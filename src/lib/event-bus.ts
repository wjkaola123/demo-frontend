type Listener = (data: unknown) => void

class EventBus {
  private listeners = new Map<string, Listener[]>()

  on(event: string, listener: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(listener)
    return () => this.off(event, listener)
  }

  off(event: string, listener: Listener) {
    const list = this.listeners.get(event)
    if (list) {
      this.listeners.set(event, list.filter(l => l !== listener))
    }
  }

  emit(event: string, data: unknown) {
    this.listeners.get(event)?.forEach(listener => listener(data))
  }
}

export const bus = new EventBus()
