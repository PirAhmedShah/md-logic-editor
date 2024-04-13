"use strict";
import { defaultKeys, defaultTheme } from "./main.js";

function getTheme() {
  
  let theme = localStorage.getItem("Theme");
    if (typeof theme !== "string") {
      localStorage.setItem("Theme", JSON.stringify(defaultTheme))
      return defaultTheme;
    };
    return JSON.parse(theme);
  }
  function getKeys() {
    let keys = localStorage.getItem("Keys");
    if (typeof keys !== "string") {
      localStorage.setItem("Keys", JSON.stringify(defaultKeys))
      return defaultTheme;
    };return JSON.parse(keys);
  }


  function constrain(value,min,max) {
    return value < min ? min : value > max? max : value;
  }

  export {getTheme, getKeys,constrain }
    