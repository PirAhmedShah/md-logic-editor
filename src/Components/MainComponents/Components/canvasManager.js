export class CanvasManager {
  constructor(id, widthPercent, heightPercent) {
    this.canvas = document.getElementById(id);
    if (this.canvas == null)
      throw new Error("Couldn't find canvas with id \"" + id + '".');
    this.ctx = this.canvas.getContext("2d");
this.canvas.w = this.canvas.width;
    this.canvas.h = this.canvas.height;
    this.canvas.w2 = this.canvas.width / 2;
    this.canvas.h2 = this.canvas.height / 2;
    this.widthPercent = widthPercent;
    this.heightPercent = heightPercent;
  }


  resize() {
    this.canvas.w = this.canvas.width = window.innerWidth * this.widthPercent;
    this.canvas.h = this.canvas.height = window.innerHeight * this.heightPercent;
    this.canvas.w2 = this.canvas.w / 2;
    this.canvas.h2 = this.canvas.h / 2;
    
  }

  initCanvas() {
    console.log(" > > > > Loading Canvas...");
    window.addEventListener("resize", ()=>{
      this.resize();
    });
    this.resize();
    console.log(" > > > > Canvas Loaded!");
  }
}
