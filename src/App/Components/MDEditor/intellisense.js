import { parameters, suggestions } from "../Objects/main.js";

const map = {
  read: ["[result]", "[from]", "[at]"],
  write: ["[value]", "[to]", "[at]"],
  ".addlink": ["[building]"],
  //".func": ["[function name]", "[parameter1]", "[parameter2]"],
  "#": ["[comment]"],
  ".label": ["[name]"],
  draw: {
    clear: ["[red]", "[green]", "[blue]"],
    //[R,G,B]
    color: ["[red]", "[green]", "[blue]", "[alpha]"],
    //[R,G,B]

    col: ["[hex color]"],

    line: ["[x1]", "[y1]", "[x2]", "[y2]"],
    //[x y x2 y2]
    stroke: ["[width]"],
    rect: ["[x1]", "[y1]", "[width]", "[height]"],
    lineRect: ["[x1]", "[y1]", "[width]", "[height]"],
    //[x y x2 y2]
    poly: ["[x]", "[y]", "[sides]", "[radius]", "[rotation]"],
    linePoly: ["[x]", "[y]", "[sides]", "[radius]", "[rotation]"],
    triangle: ["[x1]", "[y1]", "[x2]", "[y2]", "[x3]", "[y3]"],
    image: ["[x]", "[y]", "[size]", "[image]", "[rotation]"],
  },
  print: ["[string or var]"],
  drawflush: ["[to]"],
  printflush: ["[to]"],
  getlink: ["[result]", "[id]"],
  control: {
    enabled: ["[building]", "[enabled]"],
    shoot: ["[turret]", "[x]", "[y]", "[shoot]"],
    shootp: ["[turret]", "[unit]", "[shoot]"],
    config: ["[building]", "[to]"],
    color: ["[illuminator]", "[color]"],
  },
  radar: ["[target]", "[and]", "[and]", "[sort]", "[building]", "[order]", "[result]"],
  sensor: ["[result]", "[building]", "[@property]"],
  set: ["[result]", "[value]"],
  op: {
    add: ["[result]", "[operand]", "[operand]"],
    sub: ["[result]", "[operand]", "[operand]"],
    mul: ["[result]", "[operand]", "[operand]"],
    div: ["[result]", "[operand]", "[operand]"],
    idiv: ["[result]", "[operand]", "[operand]"],
    mod: ["[result]", "[operand]", "[operand]"],
    pow: ["[result]", "[operand]", "[operand]"],
    equal: ["[result]", "[operand]", "[operand]"],
    notEqual: ["[result]", "[operand]", "[operand]"],
    land: ["[result]", "[operand]", "[operand]"],
    lessThan: ["[result]", "[operand]", "[operand]"],
    lessThanEq: ["[result]", "[operand]", "[operand]"],
    greaterThan: ["[result]", "[operand]", "[operand]"],
    greaterThanEq: ["[result]", "[operand]", "[operand]"],
    strictEqual: ["[result]", "[operand]", "[operand]"],
    shl: ["[result]", "[operand]", "[operand]"],
    shr: ["[result]", "[operand]", "[operand]"],
    or: ["[result]", "[operand]", "[operand]"],
    and: ["[result]", "[operand]", "[operand]"],
    xor: ["[result]", "[operand]", "[operand]"],
    not: ["[result]", "[operand]"],
    max: ["[result]", "[operand]", "[operand]"],
    min: ["[result]", "[operand]", "[operand]"],
    angle: ["[result]", "[operand]", "[operand]"],
    angleDiff: ["[result]", "[operand]", "[operand]"],
    len: ["[result]", "[operand]", "[operand]"],
    noise: ["[result]", "[operand]", "[operand]"],
    abs: ["[result]", "[operand]"],
    log: ["[result]", "[operand]"],
    log10: ["[result]", "[operand]"],
    floor: ["[result]", "[operand]"],
    ceil: ["[result]", "[operand]"],
    sqrt: ["[result]", "[operand]"],
    rand: ["[result]", "[operand]"],
    sin: ["[result]", "[operand]"],
    cos: ["[result]", "[operand]"],
    tan: ["[result]", "[operand]"],
    asin: ["[result]", "[operand]"],
    acos: ["[result]", "[operand]"],
    atan: ["[result]", "[operand]"],
  },
  lookup: ["[type]", "[result]", "[id]"],
  packcolor: ["[result]", "[redPercent]", "[greenPercent]", "[bluePercent]", "[alphaPercent]"],
  wait: ["[seconds]"],
  stop: [],
  end: [],
  jump: {
    equal: ["[operand]", "[operand]"],
    notEqual: ["[operand]", "[operand]"],
    always: [],
    lessThan: ["[operand]", "[operand]"],
    greaterThan: ["[operand]", "[operand]"],
    lessThanEq: ["[operand]", "[operand]"],
    greaterThanEq: ["[operand]", "[operand]"],
    strictEqual: ["[operand]", "[operand]"],
  },
  ubind: ["[@unit]"],
  ucontrol: {
    move: ["[x]", "[y]"],
    idle: [],
    stop: [],
    mine: ["[x]", "[y]"],
    unbind: [],
    approach: ["[x]", "[y]", "[radius]"],
    within: ["[x]", "[y]", "[radius]", "[result]"],
    flag: [],
    payEnter: [],
    payDrop: [],
    payTake: ["[take units]"],
    itemTake: ["[from]", "[@item]", "[amount]"],
    itemDrop: ["[to]", "[amount]"],
    boost: ["[enable]"],
    target: ["[x]", "[y]", "[shoot]"],
    targetp: ["[unit]", "[shoot]"],
    autoPathfind: [],
    pathfind: ["[x]", "[y]"],
    getBlock: ["[x]", "[y]", "[type]", "[building]", "[floor]"],
  },
  uradar: ["[target]", "[and]", "[and]", "[sort]", "[0]", "[order]", "[result]"],
  ulocate: ["[find]", "[group]", "[enemy]", "[@ore]", "[x]", "[y]", "[found]", "[building]"],
};
export class Intellisense {
  constructor() {
    //console.log("____CON AUTOSUGGESTIONS");
  }
  init(editor) {
    this.cursor = editor.cursor;
  }
  suggestNext(line, wordPos = this.cursor.active.word) {
    let fK = line[0];
   if (!parameters[0].has(fK)) return [];
   if (suggestions.keywordWithOptions.has(fK)) {
     let sI = fK === "jump" ? 1 : 0;
     let sK = line[sI + 1];
     if (wordPos === 0) return suggestions.keywordWithOptionsAutoFill[fK];
     else if (!parameters[1][fK][sI].has(sK)) return [];
     else if (wordPos === 1 + sI) return map[fK][sK];
     else return [];
   } else if (wordPos == 0) return map[fK];
   else return [];
 }
}

