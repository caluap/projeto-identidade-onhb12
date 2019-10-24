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

let rootMode = false;

let growButton, showLeavesButton, penModeButton;

function setup() {
  let r = 3;
  let cnv = createCanvas(210 * r, 297 * r);

  trees.push(new Tree());

  createP();

  growButton = createButton(`grow: ${grow}`).mousePressed(toggleGrow);

  showLeavesButton = createButton(`leaves: ${showLeaves}`).mousePressed(() => {
    showLeaves = !showLeaves;
    showLeavesButton.elt.textContent = `leaves: ${showLeaves}`;
  });

  createButton("random leaves").mousePressed(randomizeLeaves);

  penModeButton = createButton("pen mode: leaves").mousePressed(() => {
    if (rootMode) {
      penModeButton.elt.textContent = "pen mode: leaves";
      rootMode = false;
    } else {
      penModeButton.elt.textContent = "pen mode: root";
      rootMode = true;
    }
    console.log(penModeButton);
  });

  createButton("clear leaves").mousePressed(() => {
    leaves = [];
  });

  createButton("clear trees").mousePressed(() => {
    trees = [];
  });

  cnv.mouseClicked(() => {
    if (rootMode) {
      trees.push(new Tree(mouseX, mouseY));
      console.log(trees[trees.length - 1]);
    }
  });
}

function toggleGrow() {
  grow = !grow;
  growButton.elt.textContent = `grow: ${grow}`;
}

function mouseDragged() {
  if (!rootMode) {
    for (let i = 0; i < 2; i++) {
      let p = randomPoint(mouseX, mouseY, 10);
      leaves.push(new Leaf(p));
    }
  }
}

function randomPoint(x, y, radius) {
  let r = random(radius);
  let a = random(TWO_PI);
  return createVector(cos(a) * r + x, sin(a) * r + y);
}

function randomizeLeaves() {
  for (var i = 0; i < 100; i++) {
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
