import images from './images';

const IMG_W = 2200;
const CANVAS_W = 800;
const OFFSET = 50;
const N_LINES = 1000;

const LINE_ITV = 25;
const IMG_ITV = 2 * 1000;

const lines = [];
// each line is { x, y } on canvas

let img = null;

window.setup = () => {
  createCanvas(CANVAS_W + OFFSET * 2, CANVAS_W + OFFSET * 2);
  background(0);

  for (let i = 0; i < N_LINES; i++) {
    lines.push(genPointInGlobe());
  }

  loadImg(0);
  drawLineTimeout(lines);
};

const loadImg = (i) => {
  loadImage(images.list[i], (newImg) => {
    newImg.loadPixels();
    img = newImg;

    window.setTimeout(loadImg.bind(null, (i + 1) % images.list.length), IMG_ITV);
  }, () => {
    window.setTimeout(loadImg.bind(null, (i + 1) % images.list.length), IMG_ITV);
  });
};

const drawLineTimeout = (lines) => {
  if (img) { drawLine(lines); }
  window.setTimeout(drawLineTimeout.bind(null, lines), LINE_ITV);
};

const drawLine = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    if (Math.random() < .1) {
      // Jump
      const p = genPointInGlobe();
      lines[i].x = p.x;
      lines[i].y = p.y;
      continue;
    }

    const { x, y } = lines[i];
    const { x: x1, y: y1 } = getNextPoint({ x, y });
    stroke(getColor(img, x, y));
    strokeWeight(getStrokeWeight());
    line(x + OFFSET, y + OFFSET, x1 + OFFSET, y1 + OFFSET);

    lines[i].x = x1;
    lines[i].y = y1;
  };
};

const getStrokeWeight = () => {
  if (Math.random() < .01) { return 5; }
  if (Math.random() < .1) { return 3; }
  if (Math.random() < .5) { return 2; }
  return 1;
};

const getNextPoint = ({ x, y }) => {
  const MAX_D = 9;
  const MIN_D = 2;
  const MAX_TAN = -1.4;
  // TODO: maybe consider angle and draw (roughly) backwards

  while (true) {
    const dx = (Math.random() * Math.random() * (MAX_D - MIN_D) + MIN_D) * (Math.random() < .5 ? 1 : -1);
    const dy = ((Math.random() * (MAX_TAN - 1 / MAX_TAN)) + 1 / MAX_TAN) * dx;
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
  const c = CANVAS_W / 2;
  return (x - c) * (x - c) + (y - c) * (y - c) < c * c * 1.2;
};

// cx: x on canvas
// cy: y on canvas
// Assuming img.loadPixels has been called
const getColor = (img, cx, cy) => {
  const THRESHOLD = 0;
  const renderW = CANVAS_W - THRESHOLD * 2;
  if (cx < THRESHOLD || cx >= CANVAS_W - THRESHOLD || cy < THRESHOLD || cy >= CANVAS_W - THRESHOLD) {
    return color(0);
  }

  const idx = (Math.floor((cy - THRESHOLD) / renderW * IMG_W) * IMG_W + Math.floor((cx - THRESHOLD) / renderW * IMG_W)) * 4;
  const r = img.pixels[idx];
  const g = img.pixels[idx + 1];
  const b = img.pixels[idx + 2];

  return color(r, g, b, r + g + b > 10 ? 128 : 255);
};
