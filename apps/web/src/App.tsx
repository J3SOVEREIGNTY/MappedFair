import { useEffect, useRef, useState } from 'react'
import { addStop, emptyItinerary, moveStop, removeStop, updateNote, type Itinerary } from './domain/itinerary'
import { venueById, venues } from './domain/venues'
import { IndexedDbItineraryStore } from './infrastructure/IndexedDbItineraryStore'
import './app/App.css'

const store = new IndexedDbItineraryStore()

function App() {
  const [plan, setPlan] = useState<Itinerary>(emptyItinerary)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [offlineReady, setOfflineReady] = useState(false)
  const planRef = useRef(plan)
  const saveQueue = useRef<Promise<void>>(Promise.resolve())
  const revision = useRef(0)

  useEffect(() => {
    let active = true
    store.load().then((saved) => {
      if (!active) return
      planRef.current = saved
      setPlan(saved)
      setReady(true)
    }).catch(() => {
      if (!active) return
      setError('Local storage could not be opened. Check browser storage settings and reload to try again.')
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => { if (active) setOfflineReady(true) }).catch(() => {})
    }
    return () => { active = false }
  }, [])

  function change(next: Itinerary) {
    if (!ready || next === planRef.current) return
    planRef.current = next
    setPlan(next)
    setSaving(true)
    setError('')
    const currentRevision = ++revision.current
    saveQueue.current = saveQueue.current.catch(() => {}).then(() => store.save(next)).then(() => {
      if (currentRevision === revision.current) {
        setSaving(false)
        setError('')
      }
    }).catch(() => {
      if (currentRevision === revision.current) {
        setSaving(false)
        setError('Changes could not be saved locally. Keep this page open and try editing again.')
      }
    })
  }

  const filtered = venues.filter((venue) =>
    (category === 'All' || venue.category === category) &&
    `${venue.name} ${venue.address}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <main className="app" aria-label="MappedFair">
      <header className="masthead">
        <div className="brand"><span className="brand-mark" aria-hidden="true">✳</span> MAPPEDFAIR <span className="brand-tag">FIELD NOTES</span></div>
        <div className="season">SEP 2026 VENUE SNAPSHOT <span aria-hidden="true">·</span> {offlineReady ? 'OFFLINE READY' : 'OFFLINE SETUP PENDING'}</div>
      </header>

      <section className="intro">
        <div className="eyebrow">YOUR FAIR, YOUR WAY <span aria-hidden="true">/ 01</span></div>
        <h1 id="mappedfair-title">A day worth <em>wandering</em> for.</h1>
        <p>Pick a few places, put them in your order, and keep your plan with you even when the signal disappears.</p>
        <a className="jump" href="#venues">Explore the venues <span aria-hidden="true">↘</span></a>
      </section>

      <div className="content">
        <section className="directory" id="venues" aria-labelledby="venues-title">
          <div className="section-heading"><div><div className="eyebrow">01 / FIND YOUR STOPS</div><h2 id="venues-title">Places to go</h2></div><span className="count">{venues.length} PLACES</span></div>
          <label className="search-label" htmlFor="venue-search">Find a venue</label>
          <input id="venue-search" type="search" placeholder="Search places or streets…" value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="filters" role="group" aria-label="Filter venues">
            {['All', 'Explore', 'Eat', 'Gather'].map((item) => <button key={item} type="button" className={category === item ? 'filter active' : 'filter'} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="venues-list">
            {filtered.length === 0 && <p className="empty">No places match that search. Try another name or street.</p>}
            {filtered.map((venue, index) => {
              const added = plan.stops.some((stop) => stop.venueId === venue.id)
              return <article className="venue" key={venue.id}>
                <span className="venue-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="venue-info"><span className="venue-category">{venue.category}</span><h3>{venue.name}</h3><p>{venue.address}</p></div>
                <button type="button" className="add-button" disabled={!ready || added} onClick={() => change(addStop(planRef.current, venue.id))} aria-label={added ? `${venue.name} added to plan` : `Add ${venue.name} to plan`}>{added ? 'Added ✓' : 'Add +'}</button>
              </article>
            })}
          </div>
        </section>

        <aside className="plan" aria-labelledby="plan-title">
          <div className="eyebrow">02 / MAKE IT YOURS</div><h2 id="plan-title">Your day, <em>your order.</em></h2>
          <p className="plan-intro">A simple list of stops. Directions and estimated travel times are not available yet.</p>
          {!ready && !error && <p role="status">Opening your saved plan…</p>}
          {error && <p className="error" role="alert">{error}</p>}
          <div className="save-state" role="status">{ready && (saving ? 'Saving on this device…' : error ? 'Save needs attention' : 'Saved on this device')}</div>
          {ready && plan.stops.length === 0 && <div className="plan-empty"><span aria-hidden="true">↗</span><strong>Start somewhere good.</strong><p>Add a place from the list to begin your day.</p></div>}
          {ready && <ol className="stops">{plan.stops.map((stop, index) => {
            const venue = venueById.get(stop.venueId)
            if (!venue) return null
            return <li key={stop.venueId} className="stop">
              <div className="stop-top"><span className="stop-index">{String(index + 1).padStart(2, '0')}</span><div className="stop-name"><strong>{venue.name}</strong><small>{venue.address}</small></div><button type="button" className="remove" aria-label={`Remove ${venue.name}`} onClick={() => change(removeStop(planRef.current, venue.id))}>×</button></div>
              <label className="note-label" htmlFor={`note-${venue.id}`}>Your note</label><input id={`note-${venue.id}`} maxLength={300} placeholder="A reminder for this stop…" value={stop.note} onChange={(event) => change(updateNote(planRef.current, venue.id, event.target.value))} />
              <div className="reorder"><button type="button" disabled={index === 0} onClick={() => change(moveStop(planRef.current, index, -1))} aria-label={`Move ${venue.name} earlier`}>↑ Earlier</button><button type="button" disabled={index === plan.stops.length - 1} onClick={() => change(moveStop(planRef.current, index, 1))} aria-label={`Move ${venue.name} later`}>↓ Later</button></div>
            </li>
          })}</ol>}
          <div className="provenance"><strong>Know before you go.</strong><p>These {venues.length} venue names and addresses were checked against the Minnesota State Fair’s <a href={venues[0].source} target="_blank" rel="noreferrer">location addresses</a> on Sep 25, 2026. This is a 2026 snapshot; recheck before a future fair. No live status, accessible route, or turn-by-turn map is provided.</p><p>Independent companion. No affiliation with the Minnesota State Fair.</p></div>
        </aside>
      </div>
      <footer className="footer"><span>MAPPEDFAIR / A LITTLE ROOM TO ROAM</span><span>BUILT FOR THE DAYS YOU GET LOST IN</span></footer>
    </main>
  )
}

export default App
