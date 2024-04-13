"use strict";
import { MDEditor } from "../../Components/MDEditor/main.js";
import { getTheme,getKeys } from "../../Components/Global/functions.js";
import {setupOptions} from "./options.js";

let mdEditor = new MDEditor(18,getTheme(),getKeys());


let mlog = `
# If you find any bugs, dm "b1zl" on discord.
# Tab: Autofill | Enter: New line | Delete: Delete word | Arrow keys: Move Cursor |
# PageUp: Prev Page| PageDown: Next Page |
# Ctrl+h, Ctrl+j, Ctrl+k: Goto Top, Goto Middle, Goto Bottom
# Ctrl+x, Ctrl+c, Ctrl+v: Cut, Copy, Paste Current Word.
# Ctrl+-, Ctrl+=: Zoom Out, Zoom In 
jump 1 equal res1 res2
.addlink cell
printflush cell1
myLabel1:
`
function loadEditor() {
  
  console.log("____LOAD EDITOR____")
  setupOptions();
  mdEditor.loadMlog(mlog)
}
export { loadEditor, mdEditor };
