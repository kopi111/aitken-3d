import * as CANNON from 'cannon-es'
import VehiclePhysics from '../src/world/VehiclePhysics.js'
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -13, 0) })
const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(200, 1, 200)), position: new CANNON.Vec3(0, -1, 0) })
world.addBody(ground)
const car = new VehiclePhysics(world, new CANNON.Vec3(0, 0.6, 0))
for (let i = 0; i < 120; i++) { world.step(1/60); if (i%20==0) { const w=car.vehicle.wheelInfos[0]; console.log(i, car.position.y.toFixed(3), w.isInContact, w.suspensionLength.toFixed(3), w.suspensionForce.toFixed(1)) } }
const w = car.vehicle.wheelInfos[0]
const d = car.vehicle.castRay(w)
console.log('depth', d, 'src', w.chassisConnectionPointWorld, 'dir', w.directionWorld, 'hit', w.raycastResult.hasHit, w.raycastResult.body?.id, 'chassis', car.chassisBody.id)
const tgt = w.chassisConnectionPointWorld.vadd(w.directionWorld.scale(0.35))
const rr = new CANNON.RaycastResult(); world.rayTest(w.chassisConnectionPointWorld, tgt, rr); console.log('direct', rr.hasHit, rr.body?.id, tgt)
const rr2 = new CANNON.RaycastResult(); world.raycastClosest(w.chassisConnectionPointWorld, tgt, {}, rr2); console.log('closest no opts', rr2.hasHit, rr2.body?.id)
console.log(world.bodies.map(b=>[b.id,b.type,b.collisionResponse,b.shapes[0].type]))
