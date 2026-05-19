<template>
  <div class="pagination">
    <div class="pagination-info">
      共 {{ total }} 条记录，第 {{ page }} / {{ totalPages }} 页
    </div>
    <div class="pagination-controls">
      <button
        class="page-btn"
        :disabled="page <= 1"
        @click="goTo(1)"
        title="首页"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>
      <button
        class="page-btn"
        :disabled="page <= 1"
        @click="goTo(page - 1)"
        title="上一页"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <template v-for="p in visiblePages" :key="p">
        <button
          v-if="p === '...'"
          class="page-btn ellipsis"
          disabled
        >...</button>
        <button
          v-else
          class="page-btn"
          :class="{ active: p === page }"
          @click="goTo(p as number)"
        >{{ p }}</button>
      </template>

      <button
        class="page-btn"
        :disabled="page >= totalPages"
        @click="goTo(page + 1)"
        title="下一页"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <button
        class="page-btn"
        :disabled="page >= totalPages"
        @click="goTo(totalPages)"
        title="末页"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      </button>
    </div>
    <div class="page-size-selector">
      <label>每页显示</label>
      <select :value="pageSize" @change="onPageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <span>条</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  page: number
  pageSize: number
  total: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
}>()

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const tp = props.totalPages

  if (tp <= 7) {
    for (let i = 1; i <= tp; i++) pages.push(i)
  } else {
    pages.push(1)
    if (props.page > 3) pages.push('...')
    const start = Math.max(2, props.page - 1)
    const end = Math.min(tp - 1, props.page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (props.page < tp - 2) pages.push('...')
    pages.push(tp)
  }
  return pages
})

function goTo(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
  }
}

function onPageSizeChange(event: Event) {
  const value = parseInt((event.target as HTMLSelectElement).value, 10)
  emit('update:pageSize', value)
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 0;
}

.pagination-info {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled):not(.active):not(.ellipsis) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.page-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.ellipsis {
  cursor: default;
  border: none;
  background: none;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.page-size-selector select {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
}

.page-size-selector select:focus {
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    align-items: center;
  }
}
</style>