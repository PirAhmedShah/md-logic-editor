import { CanvasManager } from "../../Components/CanvasManager/main.js";
import { MlogTextEditor } from "../../Components/MlogTextEditor/main.js";
import { defaultTheme, defaultHotkeys } from "../../Components/Global/main.js";

let canvasManager = new CanvasManager("coding-canvas",  0.875, 0.875);
let mlogTextEditor = new MlogTextEditor(canvasManager, 18,defaultTheme,defaultHotkeys);
let mlog = `
# random comment
read @tick cell1 position
wriate result cell1 position
.addlink cell
draw clear red blue green 0 0 0
draw coal %hexColor ablue green 0 0 0
draw line x y x2 y2 0 0
draw stroke width 0 0 0 0 0
.func name p1 p2
draw rect x y x2 y2 0 0
draw poly x y sides radius rotation 0
draw linePoly x y sides radius rotation 0
draw triangle x y x2 y2 x3 y3
draw image x y @image size rotation 0
print "String To Add to Text Buffer"
drawflush display
printflush message
.label randomAsslabel
getlink result link
control enabled bld state 0 0 0
control shoot bld x y shoot 0
control shootp bld unit shoot 0 0
control config bld @cofig 0 0 0
control color bld %hexColor 0 0 0
radar enemy ally player distance turret order result
sensor result bld @property
set result value
op add result a b
op sub result a b
op mul result a b
op div result a b
op idiv result a b
op mod result a b
op pow result a b
op equal result a b
op notEqual result a b
op land result a b
op lessThan result a b
op lessThanEq result a b
op greaterThan result a b
op greaterThanEq result a b
op strictEqual result a b
op shl result a b
op shr result a b
op or result a b
op and result a b
op xor result a b
op not result a 0
op max result a b
op min result a b
op angle result a b
op angleDiff result a b
op len result a b
op noise result a b
op abs result a 0
op log result a 0
op log10 result a 0
op floor result a 0
op ceil result a 0
op sqrt result a 0
op rand result a 0
op sin result a 0
op cos result a 0
op tan result a 0
op asin result a 0
op acos result a 0
op atan result a 0

lookup item result id
packcolor result red blue green alpha
wait sec
stop
end
jump 28 equal expression1 expression2
ubind @unit
ucontrol move x y 0 0 0
ucontrol idle 0 0 0 0 0
ucontrol stop 0 0 0 0 0
ucontrol unbind 0 0 0 0 0
ucontrol approach x y radius 0 0
ucontrol within x y radius result 0
ucontrol flag value 0 0 0 0
ucontrol mine x y 0 0 0
ucontrol payEnter 0 0 0 0 0
ucontrol payTake state 0 0 0 0
ucontrol payDrop 0 0 0 0 0
ucontrol itemTake from @item amount result 0
ucontrol boost state 0 0 0 0
ucontrol target x y shoot 0 0
ucontrol autoPathfind 0 0 0 0 0
ucontrol pathfind x y 0 0 0
ucontrol itemDrop to amount 0 0 0
ucontrol getBlock 100 130 type bld floor

uradar player enemy player distance 0 order result
ulocate building core true @copper outx outy found bld
ulocate spawn core true @copper outx outy found bld
ulocate damaged core true @copper outx outy found bld
ulocate ore core true @ore outx outy found bld
ubind @poly
ulocate building turret true @copper x x cF bld

`
function loadEditor() {
  mlogTextEditor.loadMlog(mlog)
  mlogTextEditor.init();
}
export { loadEditor };
