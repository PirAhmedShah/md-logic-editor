import { constrain } from "../Global/functions.js";

export class Cursor {
  constructor() {
    //console.log("____CON CURSOR____")
    //Cursor Position in Text Editor
    this.active = {
      line: 0, // Current active array/line in this.lines
      word: 0, // Current active string/word in this.lines[this.active.line]
      // char: 0, // Current active char/character in this.lines[this.active.line][this.active.word] | pain to implement + not worth it.
      // col: 0,
    };
  }
  init(editor) {
    this.input = editor.input;
    this.lines = editor.lines;
    this.canvas = editor.canvas;
    this.ctx = editor.ctx;
    this.renderer = editor.renderer;
    //Cursor Position in Canvas Cordinates

    this.rect = {
      x: 0,
      y: 0,
      w: 2,
      h: editor.renderer.fontSize,
      offX: editor.renderer.leftMargin,
      offY: editor.renderer.topMargin,
    };
  }

  moveCursorTo(wordPos = this.active.word, linePos = this.active.line) {
    //console.log("____FUNC CR MOVECURSORTO____")
    this.updateActive(wordPos, linePos);
  }

  moveCursor(delW, delL,optimizedRender=true) {
    console.log("____FUNC CR MOVECURSOR____");

    let oldActiveWord = this.active.word,
        oldActiveLine = this.active.line;
    this.updateActive(this.active.word + delW, this.active.line + delL);
    delL = this.active.line - oldActiveLine;
    delW = this.active.word - oldActiveWord;
    if(delL === 0 && delW === 0 ) return;

    let topMostLine = Math.floor(this.renderer.camera.y / this.renderer.fontSize);
    let maxLinesToRender = Math.floor(this.canvas.h / this.renderer.fontSize);
    let lastLine = Math.min(maxLinesToRender + topMostLine, this.lines.length) - 1;
    if (this.active.line > lastLine && delL > 0) this.scrollPage(1);
    else if (this.active.line < topMostLine && delL < 0) this.scrollPage(-1);
    else if(optimizedRender) this.renderer.renderEditedLines(this.active.line, delL);
    else this.renderer.render();
  }

  updateRect() {
    let line = this.lines[this.active.line];
    let word = line[this.active.word];
    console.log("UPDATE RECT")
    console.log(line)
    this.rect.x = this.ctx.measureText(line.slice(0, this.active.word).join(" ") + (this.active.word == 0? "": " ") ).width;
    this.rect.y = this.active.line * this.renderer.fontSize;
    this.rect.w = this.ctx.measureText(word).width;
    this.rect.h = this.renderer.fontSize;
  }
  render() {
    this.updateRect();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.rect.offX + this.rect.x, this.rect.offY + this.rect.y, this.rect.w, this.rect.h);
  }

  updateActive(wordPos, linePos) {
    //    console.log("____FUNC CR UPDATE ACTIVE____");
    this.active.line = constrain(linePos, 0, this.lines.length - 1);
    this.active.word = constrain(wordPos, 0, this.lines[this.active.line].length - 1);
  }
}
