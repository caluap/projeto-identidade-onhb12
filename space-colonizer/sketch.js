// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

var max_dist = 100;
var min_dist = 5;

let grow = false,
  showLeaves = true;

var leaves = [];
var trees = [];

let penModeButton;
let rootMode = true;

function setup() {
  let r = 2.4;
  let cnv = createCanvas(210 * r, 297 * r);

  randomizeLeaves();
  trees.push(new Tree());

  createP();

  createButton("grow").mousePressed(() => {
    grow = !grow;
  });

  createButton("show leaves").mousePressed(() => {
    showLeaves = !showLeaves;
  });

  createButton("randomize leaves").mousePressed(randomizeLeaves);

  penModeButton = createButton("pen mode: root").mousePressed(() => {
    if (rootMode) {
      penModeButton.elt.textContent = "pen mode: leaves";
      rootMode = false;
    } else {
      penModeButton.elt.textContent = "pen mode: root";
      rootMode = true;
    }
    console.log(penModeButton);
  });

  cnv.mouseClicked(e => {
    if (rootMode) {
      trees.push(new Tree(mouseX, mouseY));
      console.log(trees[trees.length - 1]);
    } else {
      // adds 30 randomly placed leaves around the mouse position
      for (let i = 0; i < 30; i++) {
        let p = randomPoint(mouseX, mouseY, 50);
        leaves.push(new Leaf(p));
      }
    }
  });
}

function randomPoint(x, y, radius) {
  let r = random(radius);
  let a = random(TWO_PI);
  return createVector(cos(a) * r + x, sin(a) * r + y);
}

function randomizeLeaves() {
  leaves = [];
  for (var i = 0; i < 10; i++) {
    leaves.push(new Leaf());
  }
}

function draw() {
  background("#cb0072");

  if (showLeaves) {
    for (var i = 0; i < leaves.length; i++) {
      leaves[i].show();
    }
  }
  for (i = 0; i < trees.length; i++) {
    trees[i].show();
  }
  if (grow && trees.length > 0) {
    trees[trees.length - 1].grow();
  }
}
