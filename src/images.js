import { IMG_DIR, IMG_EXT, START, END } from './constants';

const itv = 10;

const list = [];

const pad = (d) => d < 10 ? `0${d}` : d;

const getTimestamp = (t) => {
  return `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}_${pad(t.getHours())}${pad(t.getMinutes())}00`;
};

const add = (t) => {
  if (t >= END) { return; }

  list.push(`${IMG_DIR}/${getTimestamp(t)}${IMG_EXT}`);
  add(new Date(t.getTime() + itv * 60 * 1000));
};
add(START);

export default {
  list,
};
