import { Intellisense } from "./intellisense.js";
import { Cursor } from "./cursor.js";
import { Input } from "./input.js";
import { Logic } from "./logic.js";
import { Renderer } from "./renderer.js";
import { SyntaxHighlighter } from "./syntaxHighlighter.js";
import { removeUnwantedParameters, isComment, isCommand } from "./utility.js";
import { suggestions } from "../Objects/main.js";
import { Autocomplete } from "./autoComplete.js";
import { updateCSSKeysTo, updateCSSThemeTo } from "../Global/functions.js";

export class MDEditor {
  constructor(fontSize, theme, keys) {
    this.canvas = document.getElementById("editor");
    if (this.canvas?.tagName !== "CANVAS") throw new Error("Couldn't find canvas with id 'editor'");
    this.ctx = this.canvas.getContext("2d");
    //console.log("____CON MDEDITOR____")
    this.lines = [["[function]"]];
    this.logic = new Logic();
    this.input = new Input(keys);
    this.cursor = new Cursor();
    this.autocomplete = new Autocomplete();
    this.intellisense = new Intellisense();
    this.renderer = new Renderer(fontSize, theme);
    this.syntaxHighlighter = new SyntaxHighlighter();
    updateCSSKeysTo(keys); // this adds all keys to :root as --key-[key name]
    updateCSSThemeTo(theme);// this adds all theme colors to :root as --clr-[key name]
    this.init();
    
  }
  init() {
    this.logic.init(this);
    this.input.init(this);
    this.cursor.init(this);
    this.autocomplete.init(this);
    this.intellisense.init(this);
    this.renderer.init(this);
    this.syntaxHighlighter.init(this);
  }
  clear() {
    //console.log("____FUNC MD CLEAR____")

    this.lines.splice(0, this.lines.length);
  }

  loadMlog(mlog) {
    //console.log("____FUNC MD LOADMLOG____")
    if (typeof mlog !== "string") throw new Error("Mlog must be type of 'string' to load!");
    this.clear();
    let lineNumber = 0;
    mlog
      .trim()
      .split("\n")
      .filter((str) => {
        return str.trim() !== "";
      })
      .map((lineStr, lineIndex) => {
        //console.log(lineStr)
        let line = lineStr.trim().split(" ");

        if (line[0] === "print" && lineStr[6] === '"' && lineStr[lineStr.length - 1] === '"') {
          line = [line[0], lineStr.slice(6)];
        } else if (isComment(line)) {
          let textAfterHash = line[0].slice(1);
          line = ["#", textAfterHash + lineStr.slice(line[0].length + 1)];
        } else if (line[0][line[0].length - 1] === ":") {
          let label = line[0].slice(0, -1);
          line = [];
          line[0] = ".label";
          line[1] = label;
        }
        removeUnwantedParameters(line);
        line.forEach((word, wordIndex) => {
          if (wordIndex == 0) return;
          else if (this.logic.isVariable(line, wordIndex)) this.logic.addVar(word);
          else if (this.logic.isLabel(line, wordIndex)) this.logic.addLabel(word);
        });
        this.logic.lineNumbers[lineIndex] = lineNumber;

        if (suggestions.validFirstWords.has(line[0])) {
          this.logic.validLogicLinePos[this.logic.lineNumbers[lineIndex]] = lineIndex;
          lineNumber++;
        }
        this.lines.push(line);
        return null;
      });
    //Post Update
    this.lines.forEach((line, lineIndex) => {
      if (isCommand(line)) this.input.onCommand(line, lineIndex);
    });
    //console.log(this.lines)
    this.renderer.onResize();
  }
  exportMlog() {
    //console.log("____FUNC MD EXPORTMLOG____")
    let exportStr = "";
    this.lines.forEach((line, lineIndex) => {
      if (line[0] === ".label") exportStr += line[1] + ":\n";
      else if (line[0].trim()[0] !== ".") exportStr += line.join(" ") + "\n";
    });
    return exportStr;
  }
}
