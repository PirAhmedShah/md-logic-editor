"use strict";
import { defaultKeys, defaultTheme } from "./main.js";

export function getTheme() {
  
  let theme = localStorage.getItem("Theme");
    if (typeof theme !== "string") {
      localStorage.setItem("Theme", JSON.stringify(defaultTheme))
      return defaultTheme;
    };
    return JSON.parse(theme);
  }
  export function getKeys() {
    let keys = localStorage.getItem("Keys");
    if (typeof keys !== "string") {
      localStorage.setItem("Keys", JSON.stringify(defaultKeys))
      return defaultTheme;
    }
    return JSON.parse(keys);
  }


  export function constrain(value,min,max) {
    return value < min ? min : value > max? max : value;
  }

  export function updateCSSThemeTo(theme){
    
    Object.keys(theme).forEach(colorName=>{
      document.documentElement.style.setProperty("--clr-"+colorName, theme[colorName]);
         })
  }
  
  
  export function updateCSSKeysTo(keys){
    Object.keys(keys).forEach(keyName=>{
      document.documentElement.style.setProperty("--key-"+keyName, `"${keys[keyName]}"`);
         })
  }
  