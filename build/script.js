/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(1);

	var _util = __webpack_require__(2);

	var _images = __webpack_require__(3);

	var _images2 = _interopRequireDefault(_images);

	var _color = __webpack_require__(4);

	var _color2 = _interopRequireDefault(_color);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var lines = [];
	// { x, y, color, areaType }
	// x, y: coordinates on canvas
	// areaType: 'cloud', 'ocean', 'other'

	window.setup = function () {
	  createCanvas(_constants.CANVAS_W + _constants.OFFSET * 2, _constants.CANVAS_W + _constants.OFFSET * 2);
	  colorMode(HSB);
	  background(0, 0, 0);

	  for (var i = 0; i < _constants.N_LINES; i++) {
	    lines.push(genPointInGlobe());
	  }

	  loadImg();
	  drawLineTimeout(lines);
	};

	var loadImg = function loadImg() {
	  var i = arguments.length <= 0 || arguments[0] === undefined ? 35 : arguments[0];

	  loadImage(_images2.default.list[i], function (img) {
	    _color2.default.loadImage(img);

	    window.setTimeout(loadImg.bind(null, (i + 1) % _images2.default.list.length), _constants.IMG_ITV);
	  }, function () {
	    window.setTimeout(loadImg.bind(null, (i + 1) % _images2.default.list.length), _constants.IMG_ITV);
	  });
	};

	var drawLineTimeout = function drawLineTimeout(lines) {
	  if (_color2.default.imageLoaded()) {
	    drawLine(lines);
	  }
	  window.setTimeout(window.requestAnimationFrame.bind(null, drawLineTimeout.bind(null, lines)), _constants.LINE_ITV);
	};

	var drawLine = function drawLine(lines) {
	  for (var i = 0; i < lines.length; i++) {
	    if (Math.random() < .0015) {
	      // Jump
	      var p = genPointInGlobe();
	      lines[i].x = p.x;
	      lines[i].y = p.y;
	      continue;
	    }

	    var _lines$i = lines[i];
	    var x = _lines$i.x;
	    var y = _lines$i.y;

	    var _getNextPoint = getNextPoint({ x: x, y: y });

	    var x1 = _getNextPoint.x;
	    var y1 = _getNextPoint.y;

	    stroke((0, _color.getColor)(x, y, line));
	    strokeWeight(getStrokeWeight());
	    line(x + _constants.OFFSET, y + _constants.OFFSET, x1 + _constants.OFFSET, y1 + _constants.OFFSET);

	    lines[i].x = x1;
	    lines[i].y = y1;
	  };
	};

	var getStrokeWeight = function getStrokeWeight() {
	  if (Math.random() < .01) {
	    return 5;
	  }
	  if (Math.random() < .1) {
	    return 3;
	  }
	  if (Math.random() < .6) {
	    return 2;
	  }
	  return 1;
	};

	var getNextPoint = function getNextPoint(_ref) {
	  var x = _ref.x;
	  var y = _ref.y;

	  while (true) {
	    var dx = undefined;
	    var dy = undefined;
	    if (_constants.MAX_TAN) {
	      dx = (0, _util.fractionIn)(Math.random() * Math.random(), _constants.MIN_L, _constants.MAX_L) * (Math.random() < .5 ? 1 : -1);
	      dy = (0, _util.randIn)(1 / _constants.MAX_TAN, _constants.MAX_TAN) * dx;
	    } else {
	      var l = (0, _util.fractionIn)(Math.random() * Math.random(), _constants.MIN_L, _constants.MAX_L);
	      var dir = Math.random() < .5 ? 1 : -1;
	      var ang = (0, _util.randIn)(_constants.MIN_ANG, _constants.MAX_ANG);
	      dx = l * Math.cos(ang / 180 * Math.PI) * dir;
	      dy = l * Math.sin(ang / 180 * Math.PI) * dir * -1;
	    }
	    var x1 = x + dx;
	    var y1 = y + dy;

	    if (inGlobe({ x: x1, y: y1 })) {
	      return { x: x1, y: y1 };
	    }
	  }
	};

	var genPointInGlobe = function genPointInGlobe() {
	  while (true) {
	    var x = Math.random() * _constants.CANVAS_W;
	    var y = Math.random() * _constants.CANVAS_W;
	    if (inGlobe({ x: x, y: y })) {
	      return { x: x, y: y };
	    }
	  }
	};

	var inGlobe = function inGlobe(_ref2) {
	  var x = _ref2.x;
	  var y = _ref2.y;

	  return (0, _util.fracSqToCenter)(x, y) < 1.2;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var IMG_W = exports.IMG_W = 550;
	var CANVAS_W = exports.CANVAS_W = 800;
	var OFFSET = exports.OFFSET = 50;

	var N_LINES = exports.N_LINES = 19;

	// Interval (in ms) of drawing lines and updating image
	var LINE_ITV = exports.LINE_ITV = 0;
	var IMG_ITV = exports.IMG_ITV = 2.4 * 1000;

	// Line length and angle
	var MAX_L = exports.MAX_L = 12;
	var MIN_L = exports.MIN_L = 5;
	var MIN_ANG = exports.MIN_ANG = 30;
	var MAX_ANG = exports.MAX_ANG = 60;
	var MAX_TAN = exports.MAX_TAN = -.5;

	var IMG_DIR = exports.IMG_DIR = 'images/color/7';
	var IMG_EXT = exports.IMG_EXT = '.jpg';
	var START = exports.START = new Date('Feb 3 2016 14:50');
	var END = exports.END = new Date('Feb 4 2016 14:30');

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fracSqToCenter = exports.fractionIn = exports.randIn = undefined;

	var _constants = __webpack_require__(1);

	var randIn = exports.randIn = function randIn(lo, hi) {
	  return fractionIn(Math.random(), lo, hi);
	};

	var fractionIn = exports.fractionIn = function fractionIn(frac, lo, hi) {
	  return frac * (hi - lo) + lo;
	};

	var fracSqToCenter = exports.fracSqToCenter = function fracSqToCenter(x, y) {
	  var c = _constants.CANVAS_W / 2;
	  return ((x - c) * (x - c) + (y - c) * (y - c)) / (c * c);
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _constants = __webpack_require__(1);

	var itv = 10;

	var list = [];

	var pad = function pad(d) {
	  return d < 10 ? '0' + d : d;
	};

	var getTimestamp = function getTimestamp(t) {
	  return '' + t.getFullYear() + pad(t.getMonth() + 1) + pad(t.getDate()) + '_' + pad(t.getHours()) + pad(t.getMinutes()) + '00';
	};

	var add = function add(t) {
	  if (t >= _constants.END) {
	    return;
	  }

	  list.push(_constants.IMG_DIR + '/' + getTimestamp(t) + _constants.IMG_EXT);
	  add(new Date(t.getTime() + itv * 60 * 1000));
	};
	add(_constants.START);

	exports.default = {
	  list: list
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getColor = exports.imageLoaded = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _constants = __webpack_require__(1);

	var _util = __webpack_require__(2);

	var img = null;

	var loadImage = function loadImage(newImg) {
	  newImg.loadPixels();
	  img = newImg;
	};

	var imageLoaded = exports.imageLoaded = function imageLoaded() {
	  return img !== null;
	};

	// cx: x on canvas
	// cy: y on canvas
	// Assuming img.loadPixels has been called
	var getColor = exports.getColor = function getColor(cx, cy, line) {
	  var THRESHOLD = 0;
	  var renderW = _constants.CANVAS_W - THRESHOLD * 2;
	  if (cx < THRESHOLD || cx >= _constants.CANVAS_W - THRESHOLD || cy < THRESHOLD || cy >= _constants.CANVAS_W - THRESHOLD) {
	    return color(0, 0, 0);
	  }

	  var idx = (Math.floor((cy - THRESHOLD) / renderW * _constants.IMG_W) * _constants.IMG_W + Math.floor((cx - THRESHOLD) / renderW * _constants.IMG_W)) * 4;
	  var r = img.pixels[idx];
	  var g = img.pixels[idx + 1];
	  var b = img.pixels[idx + 2];

	  colorMode(RGB);
	  var c = color(r, g, b);
	  colorMode(HSB);

	  var _filter = filter(c, cx, cy);

	  var _filter2 = _slicedToArray(_filter, 3);

	  var h = _filter2[0];
	  var s = _filter2[1];
	  var l = _filter2[2];


	  var alpha = 1;
	  return color(h, s, l, l > 5 ? alpha : 1);
	};

	var filter = function filter(c, x, y) {
	  var h = hue(c);
	  var s = saturation(c);
	  var l = brightness(c);


	  if (l < 10) {
	    return [0, 0, 0];
	  }

	  if (isCloud(h, s, l)) {
	    var _getCloudColor = getCloudColor(h, s, l, x, y);

	    var _getCloudColor2 = _slicedToArray(_getCloudColor, 3);

	    h = _getCloudColor2[0];
	    s = _getCloudColor2[1];
	    l = _getCloudColor2[2];
	  } else if (isOcean(h, s, l)) {
	    var _getOceanColor = getOceanColor(h, s, l, x, y);

	    var _getOceanColor2 = _slicedToArray(_getOceanColor, 3);

	    h = _getOceanColor2[0];
	    s = _getOceanColor2[1];
	    l = _getOceanColor2[2];
	  } else if (l > 10) {
	    var _getOtherColor = getOtherColor(h, s, l, x, y);

	    var _getOtherColor2 = _slicedToArray(_getOtherColor, 3);

	    h = _getOtherColor2[0];
	    s = _getOtherColor2[1];
	    l = _getOtherColor2[2];
	  }
	  return [h, s, l];

	  var _brighten = brighten(h, s, l, 1.5);

	  var _brighten2 = _slicedToArray(_brighten, 3);

	  h = _brighten2[0];
	  s = _brighten2[1];
	  l = _brighten2[2];

	  var _saturate = saturate(h, s, l);

	  var _saturate2 = _slicedToArray(_saturate, 3);

	  h = _saturate2[0];
	  s = _saturate2[1];
	  l = _saturate2[2];


	  return [h, s, l];
	};

	var brighten = function brighten(h, s, l) {
	  var amount = arguments.length <= 3 || arguments[3] === undefined ? 1.2 : arguments[3];

	  return [h, s, l * amount];
	};

	var saturate = function saturate(h, s, l) {
	  var amount = arguments.length <= 3 || arguments[3] === undefined ? 1.2 : arguments[3];

	  return [h, s * amount, l];
	};

	var grayscale = function grayscale(h, s, l) {
	  return [h, 0, l];
	};

	var isCloud = function isCloud(h, s, l) {
	  return s < 18;
	};

	var isOcean = function isOcean(h, s, l) {
	  if (isCloud(h, s, l)) {
	    return false;
	  }
	  return h >= 195 && h <= 220;
	};

	var getCloudColor = function getCloudColor(h, s, l, x, y) {
	  h = (0, _util.randIn)(337, 360 + 42);
	  s = (0, _util.randIn)(65, 90);
	  l = l * (0, _util.randIn)(1.5, 1.9);

	  return correctHSL(h, s, l);
	};

	var getOceanColor = function getOceanColor(h, s, l, x, y) {
	  h += (0, _util.randIn)(-30, -20);
	  s += (0, _util.randIn)(-5, 10);
	  l += (0, _util.randIn)(-5, 5);

	  return correctHSL(h, s, l);
	};

	var getOtherColor = function getOtherColor(h, s, l, x, y) {
	  h += (0, _util.randIn)(30, 50);
	  s += (0, _util.randIn)(-5, 15);
	  l += (0, _util.randIn)(-5, 15);

	  return correctHSL(h, s, l);
	};

	var correctHSL = function correctHSL(h, s, l) {
	  return [(h + 360) % 360, Math.min(100, Math.max(0, s)), Math.min(100, Math.max(0, l))];
	};

	exports.default = {
	  loadImage: loadImage,
	  imageLoaded: imageLoaded,
	  getColor: getColor
	};

/***/ }
/******/ ]);