import { writable } from 'svelte'
import { GetSyncStatus, SyncNow } from '../wailsjs/go/main/App'
import type { sync_SyncStatusResponse } from '../wailsjs/go/models'

type SyncState = {
  status: 'idle' | 'syncing' | 'error' | 'offline'
  lastSyncAt: Date | null
  pendingPush: number
  error: string | null
}

const initial: SyncState = {
  status: 'idle',
  lastSyncAt: null,
  pendingPush: 0,
  error: null,
}

function createSyncStore() {
  const { subscribe, update } = writable<SyncState>(initial)

  let pollInterval: ReturnType<typeof setInterval> | null = null

  async function refresh() {
    try {
      const s: sync_SyncStatusResponse = await GetSyncStatus()
      update(st => ({
        ...st,
        status: s.isOnline ? 'idle' : 'offline',
        pendingPush: s.pendingPush,
        error: null,
      }))
    } catch {
      update(st => ({ ...st, status: 'offline' }))
    }
  }

  async function sync() {
    update(st => ({ ...st, status: 'syncing', error: null }))
    try {
      const s: sync_SyncStatusResponse = await SyncNow()
      update(st => ({
        ...st,
        status: s.isOnline ? 'idle' : 'offline',
        lastSyncAt: new Date(),
        pendingPush: s.pendingPush,
        error: null,
      }))
    } catch (err: any) {
      update(st => ({
        ...st,
        status: 'error',
        error: err?.message ?? 'Sync failed',
      }))
    }
  }

  // Start polling sync status every 60 seconds when online
  function startPolling() {
    if (pollInterval) return
    refresh()
    pollInterval = setInterval(refresh, 60_000)
  }

  function stopPolling() {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  return { subscribe, sync, refresh, startPolling, stopPolling }
}

export const syncStore = createSyncStore()
