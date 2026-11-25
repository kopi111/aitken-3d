import * as THREE from 'three'
import { PALETTE } from './Palette.js'

const SHADOW_HEIGHT = 0.01
const FADE_HEIGHT = 4

function softSquareTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d')
  context.filter = 'blur(10px)'
  context.fillStyle = '#fff'
  context.fillRect(size * 0.18, size * 0.18, size * 0.64, size * 0.64)
  return new THREE.CanvasTexture(canvas)
}

export default class BlobShadows {
  constructor(scene) {
    this.scene = scene
    this.items = []
    this.texture = softSquareTexture()
    this.geometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
  }

  add(target, width, depth, strength = 0.55) {
    const material = new THREE.MeshBasicMaterial({
      color: PALETTE.shadow, alphaMap: this.texture, transparent: true, depthWrite: false, opacity: strength,
    })
    const mesh = new THREE.Mesh(this.geometry, material)
    mesh.scale.set(width * 1.5, 1, depth * 1.5)
    this.scene.add(mesh)
    this.items.push({ target, mesh, strength })
  }

  update() {
    for (const { target, mesh, strength } of this.items) {
      mesh.position.set(target.position.x + 0.25, SHADOW_HEIGHT, target.position.z + 0.2)
      mesh.rotation.y = new THREE.Euler().setFromQuaternion(target.quaternion, 'YXZ').y
      mesh.material.opacity = strength * THREE.MathUtils.clamp(1 - target.position.y / FADE_HEIGHT, 0, 1)
    }
  }
}
