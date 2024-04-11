function addToArray(item, times, array = []) {
  for (let i = 0; i < times; i++) array.push(item);
  return array;
}
const database = {
  item: [
    "copper",
    "lead",
    "metaglass",
    "graphite",
    "sand",
    "coal",
    "titanium",
    "thorium",
    "scrap",
    "silicon",
    "plastanium",
    "phase-fabric",
    "surge-alloy",
    "spore-pod",
    "blast-compound",
    "pyratite",
    "beryllium",
    "fissile-matter",
    "dormant-cyst",
    "tungsten",
    "carbide",
    "oxide",
  ],
  unit: [
    "dagger",
    "mace",
    "fortress",
    "scepter",
    "reign",
    "nova",
    "pulsar",
    "quasar",
    "vela",
    "corvus",
    "crawler",
    "atrax",
    "spiroct",
    "arkyid",
    "toxopid",
    "flare",
    "horizon",
    "zenith",
    "antumbra",
    "eclipse",
    "mono",
    "poly",
    "mega",
    "quad",
    "oct",
    "risso",
    "minke",
    "bryde",
    "sei",
    "omura",
    "retusa",
    "oxynoe",
    "cyerce",
    "aegires",
    "navanax",
    "alpha",
    "beta",
    "gamma",
    "stell",
    "locus",
    "precept",
    "vanquish",
    "conquer",
    "merui",
    "cleroi",
    "anthicus",
    "tecta",
    "collaris",
    "elude",
    "avert",
    "obviate",
    "quell",
    "disrupt",
    "evoke",
    "incite",
    "emanate",
  ],
  liquid: [
    "water",
    "slag",
    "oil",
    "cryofluid",
    "neoplasm",
    "hydrogen",
    "ozone",
    "cyanogen",
    "gallium",
    "nitrogen",
    "arkycite",
  ],
  block: [
    "graphite-press",
    "multi-press",
    "silicon-smelter",
    "silicon-crucible",
    "kiln",
    "plastanium-compressor",
    "phase-weaver",
    "cryofluid-mixer",
    "pyratite-mixer",
    "blast-mixer",
    "melter",
    "separator",
    "disassembler",
    "spore-press",
    "pulverizer",
    "coal-centrifuge",
    "incinerator",
    "copper-wall",
    "copper-wall-large",
    "titanium-wall",
    "titanium-wall-large",
    "plastanium-wall",
    "plastanium-wall-large",
    "thorium-wall",
    "thorium-wall-large",
    "phase-wall",
    "phase-wall-large",
    "surge-wall",
    "surge-wall-large",
    "door",
    "illuminator",
    "door-large",
    "scrap-wall",
    "scrap-wall-large",
    "scrap-wall-huge",
    "scrap-wall-gigantic",
    "mender",
    "mend-projector",
    "overdrive-projector",
    "overdrive-dome",
    "force-projector",
    "shock-mine",
    "conveyor",
    "titanium-conveyor",
    "plastanium-conveyor",
    "armored-conveyor",
    "junction",
    "bridge-conveyor",
    "phase-conveyor",
    "sorter",
    "inverted-sorter",
    "router",
    "distributor",
    "overflow-gate",
    "underflow-gate",
    "mass-driver",
    "duct",
    "duct-router",
    "duct-bridge",
    "mechanical-pump",
    "rotary-pump",
    "conduit",
    "pulse-conduit",
    "plated-conduit",
    "liquid-router",
    "liquid-tank",
    "liquid-junction",
    "bridge-conduit",
    "phase-conduit",
    "power-node",
    "power-node-large",
    "surge-tower",
    "diode",
    "battery",
    "battery-large",
    "combustion-generator",
    "thermal-generator",
    "steam-generator",
    "differential-generator",
    "rtg-generator",
    "solar-panel",
    "solar-panel-large",
    "thorium-reactor",
    "impact-reactor",
    "mechanical-drill",
    "pneumatic-drill",
    "laser-drill",
    "blast-drill",
    "water-extractor",
    "cultivator",
    "oil-extractor",
    "core-shard",
    "core-foundation",
    "core-nucleus",
    "vault",
    "container",
    "unloader",
    "duo",
    "scatter",
    "scorch",
    "hail",
    "wave",
    "lancer",
    "arc",
    "parallax",
    "swarmer",
    "salvo",
    "segment",
    "tsunami",
    "fuse",
    "ripple",
    "cyclone",
    "foreshadow",
    "spectre",
    "meltdown",
    "command-center",
    "ground-factory",
    "air-factory",
    "naval-factory",
    "additive-reconstructor",
    "multiplicative-reconstructor",
    "exponential-reconstructor",
    "logic-display",
    "large-logic-display",
    "switch",
    "message",
    "memory-cell",
    "memory-bank",
    "micro-processor",
    "logic-processor",
    "hyper-processor",
    "world-processor",
    "canvas",
  ],
};


const logicGroups = {
  getLogicGroupColor: (textBlock) => {
    for (let i = 0; i < logicGroups.list.length; i++) {
      let groupName = logicGroups.list[i];
      if (logicGroups[groupName].keywords.includes(textBlock))
        return logicGroups[groupName].color;
    }
    return "#ffffff";
  },
  list: ["IO", "BlockControl", "Operations", "FlowControl", "UnitControl"],
  
  IO: {
    keywords: ["read", "write", "print", "draw"],
    color: "lightOrange",
  },
  BlockControl: {
    keywords: [
      "drawflush",
      "printflush",
      "control",
      "sensor",
      "radar",
      "getlink",
    ],
    color: "red",
  },
  Operations: {
    keywords: ["set", "op", "lookup", "packcolor"],
    color: "purple",
  },
  FlowControl: {
    keywords: ["jump", "wait", "stop", "end"],
    color: "blue",
  },

  UnitControl: {
    keywords: ["ubind", "ucontrol", "uradar", "ulocate"],
    color: "yellow",
  },
};
//variables existing_vars, existing_user_var , existing_label,  [string], [label ], [variable], [number], [color], linked_buildings

//existing_user_var means existing variables that are not in readOnlyVarNames.
const suggestions = {
  buildngs: ["linked_buildings","existing_user_var"],
  logicNames: Array.from(new Set(database.block.map(str => str.split('-').pop()))),
  commands: [".addlink",".label"],
  keywordWithOptions: ["jump", "draw", "control", "op", "ucontrol"],
  specialKeywords:["[number]","[variable]","[color]","[label]"],
  readOnlyVarNames: [
    "@tick",
    "@time",
    "@ipt",
    "@link",
    "@mapw",
    "@maph",
    "@this",
    "@thisx",
    "@thisy",
    "@waveNumber", //ADD ALL BELOW TO DATABASE
    "@waveTime",
    "@second",
    "@minute"],
  keywordWithOptionsAutoFill: {
    jump: "[operator]",
    draw: "[type]",
    control: "[set]",
    op: "[operator]",
    ucontrol: "[action]",
  },
  state: ["true", "false", "1", "0","existing_vars"],
  numbers: ["[number]","existing_vars"],
  constant: ["[number]","existing_vars","true","false"],
  allVars: ["existing_vars","linked_buildingss"],
  all: ["[number]","existing_vars","true","false","linked_buildingss"],
  variable: ["existing_vars","[variable]"],
  lookupOptions: ["item", "liquid", "block", "unit"],

  radarTargetOptions: [
    "any",
    "enemy",
    "player",
    "ally",
    "ground",
    "flying",
    "attacker",
    "boss",
  ],
  radarSortOptions: ["distance", "health", "shield", "armor", "maxHealth"],
  drawOptions: [
    "clear",
    "color",
    "col",
    "line",
    "stroke",
    "rect",
    "lineRect",
    "poly",
    "linePoly",
    "triangle",
    "image",
  ],
  controlOptions: ["enabled", "shoot", "shootp", "config", "color"],
  ulocateFindOptions: ["ore", "building", "spawn", "damaged"],
  ulocateGroups: [
    "core",
    "storage",
    "generator",
    "turret",
    "factory",
    "repair",
    "battery",
    "reactor",
  ],
  uControlOptions: [
    "move",
    "idle",
    "stop",
    "mine",
    "unbind",
    "approach",
    "within",
    "flag",
    "payEnter",
    "payDrop",
    "payTake",
    "itemTake",
    "itemDrop",
    "boost",
    "target",
    "targetp",
    "autoPathfind",
    "pathfind",
    "getBlock",
  ],
  jumpOperators: [
    "equal",
    "notEqual",
    "always",
    "lessThan",
    "greaterThan",
    "lessThanEq",
    "greaterThanEq",
  ],
  operators: [
    "add",
    "sub",
    "mul",
    "div",
    "idiv",
    "mod",
    "pow",
    "equal",
    "notEqual",
    "land",
    "lessThan",
    "lessThanEq",
    "greaterThan",
    "greaterThanEq",
    "strictEqual",
    "shl",
    "shr",
    "or",
    "and",
    "xor",
    "not",
    "max",
    "min",
    "angle",
    "angleDiff",
    "len",
    "noise",
    "abs",
    "log",
    "log10",
    "floor",
    "ceil",
    "sqrt",
    "rand",
    "sin",
    "cos",
    "tan",
    "asin",
    "atan",
    "acos",
  ],
  otherSensableProperties: [
    "@totalItems",
    "@firstItem",
    "@totalLiquids",
    "@totalPower",
    "@itemCapacity",
    "@liquidCapacity",
    "@powerCapacity",
    "@powerNetStored",
    "@powerNetCapacity",
    "@powerNetIn",
    "@powerNetOut",
    "@ammo",
    "@ammoCapacity",
    "@health",
    "@maxHealth",
    "@heat",
    "@shield",
    "@armor",
    "@efficiency",
    "@progress",
    "@timescale",
    "@rotation",
    "@x",
    "@y",
    "@shootX",
    "@shootY",
    "@cameraX",
    "@cameraY",
    "@cameraWidth",
    "@cameraHeight",
    "@size",
    "@dead",
    "@range",
    "@shooting",
    "@boosting",
    "@mineX",
    "@mineY",
    "@mining",
    "@speed",
    "@team",
    "@type",
    "@flag",
    "@controlled",
    "@controller",
    "@name",
    "@payloadCount",
    "@payloadType",
    "@id",
  ],
  unitNames: [...database.unit].map((str) => "@" + str),
  itemNames: [...database.item].map((str) => "@" + str),
  blockNames: [...database.block].map((str) => "@" + str),
  liquidNames: [...database.liquid].map((str) => "@" + str),
};
suggestions.allNames = [
  ...suggestions.unitNames,
  ...suggestions.itemNames,
  ...suggestions.blockNames,
  ...suggestions.liquidNames,
];

const autoSuggest = {
  read: ["[result]", "[from]", "[at]"],
  write: ["[value]", "[to]", "[at]"],
  ".addlink": ["[building]"],
  "#": ["[comment]"],
  ".label": ["[name]"],
  draw: {
    clear: ["[red]", "[green]", "[blue]"], //[R,G,B]
    color: ["[red]", "[green]", "[blue]", "[alpha]"], //[R,G,B]

    col: ["[hex color]"],

    line: ["[x1]", "[y1]", "[x2]", "[y2]"], //[x y x2 y2]
    stroke: ["[width]"],
    rect: ["[x1]", "[y1]", "[width]", "[height]"],
    lineRect: ["[x1]", "[y1]", "[width]", "[height]"], //[x y x2 y2]
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
  radar: [
    "[target]",
    "[and]",
    "[and]",
    "[sort]",
    "[building]",
    "[order]",
    "[result]",
  ],
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
  packcolor: [
    "[result]",
    "[redPercent]",
    "[greenPercent]",
    "[bluePercent]",
    "[alphaPercent]",
  ],
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
  uradar: [
    "[target]",
    "[and]",
    "[and]",
    "[sort]",
    "[0]",
    "[order]",
    "[result]",
  ],
  ulocate: [
    "[find]",
    "[group]",
    "[enemy]",
    "[@ore]",
    "[x]",
    "[y]",
    "[found]",
    "[building]",
  ],
};

const parameters = {
  0: [
    "read",
    "write",
    "draw",
    "print",
    "printflush",
    "drawflush",
    "getlink",
    "control",
    "radar",
    "sensor",
    "op",
    "set",
    "lookup",
    "packcolor",
    "wait",
    "stop",
    "end",
    "jump",
    "ubind",
    "ucontrol",
    "ulocate",
    "uradar",
    ".addlink",
    ".label",
    "#",
  ],
  1: {
    ".addlink":[[...suggestions.logicNames]],
    ".label":[["[label]"]],
    "#":[[""]],
    read: [["[variable]"], suggestions.buildngs, suggestions.numbers],
    write: [["existing_user_var"], suggestions.buildngs, suggestions.numbers],
    draw: [
      suggestions.drawOptions,
      {
        clear: addToArray(suggestions.numbers, 3), //[R,G,B]
        color: addToArray(suggestions.numbers, 4), //[x y x2 y2]
        col: [["[color]"]],
        line: addToArray(suggestions.numbers, 4), //[x y x2 y2]
        stroke: addToArray(suggestions.numbers, 1),
        rect: addToArray(suggestions.numbers, 4),
        lineRect: addToArray(suggestions.numbers, 4),
        poly: addToArray(suggestions.numbers, 5),
        linePoly: addToArray(suggestions.numbers, 5),
        triangle: addToArray(suggestions.numbers, 6),
        image: addToArray(suggestions.numbers, 2, [
          suggestions.numbers,
          suggestions.numbers,
          suggestions.allNames,
        ]),
      },
    ],
    print: [["existing_vars"]],
    drawflush: [suggestions.buildngs],
    printflush: [suggestions.buildngs],
    getlink: [["[variable]"], suggestions.numbers],
    control: [
      suggestions.controlOptions,
      {
        enabled: [suggestions.buildngs, suggestions.state],
        shoot: [
          suggestions.buildngs,
          suggestions.numbers,
          suggestions.numbers,
          suggestions.state,
        ],
        shootp: [suggestions.buildngs, ["existing_vars"], suggestions.state],
        config: [suggestions.buildngs, suggestions.itemNames],
        color: [suggestions.buildngs, ["[color]"]],
      },
    ],
    radar: [
      ...addToArray(suggestions.radarTargetOptions, 3),
      suggestions.radarSortOptions,
      suggestions.buildngs,
      ["0", "1"],
      ["[variable]"],
    ],
    sensor: [
      ["[variable]"],
      suggestions.buildngs,
      [...suggestions.itemNames,...suggestions.liquidNames, ...suggestions.otherSensableProperties],
    ],
    set: [suggestions.variable,suggestions.constant],
    op: [
      suggestions.operators,
      {
        add: [suggestions.variable, suggestions.constant, suggestions.constant],
        sub: [suggestions.variable, suggestions.constant, suggestions.constant],
        mul: [suggestions.variable, suggestions.constant, suggestions.constant],
        div: [suggestions.variable, suggestions.constant, suggestions.constant],
        idiv: [suggestions.variable, suggestions.constant, suggestions.constant],
        mod: [suggestions.variable, suggestions.constant, suggestions.constant],
        pow: [suggestions.variable, suggestions.constant, suggestions.constant],
        equal: [suggestions.variable, suggestions.constant, suggestions.constant],
        notEqual: [
          suggestions.variable,
          suggestions.constant,
          suggestions.constant,
        ],
        land: [suggestions.variable, suggestions.constant, suggestions.constant],
        lessThan: [
          suggestions.variable,
          suggestions.constant,
          suggestions.constant,
        ],
        lessThanEq: [
          suggestions.variable,
          suggestions.constant,
          suggestions.constant,
        ],
        greaterThan: [
          suggestions.variable,
          suggestions.constant,
          suggestions.constant,
        ],
        greaterThanEq: [
          suggestions.variable,
          suggestions.constant,
          suggestions.constant,
        ],
        strictEqual: [
          suggestions.variable,
          suggestions.constant,
          suggestions.constant,
        ],
        shl: [suggestions.variable, suggestions.constant, suggestions.constant],
        shr: [suggestions.variable, suggestions.constant, suggestions.constant],
        or: [suggestions.variable, suggestions.constant, suggestions.constant],
        and: [suggestions.variable, suggestions.constant, suggestions.constant],
        xor: [suggestions.variable, suggestions.constant, suggestions.constant],
        not: [suggestions.variable, suggestions.constant],
        max: [suggestions.variable, suggestions.constant, suggestions.constant],
        min: [suggestions.variable, suggestions.constant, suggestions.constant],
        angle: [suggestions.variable, suggestions.constant, suggestions.constant],
        angleDiff: [
          suggestions.variable,
          suggestions.constant,
          suggestions.constant,
        ],
        len: [suggestions.variable, suggestions.constant, suggestions.constant],
        noise: [suggestions.variable, suggestions.constant, suggestions.constant],
        abs: [suggestions.variable, suggestions.constant],
        log: [suggestions.variable, suggestions.constant],
        log10: [suggestions.variable, suggestions.constant],
        floor: [suggestions.variable, suggestions.constant],
        ceil: [suggestions.variable, suggestions.constant],
        sqrt: [suggestions.variable, suggestions.constant],
        rand: [suggestions.variable, suggestions.constant],
        sin: [suggestions.variable, suggestions.constant],
        cos: [suggestions.variable, suggestions.constant],
        tan: [suggestions.variable, suggestions.constant],
        asin: [suggestions.variable, suggestions.constant],
        acos: [suggestions.variable, suggestions.constant],
        atan: [suggestions.variable, suggestions.constant],
      },
    ],

    lookup: [suggestions.lookupOptions, ["[variable]"], suggestions.numbers],
    packcolor: addToArray(suggestions.numbers, 4, [["[variable]"]]),
    wait: [suggestions.numbers],
    stop: [],
    end: [],
    jump: [
      ["existing_label","[number]"],
      suggestions.jumpOperators,
      {
        equal: [suggestions.allVars, suggestions.all],
        notEqual: [suggestions.allVars, suggestions.all],
        always: [],
        lessThan: [suggestions.allVars, suggestions.all],
        greaterThan: [suggestions.allVars, suggestions.all],
        lessThanEq: [suggestions.allVars, suggestions.all],
        greaterThanEq: [suggestions.allVars, suggestions.all],
      },
    ],

    ubind: [[...suggestions.unitNames,"existing_user_var"]],
    ucontrol: [
      suggestions.uControlOptions,
      {
        move: addToArray(suggestions.numbers, 2),
        idle: [],
        stop: [],
        mine: addToArray(suggestions.numbers, 2),
        unbind: [],
        approach: addToArray(suggestions.numbers, 3),
        within: [...addToArray(suggestions.numbers, 3), ["[variable]"]],
        flag: [suggestions.numbers],
        payEnter: [],
        payDrop: [],
        payTake: [suggestions.state],
        itemTake: [
          suggestions.buildngs,
          suggestions.itemNames,
          suggestions.numbers,
        ],
        itemDrop: [suggestions.buildngs, suggestions.numbers],
        boost: [suggestions.state],
        target: [suggestions.numbers, suggestions.numbers, suggestions.state],
        targetp: [["existing_vars"], suggestions.state],
        autoPathfind: [],
        pathfind: [suggestions.numbers, suggestions.numbers],
        getBlock: [
          suggestions.numbers,
          suggestions.numbers,
          ["[variable]"],
          ["[variable]"],
          ["[variable]"],
        ],
      },
    ],
    uradar: [
      ...addToArray(suggestions.radarTargetOptions, 3),
      suggestions.radarSortOptions,
      ["0"],
      ["0", "1"],
      ["[variable]"],
    ],
    ulocate: [
      suggestions.ulocateFindOptions,
      suggestions.ulocateGroups,
      suggestions.state,
      suggestions.itemNames,
      ["[variable]"],
      ["[variable]"],
      ["[variable]"],
      ["[variable]"],
    ],
  },
};

const forbiddenVarName = [
  ...parameters[0],
  ...suggestions.allNames,
  ...suggestions.otherSensableProperties,
  ...suggestions.operators,
  ...suggestions.uControlOptions,
  ...suggestions.controlOptions,
  ...suggestions.ulocateGroups,
  ...suggestions.ulocateFindOptions,
  ...suggestions.drawOptions,
  ...suggestions.lookupOptions,
  ...suggestions.radarSortOptions,
  ...suggestions.radarTargetOptions,
  "always"
];


export{ database, logicGroups, suggestions, autoSuggest, forbiddenVarName, parameters};