<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCityData, useFestivalIndex, useFilmsIndex } from './composables/useFestivalData'
import type { Film, FilmIndexEntry } from './types/festival'
import CitySelector from './components/CitySelector.vue'
import DaySelector from './components/DaySelector.vue'
import ScheduleView from './components/ScheduleView.vue'
import FilmSearchView from './components/FilmSearchView.vue'
import FilmDetailDialog from './components/FilmDetailDialog.vue'

const { index } = useFestivalIndex()

const selectedCity = ref<string | null>(null)
watch(
  index,
  (idx) => {
    if (idx && !selectedCity.value && idx.cities.length) {
      // Bogotá es la ciudad principal del festival; si está disponible se
      // muestra primero, si no se usa la primera de la lista.
      selectedCity.value = idx.cities.find((c) => c.slug === 'bogota')?.slug ?? idx.cities[0].slug
    }
  },
  { immediate: true },
)

const { city, loading: cityLoading, load: loadCity } = useCityData(() => selectedCity.value)
const { films: filmsIndex } = useFilmsIndex()

const activeTab = ref<'agenda' | 'films'>('agenda')
const selectedDay = ref<string | null>(null)

watch(
  selectedCity,
  () => {
    selectedDay.value = null
    loadCity()
  },
  { immediate: true },
)

const days = computed(() => {
  const set = new Set<string>()
  for (const s of city.value?.sessions ?? []) set.add(s.date)
  return [...set].sort()
})

watch(days, (d) => {
  if (d.length && (!selectedDay.value || !d.includes(selectedDay.value))) {
    selectedDay.value = d[0]
  }
})

const sessionsForDay = computed(() =>
  (city.value?.sessions ?? []).filter((s) => s.date === selectedDay.value),
)

const filmsForCity = computed<FilmIndexEntry[]>(() => {
  if (!filmsIndex.value || !selectedCity.value) return []
  return filmsIndex.value.films.filter((f) =>
    f.screenings.some((s) => s.citySlug === selectedCity.value),
  )
})

const selectedFilm = ref<Film | FilmIndexEntry | null>(null)
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1>13° FICDEH — Cartelera</h1>
      <CitySelector
        v-if="index"
        :cities="index.cities"
        :model-value="selectedCity"
        @update:model-value="selectedCity = $event"
      />
    </header>

    <nav class="app__tabs" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'agenda'"
        :class="{ 'app__tab--active': activeTab === 'agenda' }"
        class="app__tab"
        @click="activeTab = 'agenda'"
      >
        Agenda
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'films'"
        :class="{ 'app__tab--active': activeTab === 'films' }"
        class="app__tab"
        @click="activeTab = 'films'"
      >
        Películas
      </button>
    </nav>

    <main class="app__main">
      <template v-if="activeTab === 'agenda'">
        <DaySelector
          v-if="days.length"
          :days="days"
          :model-value="selectedDay"
          @update:model-value="selectedDay = $event"
        />
        <p v-if="cityLoading" class="app__status">Cargando programación…</p>
        <ScheduleView v-else :sessions="sessionsForDay" @select-film="selectedFilm = $event" />
      </template>

      <template v-else>
        <FilmSearchView :films="filmsForCity" @select-film="selectedFilm = $event" />
      </template>
    </main>

    <FilmDetailDialog :film="selectedFilm" @close="selectedFilm = null" />
  </div>
</template>

<style scoped>
.app {
  max-width: 40rem;
  margin: 0 auto;
  padding: 1rem 1rem 3rem;
}

.app__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.app__header h1 {
  font-size: 1.25rem;
  margin: 0;
}

.app__tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1rem;
}

.app__tab {
  font: inherit;
  font-weight: 600;
  padding: 0.6rem 0.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--muted);
  cursor: pointer;
}

.app__tab--active {
  color: var(--text);
  border-bottom-color: var(--accent);
}

.app__status {
  color: var(--muted);
  padding: 2rem 0;
  text-align: center;
}
</style>
