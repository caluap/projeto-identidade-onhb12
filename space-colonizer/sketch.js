// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

var max_dist = 100;
var min_dist = 5;

let grow = false,
  showLeaves = true;

var tree;

function setup() {
  let r = 3;
  let cnv = createCanvas(210 * r, 297 * r);
  tree = new Tree();

  createButton("grow").mousePressed(() => {
    grow = !grow;
  });

  createButton("show leaves").mousePressed(() => {
    showLeaves = !showLeaves;
  });

  cnv.mouseClicked(e => {
    tree = new Tree(mouseX, mouseY);
    console.log(tree);
  });
}

function draw() {
  background("#cb0072");
  tree.show(showLeaves);
  if (grow) {
    tree.grow();
  }
}
