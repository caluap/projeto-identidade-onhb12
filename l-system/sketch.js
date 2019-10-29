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
  let axiom = "F";
  let sentence = axiom;
  let rules = [];

  sketch.setup = () => {
    let cnv = sketch.createCanvas(w, h);
    rules.push({
      a: "F",
      b: "FF+[+F-F-F]-[-F+F+F]"
    });

    this.createInterface();
  };

  createInterface = () => {
    let els = [];

    els.push(
      sketch.createButton("run").mousePressed(() => {
        sentence = processSentence(sentence, rules);
        if (debug) {
          console.log(`currently, the sentence is \n${sentence}`);
        }
      })
    );

    let parentEl = document.getElementById("control-panel");
    els.forEach(el => {
      el.parent(parentEl);
    });
  };

  turtle = (currentSentence, len = 100) => {
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
          sketch.rotate(sketch.PI / 6);
          break;
        case "-":
          sketch.rotate(-sketch.PI / 6);
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
