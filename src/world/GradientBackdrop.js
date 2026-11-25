import * as THREE from 'three'
import { PALETTE } from './Palette.js'

function cornerTexture() {
  const corners = [PALETTE.floorBottomLeft, PALETTE.floorBottomRight, PALETTE.floorTopLeft, PALETTE.floorTopRight]
  const data = new Uint8Array(corners.flatMap((hex) => {
    const color = new THREE.Color(hex)
    return [color.r * 255, color.g * 255, color.b * 255, 255].map(Math.round)
  }))
  const texture = new THREE.DataTexture(data, 2, 2)
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

export default class GradientBackdrop {
  constructor() {
    const material = new THREE.ShaderMaterial({
      uniforms: { tCorners: { value: cornerTexture() } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }',
      fragmentShader: 'uniform sampler2D tCorners; varying vec2 vUv; void main() { gl_FragColor = texture2D(tCorners, vUv * 0.5 + 0.25); }',
      depthWrite: false,
    })
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -1
  }
}
