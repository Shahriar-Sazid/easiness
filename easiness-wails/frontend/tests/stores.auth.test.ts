import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get } from 'svelte/store'
import { authStore } from '../src/stores/auth'
import * as App from '../src/wailsjs/go/main/App'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authStore.init', () => {
  it('sets setupRequired from IsSetupRequired', async () => {
    vi.mocked(App.IsSetupRequired).mockResolvedValue(true)
    await authStore.init()
    const state = get(authStore)
    expect(state.setupRequired).toBe(true)
    expect(state.isLoading).toBe(false)
  })
})

describe('authStore.login', () => {
  it('sets isLoggedIn on success', async () => {
    vi.mocked(App.Login).mockResolvedValue({ success: true, message: 'ok' })
    const ok = await authStore.login('secret')
    expect(ok).toBe(true)
    expect(get(authStore).isLoggedIn).toBe(true)
  })

  it('sets error on wrong password', async () => {
    vi.mocked(App.Login).mockResolvedValue({ success: false, message: 'invalid password' })
    const ok = await authStore.login('wrong')
    expect(ok).toBe(false)
    expect(get(authStore).isLoggedIn).toBe(false)
    expect(get(authStore).error).toBe('invalid password')
  })
})

describe('authStore.logout', () => {
  it('clears isLoggedIn', () => {
    authStore.logout()
    expect(get(authStore).isLoggedIn).toBe(false)
  })
})
