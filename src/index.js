// Orbits, a game about space ships

import { Engine, Render, World, Vector, Body, Bodies } from 'matter-js'
import Planet from './planet'
import Spaceship from './spaceship'

const gravityConstant = 1

let engine = Engine.create()
engine.world.gravity.y = 0

let render = Render.create({
  element: document.body,
  engine: engine,
  options: { 
    width: window.innerWidth,
    height: window.innerHeight
  }
})

let planets = [{ x: 400, y: 300, opts: { isStatic: true } }, { x: 400, y: 600 }]
  .map(planet => new Planet(planet.x, planet.y, planet.opts))

let ship = new Spaceship(100, 100)

let things = planets.concat(ship).map(thing => thing.body)

console.log(things)

World.add(engine.world, things)

Body.setVelocity(planets[1].body, Vector.create(0.6, 0))

Render.run(render)

let done = false

tick()

function tick (lastTime) {
  applyGravityToBodies(things)
  window.requestAnimationFrame(tick)
  Engine.update(engine, lastTime ? (performance.now() - lastTime) * 10 : 1000 / 60)
}

function applyGravityToBodies (bodies) {
  for (let i = 0; i < bodies.length; i++) {
    if (bodies[i].isStatic) continue
    let forceSum = Vector.create(0, 0)
    
    for (let j = 0; j < bodies.length; j++) {
      if (j === i) continue
      
      let thisBody = bodies[i]
      let otherBody = bodies[j]
      let xDist = thisBody.position.x - otherBody.position.x
      let yDist = thisBody.position.y - otherBody.position.y
      let distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
      
      let forceMag = gravityConstant * (thisBody.mass * otherBody.mass) / Math.pow(distance, 2)
    
      forceSum.x -= Math.abs(forceMag * (xDist / distance)) * Math.sign(xDist)
      forceSum.y -= Math.abs(forceMag * (yDist / distance)) * Math.sign(yDist)
    }
    
    let thisBody = bodies[i]
    Body.setVelocity(thisBody, {
      x: thisBody.velocity.x + forceSum.x / thisBody.mass,
      y: thisBody.velocity.y + forceSum.y / thisBody.mass
    })
  }
}