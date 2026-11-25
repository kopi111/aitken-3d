import * as THREE from 'three'
import { PALETTE } from './Palette.js'

function box(width, height, depth, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
  mesh.position.set(x, y, z)
  return mesh
}

export default class CarModel {
  constructor(scene, matcaps, vehiclePhysics) {
    this.physics = vehiclePhysics
    this.body = this.buildBody(matcaps)
    this.wheels = [0, 1, 2, 3].map(() => this.buildWheel(matcaps))
    scene.add(this.body, ...this.wheels)
  }

  buildBody(matcaps) {
    const gold = matcaps.get(PALETTE.gold)
    const deep = matcaps.get(PALETTE.goldDeep)
    const glass = matcaps.get(PALETTE.ink)
    const light = matcaps.get(PALETTE.cream)
    const group = new THREE.Group()
    group.add(
      box(2.0, 0.42, 1.0, gold, 0, 0.42, 0),
      box(1.0, 0.36, 0.86, glass, -0.15, 0.8, 0),
      box(1.04, 0.06, 0.9, deep, -0.15, 1.0, 0),
      box(0.06, 0.12, 0.22, light, 1.0, 0.48, 0.3),
      box(0.06, 0.12, 0.22, light, 1.0, 0.48, -0.3),
      box(0.3, 0.08, 1.04, deep, -0.95, 0.3, 0),
    )
    return group
  }

  buildWheel(matcaps) {
    const wheel = new THREE.Group()
    const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.22, 16).rotateX(Math.PI / 2), matcaps.get(PALETTE.ink))
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 10).rotateX(Math.PI / 2), matcaps.get(PALETTE.gold))
    wheel.add(tyre, hub)
    return wheel
  }

  update() {
    this.body.position.copy(this.physics.position)
    this.body.quaternion.copy(this.physics.quaternion)
    this.wheels.forEach((wheel, index) => {
      const transform = this.physics.wheelTransform(index)
      wheel.position.copy(transform.position)
      wheel.quaternion.copy(transform.quaternion)
    })
  }
}
