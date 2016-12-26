import { IMG_W, CANVAS_W, OFFSET, N_LINES,LINE_ITV, IMG_ITV,
         MAX_L, MIN_L, MAX_TAN, MIN_ANG, MAX_ANG } from './constants';
import { randIn, fractionIn, fracSqToCenter } from './util';
import images from './images';
import Color, { getColor, imageLoaded } from './color';

const lines = [];
// { x, y, color, areaType }
// x, y: coordinates on canvas
// areaType: 'cloud', 'ocean', 'other'

window.setup = () => {
  const canvas = createCanvas(CANVAS_W + OFFSET * 2, CANVAS_W + OFFSET * 2);
  canvas.parent('o');
  colorMode(HSB);
  background(0, 0, 0);

  for (let i = 0; i < N_LINES; i++) {
    lines.push(genPointInGlobe());
  }

  loadImg();
  drawLineTimeout(lines);
};

const loadImg = (i = 35) => {
  loadImage(images.list[i], (img) => {
    Color.loadImage(img);

    window.setTimeout(loadImg.bind(null, (i + 1) % images.list.length), IMG_ITV);
  }, () => {
    window.setTimeout(loadImg.bind(null, (i + 1) % images.list.length), IMG_ITV);
  });
};

const drawLineTimeout = (lines) => {
  if (Color.imageLoaded()) { drawLine(lines); }
  window.setTimeout(window.requestAnimationFrame.bind(null, drawLineTimeout.bind(null, lines)), LINE_ITV);
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
    stroke(getColor(x, y, line));
    strokeWeight(getStrokeWeight());
    line(x + OFFSET, y + OFFSET, x1 + OFFSET, y1 + OFFSET);

    lines[i].x = x1;
    lines[i].y = y1;
  };
};

const getStrokeWeight = () => {
  if (Math.random() < .01) { return 7; }
  if (Math.random() < .1) { return 5; }
  if (Math.random() < .5) { return 3; }
  return 2;
};

const getNextPoint = ({ x, y }) => {
  while (true) {
    let dx;
    let dy;
    if (MAX_TAN) {
      dx = fractionIn(Math.random() * Math.random(), MIN_L, MAX_L) * (Math.random() < .5 ? 1 : -1);
      dy = randIn(1 / MAX_TAN, MAX_TAN) * dx;
    }
    else {
      const l = fractionIn(Math.random() * Math.random(), MIN_L, MAX_L);
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
    const x = Math.random() * CANVAS_W;
    const y = Math.random() * CANVAS_W;
    if (inGlobe({ x, y })) {
      return { x, y };
    }
  }
};

const inGlobe = ({ x, y }) => {
  return fracSqToCenter(x, y) < 1.2;
};
