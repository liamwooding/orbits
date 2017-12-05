import { World, Bodies } from 'matter-js'
import engine from './index.js'

const defaults = {
  size: 100,
  mass: 100,
  frictionAir: 0,
  hasGravity: true
}

export default class Planet {
  constructor (x = 0, y = 0, opts = {}) {
    let planetOpts = Object.assign({}, defaults, opts)
    this._body = Bodies.circle(x, y, planetOpts.size, planetOpts)
  }

  get body () {
    return this._body
  }

  set body (body) {
    this._body = body
  }

  init (engine) {
    World.add(engine.world, this._body)
    return this
  }
}