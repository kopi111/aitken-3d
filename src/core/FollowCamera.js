import * as THREE from 'three'

const VIEW_DIRECTION = new THREE.Vector3(1, 1.45, 1.15).normalize()
const FOLLOW_EASING = 6
const ZOOM = { min: 12, max: 30, start: 19 }

export default class FollowCamera {
  constructor() {
    this.instance = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200)
    this.target = new THREE.Vector3()
    this.easedTarget = new THREE.Vector3()
    this.distance = ZOOM.start
    this.targetDistance = ZOOM.start
    window.addEventListener('wheel', (event) => this.zoom(event.deltaY * 0.02), { passive: true })
    window.addEventListener('resize', () => this.resize())
  }

  zoom(amount) {
    this.targetDistance = THREE.MathUtils.clamp(this.targetDistance + amount, ZOOM.min, ZOOM.max)
  }

  follow(position) {
    this.target.set(position.x, 0, position.z)
  }

  update(deltaSeconds) {
    const ease = 1 - Math.exp(-FOLLOW_EASING * deltaSeconds)
    this.easedTarget.lerp(this.target, ease)
    this.distance += (this.targetDistance - this.distance) * ease
    this.instance.position.copy(this.easedTarget).addScaledVector(VIEW_DIRECTION, this.distance)
    this.instance.lookAt(this.easedTarget)
  }

  resize() {
    this.instance.aspect = window.innerWidth / window.innerHeight
    this.instance.updateProjectionMatrix()
  }
}
