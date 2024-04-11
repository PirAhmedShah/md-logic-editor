import { CanvasManager } from "../../Components/CanvasManager/main.js";
import { MlogTextEditor } from "../../Components/MlogTextEditor/main.js";
import { defaultTheme, defaultHotkeys } from "../../Components/Global/main.js";

let canvasManager = new CanvasManager("coding-canvas",  0.875, 0.875);
let mlogTextEditor = new MlogTextEditor(canvasManager, 18,defaultTheme,defaultHotkeys);
function loadEditor() {
  mlogTextEditor.init();
}
export { loadEditor };
