import 'normalize-css';
import './styles.styl';

import * as about from './about';
import * as fullscreen from './fullscreen';

window.onload = () => {
  about.setup();
  fullscreen.setup();
};

import './painter';
