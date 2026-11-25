import * as CANNON from 'cannon-es'
import VehiclePhysics from '../src/world/VehiclePhysics.js'
globalThis.performance ??= { now: () => Date.now() }
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -13, 0) })
world.defaultContactMaterial.friction = 0
const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(200, 1, 200)), position: new CANNON.Vec3(0, -1, 0) })
world.addBody(ground)
const car = new VehiclePhysics(world, new CANNON.Vec3(0, 0.6, 0))
const run = (input, secs, label) => { for (let i = 0; i < secs * 60; i++) { car.drive(input, 1/60); world.step(1/60) }
  const p = car.position; const f = car.chassisBody.vectorToWorldFrame(new CANNON.Vec3(1,0,0))
  console.log(label.padEnd(14), 'pos', p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2), 'fwd', f.x.toFixed(2), f.z.toFixed(2), 'speed', car.forwardSpeed.toFixed(2)) }
run({}, 1, 'settle')
run({ forward: true }, 2, 'forward 2s')
run({ forward: true, boost: true }, 2, 'boost 2s')
run({ forward: true, left: true }, 1.5, 'left 1.5s')
run({}, 2, 'coast 2s')
run({ brake: true }, 1, 'brake')
run({ backward: true }, 1.5, 'reverse')
