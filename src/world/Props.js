import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export default class Props {
  constructor({ scene, physics, shadows, matcaps }) {
    this.scene = scene
    this.physics = physics
    this.shadows = shadows
    this.matcaps = matcaps
  }

  crate(position, size, color, mass = 1) {
    const half = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
    const body = new CANNON.Body({ mass, shape: new CANNON.Box(half), sleepSpeedLimit: 0.2 })
    body.position.set(position.x, position.y ?? size.y / 2, position.z)
    if (position.rotation) body.quaternion.setFromEuler(0, position.rotation, 0)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), this.matcaps.get(color))
    this.place(body, mesh, size.x, size.z)
    return body
  }

  pin(position, color) {
    const body = new CANNON.Body({ mass: 0.4, sleepSpeedLimit: 0.2 })
    body.addShape(new CANNON.Cylinder(0.18, 0.24, 0.9, 10), new CANNON.Vec3(0, 0.45, 0))
    body.position.set(position.x, 0, position.z)
    const mesh = new THREE.Group()
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.9, 14), this.matcaps.get(color))
    base.position.y = 0.45
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), this.matcaps.get(color))
    head.position.y = 1.0
    mesh.add(base, head)
    this.place(body, mesh, 0.5, 0.5)
  }

  staticBlock(position, size, color) {
    const body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)) })
    body.position.set(position.x, size.y / 2, position.z)
    if (position.rotation) body.quaternion.setFromEuler(0, position.rotation, 0)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), this.matcaps.get(color))
    this.place(body, mesh, size.x, size.z, 0.35)
    return mesh
  }

  place(body, mesh, width, depth, shadowStrength) {
    this.scene.add(mesh)
    this.physics.addBody(body, mesh)
    this.shadows.add(body, width, depth, shadowStrength)
  }
}
