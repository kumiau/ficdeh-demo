<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Film, FilmIndexEntry } from '../types/festival'

const props = defineProps<{
  film: Film | FilmIndexEntry | null
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.film,
  (film) => {
    if (film) {
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

function hasScreenings(film: Film | FilmIndexEntry): film is FilmIndexEntry {
  return 'screenings' in film
}
</script>

<template>
  <dialog ref="dialogRef" class="film-dialog" @close="emit('close')">
    <div v-if="film" class="film-dialog__content">
      <button type="button" class="film-dialog__close" aria-label="Cerrar" @click="dialogRef?.close()">
        ×
      </button>

      <img v-if="film.posterUrl" :src="film.posterUrl" alt="" class="film-dialog__poster" />

      <h2>{{ film.title }}</h2>
      <p class="film-dialog__meta">
        <span v-if="film.director">{{ film.director }}</span>
        <span v-if="film.country"> · {{ film.country }}</span>
        <span v-if="film.year"> · {{ film.year }}</span>
        <span v-if="film.durationMin"> · {{ film.durationMin }} min</span>
      </p>
      <p v-if="film.category" class="film-dialog__category">{{ film.category }}</p>

      <p v-if="film.synopsisEs" class="film-dialog__synopsis">{{ film.synopsisEs }}</p>

      <div v-if="film.directorProfile" class="film-dialog__section">
        <h3>Sobre el director/a</h3>
        <p>{{ film.directorProfile }}</p>
      </div>

      <p v-if="film.trailerUrl" class="film-dialog__links">
        <a :href="film.trailerUrl" target="_blank" rel="noopener">Ver trailer</a>
      </p>

      <div v-if="hasScreenings(film) && film.screenings.length" class="film-dialog__section">
        <h3>Funciones</h3>
        <ul class="film-dialog__screenings">
          <li v-for="(s, i) in film.screenings" :key="i">
            <strong>{{ s.date }} · {{ s.time }}</strong>
            — {{ s.venueName }}<span v-if="s.cityName"> ({{ s.cityName }})</span>
          </li>
        </ul>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.film-dialog {
  border: none;
  border-radius: 0.75rem;
  padding: 0;
  max-width: 32rem;
  width: min(90vw, 32rem);
  max-height: 85vh;
  color: var(--text);
  background: var(--surface);
}

.film-dialog::backdrop {
  background: rgb(0 0 0 / 55%);
}

.film-dialog__content {
  position: relative;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 85vh;
}

.film-dialog__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font: inherit;
  font-size: 1.5rem;
  line-height: 1;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.film-dialog__poster {
  max-width: 100%;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.film-dialog h2 {
  margin: 0 0 0.25rem;
}

.film-dialog__meta {
  color: var(--muted);
  margin: 0 0 0.25rem;
}

.film-dialog__category {
  font-size: 0.8rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin: 0 0 1rem;
}

.film-dialog__synopsis {
  white-space: pre-line;
  line-height: 1.5;
}

.film-dialog__section {
  margin-top: 1.25rem;
}

.film-dialog__section h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--muted);
  margin: 0 0 0.4rem;
}

.film-dialog__section p {
  line-height: 1.5;
  white-space: pre-line;
}

.film-dialog__links a {
  color: var(--accent);
}

.film-dialog__screenings {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}
</style>
