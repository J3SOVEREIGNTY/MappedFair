export type Stop = { venueId: string; note: string }
export type Itinerary = { stops: Stop[] }

export const emptyItinerary = (): Itinerary => ({ stops: [] })

export function addStop(itinerary: Itinerary, venueId: string): Itinerary {
  if (itinerary.stops.some((stop) => stop.venueId === venueId)) return itinerary
  return { stops: [...itinerary.stops, { venueId, note: '' }] }
}

export function removeStop(itinerary: Itinerary, venueId: string): Itinerary {
  return { stops: itinerary.stops.filter((stop) => stop.venueId !== venueId) }
}

export function updateNote(itinerary: Itinerary, venueId: string, note: string): Itinerary {
  return { stops: itinerary.stops.map((stop) => stop.venueId === venueId ? { ...stop, note } : stop) }
}

export function moveStop(itinerary: Itinerary, index: number, offset: -1 | 1): Itinerary {
  const nextIndex = index + offset
  if (index < 0 || nextIndex < 0 || nextIndex >= itinerary.stops.length) return itinerary
  const stops = [...itinerary.stops]
  ;[stops[index], stops[nextIndex]] = [stops[nextIndex], stops[index]]
  return { stops }
}
