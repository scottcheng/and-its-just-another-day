const LETTER_ITV = 120;
const EL_ITV = (el) => {
  if (typeof el === 'string' && el.indexOf(',') === 0) { return LETTER_ITV; }
  if (el === '.') { return LETTER_ITV; }
  if (!el.type) { return 500; }
  if (el.type === 'p') { return 1000; }
  if (el.type === 'br') { return 500; }
  if (el.type === 'a') { return LETTER_ITV; }
  if (el.type === 'h1') { return 0; }
  if (el.type === 'root') { return 0; }
  return 500;
};

const aboutContent = {
type: 'root',
children: [
  {
    type: 'h1',
    children: ["and it's just another day"],
  },
  {
    type: 'p',
    children: [
      'it was april 30, 2015.',
      { type: 'br' },
      'himawari watched us from afar. ',
      'this is what she saw.',
      { type: 'br' },
      'clouds. ',
      'oceans. ',
      'mountains. ',
      'me. ',
      'and you.',
    ],
  },
  '',
  '',
  '',
  {
    type: 'p',
    children: [
      'soon the day would come to an end.',
      { type: 'br' },
      'and another would begin.',
    ],
  },
  '',
  '',
  '',
  {
    type: 'p',
    children: [
      'by ',
      {
        type: 'a',
        href: 'http://scottcheng.com',
        children: ['scott cheng'],
      },
      { type: 'br' },
      'thanks to ',
      {
        type: 'a',
        href: 'http://himawari8.nict.go.jp/',
        children: ['himawari'],
      },
      ', ',
      {
        type: 'a',
        href: 'https://github.com/jakiestfu/himawari.js/',
        children: ['himawari.js'],
      },
      ', and ',
      {
        type: 'a',
        href: 'https://p5js.org/',
        children: ['p5.js']
      },
    ],
  },
  {
    type: 'p',
    className: 'about-close link',
    children: ['[close]'],
  },
] };

const sleep = (t) => new Promise((r) => setTimeout(r, t));

const type = async (parentNode, content) => {
  if (typeof content === 'string') {
    if (content.length === 0) {
      await sleep(LETTER_ITV);
    } else {
      for (let l of content) {
        await sleep(LETTER_ITV);
        parentNode.innerHTML = parentNode.innerHTML + l;
      }
    }
  } else {
    await sleep(EL_ITV(content));
    if (content.children) {
      for (let c of content.children) {
        if (typeof c === 'string') {
          if (c !== content.children[0]) {
            // Do not wait on first child
            await sleep(EL_ITV(c));
          }
          await type(parentNode, c);
        } else {
          const childNode = document.createElement(c.type);
          if (c.type === 'a' && c.href) {
            childNode.setAttribute('href', c.href);
            childNode.setAttribute('target', '_blank');
          }
          if (c.className) {
            childNode.setAttribute('class', c.className);
          }
          parentNode.appendChild(childNode);
          await type(childNode, c);
        }
      }
    }
  }
};

export const setup = () => {
  const containerNode = document.querySelector('#about');
  const contentNode = document.querySelector('#about-content');

  document.querySelector('#about-link').addEventListener('click', async () => {
    containerNode.classList.add('is-open');

    if (!document.querySelector('.about-close')) {
      await type(contentNode, aboutContent);
      document.querySelector('.about-close').addEventListener('click', () => {
        containerNode.classList.remove('is-open');
      });
    }
  });
};
