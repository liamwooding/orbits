import { World, Bodies, Body, Events, Vector } from 'matter-js'
import { engine } from './index.js'
import { Input } from './input'

const defaults = {
  size: 5,
  mass: 1,
  frictionAir: 0
}

const config = {
  rotateLimit: 0.1
}

export default class Spaceship {
  constructor (x = 0, y = 0, opts = {}) {
    let planetOpts = Object.assign({}, defaults, opts)
    this._body = Bodies.fromVertices(x, y, [{x: 2, y: 6}, {x: 4, y: 0}, {x: 0, y: 0}], planetOpts)

    let lastTimestamp = 0
    Events.on(engine, 'beforeUpdate', e => {
      let dt = e.timestamp - lastTimestamp
      lastTimestamp = e.timestamp

      let angularDamping = dt / 1000
      if (!Input.keys.ArrowLeft && this.body.angularVelocity < 0) {
        let newAngularVelocity = this.body.angularVelocity + angularDamping
        if (newAngularVelocity > 0) newAngularVelocity = 0
        Body.setAngularVelocity(this.body, newAngularVelocity)
      } else if (!Input.keys.ArrowRight && this.body.angularVelocity > 0) {
        let newAngularVelocity = this.body.angularVelocity - angularDamping
        if (newAngularVelocity < 0) newAngularVelocity = 0
        Body.setAngularVelocity(this.body, newAngularVelocity)
      }

      if (Input.keys.ArrowUp) this.thrust()
      if (Input.keys.ArrowLeft) this.rotate('left')
      if (Input.keys.ArrowRight) this.rotate('right')
    })
  }

  get body () {
    return this._body
  }

  thrust (force = 0.0001) {
    Body.applyForce(this.body, this.body.position, Vector.rotate(Vector.create(0, force), this.body.angle))
  }

  rotate (direction, force = 0.1) {
    let angularVelocity = this.body.angularVelocity + (direction === 'right' ? force : 0 - force)
    if (angularVelocity > config.rotateLimit) angularVelocity = config.rotateLimit
    else if (angularVelocity < -config.rotateLimit) angularVelocity = -config.rotateLimit
    Body.setAngularVelocity(this.body, angularVelocity)
  }
}