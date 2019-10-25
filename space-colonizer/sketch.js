var trees = [];
var leaves = [];

let r = 2;
let w = 210 * r,
  h = 297 * r;

let growButton, showLeavesButton, penModeButton;

function saveSVG() {
  let svgSketch = new p5(sketch => {
    sketch.setup = () => {
      let cnv = sketch.createCanvas(w, h, sketch.SVG);
    };
    sketch.draw = () => {
      console.log("will draw...");
      sketch.background("#cb0072");
      sketch.stroke(255);
      for (let i = 0; i < trees.length; i++) {
        trees[i].show(sketch);
      }
      sketch.noLoop();
      console.log("will save...");
      sketch.save();
    };
  }, "hidden-canvas-container");
}

let regularSketch = new p5(sketch => {
  let grow = false,
    showLeaves = true,
    rootMode = false;

  toggleGrow = () => {
    grow = !grow;
    growButton.elt.textContent = `grow: ${grow}`;
  };

  sketch.mouseDragged = () => {
    if (!rootMode) {
      for (let i = 0; i < 2; i++) {
        let p = sketch.randomPoint(sketch.mouseX, sketch.mouseY, 10);
        leaves.push(new Leaf(sketch, p));
      }
    }
  };

  sketch.randomPoint = (x, y, radius) => {
    let r = Math.random() * radius;
    let a = Math.random() * sketch.TWO_PI;
    x = sketch.cos(a) * r + x;
    y = sketch.sin(a) * r + y;
    return sketch.createVector(x, y);
  };

  randomizeLeaves = () => {
    for (let i = 0; i < 50; i++) {
      leaves.push(new Leaf(sketch));
    }
  };

  sketch.setup = () => {
    let cnv = sketch.createCanvas(w, h);

    trees.push(new Tree(sketch.width / 2, sketch.height / 2, sketch));

    sketch.createP("");

    growButton = sketch.createButton(`grow: ${grow}`).mousePressed(toggleGrow);

    showLeavesButton = sketch
      .createButton(`leaves: ${showLeaves}`)
      .mousePressed(() => {
        showLeaves = !showLeaves;
        showLeavesButton.elt.textContent = `leaves: ${showLeaves}`;
      });

    sketch.createButton("random leaves").mousePressed(randomizeLeaves);

    penModeButton = sketch.createButton("pen mode: leaves").mousePressed(() => {
      if (rootMode) {
        penModeButton.elt.textContent = "pen mode: leaves";
        rootMode = false;
      } else {
        penModeButton.elt.textContent = "pen mode: root";
        rootMode = true;
      }
    });

    sketch.createP("");

    sketch.createButton("clear leaves").mousePressed(() => {
      leaves = [];
    });

    sketch.createButton("clear trees").mousePressed(() => {
      trees = [];
    });

    sketch.createP("");

    sketch.createButton("save").mousePressed(() => {
      saveSVG();
    });

    cnv.mouseClicked(() => {
      if (rootMode) {
        trees.push(new Tree(sketch.mouseX, sketch.mouseY, sketch));
      }
    });
  };

  sketch.draw = () => {
    sketch.background("#cb0072");

    if (showLeaves) {
      sketch.fill(255);
      sketch.noStroke();
      for (let i = 0; i < leaves.length; i++) {
        leaves[i].show(sketch);
      }
    }
    if (grow && trees.length > 0 && leaves.length > 0) {
      if (!trees[trees.length - 1].grow()) {
        toggleGrow();
      }
    }
    for (let i = 0; i < trees.length; i++) {
      trees[i].show(sketch);
    }
  };
}, "regular-canvas-container");
