let r = 2;
let debug = false;
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
  let ruleI = 3;

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

  gradientLine = (len, c1, c2) => {
    sketch.stroke(c1);
    for (let i = 0; i < len; i += 0.1) {
      sketch.stroke(
        sketch.lerpColor(sketch.color(c1), sketch.color(c2), i / len)
      );
      sketch.point(0, -i);
    }
  };

  turtle = (currentSentence, lenMult = 1, angle = 0.138 * Math.PI) => {
    let basisLen = 9;
    let len = basisLen * lenMult;

    let level = 0;
    let strokes = [5, 1, 0.5];
    let colors = [
      sketch.color(0, 0, 0),
      sketch.color(50, 50, 50),
      sketch.color(0, 255, 128),
      sketch.color(0, 255, 0)
    ];

    sketch.resetMatrix();
    sketch.translate(sketch.width / 2, sketch.height);
    for (let i = 0; i < currentSentence.length; i++) {
      let currChar = currentSentence.charAt(i);

      switch (currChar) {
        case "F":
          // sketch.line(0, 0, 0, -len);
          let c1 = Math.min(Math.max(level - 1, 0), colors.length - 1);
          c2 = Math.min(level, colors.length - 1);
          if (level >= strokes.length) {
            sketch.strokeWeight(strokes[strokes.length - 1]);
          } else {
            sketch.strokeWeight(strokes[level]);
          }
          gradientLine(len, colors[c1], colors[c2]);
          sketch.translate(0, -len);
          break;
        case "+":
          sketch.rotate(-angle);
          break;
        case "-":
          sketch.rotate(+angle);
          break;
        case "[":
          level++;
          sketch.push();
          break;
        case "]":
          level--;
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
