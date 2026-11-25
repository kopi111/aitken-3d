import * as THREE from 'three'
import * as CANNON from 'cannon-es'

const GRID_ROWS = 7
const CELL = 0.42
const DEPTH = 0.9
const LETTER_GAP = 0.9
const DROP_HEIGHT = 7

const GLYPHS = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['111', '010', '010', '010', '010', '010', '111'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  N: ['10001', '11001', '10101', '10101', '10011', '10001', '10001'],
}

function horizontalRuns(rows) {
  const runs = []
  rows.forEach((row, rowIndex) => {
    let start = -1
    for (let column = 0; column <= row.length; column++) {
      const filled = row[column] === '1'
      if (filled && start < 0) start = column
      if (!filled && start >= 0) { runs.push({ row: GRID_ROWS - 1 - rowIndex, start, length: column - start }); start = -1 }
    }
  })
  return runs
}

export default class BlockLetters {
  constructor({ scene, physics, shadows, material, word, origin }) {
    this.scene = scene
    this.physics = physics
    this.shadows = shadows
    this.material = material
    this.build(word, origin)
  }

  build(word, origin) {
    const widths = [...word].map((letter) => GLYPHS[letter][0].length * CELL)
    const total = widths.reduce((sum, width) => sum + width, 0) + LETTER_GAP * (word.length - 1)
    let cursor = origin.x - total / 2
    ;[...word].forEach((letter, index) => {
      this.addLetter(GLYPHS[letter], cursor + widths[index] / 2, origin.z, index)
      cursor += widths[index] + LETTER_GAP
    })
  }

  addLetter(rows, centerX, centerZ, index) {
    const width = rows[0].length * CELL
    const body = new CANNON.Body({ mass: 2.5, sleepSpeedLimit: 0.2 })
    const mesh = new THREE.Group()
    for (const run of horizontalRuns(rows)) {
      const runWidth = run.length * CELL
      const x = run.start * CELL + runWidth / 2 - width / 2
      const y = run.row * CELL + CELL / 2 - (GRID_ROWS * CELL) / 2
      body.addShape(new CANNON.Box(new CANNON.Vec3(runWidth / 2, CELL / 2, DEPTH / 2)), new CANNON.Vec3(x, y, 0))
      const block = new THREE.Mesh(new THREE.BoxGeometry(runWidth, CELL, DEPTH), this.material)
      block.position.set(x, y, 0)
      mesh.add(block)
    }
    body.position.set(centerX, (GRID_ROWS * CELL) / 2 + DROP_HEIGHT + index * 1.2, centerZ)
    this.scene.add(mesh)
    this.physics.addBody(body, mesh)
    this.shadows.add(body, width, DEPTH)
  }
}
