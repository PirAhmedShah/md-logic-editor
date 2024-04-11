import { CanvasManager } from "../../MainComponents/Components/canvasManager.js";
import { MlogTextEditor } from "../../MainComponents/Components/mlogTextEditor.js";

let canvasManager = new CanvasManager("coding-canvas",  0.875, 0.875);

let canvas = canvasManager.canvas;
let mlogTextEditor = new MlogTextEditor(canvas, 18);

let test1 = `
# this is a comment.
#this is a also comment but it's better to have space after #
# -
# These are commands
# .label
# .addlink
# -
# this is label.
.label myLabel1
# myLabel1 points to following line that is not comment or command.
# following lines are not valid logic lines
# [comment]
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump sta
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump sta
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump sta
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump sta
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump sta
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump sta
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump sta
.addlink shard
.addlink processor
.label randomLabel0
# this is valid logic line
read res1 cell1 0
# labels are used in jump statement like this
jump myLabel1 always
# If cursor is on jump statement, it will highlight the line it's jumping to.
jump 3 equal var1 var2
# if variable is not highlighted, it's not declared anywhere.
op add var3 var2 var1
op rand randomNum @tick
set @unit null
# will not highlight readOnly variables
set @tick 0
set @waveTime 0
read @ipt cell1 2


`
function loadEditor() {
  console.log(" > > > Loading Minified MlogTextEditor.js...");

  canvasManager.initCanvas();
  console.log(" > > > > Loading Mlog")
  mlogTextEditor.loadMlog(test1);
  console.log(" > > > > Mlog Loaded")
  console.log(" > > > > initializing Editor")
  mlogTextEditor.init();
  console.log(" > > > MlogTextEditor Loaded!");
}
export { loadEditor };
