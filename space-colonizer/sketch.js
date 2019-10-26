var trees = [];
var leaves = [];

let min_dist = 5,
  max_dist = 100;

let pickedColor = null;

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
  let sliderRadius, sliderDensity, sliderStroke, sliderMinDist, sliderMaxDist;

  let grow = false,
    showLeaves = true,
    rootMode = false;

  let uploadedImage = null;

  handleUpload = file => {
    if (file.type === "image") {
      uploadedImage = sketch.loadImage(file.data, () => {
        console.log("Uploaded image loaded successfully!");
      });
    }
  };

  sketch.keyPressed = () => {
    if (sketch.keyCode == 67 && uploadedImage) {
      sketch.loadPixels();
      let d = sketch.pixelDensity();
      let off = getOff(sketch.mouseX, sketch.mouseY, d);
      let c = [
        sketch.pixels[off + 0],
        sketch.pixels[off + 1],
        sketch.pixels[off + 2]
      ];
      document.getElementById("picked-color").style.backgroundColor = `rgb(${
        c[0]
      }, ${c[1]}, ${c[2]})`;
      pickedColor = c;
      sketch.updatePixels();
    }
  };

  toggleGrow = () => {
    grow = !grow;
    growButton.elt.textContent = `grow: ${grow}`;
  };

  addLeaves = (x, y, n, r) => {
    for (let i = 0; i < n; i++) {
      let p = sketch.randomPoint(x, y, r);
      leaves.push(new Leaf(sketch, p));
    }
  };

  sketch.mouseDragged = () => {
    if (!rootMode) {
      addLeaves(
        sketch.mouseX,
        sketch.mouseY,
        sliderDensity.value(),
        sliderRadius.value()
      );
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

  getOff = (x, y, d) => {
    return (y * d * sketch.width + x) * d * 4;
  };

  processImg = () => {
    console.log("started processing image");
    sketch.loadPixels();

    let x = 0,
      y = 0;

    let density = sketch.pixelDensity();
    let dx = 0,
      dy = 0;

    for (let off = 0; off < sketch.pixels.length; off += 4) {
      let r = sketch.pixels[off + 0],
        g = sketch.pixels[off + 1],
        b = sketch.pixels[off + 2];
      let labA = rgb2lab([r, g, b]);
      let labB = rgb2lab([pickedColor[0], pickedColor[1], pickedColor[2]]);

      // http://zschuessler.github.io/DeltaE/learn/
      let diff = deltaE(labA, labB);
      if (diff < 15) {
        if (Math.random() < 1 / 200 / density) {
          leaves.push(new Leaf(sketch, sketch.createVector(x, y)));
          sketch.pixels[off + 0] = 0;
          sketch.pixels[off + 1] = 255;
          sketch.pixels[off + 2] = 0;
        }
      }

      // density 2 means that each 4 pixels here are equal to
      // one pixel when i create vectors, so below i account
      // for that.
      dx++;
      if (dx >= density) {
        dx = 0;
        x++;
        if (x >= sketch.width) {
          x = 0;
          dy++;
          if (dy >= density) {
            dy = 0;
            y++;
          }
        }
      }
    }

    console.log("ended processing image");
    sketch.updatePixels();
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

    els.push(sketch.createP("max dist"));

    sliderMaxDist = sketch.createSlider(10, 200, 70, 1).input(() => {
      max_dist = parseInt(sliderMaxDist.value());
    });

    els.push(sliderMaxDist);

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

    els.push(sketch.createFileInput(handleUpload));

    els.push(sketch.createP(""));

    els.push(
      sketch.createButton("process img").mousePressed(() => {
        if (uploadedImage && pickedColor) {
          processImg();
        }
      })
    );

    els.push(sketch.createP(""));

    els.push(
      sketch.createButton("remove image").mousePressed(() => {
        if (uploadedImage) {
          uploadedImage = null;
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

    if (uploadedImage) {
      sketch.image(uploadedImage, 0, 0, sketch.width, sketch.height);
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
