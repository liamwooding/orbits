import { World, Bodies, Body, Events, Vector } from 'matter-js'
import { Gravity } from './gravity'
import { engine } from './index.js'

export default class OrbitProjector {
  constructor (body) {
    this._body = Bodies.circle(body.position.x, body.position.y, 10, {
      isSensor: true,
      isProjector: true,
      timeMultiplier: 10
    })
    World.addBody(engine.world, this.body)
    Gravity.addBodies(this.body)
  }

  get body () {
    return this._body
  }

  set body (body) {
    this._body = body
  }
}