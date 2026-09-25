import 'fake-indexeddb/auto'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../App'

afterEach(cleanup)

describe('application shell', () => {
  it('exposes the MappedFair page as a named main landmark', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: 'MappedFair' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: /A day worth wandering for/ })).toBeTruthy()
  })

  it('recovers ordered stops and notes after a reload from IndexedDB', async () => {
    const page = render(<App />)
    await screen.findByText('Saved on this device')
    fireEvent.click(screen.getByRole('button', { name: 'Add Grandstand to plan' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add Food Building to plan' }))
    fireEvent.change(screen.getByLabelText('Your note', { selector: '#note-food-building' }), { target: { value: 'Meet at noon' } })
    fireEvent.click(screen.getByRole('button', { name: 'Move Food Building earlier' }))
    await waitFor(() => expect(screen.getByText('Saved on this device')).toBeTruthy())
    page.unmount()

    render(<App />)
    expect(await screen.findByDisplayValue('Meet at noon')).toBeTruthy()
    const stops = screen.getAllByRole('listitem')
    expect(stops[0].textContent).toContain('Food Building')
    expect(stops[1].textContent).toContain('Grandstand')
  })
})
