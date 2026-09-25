import type { ItineraryStore } from '../application/ItineraryStore'
import { emptyItinerary, type Itinerary } from '../domain/itinerary'
import { venueById } from '../domain/venues'

const databaseName = 'mappedfair-itinerary'
const storeName = 'plans'
const key = 'local-plan'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(storeName)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onblocked = () => reject(new Error('Another tab is blocking the local plan database.'))
  })
}

// Stored state is treated as untrusted: older versions and malformed local data
// cannot inject unexpected venue IDs or non-text notes into the displayed plan.
function readPlan(value: unknown): Itinerary {
  if (!value || typeof value !== 'object' || !('stops' in value) || !Array.isArray(value.stops)) return emptyItinerary()
  const seen = new Set<string>()
  const stops = value.stops.flatMap((stop: unknown) => {
    if (!stop || typeof stop !== 'object' || !('venueId' in stop) || typeof stop.venueId !== 'string' || !venueById.has(stop.venueId) || seen.has(stop.venueId)) return []
    seen.add(stop.venueId)
    return [{ venueId: stop.venueId, note: 'note' in stop && typeof stop.note === 'string' ? stop.note.slice(0, 300) : '' }]
  })
  return { stops }
}

export class IndexedDbItineraryStore implements ItineraryStore {
  async load(): Promise<Itinerary> {
    const db = await openDatabase()
    try {
      return await new Promise((resolve, reject) => {
        const request = db.transaction(storeName, 'readonly').objectStore(storeName).get(key)
        request.onsuccess = () => resolve(readPlan(request.result))
        request.onerror = () => reject(request.error)
      })
    } finally { db.close() }
  }

  async save(itinerary: Itinerary): Promise<void> {
    const db = await openDatabase()
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        transaction.objectStore(storeName).put(itinerary, key)
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
        transaction.onabort = () => reject(transaction.error)
      })
    } finally { db.close() }
  }
}
