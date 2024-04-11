const defaultTheme = {
  background: "#272822",
  backgroundLight: "#2E2D22",
  foreground: "#F8F8F2",
  comment: "#AFAFAF",
  red: "#F92672",
  orange: " #FD971F",
  lightOrange: "#E69F66",
  dullBlue: "#7070FF",
  yellow: "#E6DB74",
  green: "#A6E22E",
  blue: "#66D9EF",
  hightlightColor: "#101812",
  purple: "#AE81FF",
  errorLine: "#f06060",
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
  },
};
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

    
export { defaultTheme, defaultKeys, getTheme, getKeys };
