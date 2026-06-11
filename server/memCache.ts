export class MemCache<K, V> {
  private store = new Map<K, { value: V; expiresAt: number }>()

  constructor(private ttlMs: number) {}

  get(key: K): V | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: K, value: V): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs })
  }
}
