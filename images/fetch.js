import himawari from 'himawari';

// Get images in [start, end)
const start = new Date('Dec 30 2015 14:50');
const end = new Date('Dec 31 2015 14:40');

const itv = 10; // in minutes

const fetch = (t) => {
  if (t >= end) { return; }

  console.log(`Fetching ${t}`);

  himawari({
    zoom: 1,
    date: t,
    infrared: false,
    parallel: true,
    success: () => {
      fetch(new Date(t.getTime() + itv * 60 * 1000));
    },
  });
}

fetch(start);
