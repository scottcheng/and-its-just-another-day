import { CANVAS_W } from './constants';

export const randIn = (lo, hi) => {
  return fractionIn(Math.random(), lo, hi);
};

export const fractionIn = (frac, lo, hi) => {
  return frac * (hi - lo) + lo;
};

export const fracSqToCenter = (x, y) => {
  const c = CANVAS_W / 2;
  return ((x - c) * (x - c) + (y - c) * (y - c)) / (c * c);
};
