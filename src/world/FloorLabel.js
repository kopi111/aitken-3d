import * as THREE from 'three'
import { PALETTE } from './Palette.js'

const PIXELS_PER_UNIT = 64
const FONT_FAMILY = '"Poppins", "Segoe UI", system-ui, sans-serif'

export default class FloorLabel {
  constructor(scene, { text, position, size = 1, weight = 700, color = PALETTE.label, align = 'center' }) {
    const lines = text.split('\n')
    const fontPixels = size * PIXELS_PER_UNIT
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = `${weight} ${fontPixels}px ${FONT_FAMILY}`
    const widest = Math.max(...lines.map((line) => context.measureText(line).width))
    canvas.width = Math.ceil(widest + fontPixels)
    canvas.height = Math.ceil(lines.length * fontPixels * 1.3 + fontPixels * 0.4)
    context.font = `${weight} ${fontPixels}px ${FONT_FAMILY}`
    context.fillStyle = color
    context.textAlign = align
    context.textBaseline = 'top'
    const x = align === 'left' ? fontPixels / 2 : canvas.width / 2
    lines.forEach((line, index) => context.fillText(line, x, fontPixels * 0.2 + index * fontPixels * 1.3))
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    const geometry = new THREE.PlaneGeometry(canvas.width / PIXELS_PER_UNIT, canvas.height / PIXELS_PER_UNIT).rotateX(-Math.PI / 2)
    this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }))
    const offsetX = align === 'left' ? canvas.width / PIXELS_PER_UNIT / 2 : 0
    this.mesh.position.set(position.x + offsetX, 0.02, position.z)
    scene.add(this.mesh)
  }
}
