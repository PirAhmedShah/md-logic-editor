import { suggestions, parameters, emptySet, forbiddenVarName } from "../Objects/main.js";

//console.log("____UTILITY.JS____");

export function getParametersMaxLen(array) {
  let fK = array[0];
  if (!parameters[0].has(array[0])) return false;
  let kPara = parameters[1][fK];
  if (suggestions.keywordWithOptions.has(fK)) {
    let sI = fK === "jump" ? 1 : 0;
    let sK = array[1 + sI],
      optionsPara = kPara[sI + 1];
    if (!kPara[sI].has(sK)) return false;
    return optionsPara[sK].length + 2 + sI;
  } else return kPara.length + 1;
}
export function removeUnwantedParameters(array) {
  let maxLength = getParametersMaxLen(array);
  if (maxLength) array.splice(maxLength);
}
export function getParameterArray(line, wordIndex) {
  if (wordIndex == 0) return parameters[0];
  let fK = line[0];
  if (!parameters[0].has(fK)) return emptySet;
  if (isString(line[wordIndex])) return new Set(["[string]"]);
  let kPara = parameters[1][fK];
  if (suggestions.keywordWithOptions.has(fK)) {
    let sI = fK === "jump" ? 1 : 0;
    if (wordIndex == 1 || (sI == 1 && wordIndex == 2)) return kPara[wordIndex - 1];
    let sK = line[1 + sI],
      optionsPara = kPara[sI + 1];
    if (!kPara[sI].has(sK) || optionsPara[sK].length <= wordIndex - 2 - sI) return emptySet;
    return optionsPara[sK][wordIndex - 2 - sI];
  } else {
    if (kPara.length <= wordIndex - 1) return emptySet;
    return kPara[wordIndex - 1];
  }
}
export function isAutoGenerated(str) {
  return /^\[.*\]$/.test(str);
}
export function isCommand(arr) {
  return suggestions.commands.has(arr[0]);
}
export function isComment(line) {
  return line[0][0] === "#";
}
export function isString(str) {
  return /^\".*\"$/.test(str);
}
export function isValidHex(str) {
  return /^%[0-9A-F]{6}$/i.test(str);
}
export function isNumber(str) {
  return /^[0-9]+$/.test(str);
}
export function isConstant(str) {
  return /^(true|false|null|-?\d+(\.\d+)?|\d+\.\d+)$/.test(str);
}
export function isValidCharacter(str) {
  return /^[^\s]{1}$/.test(str);
}