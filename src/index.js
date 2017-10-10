// Orbits, a game about space ships

import { Engine, Render, World, Vector, Body, Bodies } from 'matter-js'
import Planet from './planet'

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
  .map(planet => new Planet(planet.x, planet.y, planet.opts).body)

console.log(planets)

World.add(engine.world, planets)

Body.setVelocity(planets[1], Vector.create(0.6, 0))

Render.run(render)

let done = false

tick()



// forAllPairs(planets, emitGravity)

function tick (lastTime) {
  applyGravityToBodies(planets)
  window.requestAnimationFrame(tick)
  Engine.update(engine, lastTime ? (performance.now() - lastTime) * 10 : 1000 / 60)
}

function forAllPairs (array, iterator) { // this don't work good yet
  array.slice(0, -1).forEach((planet, i) => {
    array.slice(i, -1).forEach((planet, j) => {
      iterator(array[i], array[j + 1])
    })
  })
}


function applyGravityToBodies (bodies) {
  for (let i = 0; i < bodies.length; i++) {
    let thisBody = bodies[i]
    if (!done) console.log('thisBody outer',thisBody, thisBody.isStatic)
    if (thisBody.isStatic) continue
    let forceSum = Vector.create(0, 0)

    
    for (let j = 0; j < bodies.length; j++) {
      if (j === i) continue
      
      let thisBody = bodies[i]
      let otherBody = bodies[j]
      if (!done) console.log('thisBody outer',thisBody)
      if (!done) console.log('otherBody outer',otherBody)
      done = true
      let xDist = thisBody.position.x - otherBody.position.x
      let yDist = thisBody.position.y - otherBody.position.y
      let distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
      
      let forceMag = gravityConstant * (thisBody.mass * otherBody.mass) / Math.pow(distance, 2)
    
      forceSum.x -= Math.abs(forceMag * (xDist / distance)) * Math.sign(xDist)
      forceSum.y -= Math.abs(forceMag * (yDist / distance)) * Math.sign(yDist)
    }
    
    Body.setVelocity(thisBody, {
      x: thisBody.velocity.x + forceSum.x / thisBody.mass,
      y: thisBody.velocity.y + forceSum.y / thisBody.mass
    })
  }
}