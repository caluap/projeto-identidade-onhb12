let axiom = "AC";
let sentence = axiom;

let rules = [];
rules.push({
  a: "A",
  b: "AB"
});

rules.push({
  a: "B",
  b: "A"
});

let r = 4;
let w = 210 * r,
  h = 297 * r;

function processSentence(currentSentence, rules) {
  let nextSentence = "";
  for (let i = 0; i < currentSentence.length; i++) {
    let currentChar = currentSentence.charAt(i);
    let found = false;
    for (let j = 0; j < rules.length; j++) {
      if (currentChar == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += currentChar;
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
  createInterface = () => {
    let els = [];

    els.push(sketch.createP(sentence));
    els.push(
      sketch.createButton("generate").mousePressed(() => {
        sentence = processSentence(sentence, rules);
        sketch.createP(sentence);
      })
    );

    let parentEl = document.getElementById("control-panel");
    els.forEach(el => {
      el.parent(parentEl);
    });
  };

  sketch.setup = () => {
    // let cnv = sketch.createCanvas(w, h);
    sketch.noCanvas();
    this.createInterface();
  };

  sketch.draw = () => {};
}, "regular-canvas-container");
