// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Branch(parent, pos, dir, level = 0) {
  this.pos = pos;
  this.level = level;
  this.parent = parent;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = 2;

  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  };

  this.next = function() {
    var nextDir = p5.Vector.mult(this.dir, this.len);
    var nextPos = p5.Vector.add(this.pos, nextDir);
    var newLevel = this.level + 0.2;
    var nextBranch = new Branch(this, nextPos, this.dir.copy(), newLevel);
    return nextBranch;
  };

  this.show = function() {
    if (parent != null) {
      // strokeWeight(Math.max(6 - Math.cbrt(this.level), 1));
      stroke(0);
      line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
    }
  };
}
