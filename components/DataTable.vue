<template>
  <div class="table-container">
    <div v-if="loading" class="table-loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else-if="error" class="table-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{{ error }}</span>
      <button class="btn btn-sm btn-secondary" @click="$emit('retry')">重试</button>
    </div>
    <div v-else-if="data.length === 0" class="table-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
      <span>暂无数据</span>
    </div>
    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-id" @click="$emit('sort', 'id')">
              <div class="th-content">
                <span>ID</span>
                <SortIcon :column="'id'" :sort-by="sortBy" :sort-order="sortOrder" />
              </div>
            </th>
            <th class="col-name" @click="$emit('sort', 'name')">
              <div class="th-content">
                <span>名称</span>
                <SortIcon :column="'name'" :sort-by="sortBy" :sort-order="sortOrder" />
              </div>
            </th>
            <th class="col-desc">描述</th>
            <th class="col-status" @click="$emit('sort', 'status')">
              <div class="th-content">
                <span>状态</span>
                <SortIcon :column="'status'" :sort-by="sortBy" :sort-order="sortOrder" />
              </div>
            </th>
            <th class="col-date" @click="$emit('sort', 'created_at')">
              <div class="th-content">
                <span>创建时间</span>
                <SortIcon :column="'created_at'" :sort-by="sortBy" :sort-order="sortOrder" />
              </div>
            </th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td class="col-id">{{ item.id }}</td>
            <td class="col-name">
              <span class="item-name" @click="$emit('view', item)" title="点击查看详情">{{ item.name }}</span>
            </td>
            <td class="col-desc">
              <span class="item-desc">{{ item.description || '-' }}</span>
            </td>
            <td class="col-status">
              <span class="status-badge" :class="'status-' + item.status">
                {{ statusLabel(item.status) }}
              </span>
            </td>
            <td class="col-date">{{ formatDate(item.created_at) }}</td>
            <td class="col-actions">
              <div class="action-buttons">
                <button class="action-btn btn-view" @click="$emit('view', item)" title="查看详情">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
                <button class="action-btn btn-edit" @click="$emit('edit', item)" title="编辑">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button class="action-btn btn-delete" @click="$emit('delete', item)" title="删除">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import type { Item, ItemStatus } from '~/types'

defineProps<{
  data: Item[]
  loading: boolean
  error: string | null
  sortBy: string
  sortOrder: string
}>()

defineEmits<{
  sort: [column: string]
  view: [item: Item]
  edit: [item: Item]
  delete: [item: Item]
  retry: []
}>()

const SortIcon = defineComponent({
  props: { column: String, sortBy: String, sortOrder: String },
  setup(props) {
    return () => {
      if (props.sortBy !== props.column) {
        return h('svg', {
          class: 'sort-icon',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          width: '14',
          height: '14'
        }, [
          h('polyline', { points: '8 13 12 9 16 13' })
        ])
      }
      if (props.sortOrder === 'ASC') {
        return h('svg', {
          class: 'sort-icon active',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          width: '14',
          height: '14'
        }, [
          h('polyline', { points: '8 14 12 10 16 14' })
        ])
      }
      return h('svg', {
        class: 'sort-icon active',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        width: '14',
        height: '14'
      }, [
        h('polyline', { points: '8 10 12 14 16 10' })
      ])
    }
  }
})

const statusMap: Record<ItemStatus, string> = {
  active: '启用',
  inactive: '停用',
  draft: '草稿',
  archived: '归档'
}

function statusLabel(status: string): string {
  return statusMap[status as ItemStatus] || status
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.table-container {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-loading,
.table-error,
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.table-error {
  color: var(--color-danger);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table thead {
  background: #f1f5f9;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.data-table th:hover {
  background: #e2e8f0;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.sort-icon.active {
  color: var(--color-primary);
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.data-table tbody tr {
  transition: background-color 0.15s;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.col-id {
  width: 70px;
}

.col-status {
  width: 100px;
}

.col-date {
  width: 170px;
  white-space: nowrap;
}

.col-actions {
  width: 130px;
}

.item-name {
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 500;
}

.item-name:hover {
  text-decoration: underline;
}

.item-desc {
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-secondary);
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 500;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f1f5f9;
  color: #475569;
}

.status-draft {
  background: #fef9c3;
  color: #854d0e;
}

.status-archived {
  background: #fce7f3;
  color: #9d174d;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.btn-view {
  color: var(--color-primary);
}

.btn-view:hover {
  background: rgba(79, 70, 229, 0.1);
}

.btn-edit {
  color: var(--color-warning);
}

.btn-edit:hover {
  background: rgba(245, 158, 11, 0.1);
}

.btn-delete {
  color: var(--color-danger);
}

.btn-delete:hover {
  background: rgba(220, 38, 38, 0.1);
}

@media (max-width: 768px) {
  .col-desc,
  .col-date {
    display: none;
  }
}
</style>