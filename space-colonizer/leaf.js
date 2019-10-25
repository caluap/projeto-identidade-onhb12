function Leaf(sketch, p = null) {
  this.pos;
  let marginW = sketch.width * 0.1;
  let marginH = sketch.height * 0.1;
  if (p === null) {
    this.pos = sketch.createVector(
      Math.random() * sketch.width,
      Math.random() * sketch.height
    );
  } else {
    if (
      p.x > -marginW &&
      p.x < sketch.width + marginW &&
      p.y > -marginH &&
      p.y < sketch.height + marginH
    ) {
      this.pos = sketch.createVector(p.x, p.y);
    } else {
      let nX = Math.min(Math.max(p.x, -marginW), sketch.width + marginW);
      let nY = Math.min(Math.max(p.y, -marginH), sketch.height + marginH);
      this.pos = sketch.createVector(nX, nY);
    }
  }
  this.reached = false;

  this.show = function(sketch) {
    sketch.fill(255);
    sketch.noStroke();
    sketch.ellipse(this.pos.x, this.pos.y, 4, 4);
  };
}
