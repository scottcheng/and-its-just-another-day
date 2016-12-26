import 'normalize-css';
import './styles.styl';

window.onload = () => {
  // setup about
  const aboutContainer = document.querySelector('#about');
  document.querySelector('#about-link').addEventListener('click', () => {
    aboutContainer.classList.add('is-open');
  });
  document.querySelector('#about-close').addEventListener('click', () => {
    aboutContainer.classList.remove('is-open');
  });
};

import './painter';
