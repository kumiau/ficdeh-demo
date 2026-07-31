<script setup lang="ts">
import type { Film } from '../types/festival'

defineProps<{
  film: Film
}>()

defineEmits<{
  select: [film: Film]
}>()
</script>

<template>
  <button type="button" class="film-card" @click="$emit('select', film)">
    <span class="film-card__title">{{ film.title }}</span>
    <span class="film-card__meta">
      <span v-if="film.director">{{ film.director }}</span>
      <span v-if="film.durationMin">· {{ film.durationMin }} min</span>
      <span v-if="film.country">· {{ film.country }}</span>
    </span>
    <span v-if="film.category" class="film-card__category">{{ film.category }}</span>
  </button>
</template>

<style scoped>
.film-card {
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

.film-card:hover,
.film-card:focus-visible {
  border-color: var(--accent);
  outline: none;
}

.film-card__title {
  font-weight: 600;
}

.film-card__meta {
  font-size: 0.85rem;
  color: var(--muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.film-card__category {
  font-size: 0.75rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
</style>
