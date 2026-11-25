import * as THREE from 'three'
import { PALETTE } from './Palette.js'

const PULSE_SPEED = 3

function outlineGeometry(width, depth) {
  const halfX = width / 2
  const halfZ = depth / 2
  const thickness = 0.12
  const shape = new THREE.Shape()
  shape.moveTo(-halfX, -halfZ); shape.lineTo(halfX, -halfZ); shape.lineTo(halfX, halfZ); shape.lineTo(-halfX, halfZ)
  const hole = new THREE.Path()
  hole.moveTo(-halfX + thickness, -halfZ + thickness); hole.lineTo(-halfX + thickness, halfZ - thickness)
  hole.lineTo(halfX - thickness, halfZ - thickness); hole.lineTo(halfX - thickness, -halfZ + thickness)
  shape.holes.push(hole)
  return new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2)
}

export default class Zone {
  constructor(scene, { position, width, depth, title, onEnter }) {
    this.center = new THREE.Vector2(position.x, position.z)
    this.halfSize = new THREE.Vector2(width / 2, depth / 2)
    this.title = title
    this.onEnter = onEnter
    this.isInside = false
    this.outline = new THREE.Mesh(outlineGeometry(width, depth), new THREE.MeshBasicMaterial({ color: PALETTE.gold, transparent: true, depthWrite: false }))
    this.fill = new THREE.Mesh(new THREE.PlaneGeometry(width, depth).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: PALETTE.gold, transparent: true, opacity: 0, depthWrite: false }))
    this.outline.position.set(position.x, 0.03, position.z)
    this.fill.position.set(position.x, 0.025, position.z)
    scene.add(this.outline, this.fill)
  }

  contains(position) {
    return Math.abs(position.x - this.center.x) < this.halfSize.x && Math.abs(position.z - this.center.y) < this.halfSize.y
  }

  update(carPosition, elapsed) {
    this.isInside = this.contains(carPosition)
    const pulse = 0.5 + 0.5 * Math.sin(elapsed * PULSE_SPEED)
    this.outline.material.opacity = this.isInside ? 1 : 0.45 + pulse * 0.35
    this.fill.material.opacity = this.isInside ? 0.18 : 0
  }
}
