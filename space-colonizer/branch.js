function Branch(parent, pos, dir, level = 0) {
  this.pos = pos;
  this.level = level;
  this.parent = parent;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = 10;

  this.isLastChild = true;

  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  };

  this.next = function() {
    var nextDir = p5.Vector.mult(this.dir, this.len);
    var nextPos = p5.Vector.add(this.pos, nextDir);
    var newLevel = this.level + 0.2;
    var nextBranch = new Branch(this, nextPos, this.dir.copy(), newLevel);
    this.isLastChild = false;
    return nextBranch;
  };

  this.show = function(sketch, stroke = null) {
    if (parent != null) {
      if (stroke === null) {
        sketch.strokeWeight(Math.max(6 - Math.cbrt(this.level), 1));
      } else {
        sketch.strokeWeight(stroke);
      }

      if (this.isLastChild) {
        // draws leaft;
        let leafSize = 5;

        let end = p5.Vector.mult(this.dir, leafSize);
        end.add(this.pos);

        // 27 degrees
        // .559 * leafSize

        let mid1 = dir.copy();
        mid1.rotate(-sketch.TWO_PI / 4);
        mid1.setMag(0.559 * leafSize);
        mid1.add(this.pos);

        let mid2 = dir.copy();
        mid2.rotate(sketch.TWO_PI / 4);
        mid2.setMag(0.559 * leafSize);
        mid2.add(this.pos);

        sketch.fill(255);

        sketch.beginShape();
        sketch.vertex(this.parent.pos.x, this.parent.pos.y);
        sketch.vertex(mid1.x, mid1.y);
        sketch.vertex(end.x, end.y);
        sketch.vertex(mid2.x, mid2.y);
        sketch.vertex(this.parent.pos.x, this.parent.pos.y);
        sketch.endShape();
      } else {
        sketch.stroke(255);
        sketch.line(
          this.pos.x,
          this.pos.y,
          this.parent.pos.x,
          this.parent.pos.y
        );
      }
    }
  };

  this.showRoot = function(sketch) {
    sketch.fill(0, 255, 0);
    sketch.ellipse(this.pos.x, this.pos.y, 10, 10);
  };
}
