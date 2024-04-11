import { loadComponents } from "./Components/components.js";

function main() {
  console.log("Loading Main...");
  loadComponents();
  console.log("Main Loaded!");
  console.log("Ready")
}
console.log("Waiting for page to load..")
window.onload = main;
