"use strict";
const defaultTheme = {
  background: "#272822",
  backgroundLight: "#2E2D22",
  foreground: "#F8F8F2",
  comment: "#AFAFAF",
  red: "#F92672",
  orange: " #FD971F",
  lightOrange: "#E69F66",
  blue: "#7070FF",
  yellow: "#E6DB74",
  green: "#A6E22E",
  cyan: "#66D9EF",
  highlight: "#3E3D32",
  purple: "#AE81FF",
  errorLine: "#f06060",
  none: "#ffffff",
};
const defaultKeys = {
  cursorLeft: "ArrowLeft",
  cursorRight: "ArrowRight",
  cursorUp: "ArrowUp",
  cursorDown: "ArrowDown",
  nextWord: " ",
  newLine: "Enter",
  removeCharacter: "Backspace",
  removeWord: "Delete",
  autofill: "Tab",
  pageUp: "PageUp",
  pageDown: "PageDown",
  ctrl: {
    copyWord: "c",
    cutWord: "x",
    pasteWord: "v",
    gotoTop: "h",
    gotoMiddle: "j",
    gotoBottom: "k",
    zoomIn: "=",
    zoomOut: "-",
  }
};
export { defaultTheme, defaultKeys};
