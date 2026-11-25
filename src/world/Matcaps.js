import * as THREE from 'three'

const SIZE = 256
const FLOOR_BOUNCE = new THREE.Color('#ff9a5a')

function paintClaySphere(context, color) {
  const base = new THREE.Color(color)
  const light = base.clone().lerp(new THREE.Color('#ffffff'), 0.55).getStyle()
  const shade = base.clone().multiplyScalar(0.45).getStyle()
  const center = SIZE / 2
  const body = context.createRadialGradient(center * 0.75, center * 0.6, SIZE * 0.05, center, center, center)
  body.addColorStop(0, light)
  body.addColorStop(0.45, base.getStyle())
  body.addColorStop(1, shade)
  context.fillStyle = body
  context.fillRect(0, 0, SIZE, SIZE)
  const shine = context.createRadialGradient(center * 0.62, center * 0.45, 0, center * 0.62, center * 0.45, SIZE * 0.16)
  shine.addColorStop(0, 'rgba(255,255,255,0.75)')
  shine.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = shine
  context.fillRect(0, 0, SIZE, SIZE)
}

function createMatcapTexture(color) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE
  paintClaySphere(canvas.getContext('2d'), color)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function addFloorBounce(material) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBounceColor = { value: FLOOR_BOUNCE }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;\nvarying vec3 vWorldNormal;')
      .replace('#include <fog_vertex>', '#include <fog_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWorldNormal = normalize(mat3(modelMatrix) * objectNormal);')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uBounceColor;\nvarying vec3 vWorldPos;\nvarying vec3 vWorldNormal;')
      .replace('#include <opaque_fragment>', `
        float nearFloor = clamp(1.0 - vWorldPos.y / 1.6, 0.0, 1.0);
        float facingDown = clamp(dot(normalize(vWorldNormal), vec3(0.0, -1.0, 0.0)) + 0.6, 0.0, 1.0);
        outgoingLight = mix(outgoingLight, uBounceColor, pow(nearFloor, 2.0) * facingDown * 0.55);
        #include <opaque_fragment>`)
  }
}

export default class Matcaps {
  constructor() {
    this.cache = new Map()
  }

  get(color) {
    if (!this.cache.has(color)) this.cache.set(color, this.create(color))
    return this.cache.get(color)
  }

  create(color) {
    const material = new THREE.MeshMatcapMaterial({ matcap: createMatcapTexture(color) })
    addFloorBounce(material)
    return material
  }
}
