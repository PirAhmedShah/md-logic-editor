import { suggestions, autoSuggest, forbiddenVarName, parameters, logicGroups, syntaxHighlighter,emptySet } from "../Database/main.js";

let t1 = new Date().getTime();
class MlogTextEditor {
  constructor(canvasManager, fontSize,theme, hotkeys) {
    //Theme, I will add options to  change them.
    this.theme = theme;
    this.maxSuggestions = 8;
    this.previousKeyLog = "";
    this.hotkeys = hotkeys
    //This(array:array(string)) contains all the lines(array:string) those lines
    this.textBufferArray = [["[function]"]];
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
    this.fontSize = fontSize;
    this.leftMargin = fontSize * 4;
    this.topMargin = 0;
    this.canvasManager = canvasManager;
    this.canvas = canvasManager.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.activeBlock = [0, 0]; // [current Word of Line , Current Line ];
    this.autoCompletionArray = [];
    this.logicLineNumbers = [];
    this.validLogicLinePos = {};
    window.editor = this;
    this.camera = {
      x: 0,
      y: 0,
    };
    this.cursor = {
      x: 0,
      y: 0,
      w: 12,
      h: 12,
      offset: 0,
    };
    window.editor = this;
  }
  isAutoGenerated(str) {
    return /^\[.*\]$/.test(str);
  }
  isCommand(arr) {
    return suggestions.commands.has(arr[0]);
  }
  isComment(arr) {
    return arr[0][0] == "#";
  }
  isString(str) {
    return /^\".*\"$/.test(str);
  }
  isValidHex(str) {
    return /^%[0-9A-F]{6}$/i.test(str);
  }
  isNumber(str) {
    return /^[0-9]+$/.test(str);
  }
  isConstant(str) {
    return /^(true|false|null|-?\d+(\.\d+)?|\d+\.\d+)$/.test(str);
  }
  isValidCharacter(str) {
    return /^[^\s]{1}$/.test(str);
  }
  isFirstWordValidByLine(line = this.activeBlock[1]) {
    return parameters[0].has(this.textBufferArray[line][0]);
  }
  isFirstWordValidByArray(array) {
    if (Array.isArray(array)) return parameters[0].has(array[0]);
    throw new Error("Couldn't check for first word, ill defined array. >" + array);
  }
  isExisting(text, objectToCheck) {
    return this[objectToCheck][text];
  }
  isValidVariable(array, index, exception = false) {
    return (
      /^[a-zA-Z_@][a-zA-Z0-9_]*$/.test(array[index]) &&
      !forbiddenVarName.has(array[index]) &&
      (exception || this.getParameterArray(array, index).has("[variable]"))
    );
  }

  isValidLabel(array, index) {
    return (
      /^[a-zA-Z_@][a-zA-Z0-9_]*$/.test(array[index]) &&
      !forbiddenVarName.has(array[index]) &&
      !this.isExisting(array[index], "variable") &&
      this.getParameterArray(array, index).has("[label]")
    );
  }

  isValidLogicLine(line) {
    if (line.length == 0) return false;
    return !(this.isAutoGenerated(line[0]) || this.isCommand(line) || this.isComment(line) || !this.isFirstWordValidByArray(line));
  }
  getXCoordinateOfWord(arr, wordIndex) {
    let x = 0;
    for (let i = 0; i < wordIndex; i++) {
      const width = this.ctx.measureText(arr[i] + " ").width;
      x += width;
    }
    return x;
  }
  makeActiveBlockSafe() {
    this.activeBlock[1] = Math.max(Math.min(this.textBufferArray.length - 1, this.activeBlock[1]), 0);
    this.activeBlock[0] = Math.max(Math.min(this.textBufferArray[this.activeBlock[1]].length - 1, this.activeBlock[0]), 0);
  }

  moveCursor(dX, dY, exactX = false, exactY = false) {
    let oldPosX = this.activeBlock[0],
      oldPosY = this.activeBlock[1];

    if (exactX) this.activeBlock[0] = dX;
    else this.activeBlock[0] += dX;

    if (exactY) this.activeBlock[1] = dY;
    else this.activeBlock[1] += dY;

    this.makeActiveBlockSafe();
    dY = this.activeBlock[1] - oldPosY;
    dX = this.activeBlock[0] - oldPosX;

    let topMostLine = Math.floor(this.camera.y / this.fontSize);
    let maxLinesToRender = Math.floor(this.canvas.h / this.fontSize);
    let lastLine = Math.min(maxLinesToRender + topMostLine, this.textBufferArray.length) - 1;
    if (this.activeBlock[1] > lastLine && dY > 0) this.scrollPage(1);
    else if (this.activeBlock[1] < topMostLine && dY < 0) this.scrollPage(-1);
    else {
      this.ctx.fillStyle = this.theme.backgroundLight; //`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
      //this.ctx.translate(0, -this.camera.y);
      // this.ctx.fillRect(
      //   0,
      //   this.topMargin - this.fontSize * 0.8 + (dY > 0 ? oldPosY : this.activeBlock[1]) * this.fontSize,
      //   this.canvas.w,
      //   this.fontSize * (dY == 0 ? 1 : 2)
      // );
      // this.renderCursor();
      // this.ctx.translate(0, this.camera.y);
    }
  }
  findRelevantStrings(str, array) {
    return array
      .filter((item) => {
        return (
          (item === "[number]" && this.isNumber(str)) ||
          (item === "[variable]" && this.isExisting(str, "variable")) ||
          (item === "[label]" && this.isExisting(str, "label")) ||
          (item === "[color]" && this.isValidHex(str)) ||
          item.toLowerCase().startsWith(str.toLowerCase()) ||
          this.containsAllChars(str.toLowerCase(), item.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (a === "[number]" || a === "[variable]" || a === "[label]") return 1;
        const startsWithStrA = a.toLowerCase().startsWith(str.toLowerCase());
        const startsWithStrB = b.toLowerCase().startsWith(str.toLowerCase());
        if (startsWithStrA && !startsWithStrB) {
          return -1; // Higher priority for strings starting with str
        } else if (!startsWithStrA && startsWithStrB) {
          return 1; // Lower priority for strings not starting with str
        } else {
          return a.length - b.length; // Sort by length if both start or don't start with str
        }
      });
  }
  containsAllChars(str, item) {
    return str.split("").every((char) => item.includes(char));
  }
  updateAutoCompletionArray(arr, index) {
    this.autoCompletionArray = null;
    let attr = Array.from(this.getParameterArray(arr, index));
    let arrayToCheck = [];
    if (attr[0] === "[string]") {
      this.autoCompletionArray = attr;
      return;
    }
    arrayToCheck.push(
      ...attr.filter((str) => {
        if (str == "existing_vars") arrayToCheck.push(...Object.keys(this.variable));
        else if (str == "existing_user_var")
          arrayToCheck.push(...Object.keys(this.variable).filter((str2) => !suggestions.readOnlyVarNames.has(str2)));
        else if (str == "linked_buildings") arrayToCheck.push(...this.linkedBuildings);
        else if (str == "existing_label") arrayToCheck.push(...Object.keys(this.label));
        else return true;
        return false;
      })
    );
    attr = null;
    let keyword = arr[index];
    this.autoCompletionArray =
      this.isAutoGenerated(keyword) || keyword.trim() === "" ? arrayToCheck : this.findRelevantStrings(keyword, arrayToCheck);
    arrayToCheck = null;
  }
  scrollPage(scrollAmount) {
    let prevPosY = this.camera.y;
    this.camera.y += scrollAmount * this.fontSize;
    this.camera.y = Math.max(Math.min(this.camera.y, (this.textBufferArray.length - 1) * this.fontSize), 0);
    return prevPosY !== this.camera.y;
  }

  gotoLine(line) {
    let prevPosY = this.camera.y;
    this.camera.y = line * this.fontSize;
    this.camera.y = Math.max(Math.min(this.camera.y, (this.textBufferArray.length - 1) * this.fontSize), 0);
    return prevPosY !== this.camera.y;
  }
  init() {
    this.canvasManager.init();
    this.ctx.font = this.fontSize + "px monospace";
    this.makeActiveBlockSafe();
    this.canvas.addEventListener("keydown", (e) => {
      this.onKeyDown(e.key, e);
    });
    window.addEventListener("resize", () => {
      this.updateFont(0);
      this.render();
    });
    this.render();
  }
  updateFont(change) {
    this.fontSize += change;
    this.topMargin = 0;
    this.leftMargin = this.fontSize * 3;
    this.ctx.font = this.fontSize + "px monospace";
  }
  renderCurLine() {
    this.ctx.translate(0, -this.camera.y);
    this.ctx.fillStyle = this.theme.backgroundLight;
    this.ctx.fillRect(0, this.topMargin - this.fontSize * 0.8 + this.activeBlock[1] * this.fontSize, this.canvas.w, this.fontSize);
    this.renderCursor();
    this.renderLine(this.activeBlock[1]);

    this.ctx.translate(0, this.camera.y);
  }
  updateVar(prevVar, newVar, arr, index) {
    if (this.isExisting(prevVar, "variable")) this.removeItemFrom(prevVar, "variable");
    arr[index] = newVar;
    if (this.isValidVariable(arr, index, true)) this.addItemTo(newVar, "variable");
  }
  updateLabel(prevLabel, newLabel, line, uline) {
    if (uline[0] === ".label" && this.isExisting(prevLabel, "label")) this.removeItemFrom(prevLabel, "label");
    if (this.isValidLabel(line, 1)) this.addItemTo(newLabel, "label");
  }
  characterInput(word, line, key) {
    if (this.isAutoGenerated(word)) {
      line[this.activeBlock[0]] = "";
      word = "";
    }

    if (this.getParameterArray(line, this.activeBlock[0]).has("[variable]")) this.updateVar(word, word + key, line, this.activeBlock[0]);
    else line[this.activeBlock[0]] += key;
    this.previousKeyLog = key;
  }
  ctrlShortcutInput(word, line, key) {
    switch (key) {
      case this.hotkeys.ctrl.gotoTop:
        this.previousKeyLog = "gotoTop: Ctrl + " + this.hotkeys.ctrl.gotoTop;
        this.gotoLine(0);
        break;
      case this.hotkeys.ctrl.gotoMiddle:
        this.previousKeyLog = "gotoMiddle: Ctrl + " + this.hotkeys.ctrl.gotoMiddle;
        this.gotoLine(Math.floor(this.textBufferArray.length / 2));
        break;
      case this.hotkeys.ctrl.gotoBottom:
        this.previousKeyLog = "gotoBottom: Ctrl + " + this.hotkeys.ctrl.gotoBottom;
        this.gotoLine(this.textBufferArray.length - 1);
        break;
      case this.hotkeys.ctrl.copyWord:
        this.previousKeyLog = "copyWord: Ctrl + " + this.hotkeys.ctrl.copyWord;
        navigator.clipboard.writeText(word).then(() => {
          console.log("Navigator > Copied");
        });
        break;
      case this.hotkeys.ctrl.cutWord:
        this.previousKeyLog = "cutWord: Ctrl + " + this.hotkeys.ctrl.cutWord;
        navigator.clipboard.writeText(word).then(() => {
          console.log("Navigator > Cut");
          line[this.activeBlock[0]] = "";
          this.render();
        });
        break;
      case this.hotkeys.ctrl.pasteWord:
        this.previousKeyLog = "pasteWord: Ctrl + " + this.hotkeys.ctrl.pasteWord;
        navigator.clipboard.readText().then((str) => {
          console.log("Navigator > Pasted");
          if (str.has("\n") || str.has(" ")) return;
          line[this.activeBlock[0]] = str;

          this.render();
        });
        break;
      case this.hotkeys.ctrl.zoomOut:
        this.previousKeyLog = "zoomOut: Ctrl + " + this.hotkeys.ctrl.zoomOut;
        this.updateFont(-1);
        break;

      case this.hotkeys.ctrl.zoomIn:
        this.previousKeyLog = "zoomIn: Ctrl + " + this.hotkeys.ctrl.zoomIn;
        this.updateFont(1);
        break;
    }
  }
  newLine(arr, at = this.textBufferArray.length) {
    if (!Array.isArray(arr) || typeof arr[0] !== "string") throw new Error("Couldn't make new line, Ill-defined array was given." + arr);
    this.textBufferArray.splice(at, 0, arr);
    this.moveCursor(0, at, true, true);
  }
  updateLogicLineNumbers() {
    let lineNumber = 0;
    for (let i = 0; i < this.textBufferArray.length; i++) {
      this.logicLineNumbers[i] = lineNumber;
      if (this.isValidLogicLine(this.textBufferArray[i])) {
        this.validLogicLinePos[this.logicLineNumbers[i]] = i;
        lineNumber++;
      }
    }
  }
  addItemTo(varName, objectToBeAddedTo) {
    if (this[objectToBeAddedTo][varName]) this[objectToBeAddedTo][varName]++;
    else this[objectToBeAddedTo][varName] = 1;
  }
  removeItemFrom(varName, objectToBeRemovedFrom) {
    if (!this[objectToBeRemovedFrom][varName]) throw new Error("Couldn't remove item > " + varName + " < from object " + objectToBeRemovedFrom);
    if (this[objectToBeRemovedFrom][varName] > 1) this[objectToBeRemovedFrom][varName]--;
    else delete this[objectToBeRemovedFrom][varName];
  }
  onCommandUpdate(line, uline, lineIndex, ulineIndex) {
    if (typeof line[1] !== "string" || lineIndex !== ulineIndex) return;
    if (line[0] === ".addlink" || uline[0] === ".addlink") {
      this.buildings = null;
      this.linkedBuildings = null;
      this.linkedBuildings = new Set();
      this.buildings = {};
      for (let i = 0; i < this.textBufferArray.length; i++) {
        let loopLine = this.textBufferArray[i];
        let loopFirstKeyword = loopLine[0];
        if (loopFirstKeyword !== ".addlink" || !suggestions.logicNames.has(loopLine[1])) continue;

        if (this.buildings[loopLine[1]]) this.buildings[loopLine[1]]++;
        else this.buildings[loopLine[1]] = 1;
        this.linkedBuildings.add(loopLine[1] + this.buildings[loopLine[1]]);
      }
    } else if (line[0] === ".label" || uline[0] === ".label") {
      if (line[0] === ".label") this.updateLabel(uline[1], line[1], line, uline, lineIndex, ulineIndex);
      else if (this.isExisting(line[1], "label")) this.removeItemFrom(line[1], "label");
    } else throw new Error("line has to be command, instead recieved > " + line[0] + " Unchanged > " + uline[0]);
  }
  updateLabelsPointingTo() {
    for (let i = 0; i < this.textBufferArray.length; i++) {
      const line = this.textBufferArray[i];
      if (line[0] !== ".label") continue;
      this.labelPointingTo[line[1]] = this.logicLineNumbers[i];
    }
  }
  onCommand(line, lineIndex) {
    if (typeof line[1] !== "string" || line[1].trim() == "") return;
    switch (line[0]) {
      case ".addlink":
        if (parameters[1][".addlink"][0].has(line[1])) {
          if (this.buildings[line[1]]) this.buildings[line[1]]++;
          else this.buildings[line[1]] = 1;
          this.linkedBuildings.add(line[1] + this.buildings[line[1]]);
        }

        break;
      case ".label":
        if (this.isValidLabel(line, 1)) this.addItemTo(line[1], "label");
        break;

      default:
        throw new Error("The line has to be command. Wrong onCommand call.");
    }
  }
  autoFill(autoFillWordIndex, arr, index) {
    if (index >= arr.length) throw new Error("Couldn't auto fill. Index out of Range. Index >" + index + " Expected Less than >" + arr.length);

    let keywordToBeFilled = this.autoCompletionArray[autoFillWordIndex];
    if (suggestions.specialKeywords.has(keywordToBeFilled)) return false;
    if (this.getParameterArray(arr, index).has("[variable]")) this.updateVar(arr[index], keywordToBeFilled, arr, index);
    else arr[index] = keywordToBeFilled;
    return true;
  }
  onKeyDown(key, e, inputByUser = true) {
    console.log(">" + key + "<");
    let renderOnKeyPress = true,
      wasAutoCompletedLastTime = false;
    if (inputByUser) e.preventDefault();
    let line = this.textBufferArray[this.activeBlock[1]];
    let shouldUpdateAutoCompletionArr = true;
    let unchangedLine = [...line];
    let unchangedLineIndex = this.activeBlock[1];
    let word = line[this.activeBlock[0]];

    if (this.isValidCharacter(key)) {
      if (e.ctrlKey) this.ctrlShortcutInput(word, line, key);
      else this.characterInput(word, line, key);
    } else
      primary: switch (key) {
        case this.hotkeys.autofill:
          this.previousKeyLog = "autofill: " + this.hotkeys.autofill;
          wasAutoCompletedLastTime = this.autoCompletionArray.length > 0 && this.autoFill(0, line, this.activeBlock[0]);
          if (wasAutoCompletedLastTime) word = line[this.activeBlock[0]];

          break;
        case this.hotkeys.nextWord:
          this.previousKeyLog = "nextWord: " + this.hotkeys.nextWord;
          if (this.isCommand(line)) this.onCommand(line, this.activeBlock[1]);
          switch (this.activeBlock[0]) {
            case 0:
              if (!this.isFirstWordValidByArray(line)) break;
              line.splice(1);
              if (suggestions.keywordWithOptions.has(word)) {
                if (word === "jump") line.push("[to]");
                else line.push(suggestions.keywordWithOptionsAutoFill[word]);
              } else line.push(...autoSuggest[word]);

              break;

            case 1:
              if (this.isFirstWordValidByArray(line) && suggestions.keywordWithOptions.has(line[0])) {
                line.splice(2);
                if (line[0] === "jump") line.push(suggestions.keywordWithOptionsAutoFill["jump"]);
                else if (parameters[1][line[0]][0].has(word)) line.push(...autoSuggest[line[0]][word]);
              } else if (this.isComment(line) || (line[0] === "print" && word[0] === '"')) {
                line[this.activeBlock[0]] += " ";
                break primary;
              }

              break;

            case 2:
              if (line[0] === "jump" && parameters[1][line[0]][1].has(word)) {
                line.splice(3);
                line.push(...autoSuggest["jump"][word]);
              }

              break;
          }
          if (this.activeBlock[0] >= line.length - 1)
            if (this.activeBlock[1] + 1 >= this.textBufferArray.length) this.newLine(["[function]"], this.activeBlock[1] + 1);
            else this.moveCursor(0, 1, true);
          else this.moveCursor(1, 0);

          break;

        case this.hotkeys.removeCharacter:
          this.previousKeyLog = "removeCharacter: " + this.hotkeys.removeCharacter;
          if (line[0] == "" || (this.isAutoGenerated(line[0]) && this.activeBlock[0] == 0)) {
            if (this.activeBlock[1] <= 0) return;
            this.textBufferArray.splice(this.activeBlock[1], 1);
            this.activeBlock[1] = this.activeBlock[1] - 1;
            this.activeBlock[0] = this.textBufferArray[this.activeBlock[1]].length - 1;
            this.moveCursor(this.activeBlock[0], this.activeBlock[1], true, true);
          } else if (word.length > 0 && !this.isAutoGenerated(word)) {
            line[this.activeBlock[0]] = word.slice(0, -1);
            if (this.isExisting(word, "variable") && this.getParameterArray(line, this.activeBlock[0]).has("[variable]")) {
              this.updateVar(word, line[this.activeBlock[0]], line, this.activeBlock[0]);
            }
          } else this.moveCursor(-1, 0);
          line = this.textBufferArray[this.activeBlock[1]];
          break;

        case this.hotkeys.removeWord:
          this.previousKeyLog = "removeWord: " + this.hotkeys.removeWord;
          shouldUpdateAutoCompletionArr = false;
          if (word === "") this.moveCursor(-1, 0);
          if (word === "" && this.activeBlock[0] == 0 && this.activeBlock[1] > 0) {
            this.textBufferArray.splice(this.activeBlock[1], 1);
            this.activeBlock[1] = this.activeBlock[1] - 1;
            this.activeBlock[0] = this.textBufferArray[this.activeBlock[1]].length - 1;
            this.moveCursor(this.activeBlock[0], this.activeBlock[1], true, true);
          } else if (line[this.activeBlock[0]] === "") this.moveCursor(-1, 0);
          else line[this.activeBlock[0]] = "";

          break;

        case this.hotkeys.newLine:
          this.previousKeyLog = "newLine: " + this.hotkeys.newLine;
          this.newLine(["[function]"], this.activeBlock[1] + 1);
          line = this.textBufferArray[this.activeBlock[1]];

          break;
        case this.hotkeys.pageUp:
          this.previousKeyLog = "pageUp: " + this.hotkeys.pageUp;
          renderOnKeyPress = this.scrollPage(-Math.floor(this.canvas.h / this.fontSize));
          if (renderOnKeyPress) this.moveCursor(0, Math.floor(this.camera.y / this.fontSize), true, true);

          break;

        case this.hotkeys.pageDown:
          this.previousKeyLog = "pageDown: " + this.hotkeys.pageDown;
          renderOnKeyPress = this.scrollPage(Math.floor(this.canvas.h / this.fontSize));
          if (renderOnKeyPress) this.moveCursor(0, Math.floor(this.camera.y / this.fontSize), true, true);

          break;

        case this.hotkeys.cursorUp:
          this.previousKeyLog = "cursorUp: " + this.hotkeys.cursorUp;
          renderOnKeyPress = !(this.activeBlock[1] == 0);
          this.moveCursor(0, -1);
          line = this.textBufferArray[this.activeBlock[1]];
          break;

        case this.hotkeys.cursorDown:
          this.previousKeyLog = "cursorDown: " + this.hotkeys.cursorDown;
          renderOnKeyPress = !(this.activeBlock[1] === this.textBufferArray.length - 1);
          this.moveCursor(0, 1);
          line = this.textBufferArray[this.activeBlock[1]];
          break;

        case this.hotkeys.cursorRight:
          this.previousKeyLog = "cursorRight: " + this.hotkeys.cursorRight;
          this.moveCursor(1, 0);
          break;

        case this.hotkeys.cursorLeft:
          this.previousKeyLog = "cursorLeft: " + this.hotkeys.cursorLeft;
          this.moveCursor(-1, 0);
          break;

        default:
          this.previousKeyLog = key;
          renderOnKeyPress = false;
          shouldUpdateAutoCompletionArr = false;
          break;
      }
    if (shouldUpdateAutoCompletionArr) this.updateAutoCompletionArray(this.textBufferArray[this.activeBlock[1]], this.activeBlock[0]);
    else this.autoCompletionArray = [];
    console.log("Renderer > Render Page? " + renderOnKeyPress);
    if (renderOnKeyPress) {
      if (this.isCommand(unchangedLine) || this.isCommand(line)) this.onCommandUpdate(line, unchangedLine, this.activeBlock[1], unchangedLineIndex);
      this.render(this.getLineToHighlight(line));
    }
  }
  getLineToHighlight(line) {
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

  getParametersMaxLen(array) {
    let fK = array[0];
    if (!this.isFirstWordValidByArray(array)) return false;
    let kPara = parameters[1][fK];
    if (suggestions.keywordWithOptions.has(fK)) {
      let sI = fK === "jump" ? 1 : 0;
      let sK = array[1 + sI],
        optionsPara = kPara[sI + 1];
      if (!kPara[sI].has(sK)) return false;
      return optionsPara[sK].length + 2 + sI;
    } else return kPara.length + 1;
  }
  removeUnwantedParameters(array) {
    let maxLength = this.getParametersMaxLen(array);
    if (maxLength) array.splice(maxLength);
  }
  getParameterArray(array, index) {
    if (index == 0) return parameters[0];
    let fK = array[0];
    if (!this.isFirstWordValidByArray(array)) return emptySet;
    if (this.isString(array[index])) return ["[string]"];
    let kPara = parameters[1][fK];
    if (suggestions.keywordWithOptions.has(fK)) {
      let sI = fK === "jump" ? 1 : 0;
      if (index == 1 || (sI == 1 && index == 2)) return kPara[index - 1];
      let sK = array[1 + sI],
        optionsPara = kPara[sI + 1];
      if (!kPara[sI].has(sK) || optionsPara[sK].length <= index - 2 - sI) return emptySet;
      return optionsPara[sK][index - 2 - sI];
    } else {
      if (kPara.length <= index - 1) return emptySet;
      return kPara[index - 1];
    }
  }
  resolveVariable(keyword){
    return this.variable[keyword] && !(forbiddenVarName.has(keyword))
  }
  // getBlockColor(array, index) {
  //   let firstKeyword = array[0];
  //   let keyword = array[index];
  //   if (this.isConstant(keyword)) return this.theme.purple; //if it's a number or boolean .
  //   else if (this.isString(keyword)) return this.theme.yellow;
  //   else if (this.isComment(array)) return this.theme.comment;
  //   else if (this.resolveVariableCondition(index, array, keyword)) return this.theme.orange;
  //   else
  //     switch (index) {
  //       case 0:
  //         return this.theme[logicGroups.getLogicGroupColor(firstKeyword)];

  //       case 1:
  //         if (
  //           (firstKeyword === "ubind" && suggestions.unitNames.has(keyword)) ||
  //           (firstKeyword === ".addlink" && suggestions.logicNames.has(keyword)) ||
  //           ((firstKeyword == "drawflush" || firstKeyword == "printflush") && this.linkedBuildings.has(keyword))
  //         )
  //           return this.theme.blue;
  //         else if (
  //           (firstKeyword === "op" && suggestions.operators.has(keyword)) ||
  //           (firstKeyword === "draw" && suggestions.drawOptions.has(keyword)) ||
  //           (firstKeyword === "ucontrol" && suggestions.uControlOptions.has(keyword)) ||
  //           (firstKeyword === "control" && suggestions.controlOptions.has(keyword)) ||
  //           (firstKeyword === "uradar" && suggestions.radarTargetOptions.has(keyword)) ||
  //           (firstKeyword === "radar" && suggestions.radarTargetOptions.has(keyword)) ||
  //           (firstKeyword === "ulocate" && suggestions.ulocateFindOptions.has(keyword)) ||
  //           (firstKeyword === "lookup" && suggestions.lookupOptions.has(keyword)) ||
  //           (firstKeyword === "jump" && this.isExisting(keyword, "label")) ||
  //           (firstKeyword === ".label" && this.resolveLabelCondition(keyword))
  //         )
  //           return this.theme.green;

  //         break;

  //       case 2:
  //         if (
  //           (firstKeyword === "jump" && suggestions.jumpOperators.has(keyword)) ||
  //           (firstKeyword === "uradar" && suggestions.radarTargetOptions.has(keyword)) ||
  //           (firstKeyword === "radar" && suggestions.radarTargetOptions.has(keyword)) ||
  //           (firstKeyword === "ulocate" && suggestions.ulocateGroups.has(keyword))
  //         )
  //           return this.theme.green;
  //         else if (firstKeyword === "draw" && array[1] === "col" && this.isValidHex(keyword)) return keyword.replace("%", "#");
  //         else if (
  //           ((firstKeyword == "read" || firstKeyword == "write") && this.linkedBuildings.has(keyword)) ||
  //           ((firstKeyword == "control" || firstKeyword == "sensor") && this.linkedBuildings.has(keyword))
  //         )
  //           return this.theme.blue;

  //         break;

  //       case 3:
  //         if (
  //           (firstKeyword === "uradar" && suggestions.radarTargetOptions.has(keyword)) ||
  //           (firstKeyword === "radar" && suggestions.radarTargetOptions.has(keyword))
  //         )
  //           return this.theme.green;
  //         else if (
  //           (firstKeyword === "sensor" && parameters[1].sensor[2].has(keyword)) ||
  //           (firstKeyword === "ucontrol" && array[1] === "itemTake" && parameters[1].ucontrol[1].itemTake[1].has(keyword)) ||
  //           (firstKeyword === "control" && array[1] === "config" && parameters[1].control[1].config[1].has(keyword))
  //         ) {
  //           return this.theme.blue;
  //         } else if (firstKeyword === "control" && array[1] === "color" && this.isValidHex(keyword)) return keyword.replace("%", "#");
  //         break;
  //       case 4:
  //         if (
  //           (firstKeyword === "draw" && array[1] === "image" && suggestions.allNames.has(keyword)) ||
  //           (firstKeyword === "ulocate" && parameters[1].ulocate[3].has(keyword)) ||
  //           (firstKeyword === "uradar" && suggestions.radarSortOptions.has(keyword)) ||
  //           (firstKeyword === "radar" && suggestions.radarSortOptions.has(keyword))
  //         )
  //           return this.theme.blue;
  //         break;

  //       case 5:
  //         break;

  //       case 6:
  //         break;
  //     }

  //   return "#ffffff";
  // }
  getTextColor(line,wordIndex,firstKeyword,keyword,withOptions,sI,secondKeyword){
     if (this.isComment(line)) return this.theme.comment;
     else if(wordIndex == 0)return this.theme[logicGroups.groupColors[logicGroups.keywordGroup[keyword]]] || "#ffffff"
    else {
      if(withOptions){
        if(wordIndex <= 1+sI) return syntaxHighlighter.keywordWithOptions[firstKeyword][wordIndex-1](keyword,this);
        else return syntaxHighlighter[firstKeyword][secondKeyword][wordIndex-2-sI](keyword,this);

      }else return syntaxHighlighter[firstKeyword][wordIndex-1](keyword,this);
      
    };
  }
  clear() {
    this.ctx.fillStyle = this.theme.backgroundLight;
    this.ctx.fillRect(0, 0, this.canvas.w, this.canvas.h);
  }
  resolveLabelCondition(labelName) {
    return /^[a-zA-Z_@][a-zA-Z0-9_]*$/.test(labelName) && this.isExisting(labelName, "label") && this.label[labelName] == 1;
  }
  loadMlog(mlog) {
    if (typeof mlog !== "string") throw new Error("Mlog must be type of 'string' to load!");
    let lineNumber = 0;
    this.textBufferArray = mlog
      .trim()
      .split("\n")
      .filter((str) => {
        return str.trim() !== "";
      })
      .map((lineStr, lineIndex) => {
        let line = lineStr.trim().split(" ");

        if (line[0] === "print" && lineStr[6] === '"' && lineStr[lineStr.length - 1] === '"') {
          line = [line[0], lineStr.slice(6)];
        } else if (this.isComment(line)) {
          line = [line[0], lineStr.slice(line[0].length + 1)];
        }
        this.removeUnwantedParameters(line);
        line.forEach((item, index) => {
          if (index == 0) return;
          else if (this.isValidVariable(line, index)) this.addItemTo(item, "variable");
        });

        this.logicLineNumbers[lineIndex] = lineNumber;

        if (this.isValidLogicLine(line)) {
          this.validLogicLinePos[this.logicLineNumbers[lineIndex]] = lineIndex;
          lineNumber++;
        }
        return line;
      });
    //Post Update
    this.textBufferArray.forEach((line, lineIndex) => {
      if (this.isCommand(line)) this.onCommand(line, lineIndex);
    });
  }
  renderLine(lineIndex, lineNumber) {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textAlign = "right";
    this.ctx.fillText(lineNumber + "| ", this.leftMargin, this.topMargin + lineIndex * this.fontSize);
    this.ctx.textAlign = "left";
    let textBlockStartPixel = this.leftMargin;
    let line = this.textBufferArray[lineIndex];
    let firstKeyword = line[0];
    let isValidLine = parameters[0].has(firstKeyword)
    let secondKeyword, sI,withOptions;
    if(isValidLine){
      withOptions = suggestions.keywordWithOptions.has(firstKeyword);
      if(withOptions){
        sI = firstKeyword === "jump" ? 1 : 0;
        secondKeyword = line[1+sI];
        isValidLine = parameters[1][firstKeyword][sI].has(secondKeyword)
      }
    } 
    for (let i = 0; i < line.length; i++) {
      const textBlock = line[i];
      this.ctx.fillStyle = isValidLine ? this.getTextColor(line, i,firstKeyword,textBlock,withOptions,sI,secondKeyword) : this.isAutoGenerated(firstKeyword) ? this.theme.foreground : this.theme.errorLine;
      this.ctx.fillText(textBlock, textBlockStartPixel, this.topMargin + lineIndex * this.fontSize);

      const textBlockM = this.ctx.measureText(textBlock + " ");
      textBlockStartPixel += textBlockM.width;
    }
  }
  renderSuggestionsBox(maxSuggestions = 1) {
    if (this.autoCompletionArray.length === 0 || maxSuggestions <= 0) return;
    this.ctx.fillStyle = this.theme.background;
    let y = this.cursor.y + this.fontSize;
    let keywords = Math.min(this.autoCompletionArray.length, maxSuggestions);
    this.ctx.fillRect(this.cursor.x, y, this.fontSize * 10, keywords * this.fontSize);
    this.ctx.lineWidth = 0.25;
    this.ctx.strokeStyle = this.ctx.fillStyle = this.theme.foreground;
    this.ctx.strokeRect(this.cursor.x, y, this.fontSize * 10, keywords * this.fontSize);
    this.ctx.fillText(this.autoCompletionArray[0], this.cursor.x + this.fontSize, y, this.fontSize * 8);
    this.ctx.fillStyle = this.theme.comment;
    for (let i = 1; i < Math.min(this.autoCompletionArray.length, maxSuggestions); i++)
      this.ctx.fillText(this.autoCompletionArray[i], this.cursor.x + this.fontSize, y + this.fontSize * i, this.fontSize * 8);
  }
  renderCursor() {
    let [x, y] = this.activeBlock;
    let arr = this.textBufferArray[y];
    let txt = arr[x];
    this.cursor.x = this.leftMargin + this.getXCoordinateOfWord(arr, x);
    this.cursor.y = this.topMargin + y * this.fontSize;
    this.cursor.w = this.ctx.measureText(txt).width;
    this.cursor.h = this.fontSize * 0.95;
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.cursor.x, this.cursor.y, this.cursor.w, this.cursor.h);
  }
  renderPreviousKeyLog() {
    this.ctx.fillStyle = this.theme.foreground;
    this.ctx.textAlign = "right";
    this.ctx.fillText(">" + this.previousKeyLog + "< ", this.canvas.w, 10, this.canvas.w2);
  }
  render(lineToHighlight = -1) {
    let t1 = new Date().getTime();
    this.clear();
    this.ctx.textBaseline = "top";
    this.ctx.translate(0, -this.camera.y);
    this.renderCursor();
    this.ctx.fillStyle = "#ff0000";
    let topMostLine = Math.floor(this.camera.y / this.fontSize);
    this.updateLogicLineNumbers();
    let maxLinesToRender = Math.floor(this.canvas.h / this.fontSize);
    if (!(lineToHighlight == -1 || lineToHighlight < topMostLine || lineToHighlight > topMostLine + maxLinesToRender)) {
      this.ctx.fillStyle = this.theme.hightlightColor;
      this.ctx.fillRect(0, lineToHighlight * this.fontSize + this.topMargin, this.canvas.w, this.fontSize);
    }
    for (let lineIndex = topMostLine; lineIndex < Math.min(maxLinesToRender + topMostLine, this.textBufferArray.length); lineIndex++)
      this.renderLine(lineIndex, this.isValidLogicLine(this.textBufferArray[lineIndex]) ? this.logicLineNumbers[lineIndex] : " ");
    this.renderSuggestionsBox(this.maxSuggestions);
    this.ctx.translate(0, this.camera.y);
    this.renderPreviousKeyLog();
    console.log("Took "+((new Date().getTime())-t1)+" ms to render.")
  }
}

export { MlogTextEditor };
