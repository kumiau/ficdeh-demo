<script setup lang="ts">
defineProps<{
  days: string[]
  modelValue: string | null
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

function label(dateIso: string): string {
  const [, month, day] = dateIso.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(`${dateIso}T00:00:00`).getDay()]
  return `${weekday} ${day}/${month}`
}
</script>

<template>
  <div class="day-selector" role="tablist" aria-label="Día">
    <button
      v-for="d in days"
      :key="d"
      type="button"
      role="tab"
      class="day-selector__day"
      :class="{ 'day-selector__day--active': d === modelValue }"
      :aria-selected="d === modelValue"
      @click="$emit('update:modelValue', d)"
    >
      {{ label(d) }}
    </button>
  </div>
</template>

<style scoped>
.day-selector {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  -webkit-overflow-scrolling: touch;
}

.day-selector__day {
  font: inherit;
  flex: 0 0 auto;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  white-space: nowrap;
  text-transform: capitalize;
}

.day-selector__day--active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
}
</style>
