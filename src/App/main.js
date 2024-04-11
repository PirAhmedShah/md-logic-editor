import { loadHome } from "./Home/main.js";

function app() {
  try {
    loadHome();
    console.log("Ready!");
  } catch (e) {
    console.error(e);
    console.warn("Reloading page after alert...");
    alert(e);
    
    window.location.reload()
  }
}
window.onload = app;

console.log("Waiting for page to load..");
