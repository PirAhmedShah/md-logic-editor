import { loadEditor } from "./Editor/main.js";


function removeLoadingOverlay() {
  let loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.animation = "fadeout 0.5s ease-in forwards";
   setTimeout(()=>{
     loadingOverlay.remove();
   },500)
}


export function loadHome() {
  
  console.log("____FUNC LOAD HOME____")
  
  loadEditor();
  removeLoadingOverlay()

  
}
