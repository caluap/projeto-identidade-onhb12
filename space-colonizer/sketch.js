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

function setup() {
  let r = 3;
  let cnv = createCanvas(210 * r, 297 * r);

  for (var i = 0; i < 500; i++) {
    leaves.push(new Leaf());
  }

  trees.push(new Tree());

  createP();

  createButton("grow").mousePressed(() => {
    grow = !grow;
  });

  createButton("show leaves").mousePressed(() => {
    showLeaves = !showLeaves;
  });

  cnv.mouseClicked(e => {
    trees.push(new Tree(mouseX, mouseY));
    console.log(trees[trees.length - 1]);
  });
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
