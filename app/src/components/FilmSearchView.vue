<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FilmIndexEntry } from '../types/festival'

const props = defineProps<{
  films: FilmIndexEntry[]
}>()

defineEmits<{
  selectFilm: [film: FilmIndexEntry]
}>()

const query = ref('')
const category = ref('')
const origin = ref<'' | 'nacional' | 'internacional'>('')

function normalize(text: string): string {
  // NFKD separa los acentos como marcas diacríticas combinables (rango
  // ̀-ͯ) para poder quitarlas y comparar sin distinguir tildes.
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

const categories = computed(() => {
  const set = new Set<string>()
  for (const f of props.films) {
    if (f.category) set.add(f.category)
  }
  return [...set].sort()
})

const filtered = computed(() => {
  const q = normalize(query.value.trim())
  return props.films.filter((f) => {
    if (q && !normalize(f.title).includes(q)) return false
    if (category.value && f.category !== category.value) return false
    if (origin.value === 'nacional' && !normalize(f.category ?? '').includes('nacional')) return false
    if (origin.value === 'internacional' && !normalize(f.category ?? '').includes('internacional')) return false
    return true
  })
})
</script>

<template>
  <div class="film-search">
    <div class="film-search__filters">
      <input
        v-model="query"
        type="search"
        placeholder="Buscar película..."
        class="film-search__input"
        aria-label="Buscar película por título"
      />
      <select v-model="category" class="film-search__select" aria-label="Categoría">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <select v-model="origin" class="film-search__select" aria-label="Origen">
        <option value="">Nacional / Internacional</option>
        <option value="nacional">Nacional</option>
        <option value="internacional">Internacional</option>
      </select>
    </div>

    <p class="film-search__count">{{ filtered.length }} película(s)</p>

    <ul class="film-search__results">
      <li v-for="f in filtered" :key="f.filmKey">
        <button type="button" class="film-search__result" @click="$emit('selectFilm', f)">
          <span class="film-search__title">{{ f.title }}</span>
          <span class="film-search__meta">
            <span v-if="f.director">{{ f.director }}</span>
            <span v-if="f.country"> · {{ f.country }}</span>
          </span>
          <span class="film-search__screenings">
            {{ f.screenings.length }} función(es)
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.film-search__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.film-search__input,
.film-search__select {
  font: inherit;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.film-search__input {
  flex: 1 1 12rem;
}

.film-search__count {
  color: var(--muted);
  font-size: 0.85rem;
  margin: 0 0 0.5rem;
}

.film-search__results {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.film-search__result {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  width: 100%;
  text-align: left;
  font: inherit;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background: var(--surface-2);
  color: var(--text);
  cursor: pointer;
}

.film-search__result:hover,
.film-search__result:focus-visible {
  border-color: var(--accent);
  outline: none;
}

.film-search__title {
  font-weight: 600;
}

.film-search__meta,
.film-search__screenings {
  font-size: 0.85rem;
  color: var(--muted);
}
</style>
