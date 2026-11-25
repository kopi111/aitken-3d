import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { PALETTE } from './Palette.js'
import { PROJECTS, SERVICES, CONTACT } from '../content.js'
import BlockLetters from './BlockLetters.js'
import FloorLabel from './FloorLabel.js'
import ProjectBoard from './ProjectBoard.js'
import Props from './Props.js'
import Zone from './Zone.js'

const SERVICE_COLORS = [PALETTE.teal, PALETTE.coral, PALETTE.sky]

export default class World {
  constructor(kit, panel) {
    this.kit = kit
    this.panel = panel
    this.props = new Props(kit)
    this.zones = []
    this.buildIntro()
    this.buildServices({ x: 26, z: 0 })
    this.buildProjects({ x: 0, z: -30 })
    this.buildContact({ x: -26, z: 4 })
    this.buildPlayground({ x: 2, z: 22 })
  }

  label(options) {
    return new FloorLabel(this.kit.scene, options)
  }

  zone(options, content) {
    this.zones.push(new Zone(this.kit.scene, { ...options, onEnter: () => this.panel.show(content) }))
  }

  buildIntro() {
    new BlockLetters({ ...this.kit, material: this.kit.matcaps.get(PALETTE.gold), word: 'AITKEN', origin: { x: 0, z: -9 } })
    this.label({ text: 'TECHNOLOGY', position: { x: 0, z: -6.2 }, size: 1.1, weight: 800 })
    this.label({ text: 'Websites · Web apps · Mobile apps', position: { x: 0, z: -4.6 }, size: 0.55, weight: 500, color: PALETTE.labelDim })
    this.label({ text: '↑ ↓ ← →  or  W A S D  to drive\nShift = boost · Space = brake · R = reset', position: { x: 0, z: 4.2 }, size: 0.42, weight: 600, color: PALETTE.labelDim })
    this.label({ text: 'SERVICES →', position: { x: 10, z: 0.5 }, size: 0.7 })
    this.label({ text: '← CONTACT', position: { x: -10, z: 0.5 }, size: 0.7 })
    this.label({ text: '↑ OUR WORK', position: { x: -9, z: -13 }, size: 0.7 })
    this.label({ text: '↓ PLAYGROUND', position: { x: 9, z: 9 }, size: 0.6, color: PALETTE.labelDim })
  }

  buildServices(origin) {
    this.label({ text: 'WHAT WE BUILD', position: { x: origin.x, z: origin.z - 9 }, size: 1 })
    SERVICES.forEach((service, index) => {
      const x = origin.x + (index - 1) * 8
      const color = SERVICE_COLORS[index]
      this.serviceSculpture(service.id, { x, z: origin.z - 4 }, color)
      this.label({ text: service.title, position: { x, z: origin.z + 0.4 }, size: 0.65 })
      this.zone({ position: { x, z: origin.z + 3 }, width: 4, depth: 3, title: service.title }, { ...service, kind: 'Service' })
    })
  }

  serviceSculpture(id, position, color) {
    const block = (offset, size, tint = color) => this.props.staticBlock({ x: position.x + offset.x, z: position.z + offset.z }, size, tint)
    if (id === 'websites') {
      block({ x: 0, z: 0 }, new THREE.Vector3(4.2, 2.8, 0.3))
      block({ x: 0, z: 0.5 }, new THREE.Vector3(1.4, 0.3, 0.9), PALETTE.ink)
    } else if (id === 'web-apps') {
      block({ x: 0, z: 0 }, new THREE.Vector3(3.4, 2.2, 0.25))
      block({ x: 0, z: 1.2 }, new THREE.Vector3(3.6, 0.18, 2.2), PALETTE.ink)
    } else {
      block({ x: 0, z: 0 }, new THREE.Vector3(1.5, 3, 0.3))
      block({ x: 0, z: 0.25 }, new THREE.Vector3(0.6, 0.25, 0.3), PALETTE.ink)
    }
  }

  buildProjects(origin) {
    this.label({ text: 'OUR WORK', position: { x: origin.x, z: origin.z - 4 }, size: 1.2, weight: 800 })
    const spacing = [-9, 0, 8]
    PROJECTS.forEach((project, index) => {
      const x = origin.x + spacing[index]
      new ProjectBoard(this.kit, { image: project.image, aspect: project.aspect, position: { x, z: origin.z } })
      this.label({ text: `${project.title}\n${project.kind}`, position: { x, z: origin.z + 2.2 }, size: 0.45 })
      this.zone({ position: { x, z: origin.z + 4.8 }, width: 4, depth: 2.6, title: project.title }, project)
    })
  }

  buildContact(origin) {
    this.label({ text: 'LET’S BUILD YOURS', position: { x: origin.x, z: origin.z - 6 }, size: 0.9, weight: 800 })
    this.props.staticBlock({ x: origin.x, z: origin.z - 3 }, new THREE.Vector3(2.4, 2.4, 0.4), PALETTE.coral)
    this.label({ text: '@aitkentechnology', position: { x: origin.x, z: origin.z - 1 }, size: 0.55 })
    this.zone({ position: { x: origin.x, z: origin.z + 2 }, width: 4.5, depth: 3, title: 'Contact' }, { ...CONTACT, kind: 'Contact' })
  }

  buildPlayground(origin) {
    this.label({ text: 'PLAYGROUND', position: { x: origin.x, z: origin.z - 5 }, size: 0.8 })
    let row = 0
    for (let line = 0; line < 4; line++) {
      for (let pin = 0; pin <= line; pin++) {
        this.props.pin({ x: origin.x - 4 + line * 0.75, z: origin.z + (pin - line / 2) * 0.75 }, row++ % 2 ? PALETTE.cream : PALETTE.coral)
      }
    }
    for (let level = 0; level < 4; level++) {
      for (let column = 0; column < 4 - level; column++) {
        const size = new THREE.Vector3(0.9, 0.9, 0.9)
        this.props.crate({ x: origin.x + 4, y: 0.45 + level * 0.9, z: origin.z - 1.4 + column * 0.95 + level * 0.47 }, size, level % 2 ? PALETTE.teal : PALETTE.gold)
      }
    }
    this.addRamp({ x: origin.x + 1, z: origin.z + 6 })
  }

  addRamp(position) {
    const size = new THREE.Vector3(3, 0.2, 4)
    const body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)) })
    body.position.set(position.x, 0.55, position.z)
    body.quaternion.setFromEuler(0.28, 0, 0)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), this.kit.matcaps.get(PALETTE.gold))
    this.kit.scene.add(mesh)
    this.kit.physics.addBody(body, mesh)
  }

  activeZone() {
    return this.zones.find((zone) => zone.isInside)
  }

  update(carPosition, elapsed) {
    for (const zone of this.zones) zone.update(carPosition, elapsed)
  }
}
