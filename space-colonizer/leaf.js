// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Leaf(p = null) {
  this.pos = createVector(random(width), random(height));
  if (p === null) {
    this.pos = createVector(random(width), random(height));
  } else {
    this.pos = createVector(p.x, p.y);
  }
  this.reached = false;

  this.show = function() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 4, 4);
  };
}
