import { mlogTextEditor } from "./main.js";

let importBtn = document.getElementById("import-clipboard-btn");
let exportBtn = document.getElementById("export-clipboard-btn");
let clearBtn = document.getElementById("clear-btn");

function onImport() {
  console.log("IMPORT: WAITING...");

  navigator.clipboard.readText().then((str) => {
    let userPermission = confirm(
`Importing...
${str}`);
    if (userPermission) {
      mlogTextEditor.loadMlog(str);
      mlogTextEditor.init();
      console.log("IMPORT: COMPLETED");
    } else console.log("IMPORT: DENIED");
  });
}
function onExport() {
  console.log("EXPORT: WAITING...");
  let str = mlogTextEditor.exportMlog();

  let userPermission =confirm(
    `Exporting...
${str}`);
  if (userPermission) {
    navigator.clipboard.writeText(str).then(()=>{
        console.log("EXPORT: COMPLETED");
    })
  } else console.log("EXPORT: DENIED");

}
function onClear() {
  let userPermission = confirm(`Clear?`);
  if(!userPermission)return;
  mlogTextEditor.loadMlog('[function]')
  mlogTextEditor.init()
}
export function setupOptions() {
  importBtn.addEventListener("click", onImport);
  exportBtn.addEventListener("click", onExport);
  clearBtn.addEventListener("click", onClear);
}
