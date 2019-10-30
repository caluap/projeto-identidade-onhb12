let r = 4;
let nTrees = 400;
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
      strokes: [9, 6, 3, 1, 1],
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
      strokes: [9, 6, 3, 1, 1, 0.5],
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

  jit = (v, original = 0.6, rand = 0.4) => {
    return v * (Math.random() * rand + original);
  };

  turtle = (currentSentence, lSystem, scaling = 1 / 2, tint = null) => {
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

    for (let i = 0; i < currentSentence.length; i++) {
      let currChar = currentSentence.charAt(i);

      switch (currChar) {
        case "F":
          if (level >= strokes.length) {
            sketch.strokeWeight(scaling * strokes[strokes.length - 1]);
          } else {
            sketch.strokeWeight(scaling * strokes[level]);
          }

          let c;
          if (level >= colors.length) {
            c = sketch.color(colors[colors.length - 1]);
          } else {
            c = sketch.color(colors[level]);
          }
          if (tint) {
            c = sketch.lerpColor(c, tint, 0.8);
          }
          sketch.stroke(c);

          let randLen = jit(len);

          sketch.line(0, 0, 0, -randLen);
          sketch.translate(0, -randLen);
          break;
        case "+":
          sketch.rotate(dir * jit(lSystem.angle));
          break;
        case "-":
          sketch.rotate(-dir * jit(lSystem.angle));
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
    let off = 0.05;
    let yOff = sketch.height * 0.2;

    // random positions
    let coords = [];
    for (let i = 0; i < nTrees; i++) {
      let x = Math.random() * sketch.width * (1 + off * 2) - off * sketch.width;

      // i don't use a simple random to increase the chance of trees on lower y values
      let y = Math.random() * Math.random() * sketch.height + yOff;
      coords.push({ x: x, y: y });
    }

    coords.sort((a, b) => {
      return a.y - b.y;
    });

    sketch.background(0);
    sketch.noStroke();
    sketch.fill("#cb0072");
    sketch.rect(0, 0, sketch.width, yOff);
    sketch.noFill();

    for (let i = 0; i < nTrees; i++) {
      if (i % 10 == 0 && debug) {
        console.log(`tree nº${i}`);
      }

      sketch.translate(coords[i].x, coords[i].y);

      // chooses tree
      let tree = Math.round(Math.random() * (lSystem.length - 1));

      // some perspective
      let pY = (coords[i].y - yOff) / sketch.height;
      let scaling = (3 / 5) * (pY + 0.1);

      turtle(
        sentences[tree],
        lSystem[tree],
        scaling,
        sketch.lerpColor(sketch.color("#a1005a"), sketch.color("#cb0072"), pY)
      );

      sketch.resetMatrix();

      if (i % 13 == 0) {
        sketch.noStroke();
        sketch.fill(0, 13);
        // sketch.fill(203, 0, 114, 1);
        sketch.rect(0, 0, sketch.width, sketch.height);
        sketch.noFill();
      }
    }
    console.log(coords);
  };
}, "regular-canvas-container");
