import { parameters, suggestions } from "../Objects/main.js";

export class Renderer {
  constructor(fontSize, theme) {
    //console.log("____CON RENDERER____")

    this.fontSize = fontSize;
    this.leftMargin = fontSize * 3;
    this.topMargin = fontSize;
    this.camera = {
      x: 0,
      y: 0,
    };

    this.theme = theme;
    window.onresize = () => this.onResize();

    //////////////////////
  }
  init(editor) {
    this.canvas = editor.canvas;
    this.ctx = editor.ctx;
    this.lines = editor.lines;
    this.logic = editor.logic;
    this.input = editor.input;
    this.cursor = editor.cursor;
    this.autocomplete = editor.autocomplete;
    this.syntaxHighlighter = editor.syntaxHighlighter;
    this.canvas.w = 0;
    this.canvas.h = 0;
    this.canvas.w2 = 0;
    this.canvas.h2 = 0;
  }
  onResize() {
    this.resizeCanvas(0.85, 0.85);
    this.updateFont(0);
    this.render();
  }
  clear() {
    //console.log("____FUNC RD CLEAR____");
    this.ctx.fillStyle = this.theme.backgroundLight;
    this.ctx.fillRect(0, 0, this.canvas.w, this.canvas.h);
  }
  resizeCanvas(scaleX = 1, scaleY = 1, width = window.innerWidth, height = window.innerHeight) {
    //console.log("____FUNC RD RESIZE CANVAS____");
    this.canvas.w = this.canvas.width = width * scaleX;
    this.canvas.h = this.canvas.height = height * scaleY;
    this.canvas.w2 = this.canvas.w / 2;
    this.canvas.h2 = this.canvas.h / 2;
  }
  updateFont(change) {
    //console.log("____FUNC RD UPDATE FONT____");
    this.fontSize += change;
    this.leftMargin = this.fontSize * 3;
    this.topMargin = this.fontSize ;
    this.cursor.rect.offX = this.leftMargin;
    this.cursor.rect.offY = this.topMargin;
    this.ctx.font = this.fontSize + "px monospace";
  }

  scrollPage(scrollAmount) {
    //console.log("____FUNC RD SCROLL PAGE____");
    let prevPosY = this.camera.y;
    this.camera.y += scrollAmount * this.fontSize;
    this.camera.y = Math.max(Math.min(this.camera.y, (this.lines.length - 1) * this.fontSize), 0);
    return prevPosY !== this.camera.y;
  }

  renderEditedLines(curLine=this.cursor.active.line, delL=0) {
    let t1 = performance.now();
    //this.theme.backgroundLight;
    this.ctx.fillStyle = this.theme.backgroundLight//`rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    this.ctx.translate(0, -this.camera.y);
    //Only draws rect on the current line ie clears the current line so only that line will be re rendered instead of entire canvas.
    this.ctx.fillRect(0, this.cursor.rect.offY +  + (delL > 0 ? curLine-delL : curLine) * this.fontSize, this.canvas.w, this.fontSize * (delL == 0 ? 1 : 2));
    this.cursor.render();
    if (delL !== 0) 
      this.renderLine(curLine - delL,this.logic.lineNumbers[curLine-delL]);
    
    this.renderLine(curLine, this.logic.lineNumbers[curLine]);
    this.ctx.translate(0, this.camera.y);

    //this.autocomplete.render();
    this.input.render();

    console.log("Took " + Math.round((performance.now() - t1) * 10) / 10 + "ms to render edited lines.");
  }

  renderLine(lineIndex) {
    //console.log("____FUNC RD RENDER LINE____");
    //console.log(arguments)
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "right";
    let line = this.lines[lineIndex];
    let lineNumberStr = suggestions.validFirstWords.has(line[0]) ? this.logic.lineNumbers[lineIndex] : "";
    this.ctx.fillText( lineNumberStr + " " , this.leftMargin, this.topMargin + lineIndex * this.fontSize);
    this.ctx.textAlign = "left";
    let textBlockStartPixel = this.leftMargin;
    let firstKeyword = line[0];
    let isValidLine = parameters[0].has(firstKeyword);
    let secondKeyword, sI, withOptions;
    if (isValidLine) {
      withOptions = suggestions.keywordWithOptions.has(firstKeyword);
      if (withOptions) {
        sI = firstKeyword === "jump" ? 1 : 0;
        secondKeyword = line[1 + sI];
        isValidLine = parameters[1][firstKeyword][sI].has(secondKeyword);
      }
    }

    for (let i = 0; i < line.length; i++) {
      const textBlock = line[i];
      this.ctx.fillStyle = isValidLine ? this.syntaxHighlighter.getTextColor(line, i, firstKeyword, textBlock, withOptions, sI, secondKeyword) : this.theme.errorLine;
      this.ctx.fillText(textBlock, textBlockStartPixel, this.topMargin + lineIndex * this.fontSize);

      textBlockStartPixel += this.ctx.measureText(textBlock + " ").width;
    }
  }

  render(lineToHighlight = -1) {
    let t1 = performance.now();

    console.log("____FUNC RD RENDER____");
    this.clear();
    this.ctx.textBaseline = "top";
    this.ctx.translate(0, -this.camera.y);
    //cursor is drawn
    this.cursor.render();
    this.ctx.fillStyle = "#ff0000";
    let topMostLine = Math.floor(this.camera.y / this.fontSize);
    let maxLinesToRender = Math.floor(this.canvas.h / this.fontSize);
    if (!(lineToHighlight == -1 || lineToHighlight < topMostLine || lineToHighlight > topMostLine + maxLinesToRender)) {
      this.ctx.fillStyle = this.theme.hightlightColor;
      this.ctx.fillRect(0, lineToHighlight * this.fontSize + this.topMargin, this.canvas.w, this.fontSize);
    }
    //console.log(this.lines)
    for (let lineIndex = topMostLine; lineIndex < Math.min(maxLinesToRender + topMostLine, this.lines.length); lineIndex++)
      this.renderLine(lineIndex)// this.logic.isValidLogicLine(this.lines[lineIndex]) ? this.logic.lineNumbers[lineIndex] : " ");
    //overlays
    //this.autocomplete.render();
    this.input.render();
    this.ctx.translate(0, this.camera.y);

    console.log("Took " + Math.round((performance.now() - t1) * 10) / 10 + "ms to render.");
  }
}
