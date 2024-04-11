import { CanvasManager } from "../../Components/CanvasManager/main.js";
import { MlogTextEditor } from "../../Components/MlogTextEditor/main.js";
import {getTheme,getKeys } from "../../Components/Global/main.js";
import {setupOptions} from "./options.js";

let canvasManager = new CanvasManager("coding-canvas",  0.875, 0.875);

let mlogTextEditor = new MlogTextEditor(canvasManager, 18,getTheme(),getKeys());


let mlog = `
# If you find any bugs, dm "b1zl" on discord.
# Tab: Autofill | Enter: New line | Delete: Delete word | Arrow keys: Move Cursor |
# PageUp: Prev Page| PageDown: Next Page |
# Ctrl+h, Ctrl+j, Ctrl+k: Goto Top, Goto Middle, Goto Bottom
# Ctrl+x, Ctrl+c, Ctrl+v: Cut, Copy, Paste Current Word.
# Ctrl+-, Ctrl+=: Zoom Out, Zoom In 
`
function loadEditor() {
  setupOptions();
  mlogTextEditor.loadMlog(mlog)
  mlogTextEditor.init();
}
export { loadEditor, mlogTextEditor };
