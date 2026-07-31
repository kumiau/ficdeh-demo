import { ref, shallowRef } from 'vue'
import type { CityData, FestivalIndex, FilmsIndex } from '../types/festival'

const DATA_BASE = `${import.meta.env.BASE_URL}data/`

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${path} (HTTP ${res.status})`)
  }
  return res.json() as Promise<T>
}

// Cachés simples en módulo: los JSON son estáticos durante la vida de la
// página, no hace falta volver a pedirlos si el usuario cambia de ciudad
// y vuelve.
const cityCache = new Map<string, CityData>()
let filmsPromise: Promise<FilmsIndex> | null = null
let indexPromise: Promise<FestivalIndex> | null = null

export function useFestivalIndex() {
  const index = shallowRef<FestivalIndex | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(true)

  indexPromise ??= fetchJson<FestivalIndex>(`${DATA_BASE}index.json`)
  indexPromise
    .then((data) => { index.value = data })
    .catch((err: Error) => { error.value = err.message })
    .finally(() => { loading.value = false })

  return { index, error, loading }
}

export function useCityData(citySlug: () => string | null) {
  const city = shallowRef<CityData | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function load() {
    const slug = citySlug()
    if (!slug) {
      city.value = null
      return
    }
    error.value = null
    const cached = cityCache.get(slug)
    if (cached) {
      city.value = cached
      return
    }
    loading.value = true
    try {
      const data = await fetchJson<CityData>(`${DATA_BASE}${slug}.json`)
      cityCache.set(slug, data)
      city.value = data
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  return { city, error, loading, load }
}

export function useFilmsIndex() {
  const films = shallowRef<FilmsIndex | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(true)

  filmsPromise ??= fetchJson<FilmsIndex>(`${DATA_BASE}films.json`)
  filmsPromise
    .then((data) => { films.value = data })
    .catch((err: Error) => { error.value = err.message })
    .finally(() => { loading.value = false })

  return { films, error, loading }
}
