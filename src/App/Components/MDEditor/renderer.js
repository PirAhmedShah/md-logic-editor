import { parameters,suggestions } from "../Objects/main.js";

export class Renderer {
  constructor(editor,fontSize,theme) {
    //console.log("____CON RENDERER____")
    this.editor = editor;
    this.logic = editor.logic;
    this.canvas = editor.canvas;
    this.lines = this.editor.lines;
    this.fontSize = fontSize;
    this.leftMargin = fontSize * 4;
    this.topMargin = fontSize * 2;
    this.cursorRect = this.editor.cursor.rect;
    this.camera = {
      x: 0,
      y: 0,
    };

    this.ctx = this.canvas.getContext("2d");
    this.canvas.w = 0;
    this.canvas.h = 0;
    this.canvas.w2 = 0;
    this.canvas.h2 = 0;
    this.theme = theme;
    window.onresize =  ()=>this.onResize();

    //////////////////////
   
  }
  onResize(){
    this.resizeCanvas(0.85,0.85);
    this.updateFont(0);
    this.render();

  }
  clear() {
    //console.log("____FUNC RD CLEAR____");
    this.ctx.fillStyle = this.theme.backgroundLight;
    this.ctx.fillRect(0, 0, this.canvas.w, this.canvas.h);
  }
  resizeCanvas(scaleX=1,scaleY=1,width=window.innerWidth,height=window.innerHeight){
    
    //console.log("____FUNC RD RESIZE CANVAS____");
    this.canvas.w = this.canvas.width = width*scaleX;
    this.canvas.h = this.canvas.height = height*scaleY;
    this.canvas.w2 = this.canvas.w/2;
    this.canvas.h2 = this.canvas.h/2;
  }
  updateFont(change) {
    //console.log("____FUNC RD UPDATE FONT____");
    this.fontSize += change;
    this.topMargin = 0;
    this.leftMargin = this.fontSize * 3;
    this.ctx.font = this.fontSize + "px monospace";
  }

  scrollPage(scrollAmount) {
    //console.log("____FUNC RD SCROLL PAGE____");
    let prevPosY = this.camera.y;
    this.camera.y += scrollAmount * this.fontSize;
    this.camera.y = Math.max(Math.min(this.camera.y, (this.lines.length - 1) * this.fontSize), 0);
    return prevPosY !== this.camera.y;
  }


 
  renderLine(lineIndex, lineNumber) {
    
    //console.log("____FUNC RD RENDER LINE____");
    //console.log(arguments)
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "right";
    this.ctx.fillText(lineNumber + "| ", this.leftMargin, this.topMargin + lineIndex * this.fontSize);
    this.ctx.textAlign = "left";
    let textBlockStartPixel = this.leftMargin;
    let line = this.lines[lineIndex];
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
      this.ctx.fillStyle = isValidLine ? this.editor.syntaxHighlighter.getTextColor(line, i, firstKeyword, textBlock, withOptions, sI, secondKeyword) : this.theme.errorLine;
      this.ctx.fillText(textBlock, textBlockStartPixel, this.topMargin + lineIndex * this.fontSize);

      textBlockStartPixel += this.ctx.measureText(textBlock + " ").width;
    }
  }
  renderSuggestionsBox(maxSuggestions = 1) {
    
    //console.log("____FUNC RD RENDER SUGGESTIONS BOX____");
    if (this.editor.autoCompletion.list.length === 0 || maxSuggestions <= 0) return;
    this.ctx.fillStyle = this.theme.background;
    let y = this.cursorRect.y + this.fontSize;
    let keywords = Math.min(this.editor.autoCompletion.list.length, maxSuggestions);
    this.ctx.fillRect(this.cursorRect.x, y, this.fontSize * 10, keywords * this.fontSize);
    this.ctx.lineWidth = 0.25;
    this.ctx.strokeStyle = this.ctx.fillStyle = this.theme.foreground;
    this.ctx.strokeRect(this.cursorRect.x, y, this.fontSize * 10, keywords * this.fontSize);
    this.ctx.fillText(this.editor.autoCompletion.list[0], this.cursorRect.x + this.fontSize, y, this.fontSize * 8);
    this.ctx.fillStyle = this.theme.comment;
    for (let i = 1; i < Math.min(this.editor.autoCompletion.list.length, maxSuggestions); i++)
      this.ctx.fillText(this.editor.autoCompletion.list[i], this.cursorRect.x + this.fontSize, y + this.fontSize * i, this.fontSize * 8);
  }
  renderPreviousKeyLog() {
    this.ctx.fillStyle = this.theme.foreground;
    this.ctx.textAlign = "right";
    this.ctx.fillText(">" + this.previousKeyLog + "< ", this.canvas.w, 10, this.canvas.w2);
  }
  render(lineToHighlight = -1) {
    let t1 = new Date().getTime();
    
   //console.log("____FUNC RD RENDER____");
   this.clear();
    this.ctx.textBaseline = "top";
    this.ctx.translate(0, -this.camera.y);

    this.ctx.fillStyle = "#ff0000";
    let topMostLine = Math.floor(this.camera.y / this.fontSize);
    this.logic.updateLineNumbers();
    let maxLinesToRender = Math.floor(this.canvas.h / this.fontSize);
    if (!(lineToHighlight == -1 || lineToHighlight < topMostLine || lineToHighlight > topMostLine + maxLinesToRender)) {
      this.ctx.fillStyle = this.theme.hightlightColor;
      this.ctx.fillRect(0, lineToHighlight * this.fontSize + this.topMargin, this.canvas.w, this.fontSize);
    }
    //console.log(this.lines)
    //console.log(this.editor.lines)
    for (let lineIndex = topMostLine; lineIndex < Math.min(maxLinesToRender + topMostLine, this.lines.length); lineIndex++)
      this.renderLine(lineIndex, this.logic.isValidLogicLine(this.lines[lineIndex]) ? this.logic.lineNumbers[lineIndex] : " ");
    this.renderSuggestionsBox(this.maxSuggestions);
    this.ctx.translate(0, this.camera.y);
    this.renderPreviousKeyLog();
    console.log("Took " + (new Date().getTime() - t1) + " ms to render.");
  }
  
}
