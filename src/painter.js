import { OFFSET, LINE_ITV, IMG_ITV, MAX_TAN, MIN_ANG, MAX_ANG } from './constants';
import { randIn, fractionIn, fracSqToCenter } from './util';
import images from './images';
import Color, { getColor, imageLoaded } from './color';

const lines = [];
// { x, y }: coordinates on canvas

let canvasW = 800;
let strokeWeights = [7, 5, 3, 2];
let maxL = 15;
let minL = 5;
let nLines = 51;

const setCanvasSize = () => {
  const screenSize = Math.min(window.innerWidth, window.innerHeight);
  canvasW = Math.round(screenSize * (screenSize < 500 ? 1.1 : .975));
  maxL = Math.round(15 / 800 * canvasW);
  minL = Math.round(maxL / 3);
  nLines = Math.round(51 / 800 * canvasW * randIn(.75, 1.25));

  if (canvasW < 640) {
    strokeWeights = [5, 3, 2, 1];
  }
  if (canvasW > 1000) {
    strokeWeights = [10, 6, 3, 2];
  }
  if (canvasW > 1300) {
    strokeWeights = [13, 7, 5, 3];
  }
};

window.setup = () => {
  setCanvasSize();
  const canvas = createCanvas(canvasW + OFFSET * 2, canvasW + OFFSET * 2);
  canvas.parent('o');
  colorMode(HSB);
  background(0, 0, 0);

  for (let i = 0; i < nLines; i++) {
    lines.push(genPointInGlobe());
  }

  loadImg();
  drawLineTimeout(lines);
};

const loadImg = (i = 35) => {
  loadImage(images.list[i], (img) => {
    Color.loadImage(img);

    setTimeout(loadImg.bind(null, (i + 1) % images.list.length), IMG_ITV);
  }, () => {
    setTimeout(loadImg.bind(null, (i + 1) % images.list.length), IMG_ITV);
  });
};

const drawLineTimeout = (lines) => {
  if (Color.imageLoaded()) { drawLine(lines); }
  setTimeout(requestAnimationFrame.bind(null, drawLineTimeout.bind(null, lines)), LINE_ITV);
};

const drawLine = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    if (Math.random() < .0015) {
      // Jump
      const p = genPointInGlobe();
      lines[i].x = p.x;
      lines[i].y = p.y;
      continue;
    }

    const { x, y } = lines[i];
    const { x: x1, y: y1 } = getNextPoint({ x, y });
    stroke(getColor(x, y, line, canvasW));
    strokeWeight(getStrokeWeight());
    line(x + OFFSET, y + OFFSET, x1 + OFFSET, y1 + OFFSET);

    lines[i].x = x1;
    lines[i].y = y1;
  };
};

const getStrokeWeight = () => {
  if (Math.random() < .01) { return strokeWeights[0]; }
  if (Math.random() < .1) { return strokeWeights[1]; }
  if (Math.random() < .5) { return strokeWeights[2]; }
  return strokeWeights[3];
};

const getNextPoint = ({ x, y }) => {
  while (true) {
    let dx;
    let dy;
    if (MAX_TAN) {
      dx = fractionIn(Math.random() * Math.random(), minL, maxL) * (Math.random() < .5 ? 1 : -1);
      dy = randIn(1 / MAX_TAN, MAX_TAN) * dx;
    }
    else {
      const l = fractionIn(Math.random() * Math.random(), minL, maxL);
      const dir = (Math.random() < .5 ? 1 : -1);
      const ang = randIn(MIN_ANG, MAX_ANG);
      dx = l * Math.cos(ang / 180 * Math.PI) * dir;
      dy = l * Math.sin(ang / 180 * Math.PI) * dir * -1;
    }
    const x1 = x + dx;
    const y1 = y + dy;

    if (inGlobe({ x: x1, y: y1 })) {
      return { x: x1, y: y1 };
    }
  }
};

const genPointInGlobe = () => {
  while (true) {
    const x = Math.random() * canvasW;
    const y = Math.random() * canvasW;
    if (inGlobe({ x, y })) {
      return { x, y };
    }
  }
};

const inGlobe = ({ x, y }) => {
  return fracSqToCenter(x, y, canvasW) < 1.2;
};
