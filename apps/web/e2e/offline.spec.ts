import { expect, test } from '@playwright/test'

test('recovers an ordered plan and note through offline reload and reconnect', async ({ page, context }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /A day worth wandering for/ })).toBeVisible()
  await expect(page.getByText('OFFLINE READY')).toBeVisible({ timeout: 20_000 })

  await page.getByRole('button', { name: 'Add Grandstand to plan' }).click()
  await page.getByRole('button', { name: 'Add Food Building to plan' }).click()
  await page.locator('#note-food-building').fill('Meet at noon')
  await page.getByRole('button', { name: 'Move Food Building earlier' }).click()
  await expect(page.locator('.stops > li').first()).toContainText('Food Building')
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible()

  await page.reload()
  await expect(page.locator('#note-food-building')).toHaveValue('Meet at noon')
  await expect(page.locator('.stops > li').first()).toContainText('Food Building')
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: /A day worth wandering for/ })).toBeVisible()
  await expect(page.locator('#note-food-building')).toHaveValue('Meet at noon')
  await expect(page.locator('.stops > li').first()).toContainText('Food Building')
  await page.getByRole('button', { name: 'Add Fine Arts Center to plan' }).click()
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible()

  await context.setOffline(false)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Fine Arts Center added to plan' })).toBeDisabled()
  expect(runtimeErrors).toEqual([])
})

test('storage denial is visible and does not claim the plan was saved', async ({ page, context }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', {
      configurable: true,
      value: { open: () => { throw new Error('Storage blocked') } },
    })
  })
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Local storage could not be opened')
  await expect(page.getByRole('button', { name: 'Add Grandstand to plan' })).toBeDisabled()
  await expect(page.getByText('Saved on this device', { exact: true })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('keyboard removal moves focus to the next stop and then the empty plan heading', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Add Grandstand to plan' }).click()
  await page.getByRole('button', { name: 'Add Food Building to plan' }).click()

  await page.getByRole('button', { name: 'Remove Grandstand' }).press('Enter')
  await expect(page.getByRole('button', { name: 'Remove Food Building' })).toBeFocused()

  await page.getByRole('button', { name: 'Remove Food Building' }).press('Enter')
  await expect(page.getByRole('heading', { name: 'Your day, your order.' })).toBeFocused()
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible()
})
