import { getParameterArray, isAutoGenerated, isNumber, isString, isValidHex } from "./utility.js";
import { getKeys } from "../Global/functions.js";
import { suggestions } from "../Objects/main.js";
export class Autocomplete {
  constructor() {
    //console.log("____CON AUTO COMPLETION")
    this.maxSuggestions = 8;
    this.list = [];
  }
  hide(){
    this.suggestionBox.setAttribute("hidden","");
  }
  
  show(){
    this.suggestionBox.removeAttribute("hidden");
  }
  createNewSuggestionElement(){
    //rempve old one of there is
    let element = document.getElementById("e-ac-box");
    if(element) element.remove();
    //create new one
    element = document.createElement("div");
    element.setAttribute("id","e-ac-box");
    element.setAttribute("key",getKeys().autofill);
    this.canvas.parentElement.appendChild(element);
    return element;

  }
  init(editor) {
    this.logic = editor.logic;
    this.ctx = editor.ctx;
    this.canvas = editor.canvas;
    this.cursor = editor.cursor;
    this.renderer = editor.renderer;
    this.lines = editor.lines;
    this.suggestionBox = this.createNewSuggestionElement()
    this.hide()
  }
  findRelevantStrings(str, array) {
    //console.log("____FUNC AC FIND REL STR____")
    if(isAutoGenerated(str)) str = "";
    return array
      .filter((item) => {
        return (
          (item === "[number]" && isNumber(str)) ||
          (item === "[variable]" && this.logic.variable[str]) ||
          (item === "[label]" && this.logic.label[str]) ||
          (item === "[color]" && isValidHex(str)) ||
          (item === "[string]" && isString(str)) ||
          item.startsWith(str) ||
          str.split("").every((char) => item.includes(char))
        );
      })
      .sort((a, b) => {
        if (a === "[number]" || a === "[variable]" || a === "[label]") return 1;
        const startsWithStrA = a.startsWith(str);
        const startsWithStrB = b.startsWith(str);
        return startsWithStrA && !startsWithStrB ? -1 : !startsWithStrA && startsWithStrB ? 1 : a.length - b.length;
      });
  }

  updateList(line, wordIndex) {
    let attributes = getParameterArray(line,wordIndex);
    let arrayToCheck = [];
    for (const attribute of attributes) {
      if (attribute == "existing_var") arrayToCheck.push(...Object.keys(this.logic.variable))
      else if (attribute == "linked_buildings") arrayToCheck.push(...this.logic.linkedBuildings)
      else if (attribute == "existing_label") arrayToCheck.push(...Object.keys(this.logic.label))
      else arrayToCheck.push(attribute)
    }
    attributes = null;
    this.list = this.findRelevantStrings(line[wordIndex],arrayToCheck);
    arrayToCheck = null;
  }
  renderSuggestionsBox() {
    this.updateList(this.lines[this.cursor.active.line],this.cursor.active.word)
    if(this.list.length === 0){this.hide();console.log("HIDDEN");return;}   
    //add first item sperately with id "e-ac-selected"
    //Reason to use id is to retrive the element and its innerText value as fast as possible when user wants to autofill.
    this.suggestionBox.innerHTML =   ("<div id='e-ac-selected' class='e-ac-item'>"+this.list[0]+"</div>");
    for (let i = 1; i < this.list.length; i++) this.suggestionBox.innerHTML += ("<div class='e-ac-item'>"+this.list[i]+"</div>");
    this.suggestionBox.style.fontSize = (this.renderer.fontSize + " px");
    this.suggestionBox.style.top = (this.canvas.offsetTop +this.cursor.rect.y + this.renderer.topMargin + this.cursor.rect.h)+ "px";
    this.suggestionBox.style.left = (this.canvas.offsetLeft +this.cursor.rect.x + this.renderer.leftMargin)+ "px";
    this.show();
    console.log("SHOWN")
    
  }
  render(){
    this.renderSuggestionsBox();
  };
  fill() {
    console.log("IS VISIBLE >"+checkVisibility)
    if(!this.suggestionBox.checkVisibility() || this.list.length == 0) return false;
    console.log("filling the line...")
    
    
    let line = this.lines[this.cursor.active.line];
    let activeWord = this.cursor.active.word;
    let keywordToBeFilled = this.suggestionBox.querySelector("#e-ac-selected").innerText; //get the inner text of selected item;
    if (suggestions.specialKeywords.has(keywordToBeFilled)) return false;
    if (getParameterArray(line,activeWord).has("[variable]")) this.logic.updateVar(line[activeWord], keywordToBeFilled, line,activeWord);
    line[activeWord] = keywordToBeFilled;
    return true;
  }
};