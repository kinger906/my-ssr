<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        v-model="searchText"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @input="onInput"
      />
      <button v-if="searchText" class="clear-btn" @click="clearSearch" title="清除搜索">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
}>(), {
  modelValue: '',
  placeholder: '搜索...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const searchText = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (val) => {
  searchText.value = val
})

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', searchText.value)
    emit('search', searchText.value)
  }, 300)
}

function clearSearch() {
  searchText.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 36px 10px 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.clear-btn {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
}

.clear-btn:hover {
  background-color: var(--color-border);
  color: var(--color-text);
}

@media (max-width: 768px) {
  .search-input {
    max-width: 100%;
    font-size: 1rem;
  }
}
</style>