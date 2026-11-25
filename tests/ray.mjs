import * as CANNON from 'cannon-es'
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -13, 0) })
const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() })
ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); world.addBody(ground)
world.step(1/60)
const r = new CANNON.RaycastResult()
console.log(world.raycastClosest(new CANNON.Vec3(0,0.15,0), new CANNON.Vec3(0,-0.3,0), {}, r), r.hasHit, r.hitPointWorld)
const r2 = new CANNON.RaycastResult(); world.rayTest(new CANNON.Vec3(0,0.15,0), new CANNON.Vec3(0,-0.3,0), r2); console.log('rayTest', r2.hasHit)
