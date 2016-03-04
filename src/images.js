const dir = 'images/color/4';
const ext = '.jpg';

const start = new Date('Oct 31 2015 14:50');
const end = new Date('Nov 1 2015 14:30');

const itv = 10;

const list = [];

const pad = (d) => d < 10 ? `0${d}` : d;

const getTimestamp = (t) => {
  return `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}_${pad(t.getHours())}${pad(t.getMinutes())}00`;
};

const add = (t) => {
  if (t >= end) { return; }

  list.push(`${dir}/${getTimestamp(t)}${ext}`);
  add(new Date(t.getTime() + itv * 60 * 1000));
};
add(start);

export default {
  list,
};
