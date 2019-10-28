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

    // only creates new branch if its far enough from current
    let dist = p5.Vector.dist(nextPos, this.pos);
    if (dist >= this.len / 4) {
      var newLevel = this.level + 1;
      var nextBranch = new Branch(this, nextPos, this.dir.copy(), newLevel);
      this.isLastChild = false;
      return nextBranch;
    } else {
      return null;
    }
  };

  this.drawLeaf = function(sketch) {
    // draws leaft;
    let leafSize = 4;

    let end = p5.Vector.mult(this.dir, leafSize);
    end.add(this.pos);

    // 27 degrees
    // .559 * leafSize

    let mid1 = dir.copy();
    mid1.rotate(-sketch.TWO_PI / 4);
    mid1.setMag(0.559 * leafSize);
    mid1.add(this.pos);

    let cp1_1 = dir.copy();
    cp1_1.rotate(-sketch.TWO_PI / 4);
    cp1_1.setMag(0.25 * leafSize);
    cp1_1.add(this.parent.pos);
    cp1_1.lerp(mid1, 0.448);

    let cp1_2 = dir.copy();
    cp1_2.rotate(-sketch.TWO_PI / 4);
    cp1_2.setMag(0.25 * leafSize);
    cp1_2.add(end);
    cp1_2.lerp(mid1, 0.448);

    let mid2 = dir.copy();
    mid2.rotate(sketch.TWO_PI / 4);
    mid2.setMag(0.559 * leafSize);
    mid2.add(this.pos);

    let cp2_1 = dir.copy();
    cp2_1.rotate(sketch.TWO_PI / 4);
    cp2_1.setMag(0.25 * leafSize);
    cp2_1.add(this.parent.pos);
    cp2_1.lerp(mid2, 0.448);

    let cp2_2 = dir.copy();
    cp2_2.rotate(sketch.TWO_PI / 4);
    cp2_2.setMag(0.25 * leafSize);
    cp2_2.add(end);
    cp2_2.lerp(mid2, 0.448);

    sketch.beginShape();
    sketch.curveVertex(this.parent.pos.x, this.parent.pos.y);
    sketch.curveVertex(this.parent.pos.x, this.parent.pos.y);
    sketch.curveVertex(cp1_1.x, cp1_1.y);
    sketch.curveVertex(mid1.x, mid1.y);
    sketch.curveVertex(cp1_2.x, cp1_2.y);
    sketch.curveVertex(end.x, end.y);
    sketch.curveVertex(cp2_2.x, cp2_2.y);
    sketch.curveVertex(mid2.x, mid2.y);
    sketch.curveVertex(cp2_1.x, cp2_1.y);
    sketch.curveVertex(this.parent.pos.x, this.parent.pos.y);
    sketch.curveVertex(this.parent.pos.x, this.parent.pos.y);
    sketch.endShape();
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

      if (this.isLastChild) {
        sketch.fill(255);
        sketch.stroke(255);
        if (i % rateOfFlowering == 0) {
          this.drawFlower(sketch);
        } else {
          this.drawLeaf(sketch);
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
