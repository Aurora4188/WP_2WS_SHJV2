let beat, song;
let background;
let volume;

function preload() {
  //beat = loadSound("assets/beat.mp3");
  //song = loadSound("assets/song.mp3");
  background = ("assets/mixkit-valley-sunset.mp3");
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();

  initThree(); // ***
}

function draw() {
  noLoop();
}

function keyPressed() {
  if (key == " ") {

  }
}