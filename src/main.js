import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import './style.css'
import Time from './core/Time.js'
import Controls from './core/Controls.js'
import FollowCamera from './core/FollowCamera.js'
import PhysicsWorld from './world/PhysicsWorld.js'
import VehiclePhysics from './world/VehiclePhysics.js'
import CarModel from './world/CarModel.js'
import Matcaps from './world/Matcaps.js'
import GradientBackdrop from './world/GradientBackdrop.js'
import BlobShadows from './world/BlobShadows.js'
import World from './world/World.js'
import InfoPanel from './ui/InfoPanel.js'
import TouchPad from './ui/TouchPad.js'

const OPEN_KEYS = ['Enter', 'KeyE', 'KeyF']

class Experience {
  constructor(canvas) {
    this.renderer = this.createRenderer(canvas)
    this.scene = new THREE.Scene()
    this.camera = new FollowCamera()
    this.controls = new Controls()
    this.physics = new PhysicsWorld()
    this.matcaps = new Matcaps()
    this.shadows = new BlobShadows(this.scene)
    this.scene.add(new GradientBackdrop().mesh)
    this.panel = new InfoPanel(document.querySelector('[data-panel]'))
    this.hint = document.querySelector('[data-hint]')
    new TouchPad(document.querySelector('[data-touch]'), this.controls)
    this.createCar()
    this.world = new World({ scene: this.scene, physics: this.physics, shadows: this.shadows, matcaps: this.matcaps }, this.panel)
    this.bindKeys()
    new Time().onTick((delta, elapsed) => this.update(delta, elapsed))
  }

  createRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', () => renderer.setSize(window.innerWidth, window.innerHeight))
    return renderer
  }

  createCar() {
    this.car = new VehiclePhysics(this.physics.world, new CANNON.Vec3(0, 0.6, 0))
    this.carModel = new CarModel(this.scene, this.matcaps, this.car)
    this.shadows.add(this.car.chassisBody, 2.0, 1.1, 0.6)
  }

  bindKeys() {
    this.controls.onPress((code) => {
      if (code === 'Escape') this.panel.hide()
      if (code === 'KeyR') this.car.reset()
      if (OPEN_KEYS.includes(code)) this.openActiveZone()
    })
    this.hint.addEventListener('click', () => this.openActiveZone())
  }

  openActiveZone() {
    const zone = this.world.activeZone()
    if (zone && !this.panel.isOpen) zone.onEnter()
  }

  update(delta, elapsed) {
    const input = this.panel.isOpen ? {} : this.controls.input
    this.car.drive(input, delta)
    this.physics.step(delta)
    this.carModel.update()
    this.shadows.update()
    this.world.update(this.car.position, elapsed)
    this.updateHint()
    this.camera.follow(this.car.position)
    this.camera.update(delta)
    this.renderer.render(this.scene, this.camera.instance)
  }

  updateHint() {
    const zone = this.world.activeZone()
    this.hint.hidden = !zone || this.panel.isOpen
    if (zone) this.hint.querySelector('[data-hint-title]').textContent = zone.title
  }
}

window.experience = new Experience(document.querySelector('canvas.webgl'))
