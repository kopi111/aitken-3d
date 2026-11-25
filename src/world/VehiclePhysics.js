import * as CANNON from 'cannon-es'

const CHASSIS = { length: 2.03, width: 1.02, height: 0.7, mass: 40, liftOffset: 0.35 }
const WHEEL = { radius: 0.25, frontX: 0.635, backX: -0.475, halfTrack: 0.42 }
const DRIVE = {
  engineForce: 300,
  boostEngineForce: 520,
  maxSpeed: 11,
  boostMaxSpeed: 20,
  steeringMax: Math.PI * 0.17,
  steeringSpeed: 2.2,
  brakeForce: 1.4,
  coastDrag: 0.1,
}
const FRONT_WHEELS = [0, 1]
const BACK_WHEELS = [2, 3]

export default class VehiclePhysics {
  constructor(world, spawnPosition) {
    this.world = world
    this.spawnPosition = spawnPosition.clone()
    this.steering = 0
    this.forwardSpeed = 0
    this.chassisBody = this.createChassis()
    this.vehicle = this.createVehicle()
    this.vehicle.addToWorld(world)
    this.watchForFlip()
  }

  createChassis() {
    const halfExtents = new CANNON.Vec3(CHASSIS.length / 2, CHASSIS.height / 2, CHASSIS.width / 2)
    const body = new CANNON.Body({ mass: CHASSIS.mass, allowSleep: false })
    body.addShape(new CANNON.Box(halfExtents), new CANNON.Vec3(0, CHASSIS.liftOffset, 0))
    body.position.copy(this.spawnPosition)
    return body
  }

  createVehicle() {
    const vehicle = new CANNON.RaycastVehicle({ chassisBody: this.chassisBody })
    const corners = [
      [WHEEL.frontX, WHEEL.halfTrack], [WHEEL.frontX, -WHEEL.halfTrack],
      [WHEEL.backX, WHEEL.halfTrack], [WHEEL.backX, -WHEEL.halfTrack],
    ]
    for (const [x, z] of corners) vehicle.addWheel(this.wheelOptions(x, z))
    return vehicle
  }

  wheelOptions(x, z) {
    return {
      radius: WHEEL.radius,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      axleLocal: new CANNON.Vec3(0, 0, 1),
      chassisConnectionPointLocal: new CANNON.Vec3(x, 0, z),
      suspensionStiffness: 50,
      suspensionRestLength: 0.1,
      frictionSlip: 10,
      dampingRelaxation: 1.8,
      dampingCompression: 1.5,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      maxSuspensionTravel: 0.3,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true,
    }
  }

  get position() { return this.chassisBody.position }
  get quaternion() { return this.chassisBody.quaternion }
  get speed() { return this.chassisBody.velocity.length() }

  wheelTransform(index) {
    this.vehicle.updateWheelTransform(index)
    return this.vehicle.wheelInfos[index].worldTransform
  }

  drive(input, deltaSeconds) {
    this.updateForwardSpeed()
    this.steer(input, deltaSeconds)
    this.accelerate(input)
    this.applyBrake(input)
    this.coast(input)
  }

  updateForwardSpeed() {
    const forward = this.chassisBody.vectorToWorldFrame(new CANNON.Vec3(1, 0, 0))
    this.forwardSpeed = forward.dot(this.chassisBody.velocity)
  }

  steer(input, deltaSeconds) {
    const target = (input.left ? 1 : 0) - (input.right ? 1 : 0)
    const step = DRIVE.steeringSpeed * deltaSeconds
    const desired = target * DRIVE.steeringMax
    const difference = desired - this.steering
    this.steering += Math.sign(difference) * Math.min(Math.abs(difference), step)
    for (const index of FRONT_WHEELS) this.vehicle.setSteeringValue(this.steering, index)
  }

  accelerate(input) {
    const direction = (input.forward ? 1 : 0) - (input.backward ? 1 : 0)
    const maxSpeed = input.boost ? DRIVE.boostMaxSpeed : DRIVE.maxSpeed
    const force = input.boost ? DRIVE.boostEngineForce : DRIVE.engineForce
    const atTopSpeed = Math.sign(this.forwardSpeed) === direction && Math.abs(this.forwardSpeed) > maxSpeed
    const engine = atTopSpeed ? 0 : direction * force
    for (const index of BACK_WHEELS) this.vehicle.applyEngineForce(engine, index)
  }

  applyBrake(input) {
    const brake = input.brake ? DRIVE.brakeForce : 0
    for (let index = 0; index < 4; index++) this.vehicle.setBrake(brake, index)
  }

  coast(input) {
    if (input.forward || input.backward) return
    const drag = this.chassisBody.velocity.clone().scale(-DRIVE.coastDrag * CHASSIS.mass / 60)
    drag.y = 0
    this.chassisBody.applyImpulse(drag)
  }

  jump(strength = 150) {
    this.chassisBody.applyImpulse(new CANNON.Vec3(0, strength, 0), this.chassisBody.position.vadd(new CANNON.Vec3(0.1, 0, 0)))
  }

  reset() {
    this.chassisBody.position.copy(this.spawnPosition)
    this.chassisBody.quaternion.set(0, 0, 0, 1)
    this.chassisBody.velocity.setZero()
    this.chassisBody.angularVelocity.setZero()
  }

  watchForFlip() {
    let upsideDownSince = null
    this.world.addEventListener('postStep', () => {
      const up = this.chassisBody.vectorToWorldFrame(new CANNON.Vec3(0, 1, 0))
      if (up.y > 0.5) { upsideDownSince = null; return }
      upsideDownSince ??= performance.now()
      if (performance.now() - upsideDownSince > 1000) { this.jump(); upsideDownSince = null }
    })
  }
}
