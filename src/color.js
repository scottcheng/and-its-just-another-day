import { IMG_W, CANVAS_W } from './constants';
import { randIn, fracSqToCenter } from './util';

let img = null;


const loadImage = (newImg) => {
  newImg.loadPixels();
  img = newImg;
};

export const imageLoaded = () => img !== null;

// cx: x on canvas
// cy: y on canvas
// Assuming img.loadPixels has been called
export const getColor = (cx, cy, line) => {
  const THRESHOLD = 0;
  const renderW = CANVAS_W - THRESHOLD * 2;
  if (cx < THRESHOLD || cx >= CANVAS_W - THRESHOLD || cy < THRESHOLD || cy >= CANVAS_W - THRESHOLD) {
    return color(0, 0, 0);
  }

  const idx = (Math.floor((cy - THRESHOLD) / renderW * IMG_W) * IMG_W + Math.floor((cx - THRESHOLD) / renderW * IMG_W)) * 4;
  let r = img.pixels[idx];
  let g = img.pixels[idx + 1];
  let b = img.pixels[idx + 2];

  colorMode(RGB);
  let c = color(r, g, b);
  colorMode(HSB);
  const [h, s, l] = filter(c, cx, cy);

  const alpha = 1;
  return color(h, s, l, l > 5 ? alpha : 1);
};

const filter = (c, x, y) => {
  let [h, s, l] = [hue(c), saturation(c), brightness(c)];

  if (l < 10) {
    return [0, 0, 0];
  }

  if (isCloud(h, s, l)) {
    [h, s, l] = getCloudColor(h, s, l, x, y);
  }
  else if (isOcean(h, s, l)) {
    [h, s, l] = getOceanColor(h, s, l, x, y);
  }
  else if (l > 10) {
    [h, s, l] = getOtherColor(h, s, l, x, y);
  }
  return [h, s, l];

  [h, s, l] = brighten(h, s, l, 1.5);
  [h, s, l] = saturate(h, s, l);

  return [h, s, l];
};

const brighten = (h, s, l, amount = 1.2) => {
  return [h, s, l * amount];
};

const saturate = (h, s, l, amount = 1.2) => {
  return [h, s * amount, l];
};

const grayscale = (h, s, l) => {
  return [h, 0, l];
};

const isCloud = (h, s, l) => {
  return s < 18;
};

const isOcean = (h, s, l) => {
  if (isCloud(h, s, l)) { return false; }
  return h >= 195 && h <= 220;
};

const getCloudColor = (h, s, l, x, y) => {
  h = randIn(337, 360 + 42);
  s = randIn(65, 90);
  l = l * randIn(1.5, 1.9);

  return correctHSL(h, s, l);
};

const getOceanColor = (h, s, l, x, y) => {
  h += randIn(-30, -20);
  s += randIn(-5, 10);
  l += randIn(-5, 5);

  return correctHSL(h, s, l);
};

const getOtherColor = (h, s, l, x, y) => {
  h += randIn(30, 50);
  s += randIn(-5, 15);
  l += randIn(-5, 15);

  return correctHSL(h, s, l);
};

const correctHSL = (h, s, l) => {
  return [(h + 360) % 360, Math.min(100, Math.max(0, s)), Math.min(100, Math.max(0, l))];
}

export default {
  loadImage,
  imageLoaded,
  getColor,
};
