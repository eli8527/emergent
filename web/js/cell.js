import { randomUniform } from './util';
import { randomExponential } from './util';

class Cell {
  constructor(x, y, container) {
    this.sprite = new PIXI.Sprite.fromImage('img/cell.png');
    this.sprite.position.set(x, y);
    this.sprite.rotation = randomUniform(0, 2 * Math.PI);
    this.sprite.alpha = 0.8;
    this.container = container;
    this.container.addChild(this.sprite);

    this.direction = randomUniform(0, 2 * Math.PI);
    this.speed = randomExponential(.03);
    this.lifespan = randomExponential(60 * 5);
  }

  getX() {
    return this.sprite.position.x;
  }

  getY() {
    return this.sprite.position.y;
  }

  split() {
    const dx = randomUniform(-15, 15);
    const dy = randomUniform(-15, 15);
    const c = new Cell(this.getX() + dx, this.getY() + dy, this.container);
    c.sprite.tint = this.sprite.tint;
    return c;
  }

  step() {
    const dx = Math.sin(this.direction) * this.speed;
    const dy = Math.cos(this.direction) * this.speed;
    this.direction += randomUniform(-0.01, 0.01);
    this.sprite.position.set(this.getX() + dx, this.getY() + dy);
  }
}

export default Cell;
