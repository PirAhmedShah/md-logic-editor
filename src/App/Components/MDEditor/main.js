import { AutoCompletion } from "./autoCompletion.js";
import { AutoSuggestion } from "./autoSuggestion.js";
import { Cursor } from "./cursor.js";
import { Input } from "./input.js";
import { Logic } from "./logic.js";
import { Renderer } from "./renderer.js";
import { SyntaxHighlighter } from "./syntaxHighlighter.js";
import { removeUnwantedParameters, isComment, isCommand} from "./utility.js";

export class MDEditor {
  constructor(fontSize,theme,keys) {
    
    this.canvas = document.getElementById("md-editor");
    if (this.canvas?.tagName !== "CANVAS") throw new Error("Couldn't find canvas with id 'md-editor'");
  //console.log("____CON MDEDITOR____")
    this.lines = [["[function]"]];
    this.logic = new Logic(this);
    this.input = new Input(this, keys);
    this.cursor = new Cursor(this);
    this.autoCompletion = new AutoCompletion(this);
    this.autoSuggestions = new AutoSuggestion(this);
    this.renderer = new Renderer(this, fontSize, theme);
    this.syntaxHighlighter = new SyntaxHighlighter(this);

    window.x = this;
  }
  clear(){
    //console.log("____FUNC MD CLEAR____")
   
      this.lines.splice(0,this.lines.length);
    
   
  
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
        line.forEach((item, index) => {
          if (index == 0) return;
          else if (this.logic.isValidVariable(line, index)) this.logic.addVar(item, "variable");
        });
        this.logic.lineNumbers[lineIndex] = lineNumber;

        if (this.logic.isValidLogicLine(line)) {
          this.validLogicLinePos[this.logic.lineNumbers[lineIndex]] = lineIndex;
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
