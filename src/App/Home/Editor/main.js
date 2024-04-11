import { CanvasManager } from "../../Components/CanvasManager/main.js";
import { MlogTextEditor } from "../../Components/MlogTextEditor/main.js";
import {getTheme,getKeys } from "../../Components/Global/main.js";
import {setupOptions} from "./options.js";

let canvasManager = new CanvasManager("coding-canvas",  0.875, 0.875);

let mlogTextEditor = new MlogTextEditor(canvasManager, 18,getTheme(),getKeys());


let mlog = `

# this is my comment

#this is my comment

.label myLabel1

jump myLabel1 always

myLabel2:
jump myLabel2 always

se a c a
d 
asda
s d
as
d as afksdoifasdo fkads
f dsaf
 asdkfosadkf 
 d 
 asda
 s d
 as
 d as afksdoifasdo fkads
 f dsaf
  asdkfosadkf 

`
function loadEditor() {
  setupOptions();
  mlogTextEditor.loadMlog(mlog)
  mlogTextEditor.init();
}
export { loadEditor, mlogTextEditor };
