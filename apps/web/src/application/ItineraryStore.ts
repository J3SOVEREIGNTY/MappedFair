import type { Itinerary } from '../domain/itinerary'

export interface ItineraryStore {
  load(): Promise<Itinerary>
  save(itinerary: Itinerary): Promise<void>
}
