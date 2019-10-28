function Branch(parent, pos, dir, level = 0) {
  this.pos = pos;
  this.level = level;
  this.parent = parent;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = 10;

  this.howManyLeaves =
    1 + Math.round(2 * Math.random() * Math.random() * Math.random());

  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  };

  this.next = function() {
    var nextDir = p5.Vector.mult(this.dir, this.len);
    var nextPos = p5.Vector.add(this.pos, nextDir);

    // only creates new branch if its far enough from current
    let dist = p5.Vector.dist(nextPos, this.pos);
    if (dist >= this.len / 4 || this.parent == null) {
      var newLevel = this.level + 1;
      var nextBranch = new Branch(this, nextPos, this.dir.copy(), newLevel);
      this.howManyLeaves = 0;
      return nextBranch;
    } else {
      return null;
    }
  };

  this.drawLeaf = function(sketch, n = 1, lfW = 4, lfH = 8) {
    if (n > 0) {
      lfW = 2 + 2 / n;
      sketch.push();
      sketch.translate(this.parent.pos.x, this.parent.pos.y);

      let vectAngle;
      if (this.parent != null) {
        vectAngle = this.parent.dir.heading();
      } else {
        vectAngle = this.dir.heading();
      }
      sketch.rotate(vectAngle + sketch.PI / 2);

      for (let i = 0; i < n; i++) {
        if (n > 1 && i == 0) {
          sketch.rotate(-sketch.TWO_PI / 4);
        }
        this.drawLeaf(sketch, 0, lfW);
        sketch.rotate(sketch.TWO_PI / 4);
      }

      sketch.pop();
    } else {
      sketch.beginShape();

      sketch.curveVertex(0, 0);
      sketch.curveVertex(0, 0);
      sketch.curveVertex(-0.25 * lfW, -0.25 * lfH);
      sketch.curveVertex(-0.25 * lfW, -0.75 * lfH);
      sketch.curveVertex(0 * lfW, -1 * lfH);
      sketch.curveVertex(0.25 * lfW, -0.75 * lfH);
      sketch.curveVertex(0.25 * lfW, -0.25 * lfH);
      sketch.curveVertex(0, 0);
      sketch.curveVertex(0, 0);

      sketch.endShape();
    }
  };

  this.drawFlower = function(sketch) {
    let flowerRad = 2;
    let petalRad = 5;
    let nPetals = 5;

    sketch.push();
    sketch.translate(this.pos.x, this.pos.y);
    sketch.rotate((2 * sketch.PI) / nPetals);
    for (let i = 0; i < nPetals; i++) {
      sketch.ellipse(0, flowerRad / 2 + petalRad / 2, petalRad / 3, petalRad);
      sketch.rotate((2 * sketch.PI) / nPetals);
    }
    sketch.pop();

    sketch.line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
    sketch.ellipse(this.pos.x, this.pos.y, flowerRad, flowerRad);
  };

  this.show = function(sketch, stroke = null, thinningStroke = false, i = 0) {
    let rateOfFlowering = 131;
    if (parent != null) {
      if (stroke === null) {
        sketch.strokeWeight(Math.max(3 - Math.cbrt(this.level), 1));
      } else {
        let s = stroke;
        if (thinningStroke) {
          s = Math.max(stroke - Math.pow(this.level, 1 / 4), 1);
        }
        sketch.strokeWeight(s);
      }

      if (this.howManyLeaves > 0) {
        sketch.fill(255);
        sketch.stroke(255);
        if (i % rateOfFlowering == 0) {
          this.drawFlower(sketch);
        } else {
          this.drawLeaf(sketch, this.howManyLeaves);
        }
        sketch.noFill();
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
