"use strict";
import { suggestions, forbiddenVarName } from "../Objects/main.js";
import { getParameterArray } from "./utility.js";

export class Logic {
  constructor() {
    //console.log("____CON LOGIC____")
    this.variable = {
      "@this": 1,
      "@thisx": 1,
      "@thisy": 1,
      "@ipt": 1,
      "@time": 1,
      "@tick": 1,
      "@counter": 1,
      "@link": 1,
      "@unit": 1,
      "@mapw": 1,
      "@maph": 1,
      "@waveNumber": 1, //ADD ALL BELOW TO DATABASE
      "@waveTime": 1,
      "@second": 1,
      "@minute": 1,
      "@waveTime": 1,
    };
    this.label = {};
    this.labelPointingTo = {};

    this.buildings = {};
    this.linkedBuildings = new Set();

    this.lineNumbers = [];
    this.validLogicLinePos = {};
  }
  init(editor) {
    this.lines = editor.lines;
  }

  getLineToHighlight(line) {
    //console.log("____FUNC LG GETLINETOHIGHTLIGHT____")
    if (line[0] === "jump") {
      let to = line[1];
      if (this.isNumber(to)) return this.validLogicLinePos[to]; // Task is to find the logic line number to in textBufferarray
      else if (this.label[to]) {
        this.updateLabelsPointingTo();
        return this.validLogicLinePos[this.labelPointingTo[to]]; // same Task here;
      }
    }
    return -1;
  }

  addVar(varName) {
    //console.log("____FUNC LG ADD VAR____")
    this.variable[varName] = (this.variable[varName] || 0) + 1;
  }
  removeVar(varName) {
    //console.log("____FUNC LG REMOVE VAR____")
    if (varName in this.variable &&--this.variable[varName] < 1) delete this.variable[varName];
  }
  updateVar(oldVarName, newVarName,line,varWordIndex) {
    if (oldVarName in this.variable &&--this.variable[oldVarName] < 1) delete this.variable[oldVarName];
    if (this.isVariable(line,varWordIndex)) this.variable[newVarName] = (this.variable[newVarName] || 0) + 1;
    console.clear()
    console.log(oldVarName)
    console.log(newVarName + " is" + (this.isVariable(line,varWordIndex) ? " absolutely a" :" not a" )+" var")
    console.log(this.variable)
  }
  updateLabel(oldLabelName, newLabelName,line,labelWordIndex) {
    if (oldLabelName in this.label && --this.label[oldLabelName] < 1) delete this.label[oldLabelName];
    if (this.isLabel(line,labelWordIndex)) this.label[newLabelName] = (this.label[newLabelName] || 0) + 1;
  }
  addLabel(labelName) {
    //console.log("____FUNC LG ADDLABEL____")
    this.label[labelName] = (this.label[labelName] || 0) + 1;
  }
  removeLabel(labelName) {
    //console.log("____FUNC LG REMOVE LABEL____")
    if (labelName in this.label && --this.label[labelName] < 1) delete this.label[labelName];
  }

  isVariable(line, wordIndex) {
    return /^[a-zA-Z_@][a-zA-Z0-9_]*$/.test(line[wordIndex]) && !forbiddenVarName.has(line[wordIndex]) && getParameterArray(line, wordIndex).has("[variable]");
  }
  isLabel(line, wordIndex) {
    //console.log("____FUNC LG IS VALID LABEL____")
    let possibleLabel = line[wordIndex];
    return /^[a-zA-Z_@][a-zA-Z0-9_]*$/.test(possibleLabel) && getParameterArray(line, wordIndex).has("[label]") && !forbiddenVarName.has(possibleLabel) && !this.variable[possibleLabel];
  }
  update(line,wordIndex,prevWord){
    let attrbuites = getParameterArray(line, wordIndex);
    if (attrbuites.has("[variable]")) this.updateVar(prevWord, line[wordIndex], line, wordIndex);
    else if (attrbuites.has("[label]")) this.updateLabel(prevWord, line[wordIndex], line, wordIndex);

  }
  updateLineNumbers() {
    console.log("____FUNC LG UPDATE LINE NUMBER____");
    let lineNumber = 0;
    for (let i = 0; i < this.lines.length; i++) {
      this.lineNumbers[i] = lineNumber;
      let line = this.lines[i];
      if (line[0] === ".label") this.labelPointingTo[line[1]] = this.lineNumbers[i];
      if (suggestions.validFirstWords.has(line[0])) {
        this.validLogicLinePos[lineNumber] = i;
        lineNumber++;
      }
    }
  }
}
