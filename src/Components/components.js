import { loadCodingComponents } from "./CodingComponents/codingComponents.js";
import { loadMainComponents } from "./MainComponents/mainComponents.js";

export function loadComponents() {
  console.log(" > Loading Components...");
  loadMainComponents();
  loadCodingComponents();

  console.log(" > Components Loaded!");
}
