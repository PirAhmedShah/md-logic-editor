import { CanvasManager } from "../../Components/MainComponents/canvasManager.js";
import { MlogTextEditor } from "../../Components/MainComponents/mlogTextEditor.js";

let canvasManager = new CanvasManager("coding-canvas",  0.875, 0.875);
let mlogTextEditor = new MlogTextEditor(canvasManager, 18);
function loadEditor() {
  mlogTextEditor.init();
}
export { loadEditor };
