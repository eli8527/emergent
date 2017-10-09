(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function () {
  function Cell(x, y, container) {
    _classCallCheck(this, Cell);

    this.sprite = new PIXI.Sprite.fromImage('img/cell.png');
    this.sprite.position.set(x, y);
    this.sprite.rotation = (0, _util.randomUniform)(0, 2 * Math.PI);
    this.sprite.alpha = 0.8;
    this.container = container;
    this.container.addChild(this.sprite);

    this.direction = (0, _util.randomUniform)(0, 2 * Math.PI);
    this.speed = (0, _util.randomExponential)(.03);
    this.lifespan = (0, _util.randomExponential)(60 * 5);
  }

  _createClass(Cell, [{
    key: 'getX',
    value: function getX() {
      return this.sprite.position.x;
    }
  }, {
    key: 'getY',
    value: function getY() {
      return this.sprite.position.y;
    }
  }, {
    key: 'split',
    value: function split() {
      var dx = (0, _util.randomUniform)(-15, 15);
      var dy = (0, _util.randomUniform)(-15, 15);
      var c = new Cell(this.getX() + dx, this.getY() + dy, this.container);
      c.sprite.tint = this.sprite.tint;
      return c;
    }
  }, {
    key: 'step',
    value: function step() {
      var dx = Math.sin(this.direction) * this.speed;
      var dy = Math.cos(this.direction) * this.speed;
      this.direction += (0, _util.randomUniform)(-0.01, 0.01);
      this.sprite.position.set(this.getX() + dx, this.getY() + dy);
    }
  }]);

  return Cell;
}();

exports.default = Cell;

},{"./util":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColorRunner = function () {
  function ColorRunner() {
    _classCallCheck(this, ColorRunner);

    this.Rx = (0, _util.randomUniform)(0, 1000);
    this.Gx = (0, _util.randomUniform)(0, 1000);
    this.Bx = (0, _util.randomUniform)(0, 1000);

    this.step = 10;
  }

  _createClass(ColorRunner, [{
    key: 'requestColorHex',
    value: function requestColorHex() {
      this.Rx += this.step;
      this.Gx += this.step;
      this.Bx += this.step;

      var R = Math.abs(Math.sin(this.Rx * .0125) * 125) + 125;
      var G = Math.abs(Math.sin(this.Gx * .0215) * 125) + 125;
      var B = Math.abs(Math.sin(this.Bx * .0092) * 125) + 125;

      var hex = '0x' + this.rgbToHex(R, G, B);
      return hex;
    }

    // code from https://gist.github.com/lrvick/2080648

  }, {
    key: 'rgbToHex',
    value: function rgbToHex(r, g, b) {
      var bin = r << 16 | g << 8 | b;
      return function (h) {
        return new Array(7 - h.length).join('0') + h;
      }(bin.toString(16).toUpperCase());
    }
  }]);

  return ColorRunner;
}();

exports.default = ColorRunner;

},{"./util":4}],3:[function(require,module,exports){
'use strict';

var _cell = require('./cell');

var _cell2 = _interopRequireDefault(_cell);

var _color = require('./color');

var _color2 = _interopRequireDefault(_color);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Set up canvas.
var renderer = PIXI.autoDetectRenderer(screen.width, screen.height, { backgroundColor: 0x0A0F28 });
var canvas = document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var colorRunner = new _color2.default();
var cells = [];
var mouseX = 0;
var mouseY = 0;

// Full screen button.
document.getElementById('fullscreen-btn').addEventListener('click', function () {
  ;var rfs = canvas.requestFullscreen || canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen || canvas.msRequestFullscreen;
  rfs.call(canvas);
});

// Reset command.
document.addEventListener('keydown', function (e) {
  if (e.keyCode === 82 && e.altKey) {
    cells.forEach(function (c) {
      stage.removeChild(c.sprite);
    });
    cells = [];
  }
});

// Create bacterium on click.
renderer.view.addEventListener('mousedown', function (e) {
  var c = new _cell2.default(e.x, e.y, stage);
  c.sprite.tint = colorRunner.requestColorHex();
  cells.push(c);

  generateCreatePing();
});

// Track mouse movements for scaling effect.
renderer.view.addEventListener('mousemove', function (e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

var meter = new FPSMeter();

function animate() {
  requestAnimationFrame(animate);

  cells.forEach(function (c, i) {
    if (Math.random() < 0.004) {
      if (Math.random() < 0.0004) {
        generateSplitPing();
      }

      var newCell = c.split();
      cells.push(newCell);
    }

    // check mouse location
    var d = (0, _util.distance)(mouseX, mouseY, c.getX(), c.getY());
    if (d < 50) {
      c.sprite.scale.set(Math.min(50 / d, 2));
    } else {
      c.sprite.scale.set(1);
    }

    c.step();

    if (c.lifespan-- <= 0) {
      // kill if end of life
      cells.splice(i, 1);
      stage.removeChild(c.sprite);
    }
  });

  // render the container
  meter.tick();
  renderer.render(stage);
}

animate();

function generateCreatePing() {
  if (Math.random() < 0.25) {
    socketPort.send({
      address: '/create',
      args: 1
    });
  }
}

function generateSplitPing() {
  socketPort.send({
    address: '/split',
    args: 1
  });
}

// Set up WebSocket.
var socketPort = new osc.WebSocketPort({
  url: 'ws://localhost:8000' });
socketPort.open();

socketPort.on('ready', function () {
  console.log('Browser port ready!');

  generateCreatePing();
});

socketPort.on('message', function (oscMsg) {
  console.log('Browser received OSC from Max: ', oscMsg);

  var cell = new _cell2.default(oscMsg.args[0], oscMsg.args[1], stage);
  cell.sprite.tint = colorRunner.requestColorHex();
  cells.push(cell);

  generateCreatePing();
});

},{"./cell":1,"./color":2,"./util":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomUniform = randomUniform;
exports.randomExponential = randomExponential;
exports.distance = distance;
// Return a random number in [lo, hi)
function randomUniform(lo, hi) {
  return (hi - lo) * Math.random() + lo;
}

// Return an exponentially distributed random number
function randomExponential(expected) {
  return Math.log(Math.random()) / -(1 / expected);
}

// Return the Euclidean distance between two points.
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9jZWxsLmpzIiwianMvY29sb3IuanMiLCJqcy9pbmRleC5qcyIsImpzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBOzs7O0lBR00sSTtBQUNKLGdCQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLFNBQWxCLEVBQTZCO0FBQUE7O0FBQzNCLFNBQUssTUFBTCxHQUFjLElBQUksS0FBSyxNQUFMLENBQVksU0FBaEIsQ0FBMEIsY0FBMUIsQ0FBZDtBQUNBLFNBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsR0FBckIsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7QUFDQSxTQUFLLE1BQUwsQ0FBWSxRQUFaLEdBQXVCLHlCQUFjLENBQWQsRUFBaUIsSUFBSSxLQUFLLEVBQTFCLENBQXZCO0FBQ0EsU0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixHQUFwQjtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLFNBQUssU0FBTCxDQUFlLFFBQWYsQ0FBd0IsS0FBSyxNQUE3Qjs7QUFFQSxTQUFLLFNBQUwsR0FBaUIseUJBQWMsQ0FBZCxFQUFpQixJQUFJLEtBQUssRUFBMUIsQ0FBakI7QUFDQSxTQUFLLEtBQUwsR0FBYSw2QkFBa0IsR0FBbEIsQ0FBYjtBQUNBLFNBQUssUUFBTCxHQUFnQiw2QkFBa0IsS0FBSyxDQUF2QixDQUFoQjtBQUNEOzs7OzJCQUVNO0FBQ0wsYUFBTyxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLENBQTVCO0FBQ0Q7OzsyQkFFTTtBQUNMLGFBQU8sS0FBSyxNQUFMLENBQVksUUFBWixDQUFxQixDQUE1QjtBQUNEOzs7NEJBRU87QUFDTixVQUFNLEtBQUsseUJBQWMsQ0FBQyxFQUFmLEVBQW1CLEVBQW5CLENBQVg7QUFDQSxVQUFNLEtBQUsseUJBQWMsQ0FBQyxFQUFmLEVBQW1CLEVBQW5CLENBQVg7QUFDQSxVQUFNLElBQUks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TUFBL0M7O0FBRUEsTUFBTSxPQUFPLG1CQUFTLE9BQU8sSUFBUCxDQUFZLENBQVosQ0FBVCxFQUF5QixPQUFPLElBQVAsQ0FBWSxDQUFaLENBQXpCLEVBQXlDLEtBQXpDLENBQWI7QUFDQSxPQUFLLE1BQUwsQ0FBWSxJQUFaLEdBQW1CLFlBQVksZUFBWixFQUFuQjtBQUNBLFFBQU0sSUFBTixDQUFXLElBQVg7O0FBRUE7QUFDRCxDQVJIOzs7Ozs7OztRQ2xIZ0IsYSxHQUFBLGE7UUFLQSxpQixHQUFBLGlCO1FBS0EsUSxHQUFBLFE7QUFYaEI7QUFDTyxTQUFTLGFBQVQsQ0FBdUIsRUFBdkIsRUFBMkIsRUFBM0IsRUFBK0I7QUFDcEMsU0FBTyxDQUFDLEtBQUssRUFBTixJQUFZLEtBQUssTUFBTCxFQUFaLEdBQTRCLEVBQW5DO0FBQ0Q7O0FBRUQ7QUFDTyxTQUFTLGlCQUFULENBQTJCLFFBQTNCLEVBQXFDO0FBQzFDLFNBQU8sS0FBSyxHQUFMLENBQVMsS0FBSyxNQUFMLEVBQVQsSUFBMEIsRUFBRSxJQUFJLFFBQU4sQ0FBakM7QUFDRDs7QUFFRDtBQUNPLFNBQVMsUUFBVCxDQUFrQixFQUFsQixFQUFzQixFQUF0QixFQUEwQixFQUExQixFQUE4QixFQUE5QixFQUFrQztBQUN2QyxTQUFPLEtBQUssSUFBTCxDQUFVLENBQUMsS0FBSyxFQUFOLEtBQWEsS0FBSyxFQUFsQixJQUF3QixDQUFDLEtBQUssRUFBTixLQUFhLEtBQUssRUFBbEIsQ0FBbEMsQ0FBUDtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IHJhbmRvbVVuaWZvcm0gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgcmFuZG9tRXhwb25lbnRpYWwgfSBmcm9tICcuL3V0aWwnO1xuXG5jbGFzcyBDZWxsIHtcbiAgY29uc3RydWN0b3IoeCwgeSwgY29udGFpbmVyKSB7XG4gICAgdGhpcy5zcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvY2VsbC5wbmcnKTtcbiAgICB0aGlzLnNwcml0ZS5wb3NpdGlvbi5zZXQoeCwgeSk7XG4gICAgdGhpcy5zcHJpdGUucm90YXRpb24gPSByYW5kb21Vbmlmb3JtKDAsIDIgKiBNYXRoLlBJKTtcbiAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IDAuODtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLmNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLnNwcml0ZSk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbiA9IHJhbmRvbVVuaWZvcm0oMCwgMiAqIE1hdGguUEkpO1xuICAgIHRoaXMuc3BlZWQgPSByYW5kb21FeHBvbmVudGlhbCguMDMpO1xuICAgIHRoaXMubGlmZXNwYW4gPSByYW5kb21FeHBvbmVudGlhbCg2MCAqIDUpO1xuICB9XG5cbiAgZ2V0WCgpIHtcbiAgICByZXR1cm4gdGhpcy5zcHJpdGUucG9zaXRpb24ueDtcbiAgfVxuXG4gIGdldFkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ByaXRlLnBvc2l0aW9uLnk7XG4gIH1cblxuICBzcGxpdCgpIHtcbiAgICBjb25zdCBkeCA9IHJhbmRvbVVuaWZvcm0oLTE1LCAxNSk7XG4gICAgY29uc3QgZHkgPSByYW5kb21Vbmlmb3JtKC0xNSwgMTUpO1xuICAgIGNvbnN0IGMgPSBuZXcgQ2VsbCh0aGlzLmdldFgoKSArIGR4LCB0aGlzLmdldFkoKSArIGR5LCB0aGlzLmNvbnRhaW5lcik7XG4gICAgYy5zcHJpdGUudGludCA9IHRoaXMuc3ByaXRlLnRpbnQ7XG4gICAgcmV0dXJuIGM7XG4gIH1cblxuICBzdGVwKCkge1xuICAgIGNvbnN0IGR4ID0gTWF0aC5zaW4odGhpcy5kaXJlY3Rpb24pICogdGhpcy5zcGVlZDtcbiAgICBjb25zdCBkeSA9IE1hdGguY29zKHRoaXMuZGlyZWN0aW9uKSAqIHRoaXMuc3BlZWQ7XG4gICAgdGhpcy5kaXJlY3Rpb24gKz0gcmFuZG9tVW5pZm9ybSgtMC4wMSwgMC4wMSk7XG4gICAgdGhpcy5zcHJpdGUucG9zaXRpb24uc2V0KHRoaXMuZ2V0WCgpICsgZHgsIHRoaXMuZ2V0WSgpICsgZHkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENlbGw7XG4iLCJpbXBvcnQgeyByYW5kb21Vbmlmb3JtIH0gZnJvbSAnLi91dGlsJztcblxuY2xhc3MgQ29sb3JSdW5uZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLlJ4ID0gcmFuZG9tVW5pZm9ybSgwLCAxMDAwKTtcbiAgICB0aGlzLkd4ID0gcmFuZG9tVW5pZm9ybSgwLCAxMDAwKTtcbiAgICB0aGlzLkJ4ID0gcmFuZG9tVW5pZm9ybSgwLCAxMDAwKTtcblxuICAgIHRoaXMuc3RlcCA9IDEwO1xuICB9XG5cbiAgcmVxdWVzdENvbG9ySGV4KCkge1xuICAgIHRoaXMuUnggKz0gdGhpcy5zdGVwO1xuICAgIHRoaXMuR3ggKz0gdGhpcy5zdGVwO1xuICAgIHRoaXMuQnggKz0gdGhpcy5zdGVwO1xuXG4gICAgbGV0IFIgPSBNYXRoLmFicyhNYXRoLnNpbih0aGlzLlJ4ICogLjAxMjUpICogMTI1KSArIDEyNTtcbiAgICBsZXQgRyA9IE1hdGguYWJzKE1hdGguc2luKHRoaXMuR3ggKiAuMDIxNSkgKiAxMjUpICsgMTI1O1xuICAgIGxldCBCID0gTWF0aC5hYnMoTWF0aC5zaW4odGhpcy5CeCAqIC4wMDkyKSAqIDEyNSkgKyAxMjU7XG5cbiAgICBsZXQgaGV4ID0gJzB4JyArIHRoaXMucmdiVG9IZXgoUiwgRywgQik7XG4gICAgcmV0dXJuIGhleDtcbiAgfVxuXG4gIC8vIGNvZGUgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9scnZpY2svMjA4MDY0OFxuICByZ2JUb0hleChyLCBnLCBiKSB7XG4gICAgdmFyIGJpbiA9IHIgPDwgMTYgfCBnIDw8IDggfCBiO1xuICAgIHJldHVybiAoZnVuY3Rpb24gKGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheSg3IC0gaC5sZW5ndGgpLmpvaW4oJzAnKSArIGg7XG4gICAgICB9KShiaW4udG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkpO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sb3JSdW5uZXI7XG4iLCJpbXBvcnQgQ2VsbCBmcm9tICcuL2NlbGwnO1xuaW1wb3J0IENvbG9yUnVubmVyIGZyb20gJy4vY29sb3InO1xuaW1wb3J0IHsgcmFuZG9tRXhwb25lbnRpYWwsIGRpc3RhbmNlIH0gZnJvbSAnLi91dGlsJztcblxuLy8gU2V0IHVwIGNhbnZhcy5cbmNvbnN0IHJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoc2NyZWVuLndpZHRoLCBzY3JlZW4uaGVpZ2h0LFxuICB7IGJhY2tncm91bmRDb2xvcjogMHgwQTBGMjggfSk7XG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLnZpZXcpO1xuY29uc3Qgc3RhZ2UgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbmNvbnN0IGNvbG9yUnVubmVyID0gbmV3IENvbG9yUnVubmVyKCk7XG5sZXQgY2VsbHMgPSBbXTtcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5cbi8vIEZ1bGwgc2NyZWVuIGJ1dHRvbi5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmdWxsc2NyZWVuLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIDtjb25zdCByZnMgPSBjYW52YXMucmVxdWVzdEZ1bGxzY3JlZW5cbiAgICAgIHx8IGNhbnZhcy53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlblxuICAgICAgfHwgY2FudmFzLm1velJlcXVlc3RGdWxsU2NyZWVuXG4gICAgICB8fCBjYW52YXMubXNSZXF1ZXN0RnVsbHNjcmVlbjtcbiAgICByZnMuY2FsbChjYW52YXMpO1xuICB9KTtcblxuLy8gUmVzZXQgY29tbWFuZC5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSA4MiAmJiBlLmFsdEtleSkge1xuICAgICAgY2VsbHMuZm9yRWFjaChjID0+IHtcbiAgICAgICAgc3RhZ2UucmVtb3ZlQ2hpbGQoYy5zcHJpdGUpO1xuICAgICAgfSk7XG4gICAgICBjZWxscyA9IFtdO1xuICAgIH1cbiAgfSk7XG5cbi8vIENyZWF0ZSBiYWN0ZXJpdW0gb24gY2xpY2suXG5yZW5kZXJlci52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgIGNvbnN0IGMgPSBuZXcgQ2VsbChlLngsIGUueSwgc3RhZ2UpO1xuICAgIGMuc3ByaXRlLnRpbnQgPSBjb2xvclJ1bm5lci5yZXF1ZXN0Q29sb3JIZXgoKTtcbiAgICBjZWxscy5wdXNoKGMpO1xuXG4gICAgZ2VuZXJhdGVDcmVhdGVQaW5nKCk7XG4gIH0pO1xuXG4vLyBUcmFjayBtb3VzZSBtb3ZlbWVudHMgZm9yIHNjYWxpbmcgZWZmZWN0LlxucmVuZGVyZXIudmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcbiAgICBtb3VzZVggPSBlLnBhZ2VYO1xuICAgIG1vdXNlWSA9IGUucGFnZVk7XG4gIH0pO1xuXG52YXIgbWV0ZXIgPSBuZXcgRlBTTWV0ZXIoKTtcblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuXG4gIGNlbGxzLmZvckVhY2goKGMsIGkpID0+IHtcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC4wMDQpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjAwMDQpIHtcbiAgICAgICAgICBnZW5lcmF0ZVNwbGl0UGluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3Q2VsbCA9IGMuc3BsaXQoKTtcbiAgICAgICAgY2VsbHMucHVzaChuZXdDZWxsKTtcbiAgICAgIH1cblxuICAgICAgLy8gY2hlY2sgbW91c2UgbG9jYXRpb25cbiAgICAgIGNvbnN0IGQgPSBkaXN0YW5jZShtb3VzZVgsIG1vdXNlWSwgYy5nZXRYKCksIGMuZ2V0WSgpKTtcbiAgICAgIGlmIChkIDwgNTApIHtcbiAgICAgICAgYy5zcHJpdGUuc2NhbGUuc2V0KE1hdGgubWluKDUwIC8gZCwgMikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYy5zcHJpdGUuc2NhbGUuc2V0KDEpO1xuICAgICAgfVxuXG4gICAgICBjLnN0ZXAoKTtcblxuICAgICAgaWYgKGMubGlmZXNwYW4tLSA8PSAwKSB7XG4gICAgICAgIC8vIGtpbGwgaWYgZW5kIG9mIGxpZmVcbiAgICAgICAgY2VsbHMuc3BsaWNlKGksIDEpO1xuICAgICAgICBzdGFnZS5yZW1vdmVDaGlsZChjLnNwcml0ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLy8gcmVuZGVyIHRoZSBjb250YWluZXJcbiAgbWV0ZXIudGljaygpO1xuICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xufVxuXG5hbmltYXRlKCk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ3JlYXRlUGluZygpIHtcbiAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjI1KSB7XG4gICAgc29ja2V0UG9ydC5zZW5kKHtcbiAgICAgICAgYWRkcmVzczogJy9jcmVhdGUnLFxuICAgICAgICBhcmdzOiAxLFxuICAgICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVTcGxpdFBpbmcoKSB7XG4gIHNvY2tldFBvcnQuc2VuZCh7XG4gICAgICBhZGRyZXNzOiAnL3NwbGl0JyxcbiAgICAgIGFyZ3M6IDEsXG4gICAgfSk7XG59XG5cbi8vIFNldCB1cCBXZWJTb2NrZXQuXG5sZXQgc29ja2V0UG9ydCA9IG5ldyBvc2MuV2ViU29ja2V0UG9ydCh7XG4gICAgdXJsOiAnd3M6Ly9sb2NhbGhvc3Q6ODAwMCcsIC8vIFVSTCB0byB5b3VyIFdlYiBTb2NrZXQgc2VydmVyLlxuICB9KTtcbnNvY2tldFBvcnQub3BlbigpO1xuXG5zb2NrZXRQb3J0Lm9uKCdyZWFkeScsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZygnQnJvd3NlciBwb3J0IHJlYWR5IScpO1xuXG4gICAgZ2VuZXJhdGVDcmVhdGVQaW5nKCk7XG4gIH0pO1xuXG5zb2NrZXRQb3J0Lm9uKCdtZXNzYWdlJywgKG9zY01zZykgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdCcm93c2VyIHJlY2VpdmVkIE9TQyBmcm9tIE1heDogJywgb3NjTXNnKTtcblxuICAgIGNvbnN0IGNlbGwgPSBuZXcgQ2VsbChvc2NNc2cuYXJnc1swXSwgb3NjTXNnLmFyZ3NbMV0sIHN0YWdlKTtcbiAgICBjZWxsLnNwcml0ZS50aW50ID0gY29sb3JSdW5uZXIucmVxdWVzdENvbG9ySGV4KCk7XG4gICAgY2VsbHMucHVzaChjZWxsKTtcblxuICAgIGdlbmVyYXRlQ3JlYXRlUGluZygpO1xuICB9KTtcbiIsIi8vIFJldHVybiBhIHJhbmRvbSBudW1iZXIgaW4gW2xvLCBoaSlcbmV4cG9ydCBmdW5jdGlvbiByYW5kb21Vbmlmb3JtKGxvLCBoaSkge1xuICByZXR1cm4gKGhpIC0gbG8pICogTWF0aC5yYW5kb20oKSArIGxvO1xufVxuXG4vLyBSZXR1cm4gYW4gZXhwb25lbnRpYWxseSBkaXN0cmlidXRlZCByYW5kb20gbnVtYmVyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tRXhwb25lbnRpYWwoZXhwZWN0ZWQpIHtcbiAgcmV0dXJuIE1hdGgubG9nKE1hdGgucmFuZG9tKCkpIC8gLSgxIC8gZXhwZWN0ZWQpO1xufVxuXG4vLyBSZXR1cm4gdGhlIEV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMuXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcbiAgcmV0dXJuIE1hdGguc3FydCgoeDEgLSB4MikgKiAoeDEgLSB4MikgKyAoeTEgLSB5MikgKiAoeTEgLSB5MikpO1xufVxuIl19
