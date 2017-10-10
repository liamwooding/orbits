import { World, Bodies, Body, Vector } from 'matter-js'
import engine from './index.js'

const defaults = {
  size: 5,
  mass: 1,
  frictionAir: 0
}

const keys = {
  38: 'up',
  40: 'down'
}

export default class Spaceship {
  constructor (x = 0, y = 0, opts = {}) {
    let planetOpts = Object.assign({}, defaults, opts)
    console.log(planetOpts)
    this._body = Bodies.polygon(x, y, 3, planetOpts.size, planetOpts)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') this.thrust(Vector.create(0, 0.0001))
      if (event.key === 'ArrowDown') this.thrust(Vector.create(0, -0.0001))
      if (event.key === 'ArrowLeft') this.rotate('left')
      if (event.key === 'ArrowRight') this.rotate('right')

      console.log('keypress event\n\n' + 'key: ' + event.key)
    })
  }

  get body () {
    return this._body
  }

  set body (body) {
    this._body = body
  }

  thrust (vector) {
    Body.applyForce(this.body, this.body.position, Vector.rotate(vector, this.body.angle))
  }

  rotate (direction, force = 0.01) {
    Body.setAngularVelocity(this.body, this.body.angularVelocity + (direction === 'right' ? force : 0 - force))
  }
}