let r = 2;
let debug = true;
let w = 210 * r,
  h = 297 * r;

function processSentence(currentSentence, rules, axiom) {
  if (currentSentence == "") {
    currentSentence = axiom;
  }
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
  let sentence = "";
  let lSystem = [];
  let ruleI = 0;

  sketch.setup = () => {
    let cnv = sketch.createCanvas(w, h);
    lSystem.push({
      angle: Math.PI / 7,
      lenMult: 1,
      axiom: "F",
      rules: [{ a: "F", b: "F[+F]F[-F]F" }]
    });
    lSystem.push({
      angle: sketch.radians(25),
      lenMult: 1,
      axiom: "X",
      rules: [
        { a: "F", b: "FF" },
        { a: "X", b: "F+[-F-XF-X][+FF][--XF[+X]][++F-X]" }
      ]
    });
    lSystem.push({
      angle: Math.PI / 9,
      lenMult: 1,
      axiom: "X",
      rules: [{ a: "F", b: "FF" }, { a: "X", b: "F[+X]F[-X]+X" }]
    });
    lSystem.push({
      angle: sketch.radians(20),
      lenMult: 1,
      axiom: "X",
      rules: [
        { a: "F", b: "FX[FX[+XF]]" },
        { a: "X", b: "FF[+XZ++X-F[+ZX]][-X++F-X]" },
        { a: "Z", b: "[+F-X-F][++ZX]" }
      ]
    });

    this.createInterface();
    sketch.noLoop();
  };

  createInterface = () => {
    let els = [];

    els.push(
      sketch.createButton("run").mousePressed(() => {
        sentence = processSentence(
          sentence,
          lSystem[ruleI].rules,
          lSystem[ruleI].axiom
        );
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

  turtle = (currentSentence, lenMult = 1, angle = 0.138 * Math.PI) => {
    let basisLen = 10;

    let len = basisLen * lenMult;

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
          sketch.rotate(-angle);
          break;
        case "-":
          sketch.rotate(+angle);
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
    turtle(sentence, lSystem[ruleI].lenMult, lSystem[ruleI].angle);
  };
}, "regular-canvas-container");
