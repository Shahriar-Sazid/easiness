import { writable, derived } from 'svelte/store'
import { GetUnitData } from '../wailsjs/go/main/App'
import type { dto_UnitDTO, dto_UnitConversionDTO } from '../wailsjs/go/models'

interface UnitsState {
  units: dto_UnitDTO[]
  conversions: dto_UnitConversionDTO[]
  loaded: boolean
}

function createUnitsStore() {
  const { subscribe, set, update } = writable<UnitsState>({
    units: [],
    conversions: [],
    loaded: false,
  })

  return {
    subscribe,

    async load() {
      const data = await GetUnitData()
      set({ units: data.units, conversions: data.conversions, loaded: true })
    },
  }
}

export const unitsStore = createUnitsStore()

export const unitMap = derived(unitsStore, $s =>
  Object.fromEntries($s.units.map(u => [u.id, u.name]))
)

export function getUnitName(units: dto_UnitDTO[], id: number): string {
  return units.find(u => u.id === id)?.name ?? ''
}
