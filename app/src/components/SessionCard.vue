<script setup lang="ts">
import type { Film, Session } from '../types/festival'
import FilmCard from './FilmCard.vue'

defineProps<{
  session: Session
}>()

defineEmits<{
  selectFilm: [film: Film]
}>()
</script>

<template>
  <article class="session-card">
    <div class="session-card__time">{{ session.time ?? '—' }}</div>
    <div class="session-card__body">
      <header class="session-card__venue">
        <h3>{{ session.venueName ?? 'Sede por confirmar' }}</h3>
        <p v-if="session.venueAddress" class="session-card__address">{{ session.venueAddress }}</p>
      </header>

      <ul class="session-card__films">
        <li v-for="(film, i) in session.films" :key="i">
          <FilmCard :film="film" @select="$emit('selectFilm', film)" />
        </li>
      </ul>

      <ul v-if="session.notes.length" class="session-card__notes">
        <li v-for="(note, i) in session.notes" :key="i">{{ note }}</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.session-card {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.session-card__time {
  font-weight: 600;
  color: var(--accent);
  font-size: 0.9rem;
  padding-top: 0.15rem;
}

.session-card__venue h3 {
  margin: 0;
  font-size: 1rem;
}

.session-card__address {
  margin: 0.1rem 0 0.5rem;
  font-size: 0.8rem;
  color: var(--muted);
}

.session-card__films {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.session-card__notes {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.8rem;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.session-card__notes li::before {
  content: '· ';
}
</style>
