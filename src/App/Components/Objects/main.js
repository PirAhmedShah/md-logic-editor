"use strict";

console.log("____OBJECTS MAIN.js____");
let database = {
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
  liquid: ["water", "slag", "oil", "cryofluid", "neoplasm", "hydrogen", "ozone", "cyanogen", "gallium", "nitrogen", "arkycite"],
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
  groupColors: { IO: "lightOrange", BlockControl: "red", Operations: "purple", FlowControl: "cyan", UnitControl: "yellow", Commands: "blue" },
  keywordGroup: {
    read: "IO",
    write: "IO",
    print: "IO",
    draw: "IO",
    drawflush: "BlockControl",
    printflush: "BlockControl",
    control: "BlockControl",
    sensor: "BlockControl",
    radar: "BlockControl",
    getlink: "BlockControl",
    set: "Operations",
    op: "Operations",
    lookup: "Operations",
    packcolor: "Operations",
    jump: "FlowControl",
    wait: "FlowControl",
    stop: "FlowControl",
    end: "FlowControl",
    ubind: "UnitControl",
    ucontrol: "UnitControl",
    uradar: "UnitControl",
    ulocate: "UnitControl",
    ".label": "Commands",
    ".addlink": "Commands",
    //".func": "Commands",
  },
};
//variables existing_var,
//existing_var, existing_label, [string], [label], [variable], [number], [color], linked_buildings;

//existing_var means existing variables that are not in readOnlyVarNames.
const suggestions = {
  buildings: ["linked_buildings", "existing_var"],
  logicNames: new Set(database.block.map((str) => str.split("-").pop())),
  commands: new Set([".addlink", ".label"]),
  keywordWithOptions: new Set(["jump", "draw", "control", "op", "ucontrol"]),
  validFirstWords: new Set([
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
    "uradar"]),
  specialKeywords: new Set(["[number]", "[variable]", "[color]", "[label]"]),
  order: new Set(["0","1"]),
  readOnlyVarNames: new Set([
    "@tick",
    "@time",
    "@ipt",
    "@link",
    "@mapw",
    "@maph",
    "@this",
    "@thisx",
    "@thisy",
    "@waveNumber",
    //ADD ALL BELOW TO DATABASE
    "@waveTime",
    "@second",
    "@minute",
  ]),
  keywordWithOptionsAutoFill: {
    jump: ["[to]","[operator]"],
    draw: ["[type]"],
    control: ["[set]"],
    op: ["[operator]"],
    ucontrol: ["[action]"],
  },
  state: ["true", "false", "1", "0", "existing_var"],
  stateValues: new Set(["true", "false", "1", "0"]),
  numbers: ["[number]", "existing_var"],
  constant: ["[number]", "existing_var", "true", "false"],
  allVars: ["existing_var", "linked_buildings"],
  all: ["[number]", "existing_var", "true", "false", "linked_buildings"],
  variable: ["existing_var", "[variable]"],

  lookupOptions: new Set(["item", "liquid", "block", "unit"]),
  radarTargetOptions: new Set(["any", "enemy", "player", "ally", "ground", "flying", "attacker", "boss"]),
  radarSortOptions: new Set(["distance", "health", "shield", "armor", "maxHealth"]),
  drawOptions: new Set(["clear", "color", "col", "line", "stroke", "rect", "lineRect", "poly", "linePoly", "triangle", "image"]),
  controlOptions: new Set(["enabled", "shoot", "shootp", "config", "color"]),
  ulocateFindOptions: new Set(["ore", "building", "spawn", "damaged"]),
  ulocateGroups: new Set(["core", "storage", "generator", "turret", "factory", "repair", "battery", "reactor"]),
  uControlOptions: new Set([
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
  ]),
  jumpOperators: new Set(["equal", "notEqual", "always", "lessThan", "greaterThan", "lessThanEq", "greaterThanEq","strictEqual"]),
  operators: new Set([
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
  ]),
  otherSensableProperties: new Set([
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
    "@config"
  ]),
  unitNames: new Set([...database.unit].map((str) => "@" + str)),
  itemNames: new Set([...database.item].map((str) => "@" + str)),
  blockNames: new Set([...database.block].map((str) => "@" + str)),
  liquidNames: new Set([...database.liquid].map((str) => "@" + str)),
};
suggestions.allNames = new Set([...suggestions.unitNames, ...suggestions.itemNames, ...suggestions.blockNames, ...suggestions.liquidNames]);
suggestions.allSensables = new Set([...suggestions.itemNames, ...suggestions.liquidNames, ...suggestions.otherSensableProperties]);

let emptySet = new Set();
let parms = {
  varOnly: new Set(["[variable]"]),
  buildingsOnly: new Set(suggestions.buildings),
  numbersOnly: new Set(suggestions.numbers),
  existingVarsOnly: new Set(["existing_var"]),
  colorOnly: new Set(["[color]"]),

  stateOnly: new Set(suggestions.state),
  variable: new Set(suggestions.variable),
  constant: new Set(suggestions.constant),
  allVars: new Set(suggestions.allVars),
  all: new Set(suggestions.all),
  orderOnly:suggestions.order,
};
const parameters = {
  0: new Set([
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
   // ".func",
    ".label",
    "#",
  ]),
  1: {
    ".addlink": [new Set(suggestions.logicNames)],
   // ".func": [emptySet, parms.varOnly,parms.varOnly],
    ".label": [new Set(["[label]"])],
    "#": [emptySet],
    read: [parms.varOnly, parms.buildingsOnly, parms.numbersOnly],
    write: [parms.existingVarsOnly, parms.buildingsOnly, parms.numbersOnly],
    draw: [
      new Set(suggestions.drawOptions),
      {
        clear: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        //[R,G,B]
        color: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        //[x y x2 y2]
        col: [parms.colorOnly],
        line: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        //[x y x2 y2]
        stroke: [parms.numbersOnly],
        rect: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        lineRect: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        poly: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        linePoly: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        triangle: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        image: [parms.numbersOnly, parms.numbersOnly, suggestions.allNames, parms.numbersOnly, parms.numbersOnly],
      },
    ],
    print: [parms.existingVarsOnly],
    drawflush: [parms.buildingsOnly],
    printflush: [parms.buildingsOnly],
    getlink: [parms.varOnly, parms.numbersOnly],
    control: [
      suggestions.controlOptions,
      {
        enabled: [parms.buildingsOnly, parms.stateOnly],
        shoot: [parms.buildingsOnly, parms.numbersOnly, parms.numbersOnly, parms.stateOnly],
        shootp: [parms.buildingsOnly, parms.existingVarsOnly, parms.stateOnly],
        config: [parms.buildingsOnly, suggestions.itemNames],
        color: [parms.buildingsOnly, parms.colorOnly],
      },
    ],
    radar: [suggestions.radarTargetOptions, suggestions.radarTargetOptions, suggestions.radarTargetOptions, suggestions.radarSortOptions, parms.buildingsOnly, parms.orderOnly, parms.varOnly],
    sensor: [parms.varOnly, parms.buildingsOnly, suggestions.allSensables],
    set: [parms.variable, parms.constant],
    op: [
      suggestions.operators,
      {
        add: [parms.variable, parms.constant, parms.constant],
        sub: [parms.variable, parms.constant, parms.constant],
        mul: [parms.variable, parms.constant, parms.constant],
        div: [parms.variable, parms.constant, parms.constant],
        idiv: [parms.variable, parms.constant, parms.constant],
        mod: [parms.variable, parms.constant, parms.constant],
        pow: [parms.variable, parms.constant, parms.constant],
        equal: [parms.variable, parms.constant, parms.constant],
        notEqual: [parms.variable, parms.constant, parms.constant],
        land: [parms.variable, parms.constant, parms.constant],
        lessThan: [parms.variable, parms.constant, parms.constant],
        lessThanEq: [parms.variable, parms.constant, parms.constant],
        greaterThan: [parms.variable, parms.constant, parms.constant],
        greaterThanEq: [parms.variable, parms.constant, parms.constant],
        strictEqual: [parms.variable, parms.constant, parms.constant],
        shl: [parms.variable, parms.constant, parms.constant],
        shr: [parms.variable, parms.constant, parms.constant],
        or: [parms.variable, parms.constant, parms.constant],
        and: [parms.variable, parms.constant, parms.constant],
        xor: [parms.variable, parms.constant, parms.constant],
        not: [parms.variable, parms.constant],
        max: [parms.variable, parms.constant, parms.constant],
        min: [parms.variable, parms.constant, parms.constant],
        angle: [parms.variable, parms.constant, parms.constant],
        angleDiff: [parms.variable, parms.constant, parms.constant],
        len: [parms.variable, parms.constant, parms.constant],
        noise: [parms.variable, parms.constant, parms.constant],
        abs: [parms.variable, parms.constant],
        log: [parms.variable, parms.constant],
        log10: [parms.variable, parms.constant],
        floor: [parms.variable, parms.constant],
        ceil: [parms.variable, parms.constant],
        sqrt: [parms.variable, parms.constant],
        rand: [parms.variable, parms.constant],
        sin: [parms.variable, parms.constant],
        cos: [parms.variable, parms.constant],
        tan: [parms.variable, parms.constant],
        asin: [parms.variable, parms.constant],
        acos: [parms.variable, parms.constant],
        atan: [parms.variable, parms.constant],
      },
    ],

    lookup: [suggestions.lookupOptions, parms.varOnly, parms.numbersOnly],
    packcolor: [parms.varOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
    wait: [parms.numbersOnly],
    stop: [emptySet],
    end: [emptySet],
    jump: [
      new Set(["existing_label", "[number]"]),
      suggestions.jumpOperators,
      {
        equal: [parms.allVars, parms.all],
        notEqual: [parms.allVars, parms.all],
        always: [],
        lessThan: [parms.allVars, parms.all],
        greaterThan: [parms.allVars, parms.all],
        lessThanEq: [parms.allVars, parms.all],
        greaterThanEq: [parms.allVars, parms.all],
        strictEqual:[parms.allVars, parms.all]
      },
    ],

    ubind: [new Set([...suggestions.unitNames, "existing_var"])],
    ucontrol: [
      suggestions.uControlOptions,
      {
        move: [parms.numbersOnly, parms.numbersOnly],
        idle: [],
        stop: [],
        mine: [parms.numbersOnly, parms.numbersOnly],
        unbind: [],
        approach: [parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        within: [parms.varOnly, parms.numbersOnly, parms.numbersOnly, parms.numbersOnly],
        flag: [parms.numbersOnly],
        payEnter: [],
        payDrop: [],
        payTake: [parms.stateOnly],
        itemTake: [parms.buildingsOnly, suggestions.itemNames, parms.numbersOnly],
        itemDrop: [parms.buildingsOnly, parms.numbersOnly],
        boost: [parms.stateOnly],
        target: [parms.numbersOnly, parms.numbersOnly, parms.stateOnly],
        targetp: [parms.existingVarsOnly, parms.stateOnly],
        autoPathfind: [],
        pathfind: [parms.numbersOnly, parms.numbersOnly],
        getBlock: [parms.numbersOnly, parms.numbersOnly, parms.varOnly, parms.varOnly, parms.varOnly],
      },
    ],
    uradar: [suggestions.radarTargetOptions, suggestions.radarTargetOptions, suggestions.radarTargetOptions, suggestions.radarSortOptions, parms.buildingsOnly, parms.orderOnly, parms.varOnly],
    ulocate: [suggestions.ulocateFindOptions, suggestions.ulocateGroups, parms.stateOnly, suggestions.itemNames, parms.varOnly, parms.varOnly, parms.varOnly, parms.varOnly],
  },
};

const forbiddenVarName = new Set([
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
  ...suggestions.radarTargetOptions,
  ...suggestions.readOnlyVarNames,
  "always",
]);
export { database, logicGroups, suggestions,forbiddenVarName, parameters, emptySet };
