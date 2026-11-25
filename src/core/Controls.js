const KEY_ACTIONS = {
  ArrowUp: 'forward', KeyW: 'forward', KeyZ: 'forward',
  ArrowDown: 'backward', KeyS: 'backward',
  ArrowLeft: 'left', KeyA: 'left', KeyQ: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ShiftLeft: 'boost', ShiftRight: 'boost',
  Space: 'brake',
}

export default class Controls {
  constructor() {
    this.input = { forward: false, backward: false, left: false, right: false, boost: false, brake: false }
    this.pressListeners = []
    window.addEventListener('keydown', (event) => this.handleKey(event, true))
    window.addEventListener('keyup', (event) => this.handleKey(event, false))
    window.addEventListener('blur', () => this.releaseAll())
  }

  onPress(listener) {
    this.pressListeners.push(listener)
  }

  handleKey(event, isDown) {
    const action = KEY_ACTIONS[event.code]
    if (action) {
      this.input[action] = isDown
      event.preventDefault()
    }
    if (isDown && !event.repeat) for (const listener of this.pressListeners) listener(event.code)
  }

  setTouchInput(partialInput) {
    Object.assign(this.input, partialInput)
  }

  releaseAll() {
    for (const action of Object.keys(this.input)) this.input[action] = false
  }
}
