const DEAD_ZONE = 0.25

export default class TouchPad {
  constructor(root, controls) {
    this.controls = controls
    this.stick = root.querySelector('[data-stick]')
    this.knob = root.querySelector('[data-knob]')
    this.bindStick()
    this.bindButton(root.querySelector('[data-boost]'), 'boost')
    if (matchMedia('(pointer: coarse)').matches) root.hidden = false
  }

  bindStick() {
    const release = () => {
      this.knob.style.transform = ''
      this.controls.setTouchInput({ forward: false, backward: false, left: false, right: false })
    }
    this.stick.addEventListener('pointerdown', (event) => { this.stick.setPointerCapture(event.pointerId); this.move(event) })
    this.stick.addEventListener('pointermove', (event) => { if (this.stick.hasPointerCapture(event.pointerId)) this.move(event) })
    this.stick.addEventListener('pointerup', release)
    this.stick.addEventListener('pointercancel', release)
  }

  move(event) {
    const rect = this.stick.getBoundingClientRect()
    const radius = rect.width / 2
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - radius) / radius))
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - radius) / radius))
    this.knob.style.transform = `translate(${x * radius * 0.5}px, ${y * radius * 0.5}px)`
    this.controls.setTouchInput({ forward: y < -DEAD_ZONE, backward: y > DEAD_ZONE, left: x < -DEAD_ZONE, right: x > DEAD_ZONE })
  }

  bindButton(button, action) {
    button.addEventListener('pointerdown', () => this.controls.setTouchInput({ [action]: true }))
    for (const type of ['pointerup', 'pointercancel', 'pointerleave']) button.addEventListener(type, () => this.controls.setTouchInput({ [action]: false }))
  }
}
