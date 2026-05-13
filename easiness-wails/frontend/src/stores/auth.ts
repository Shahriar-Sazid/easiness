import { writable, derived } from 'svelte/store'
import { IsSetupRequired, Login, SetupAuth, ChangePassword } from '../wailsjs/go/main/App'
import type { dto_LoginRequest, dto_SetupAuthRequest, dto_ChangePasswordRequest } from '../wailsjs/go/models'

interface AuthState {
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  setupRequired: boolean | null
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isLoggedIn: false,
    isLoading: true,
    error: null,
    setupRequired: null,
  })

  return {
    subscribe,

    async init() {
      try {
        const required = await IsSetupRequired()
        update(s => ({ ...s, setupRequired: required, isLoading: false }))
      } catch (e) {
        update(s => ({ ...s, isLoading: false }))
      }
    },

    async setup(password: string) {
      update(s => ({ ...s, isLoading: true, error: null }))
      try {
        const req: dto_SetupAuthRequest = { password }
        await SetupAuth(req)
        update(s => ({ ...s, setupRequired: false, isLoggedIn: true, isLoading: false }))
      } catch (e: any) {
        update(s => ({ ...s, isLoading: false, error: e?.message ?? 'Setup failed' }))
      }
    },

    async login(password: string): Promise<boolean> {
      update(s => ({ ...s, isLoading: true, error: null }))
      try {
        const req: dto_LoginRequest = { password }
        const resp = await Login(req)
        if (resp.success) {
          update(s => ({ ...s, isLoggedIn: true, isLoading: false }))
          return true
        } else {
          update(s => ({ ...s, isLoading: false, error: resp.message }))
          return false
        }
      } catch (e: any) {
        update(s => ({ ...s, isLoading: false, error: e?.message ?? 'Login failed' }))
        return false
      }
    },

    logout() {
      update(s => ({ ...s, isLoggedIn: false }))
    },

    async changePassword(oldPassword: string, newPassword: string) {
      const req: dto_ChangePasswordRequest = { oldPassword, newPassword }
      await ChangePassword(req)
    },

    clearError() {
      update(s => ({ ...s, error: null }))
    },
  }
}

export const authStore = createAuthStore()
export const isLoggedIn = derived(authStore, $s => $s.isLoggedIn)
