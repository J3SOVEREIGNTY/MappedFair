export type Venue = Readonly<{
  id: string
  name: string
  address: string
  category: 'Explore' | 'Eat' | 'Gather'
  source: string
  reuseBasis: 'independently selected factual name and address; no directory or map license'
  verifiedOn: string
  season: number
}>

// Independently selected factual names and addresses, manually checked against
// the Fair's location addresses. No map imagery or directory descriptions are copied.
const source = 'https://www.mnstatefair.org/guides/accessibility/locations'
const verifiedOn = '2026-09-25'
const season = 2026
const reuseBasis = 'independently selected factual name and address; no directory or map license'

export const venues: readonly Venue[] = [
  { id: 'grandstand', name: 'Grandstand', address: '1755 Dan Patch Ave.', category: 'Gather', source, reuseBasis, verifiedOn, season },
  { id: 'ag-hort', name: 'Agriculture Horticulture Building', address: '1263 Cooper St.', category: 'Explore', source, reuseBasis, verifiedOn, season },
  { id: 'food-building', name: 'Food Building', address: '1297 Underwood St.', category: 'Eat', source, reuseBasis, verifiedOn, season },
  { id: 'fine-arts', name: 'Fine Arts Center', address: '1442 Cosgrove St.', category: 'Explore', source, reuseBasis, verifiedOn, season },
  { id: 'creative-activities', name: 'Creative Activities', address: '1342 Cosgrove St.', category: 'Explore', source, reuseBasis, verifiedOn, season },
  { id: 'gate-16', name: 'Gate #16 Transit Hub', address: '1710 Randall Ave.', category: 'Gather', source, reuseBasis, verifiedOn, season },
]

export const venueById = new Map(venues.map((venue) => [venue.id, venue]))
