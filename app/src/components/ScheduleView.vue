<script setup lang="ts">
import type { Film, Session } from '../types/festival'
import SessionCard from './SessionCard.vue'

defineProps<{
  sessions: Session[]
}>()

defineEmits<{
  selectFilm: [film: Film]
}>()
</script>

<template>
  <div class="schedule-view">
    <p v-if="!sessions.length" class="schedule-view__empty">
      No hay funciones programadas para este día.
    </p>
    <SessionCard
      v-for="(session, i) in sessions"
      :key="i"
      :session="session"
      @select-film="$emit('selectFilm', $event)"
    />
  </div>
</template>

<style scoped>
.schedule-view {
  display: flex;
  flex-direction: column;
}

.schedule-view__empty {
  color: var(--muted);
  padding: 2rem 0;
  text-align: center;
}
</style>
