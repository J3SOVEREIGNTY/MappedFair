import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('application shell', () => {
  it('exposes the MappedFair page as a named main landmark', () => {
    render(<App />)

    expect(screen.getByRole('main', { name: 'MappedFair' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: 'MappedFair' })).toBeTruthy()
  })
})
