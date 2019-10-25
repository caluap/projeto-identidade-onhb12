// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Leaf(sketch, p = null) {
  this.pos;
  if (p === null) {
    this.pos = sketch.createVector(
      Math.random() * sketch.width,
      Math.random() * sketch.height
    );
  } else {
    this.pos = sketch.createVector(p.x, p.y);
  }
  this.reached = false;

  this.show = function(sketch) {
    sketch.fill(255);
    sketch.noStroke();
    sketch.ellipse(this.pos.x, this.pos.y, 4, 4);
  };
}
