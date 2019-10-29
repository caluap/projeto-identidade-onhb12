let r = 4;
let debug = false;
let w = 210 * r,
  h = 297 * r;

function processSentence(currentSentence, rules) {
  let nextSentence = "";
  for (let i = 0; i < currentSentence.length; i++) {
    let currChar = currentSentence.charAt(i);
    let found = false;
    for (let j = 0; j < rules.length; j++) {
      if (currChar == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += currChar;
    }
  }
  return nextSentence;
}

function saveSVG(strokeWeight) {
  let svgSketch = new p5(sketch => {
    sketch.setup = () => {
      let cnv = sketch.createCanvas(w, h, sketch.SVG);
    };
    sketch.draw = () => {
      console.log("will draw...");
      sketch.noLoop();
      console.log("will save...");
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time = today.getHours() + "-" + today.getMinutes();
      let fileName = "l-system-" + date + "--" + time + ".svg";
      sketch.save(fileName);
    };
  }, "hidden-canvas-container");
}

let regularSketch = new p5(sketch => {
  let axiom = "X";
  let sentence = axiom;
  let rules = {};

  sketch.setup = () => {
    let cnv = sketch.createCanvas(w, h);
    rules["barnsley_fern"] = [
      {
        a: "F",
        b: "FF"
      },
      {
        a: "X",
        b: "F+[[X]-X]-F[-FX]+X"
      }
    ];

    this.createInterface();
    sketch.noLoop();
  };

  createInterface = () => {
    let els = [];

    els.push(
      sketch.createButton("run").mousePressed(() => {
        sentence = processSentence(sentence, rules.barnsley_fern);
        if (debug) {
          console.log(`currently, the sentence is \n${sentence}`);
        }
        sketch.redraw();
      })
    );

    let parentEl = document.getElementById("control-panel");
    els.forEach(el => {
      el.parent(parentEl);
    });
  };

  turtle = (currentSentence, len = 5, angle = -0.138 * Math.PI) => {
    sketch.resetMatrix();
    sketch.translate(sketch.width / 2, sketch.height);
    sketch.stroke(255);
    for (let i = 0; i < currentSentence.length; i++) {
      let currChar = currentSentence.charAt(i);
      switch (currChar) {
        case "F":
          sketch.line(0, 0, 0, -len);
          sketch.translate(0, -len);
          break;
        case "+":
          sketch.rotate(angle);
          break;
        case "-":
          sketch.rotate(-angle);
          break;
        case "[":
          sketch.push();
          break;
        case "]":
          sketch.pop();
          break;
      }
    }
  };

  sketch.draw = () => {
    sketch.background(51);
    turtle(sentence);
  };
}, "regular-canvas-container");
