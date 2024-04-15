import { suggestions, parameters } from "../Objects/main.js";
import { getParameterArray, isAutoGenerated, isValidCharacter } from "./utility.js";

export class Input {
  constructor(keys) {
    //console.log("____CON INPUT____");
    this.previousKeyLog = "";
    this.keys = keys;
  }
  init(editor) {
    this.lines = editor.lines;
    this.logic = editor.logic;
    this.cursor = editor.cursor;
    this.renderer = editor.renderer;
    this.canvas = editor.canvas;
    this.ctx = editor.ctx;
    this.theme = editor.renderer.theme;
    this.intellisense = editor.intellisense;
    this.autocomplete = editor.autocomplete;
    editor.canvas.onkeydown = (e) => {
      this.onInput(e);
    };
  }
  onCharacterInput(word, line, key) {
    console.log("____FUNC IN CHAR INPUT____");

    if (isAutoGenerated(word)) {
      line[this.cursor.active.word] = "";
      word = "";
    }
    line[this.cursor.active.word] += key;
    this.logic.update(line, this.cursor.active.word, word);

    if (this.cursor.active.word == 0 && suggestions.validFirstWords.has(line[this.cursor.active.word])) {
      this.logic.updateLineNumbers();
      this.renderer.render();
    } else this.renderer.renderEditedLines(); // REMOVE THIS RENDER THE CURRENT LINE INSTEAD!
    this.autocomplete.render();
  }
  onCtrlInput(word, line, key) {
    //console.log("____FUNC IN CTRL____");
    switch (key) {
      case this.keys.ctrl.gotoTop:
        this.gotoLine(0);
        break;
      case this.keys.ctrl.gotoMiddle:
        this.gotoLine(Math.floor(this.lines.length / 2));
        break;
      case this.keys.ctrl.gotoBottom:
        this.gotoLine(this.lines.length - 1);
        break;
      case this.keys.ctrl.copyWord:
        navigator.clipboard.writeText(word).then(() => {
          ////console.log("Navigator > Copied");
        });
        break;
      case this.keys.ctrl.cutWord:
        navigator.clipboard.writeText(word).then(() => {
          ////console.log("Navigator > Cut");
          line[this.cursor.active.word] = "";
          this.render();
        });
        break;
      case this.keys.ctrl.pasteWord:
        navigator.clipboard.readText().then((str) => {
          ////console.log("Navigator > Pasted");
          if (str.has("\n") || str.has(" ")) return;
          line[this.cursor.active.word] = str;

          this.renderer.renderEditedLines();
          this.autocomplete.render();
        });
        break;
      case this.keys.ctrl.zoomOut:
        this.renderer.updateFont(-1);
        this.renderer.render();
        this.autocomplete.render();
        break;

      case this.keys.ctrl.zoomIn:
        this.renderer.updateFont(1);
        this.renderer.render();
        this.autocomplete.render();
        break;
    }
  }
  newLine(arr, at = this.lines.length) {
    //console.log("____FUNC IN NEWLINE____");
    if (!Array.isArray(arr) || typeof arr[0] !== "string") throw new Error("Couldn't make new line, Ill-defined array was given." + arr);
    this.lines.splice(at, 0, arr);
    this.cursor.active.word = 0;
  }
  onCommandUpdate(line, uline, lineIndex, ulineIndex) {
    //console.log("____FUNC IN ONCOMMANDUPDATE____");
    if (typeof line[1] !== "string" || lineIndex !== ulineIndex) return;
    if (line[0] === ".addlink" || uline[0] === ".addlink") {
      this.logic.buildings = null;
      this.logic.buildings = {};
      this.logic.linkedBuildings = null;
      this.logic.linkedBuildings = new Set();
      for (let i = 0; i < this.lines.length; i++) {
        let loopLine = this.lines[i];
        let loopFirstKeyword = loopLine[0];
        if (loopFirstKeyword !== ".addlink" || !suggestions.logicNames.has(loopLine[1])) continue;

        if (this.logic.buildings[loopLine[1]]) this.logic.buildings[loopLine[1]]++;
        else this.logic.buildings[loopLine[1]] = 1;
        this.logic.linkedBuildings.add(loopLine[1] + this.logic.buildings[loopLine[1]]);
      }
    } else if (line[0] === ".label" || uline[0] === ".label") {
      if (line[0] === ".label") this.updateLabel(uline[1], line[1], line, uline, lineIndex, ulineIndex);
      else if (this.logic.label[line[1]]) this.removeItemFrom(line[1], "label");
    } else throw new Error("line has to be command, instead recieved > " + line[0] + " Unchanged > " + uline[0]);
  }
  onCommand(line, lineIndex) {
    //console.log("____FUNC IN ONCOMMAND____");
    if (typeof line[1] !== "string" || line[1].trim() == "") return;
    switch (line[0]) {
      case ".addlink":
        if (parameters[1][".addlink"][0].has(line[1])) {
          if (this.logic.buildings[line[1]]) this.logic.buildings[line[1]]++;
          else this.logic.buildings[line[1]] = 1;
          this.logic.linkedBuildings.add(line[1] + this.logic.buildings[line[1]]);
        }

        break;
      case ".label":
        if (this.logic.isLabel(line, 1)) this.logic.addLabel(line[1]);
        break;

      default:
        throw new Error("The line has to be command. Wrong onCommand call.");
    }
  }
  onInput(e) {
    e.preventDefault();
    this.autocomplete.hide();
    //console.log("____FUNC IN ONINPUT > " + e.key);
    let line = this.lines[this.cursor.active.line];
    let word = line[this.cursor.active.word];
    let key = e.key;
    console.log("KEY >" + key + "<");
    this.previousKeyLog = key;

    if (e.ctrlKey) this.onCtrlInput(word, line, key);
    else if (isValidCharacter(key)) this.onCharacterInput(word, line, key);
    else {
      console.log("NONE CHAR KEY PRESSED");
      switch (key) {
        case this.keys.nextWord:
          let autoGeneratedSuggestion = this.intellisense.suggestNext(line);
          if (autoGeneratedSuggestion.length > 0) {
            line.length = this.cursor.active.word + 1;
            line.push(...autoGeneratedSuggestion);
          }
          this.cursor.moveCursor(1, 0, false);
          this.autocomplete.render();

          break;
        case this.keys.removeCharacter:
          //if it's auto generated, dont do anything.
          if (isAutoGenerated(word)) return;
          line[this.cursor.active.word] = line[this.cursor.active.word].slice(0, -1);
          //check if it was the first valid word being removed if so then update and change the line
          this.logic.update(line, this.cursor.active.word, word);
          if (this.cursor.active.word == 0 && suggestions.validFirstWords.has(word)) {
            this.renderer.render(); //renders entire page THIS IS BAD.
          } else this.renderer.renderEditedLines(); //else render line that's being edited

          this.autocomplete.render();
          //use intellisense to suggest the word if word = "";

          break;
        case this.keys.removeWord:
          if (isAutoGenerated(word)) return; // delete the line if it's first auto generated word ie "[function]".
          line[this.cursor.active.word] = ""; //use intelisense here.
          this.logic.update(line, this.cursor.active.word, word);
          this.renderer.renderEditedLines();
          this.autocomplete.render();
          break;
        case this.keys.newLine:
          this.newLine(["[function]"], this.cursor.active.line);
          this.logic.updateLineNumbers();
          this.renderer.render();
          this.autocomplete.render();
          break;
        case this.keys.cursorUp:
          this.cursor.moveCursor(0, -1);
          break;
        case this.keys.cursorDown:
          this.cursor.moveCursor(0, 1);
          break;
        case this.keys.cursorLeft:
          this.cursor.moveCursor(-1, 0);
          break;
        case this.keys.cursorRight:
          this.cursor.moveCursor(1, 0);
          break;
        case this.keys.pageUp:
          break;
        case this.keys.pageDown:
          break;
        case this.keys.autofill:
          console.log("Tab Pressed......");
          let hasAutoFilled = this.autocomplete.fill();
          if(hasAutoFilled){
            let getNextKeywords = this.intellisense.suggestNext(line);

          if (getNextKeywords.length > 0) {
            line.length = this.cursor.active.word + 1;
            line.push(...getNextKeywords);
          }
          }
          this.logic.updateLineNumbers() // find a way to update the line numbers of lines on screen only.
          //if it's the last word of the line, go to next line instead of next word.
          if (this.cursor.active.word + 1 == line.length) this.cursor.moveCursor(-Infinity, 1);
          else this.cursor.moveCursor(1, 0, false);

          this.autocomplete.render();

          break;
        default:
          console.log("No action for this key.");
          break;
      }
    }
  }
  renderPreviousKeyLog() {
    this.ctx.fillStyle = this.theme.foreground;
    this.ctx.textAlign = "right";
    this.ctx.fillText(">" + this.previousKeyLog + "< ", this.canvas.w, 10, this.canvas.w2);
  }
  render() {
    //this.renderPreviousKeyLog();
  }
}