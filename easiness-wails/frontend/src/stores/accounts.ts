import { writable, derived } from 'svelte/store'
import { GetAllAccounts } from '../wailsjs/go/main/App'
import type { dto_AccountResponse } from '../wailsjs/go/models'

interface AccountsState {
  accounts: Record<number, dto_AccountResponse>
  loaded: boolean
}

function createAccountsStore() {
  const { subscribe, set, update } = writable<AccountsState>({
    accounts: {},
    loaded: false,
  })

  return {
    subscribe,

    async load() {
      const accounts = await GetAllAccounts()
      set({ accounts, loaded: true })
    },

    invalidate() {
      update(s => ({ ...s, loaded: false }))
    },
  }
}

export const accountsStore = createAccountsStore()

export const accountList = derived(accountsStore, $s =>
  Object.values($s.accounts)
)
