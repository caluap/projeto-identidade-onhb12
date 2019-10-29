let r = 2;
let debug = true;
let w = 210 * r,
  h = 297 * r;

function processSentence(currentSentence, rules, axiom = "X") {
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
  let sentences = [];
  let lSystem = [];
  let ruleI = 0;

  sketch.setup = () => {
    let cnv = sketch.createCanvas(w, h);
    sketch.noLoop();

    lSystem.push({
      angle: Math.PI / 7,
      lenMult: 0.6,
      iterations: 4,
      strokes: [2, 1, 1, 2],
      colors: null,
      axiom: "F",
      rules: [{ a: "F", b: "F[+F]F[-F]F" }]
    });
    lSystem.push({
      angle: sketch.radians(25),
      lenMult: 0.8,
      iterations: 5,
      strokes: [9, 6, 3, 1, 0.5],
      colors: ["#555", "#666", "#bbb", "#fff"],
      axiom: "X",
      rules: [
        { a: "F", b: "FF" },
        { a: "X", b: "F+[-F-XF-X][+FF][--XF[+X]][++F-X]" }
      ]
    });
    lSystem.push({
      angle: Math.PI / 9,
      lenMult: 0.2,
      iterations: 7,
      strokes: [5, 1],
      colors: null,
      axiom: "X",
      rules: [{ a: "F", b: "FF" }, { a: "X", b: "F[+X]F[-X]+X" }]
    });
    lSystem.push({
      angle: sketch.radians(20),
      lenMult: 1.2,
      iterations: 4,
      strokes: [5, 2, 2, 1],
      colors: null,
      axiom: "X",
      rules: [
        { a: "F", b: "FX[FX[+XF]]" },
        { a: "X", b: "FF[+XZ++X-F[+ZX]][-X++F-X]" },
        { a: "Z", b: "[+F-X-F][++ZX]" }
      ]
    });

    createInterface();
    createSentences();
  };

  createInterface = () => {
    let els = [];

    els.push(
      sketch.createButton("run").mouseClicked(() => {
        if (ruleI == lSystem.length - 1) {
          ruleI = 0;
        } else {
          ruleI++;
        }
        if (debug) {
          console.log(`will draw l-system: ${ruleI}`);
        }
        sketch.redraw();
      })
    );

    let parentEl = document.getElementById("control-panel");
    els.forEach(el => {
      el.parent(parentEl);
    });
  };

  createSentences = () => {
    for (let i = 0; i < lSystem.length; i++) {
      sentences.push(lSystem[i].axiom);
      for (let j = 0; j < lSystem[i].iterations; j++) {
        sentences[i] = processSentence(sentences[i], lSystem[i].rules);
      }
    }
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

  turtle = (
    currentSentence,
    lenMult = 1,
    angle = Math.PI / 7,
    strokes = null,
    colors = null
  ) => {
    let basisLen = 9;
    let len = basisLen * lenMult;

    let level = 0;
    if (!strokes) {
      strokes = [4, 2, 1, 1, 0.5];
    }
    if (!colors) {
      colors = ["#555", "#999", "#ddd", "#eee"];
    }

    sketch.resetMatrix();
    sketch.translate(sketch.width / 2, sketch.height);
    for (let i = 0; i < currentSentence.length; i++) {
      let currChar = currentSentence.charAt(i);

      switch (currChar) {
        case "F":
          if (level >= strokes.length) {
            sketch.strokeWeight(strokes[strokes.length - 1]);
          } else {
            sketch.strokeWeight(strokes[level]);
          }
          if (level >= colors.length) {
            sketch.stroke(colors[colors.length - 1]);
          } else {
            sketch.stroke(colors[level]);
          }
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
    turtle(
      sentences[ruleI],
      lSystem[ruleI].lenMult,
      lSystem[ruleI].angle,
      lSystem[ruleI].strokes,
      lSystem[ruleI].colors
    );
  };
}, "regular-canvas-container");
