import { World, Bodies, Body, Events, Vector } from 'matter-js'
import { engine } from './index.js'

export default class OrbitProjector (body) {
  constructor (x = 0, y = 0, opts = {}) {
    this._body = Bodies.polygon(body.position.x, body.position.y, 3, 3, { opts: { isSensor: true } })

    startProjection()

    // let lastTimestamp = 0
    // Events.on(engine, 'beforeUpdate', e => {
    //   let dt = e.timestamp - lastTimestamp
    //   lastTimestamp = e.timestamp
    // })
  }

  startProjection () {
    World.add(engine.world, this.body)

  }

  get body () {
    return this._body
  }

  set body (body) {
    this._body = body
  }
}