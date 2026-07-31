<script setup lang="ts">
import type { CityIndexEntry } from '../types/festival'

defineProps<{
  cities: CityIndexEntry[]
  modelValue: string | null
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="city-selector">
    <span class="city-selector__label">Ciudad</span>
    <select
      class="city-selector__select"
      :value="modelValue ?? ''"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="c in cities" :key="c.slug" :value="c.slug">
        {{ c.name }} ({{ c.filmCount }} películas)
      </option>
    </select>
  </label>
</template>

<style scoped>
.city-selector {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.city-selector__label {
  font-weight: 600;
  color: var(--muted);
}

.city-selector__select {
  font: inherit;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  min-width: 12rem;
}
</style>
