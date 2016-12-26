const fullscreenEnabled = () =>
  document.fullscreenEnabled ||
	document.webkitFullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.msFullscreenEnabled;

const fullscreenElement = () =>
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement;

const request = () => {
  const d = document.documentElement;
  const requestFn = d.requestFullscreen ||
    d.webkitRequestFullscreen ||
    d.mozRequestFullScreen ||
    d.msRequestFullscreen;

  if (requestFn) { requestFn.call(d); }

  updateClass();
};

const exit = () => {
  const exitFn = document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;

  if (exitFn) { exitFn.call(document); }

  updateClass();
};

const toggle = () => {
  if (fullscreenElement()) {
    exit();
  } else {
    request();
  }
};

const updateClass = () => {
  if (fullscreenElement()) {
    document.querySelector('#fullscreen').classList.add('is-active');
  } else {
    document.querySelector('#fullscreen').classList.remove('is-active');
  }
};

// Periodically check class
// This is needed because esc key event does not fire when exiting from
// fullscreen mode in some browsers
const checkClass = () => {
  updateClass();
  setTimeout(requestAnimationFrame.bind(null, checkClass.bind(null)), 1000);
};

export const setup = () => {
  const containerNode = document.querySelector('#fullscreen');

  if (!fullscreenEnabled()) {
    containerNode.parentNode.removeChild(containerNode);
    return;
  }

  document.querySelector('#fullscreen-link').addEventListener('click', () => {
    request();
  });
  document.querySelector('#fullscreen-close').addEventListener('click', () => {
    exit();
  });

  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      // enter
      toggle();
    } else if (e.keyCode === 27) {
      // esc
      exit();
    }
  });

  checkClass();
};
