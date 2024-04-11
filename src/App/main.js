import { loadHome } from "./Home/main.js";

function app() {
  //try {
    loadHome()
//    console.log("Ready!")
  //} catch (e) {
    //console.error(e)
  //  console.warn("Reloading page in 5 seconds...")
//    setTimeout(()=>{
//      window.location.reload()
    //},5000)
    //alert(e);
 // }
}
window.onload = app;

console.log("Waiting for page to load..")