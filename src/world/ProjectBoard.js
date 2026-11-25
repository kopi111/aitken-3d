import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { PALETTE } from './Palette.js'

const BOARD_HEIGHT = 3.4
const FRAME = 0.18
const LEG_HEIGHT = 0.6

export default class ProjectBoard {
  constructor({ scene, physics, shadows, matcaps }, { image, aspect, position }) {
    const width = BOARD_HEIGHT * aspect
    const group = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(width + FRAME * 2, BOARD_HEIGHT + FRAME * 2, 0.25), matcaps.get(PALETTE.ink))
    frame.position.y = LEG_HEIGHT + BOARD_HEIGHT / 2
    const texture = new THREE.TextureLoader().load(image)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(width, BOARD_HEIGHT), new THREE.MeshBasicMaterial({ map: texture }))
    screen.position.set(0, frame.position.y, 0.13)
    const stand = new THREE.Mesh(new THREE.BoxGeometry(width * 0.5, LEG_HEIGHT, 0.5), matcaps.get(PALETTE.goldDeep))
    stand.position.y = LEG_HEIGHT / 2
    group.add(frame, screen, stand)
    group.position.set(position.x, 0, position.z)
    scene.add(group)

    const body = new CANNON.Body({ mass: 0 })
    body.addShape(new CANNON.Box(new CANNON.Vec3(width / 2 + FRAME, 2.2, 0.3)), new CANNON.Vec3(0, 2.2, 0))
    body.position.set(position.x, 0, position.z)
    physics.addBody(body)
    shadows.add(body, width + FRAME * 2, 0.6, 0.4)
  }
}
