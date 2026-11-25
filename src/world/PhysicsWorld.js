import * as CANNON from 'cannon-es'

const GRAVITY = -13
const FIXED_STEP = 1 / 60
const WORLD_HALF_SIZE = 70

export default class PhysicsWorld {
  constructor() {
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, GRAVITY, 0), allowSleep: true })
    this.world.defaultContactMaterial.friction = 0.25
    this.world.defaultContactMaterial.restitution = 0.2
    this.links = []
    this.addGround()
    this.addBoundaryWalls()
  }

  addGround() {
    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(WORLD_HALF_SIZE, 1, WORLD_HALF_SIZE)) })
    ground.position.set(0, -1, 0)
    this.world.addBody(ground)
  }

  addBoundaryWalls() {
    const long = WORLD_HALF_SIZE
    const walls = [[long, 0, 0, 1, long], [-long, 0, 0, 1, long], [0, 0, long, long, 1], [0, 0, -long, long, 1]]
    for (const [x, , z, halfX, halfZ] of walls) {
      const wall = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(halfX, 3, halfZ)) })
      wall.position.set(x, 3, z)
      this.world.addBody(wall)
    }
  }

  addBody(body, mesh) {
    this.world.addBody(body)
    if (mesh) this.links.push({ body, mesh })
  }

  step(deltaSeconds) {
    this.world.step(FIXED_STEP, deltaSeconds, 3)
    for (const { body, mesh } of this.links) {
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
    }
  }
}
