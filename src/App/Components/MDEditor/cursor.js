import { constrain } from "../Global/functions.js";

export class Cursor {
  constructor() {
    //console.log("____CON CURSOR____")
    //Cursor Position in Text Editor
    this.active = {
        line: 0, // Current active array/line in this.lines
        word: 0, // Current active string/word in this.lines[this.active.line]
        char: 0 // Current active char/character in this.lines[this.active.line][this.active.word]
      } 
    //Cursor Position in Canvas Cordinates
    this.rect = {
      x: 0,
      y: 0,
      w: 12,
      h: 12
    };
  }
  
 
  moveCursorTo(charPos = this.active.char, wordPos = this.active.word, linePos = this.active.line) {
    //console.log("____FUNC CR MOVECURSORTO____")
    this.updateActive(charPos, wordPos, linePos);
  }

  moveCursor(delC = 0, delW = 0, delL = 0) {
    //console.log("____FUNC CR MOVECURSOR____")
    this.moveCursorTo(this.active.char + delC, this.active.word + delW, this.active.line + delL);
  }
  updateActive(charPos,wordPos,linePos) {
    //console.log("____FUNC CR UPDATE ACTIVE____")
    //console.log("________________")
    //console.log("linePos "+linePos)
    //console.log("wordPos "+wordPos)
    //console.log("charPos "+charPos)
    this.active.line = constrain(linePos,0,this.lines.length-1 )
    let line = this.lines[this.active.line]
    if(wordPos == line.length+1){
      this.active.word = 0;
      this.active.line = constrain(++this.active.line,0,this.lines.length-1 );
      line = this.lines[this.active.line];
    }else this.active.word = constrain(wordPos,0,line.length )
    
    let word = line[this.active.word];
    if(charPos == word.length+1){
      this.active.char = 0;
    
      this.active.word = constrain(++this.active.word,0,line.length-1 );
      word = word[this.active.word];
    }
     else this.active.char = constrain(charPos,0,word.length )
    

  }
}
