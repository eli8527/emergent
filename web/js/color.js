import { randomUniform } from './util';

class ColorRunner {
  constructor() {
    this.Rx = randomUniform(0, 1000);
    this.Gx = randomUniform(0, 1000);
    this.Bx = randomUniform(0, 1000);

    this.step = 10;
  }

  requestColorHex() {
    this.Rx += this.step;
    this.Gx += this.step;
    this.Bx += this.step;

    let R = Math.abs(Math.sin(this.Rx * .0125) * 125) + 125;
    let G = Math.abs(Math.sin(this.Gx * .0215) * 125) + 125;
    let B = Math.abs(Math.sin(this.Bx * .0092) * 125) + 125;

    let hex = '0x' + this.rgbToHex(R, G, B);
    return hex;
  }

  // code from https://gist.github.com/lrvick/2080648
  rgbToHex(r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join('0') + h;
      })(bin.toString(16).toUpperCase());
  }

}

export default ColorRunner;
