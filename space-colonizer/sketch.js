var trees = [];
var leaves = [];

let min_dist = 5,
  max_dist = 100;

let r = 4;
let w = 210 * r,
  h = 297 * r;

let growButton, showLeavesButton, penModeButton;

function saveSVG(strokeWeight) {
  let svgSketch = new p5(sketch => {
    sketch.setup = () => {
      let cnv = sketch.createCanvas(w, h, sketch.SVG);
    };
    sketch.draw = () => {
      console.log("will draw...");
      sketch.background("#cb0072");
      sketch.stroke(255);
      for (let i = 0; i < trees.length; i++) {
        trees[i].show(sketch, strokeWeight);
      }
      sketch.noLoop();
      console.log("will save...");
      sketch.save();
    };
  }, "hidden-canvas-container");
}

let regularSketch = new p5(sketch => {
  let sliderRadius, sliderDensity, sliderStroke, sliderMinDist;

  let grow = false,
    showLeaves = true,
    rootMode = false;

  toggleGrow = () => {
    grow = !grow;
    growButton.elt.textContent = `grow: ${grow}`;
  };

  sketch.mouseDragged = () => {
    if (!rootMode) {
      for (let i = 0; i < sliderDensity.value(); i++) {
        let p = sketch.randomPoint(
          sketch.mouseX,
          sketch.mouseY,
          sliderRadius.value()
        );
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

    let els = [];

    growButton = sketch.createButton(`grow: ${grow}`).mousePressed(toggleGrow);
    els.push(growButton);

    showLeavesButton = sketch
      .createButton(`leaves: ${showLeaves}`)
      .mousePressed(() => {
        showLeaves = !showLeaves;
        showLeavesButton.elt.textContent = `leaves: ${showLeaves}`;
      });

    els.push(showLeavesButton);

    els.push(
      sketch.createButton("random leaves").mousePressed(randomizeLeaves)
    );

    penModeButton = sketch.createButton("pen mode: leaves").mousePressed(() => {
      if (rootMode) {
        penModeButton.elt.textContent = "pen mode: leaves";
        rootMode = false;
      } else {
        penModeButton.elt.textContent = "pen mode: root";
        rootMode = true;
      }
    });

    els.push(penModeButton);

    els.push(sketch.createP(""));

    sliderRadius = sketch.createSlider(5, 200, 20, 1);
    els.push(sketch.createP("radius"));
    els.push(sliderRadius);

    els.push(sketch.createP("density"));
    sliderDensity = sketch.createSlider(1, 40, 2, 1);
    els.push(sliderDensity);

    els.push(sketch.createP("stroke"));
    sliderStroke = sketch.createSlider(1, 6, 3, 0.5);
    els.push(sliderStroke);

    els.push(sketch.createP("min dist"));

    sliderMinDist = sketch.createSlider(2, 10, 5, 1).input(() => {
      min_dist = parseInt(sliderMinDist.value());
    });

    els.push(sliderMinDist);

    els.push(sketch.createP(""));

    els.push(
      sketch.createButton("clear leaves").mousePressed(() => {
        leaves = [];
      })
    );

    els.push(
      sketch.createButton("clear trees").mousePressed(() => {
        let r = confirm("sure?");
        if (r) {
          trees = [];
        }
      })
    );

    els.push(sketch.createP(""));

    els.push(
      sketch.createButton("save").mousePressed(() => {
        saveSVG(parseInt(sliderStroke.value()));
      })
    );

    cnv.mouseClicked(() => {
      if (rootMode) {
        trees.push(new Tree(sketch.mouseX, sketch.mouseY, sketch));
      }
    });

    let parentEl = document.getElementById("control-panel");

    els.forEach(el => {
      el.parent(parentEl);
    });
  };

  sketch.draw = () => {
    if (rootMode) {
      sketch.background("#009900");
    } else {
      sketch.background("#cb0072");
    }

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
    } else if (trees.length > 0) {
      trees[trees.length - 1].showRoot(sketch);
    }
    for (let i = 0; i < trees.length; i++) {
      trees[i].show(sketch, parseInt(sliderStroke.value()));
    }
  };
}, "regular-canvas-container");
