let debug = true;

let bg = 0;

let nTrees = 66;
let lSystem = [];
let sentences = [];

let trees = [];

let coords = [];

let xOff = 0.05,
  yOff = 0.2;

let r = 4;
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

function selectTrees() {
  for (let i = 0; i < nTrees; i++) {
    trees.push(Math.round(Math.random() * (lSystem.length - 1)));
  }
}

function createCoordinates(sketch) {
  // random positions
  for (let i = 0; i < nTrees; i++) {
    let x = Math.random() * sketch.width * (1 + xOff * 2) - xOff * sketch.width;

    // i don't use a simple random to increase the chance of trees on lower y values
    let y =
      Math.random() * Math.random() * Math.random() * sketch.height +
      yOff * sketch.height;
    coords.push({ x: x, y: y });
  }

  coords.sort((a, b) => {
    return a.y - b.y;
  });
}

function genericDraw(sketch, resMult = 1) {
  sketch.background(bg);
  sketch.noStroke();
  sketch.fill("#cb0072");
  sketch.rect(0, 0, sketch.width, yOff * sketch.height);
  sketch.noFill();

  // this will make the veil appear around 66 times (or nTrees, if lower than 100)
  let div = Math.min(1, Math.round(nTrees / 66));

  let firstY = coords[0].y;
  let lastY = coords[coords.length - 1].y;

  for (let i = 0; i < nTrees; i++) {
    if (i % 10 == 0 && debug) {
      console.log(`tree nº${i}`);
    }

    sketch.translate(coords[i].x * resMult, coords[i].y * resMult);

    // chooses tree
    let tree = trees[i];

    // some perspective
    let pY = (coords[i].y - firstY) / (lastY - firstY);
    let scaling = resMult * (3 / 5) * (pY + 0.1);

    let mixedOriginColor = sketch.lerpColor(
      sketch.color("#a1005a"),
      sketch.color(bg),
      0.5
    );

    turtle(
      sketch,
      sentences[tree],
      lSystem[tree],
      scaling,
      sketch.lerpColor(mixedOriginColor, sketch.color("#cb0072"), pY)
    );

    sketch.resetMatrix();

    if (i % div == 0) {
      sketch.noStroke();
      sketch.fill(bg, 13);
      // sketch.fill(203, 0, 114, 1);
      sketch.rect(0, 0, sketch.width, sketch.height);
      sketch.noFill();
    }
  }
  if (debug) {
    console.log(coords);
  }
}

function turtle(
  sketch,
  currentSentence,
  lSystem,
  scaling = 1 / 2,
  tint = null
) {
  let dir = Math.random() > 0.5 ? -1 : 1;
  let baseLen = 9;
  let len = jit(baseLen * lSystem.lenMult * scaling);
  let strokes, colors;
  let level = 0;

  if (!lSystem.strokes) {
    strokes = [4, 2, 1, 1, 0.5];
  } else {
    strokes = lSystem.strokes;
  }
  if (!lSystem.colors) {
    colors = ["#fff"];
  } else {
    colors = lSystem.colors;
  }

  let mult = 7;
  for (let j = 0; j < 2; j++) {
    sketch.push();
    for (let i = 0; i < currentSentence.length; i++) {
      let currChar = currentSentence.charAt(i);

      switch (currChar) {
        case "F":
          if (level >= strokes.length) {
            sketch.strokeWeight(mult * scaling * strokes[strokes.length - 1]);
          } else {
            sketch.strokeWeight(mult * scaling * strokes[level]);
          }

          let c;
          if (j == 0) {
            c = sketch.color(bg, 12);
          } else {
            if (level >= colors.length) {
              c = sketch.color(colors[colors.length - 1]);
            } else {
              c = sketch.color(colors[level]);
            }
            if (tint) {
              c = sketch.lerpColor(c, tint, 0.8);
            }
          }

          sketch.stroke(c);

          let randLen = len;

          sketch.line(0, 0, 0, -randLen);
          sketch.translate(0, -randLen);
          break;
        case "+":
          sketch.rotate(dir * lSystem.angle);
          break;
        case "-":
          sketch.rotate(-dir * lSystem.angle);
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
    sketch.pop();
    mult = 1;
  }
}

function savePNG() {
  let pngSketch = new p5(sketch => {
    let resMult = Math.round(300 / 72);
    sketch.setup = () => {
      let cnv = sketch.createCanvas(w * resMult, h * resMult);
    };
    sketch.draw = () => {
      console.log("will draw...");
      genericDraw(sketch, resMult);

      sketch.noLoop();
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time = today.getHours() + "-" + today.getMinutes();
      let fileName = "l-system-" + date + "--" + time + ".png";
      console.log(`will save... ${fileName}`);
      sketch.save(fileName);
    };
  }, "hidden-canvas-container");
}

let regularSketch = new p5(sketch => {
  sketch.setup = () => {
    let cnv = sketch.createCanvas(w, h);
    sketch.noLoop();

    lSystem.push({
      angle: Math.PI / 7,
      lenMult: 0.6,
      iterations: 4,
      strokes: [3, 2, 1, 1.5],
      colors: null,
      axiom: "F",
      rules: [{ a: "F", b: "F[+F]F[-F]F" }]
    });
    lSystem.push({
      angle: sketch.radians(25),
      lenMult: 0.8,
      iterations: 5,
      strokes: [3, 2, 1],
      colors: null,
      axiom: "X",
      rules: [
        { a: "F", b: "FF" },
        { a: "X", b: "F+[-F-XF-X][+FF][--XF[+X]][++F-X]" }
      ]
    });
    lSystem.push({
      angle: sketch.radians(25),
      lenMult: 0.4,
      iterations: 6,
      strokes: [3, 2, 1, 1, 0.5],
      colors: null,
      axiom: "X",
      rules: [
        { a: "F", b: "FF" },
        { a: "X", b: "F+[-F-XF-X][+F--F][--XF[+X]][++F-X]" }
      ]
    });
    lSystem.push({
      angle: Math.PI / 9,
      lenMult: 0.2,
      iterations: 7,
      strokes: [2, 1],
      colors: null,
      axiom: "X",
      rules: [{ a: "F", b: "FF" }, { a: "X", b: "F[+X]F[-X]+X" }]
    });
    lSystem.push({
      angle: sketch.radians(20),
      lenMult: 1.2,
      iterations: 4,
      strokes: [3, 2, 2, 1],
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
    selectTrees();
    createCoordinates(sketch);
  };

  createInterface = () => {
    let els = [];

    els.push(
      sketch.createButton("rerun").mouseClicked(() => {
        sketch.redraw();
      })
    );

    els.push(
      sketch.createButton("save").mouseClicked(() => {
        savePNG();
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

  jit = (v, original = 0.6, rand = 0.4) => {
    return v * (Math.random() * rand + original);
  };

  sketch.draw = () => {
    genericDraw(sketch);
  };
}, "regular-canvas-container");
