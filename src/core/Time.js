const MAX_DELTA_SECONDS = 1 / 30

export default class Time {
  constructor() {
    this.listeners = []
    this.elapsed = 0
    this.last = performance.now()
    requestAnimationFrame(() => this.tick())
  }

  onTick(listener) {
    this.listeners.push(listener)
  }

  tick() {
    const now = performance.now()
    const delta = Math.min((now - this.last) / 1000, MAX_DELTA_SECONDS)
    this.last = now
    this.elapsed += delta
    for (const listener of this.listeners) listener(delta, this.elapsed)
    requestAnimationFrame(() => this.tick())
  }
}
