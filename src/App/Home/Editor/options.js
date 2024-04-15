"use strict";
import { mdEditor } from "./main.js";

let importBtn = document.getElementById("import-clipboard-btn");
let exportBtn = document.getElementById("export-clipboard-btn");
let clearBtn = document.getElementById("clear-btn");

function onImport() {
  
  console.log("____FUNC ONIMPORT____")
  console.log("IMPORT: WAITING...");

  navigator.clipboard.readText().then((str) => {
    let userPermission = confirm(
`Importing...
${str}`);
    if (userPermission) {
      mdEditor.loadMlog(str);
      mdEditor.init();
      console.log("IMPORT: COMPLETED");
    } else console.log("IMPORT: DENIED");
  });
}
function onExport() {
  
  console.log("____FUNC ONEXPORT____")
  console.log("EXPORT: WAITING...");
  let str = mdEditor.exportMlog();

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
  console.log("____FUNC ONCLEAR____")
  let userPermission = confirm(`Clear?`);
  if(!userPermission)return;
  mdEditor.loadMlog('[function]')
  mdEditor.init()
}
export function setupOptions() {
  
  console.log("____SETUP OPTIONS____")
  importBtn.addEventListener("click", onImport);
  exportBtn.addEventListener("click", onExport);
  clearBtn.addEventListener("click", onClear);
}
