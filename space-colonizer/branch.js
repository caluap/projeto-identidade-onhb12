function Branch(parent, pos, dir, level = 0) {
  this.pos = pos;
  this.level = level;
  this.parent = parent;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = 10;

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

  this.show = function(sketch, stroke = null) {
    if (parent != null) {
      if (stroke === null) {
        sketch.strokeWeight(Math.max(6 - Math.cbrt(this.level), 1));
      } else {
        sketch.strokeWeight(stroke);
      }
      sketch.stroke(255);
      sketch.line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
    }
  };

  this.showRoot = function(sketch) {
    sketch.fill(0, 255, 0);
    sketch.ellipse(this.pos.x, this.pos.y, 10, 10);
  };
}
