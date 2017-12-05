import { Events, Vector, Body } from 'matter-js'
const gravityConstant = 0.2

class GravityController {
  init (engine) {
    this._engine = engine
    this._bodies = []
    this.addBody = this.addBodies
    let lastTimestamp = 0
    
    Events.on(this._engine, 'beforeUpdate', e => {
      this.applyGravityToBodies(e.timestamp - lastTimestamp)
      lastTimestamp = e.timestamp
    })
  }

  applyGravityToBodies (deltaTime) {
    for (let i = 0; i < this.bodies.length; i++) {
      if (this.bodies[i].isStatic) continue
      let forceSum = Vector.create(0, 0)
      let timeMultiplier = this.bodies[i].isProjector ? this.bodies[i].timeMultiplier : 1
      
      for (let j = 0; j < this.bodies.length; j++) {
        if (j === i || !this.bodies[j].hasGravity) continue
        
        let thisBody = this.bodies[i]
        let otherBody = this.bodies[j]

        let xDist = thisBody.position.x - otherBody.position.x
        let yDist = thisBody.position.y - otherBody.position.y
        let distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
        
        let forceMag = gravityConstant * (thisBody.mass * otherBody.mass) / Math.pow(distance, 2)
      
        forceSum.x -= ((Math.abs(forceMag * (xDist / distance)) * Math.sign(xDist)) * deltaTime) * timeMultiplier
        forceSum.y -= ((Math.abs(forceMag * (yDist / distance)) * Math.sign(yDist)) * deltaTime) * timeMultiplier
      }
      
      let thisBody = this.bodies[i]
      Body.setVelocity(thisBody, {
        x: thisBody.velocity.x + forceSum.x / thisBody.mass,
        y: thisBody.velocity.y + forceSum.y / thisBody.mass
      })
    }
  }

  addBodies (bodies) {
    if (!Array.isArray(bodies)) bodies = [bodies]
    bodies = bodies.filter(body => !this._bodies.some(b => b.id === body.id))
    this._bodies = this._bodies.concat(bodies)
  }

  get bodies () {
    return this._bodies
  }
}

export let Gravity = new GravityController()