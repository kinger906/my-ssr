<template>
  <div class="page-container">
    <div class="toolbar">
      <div class="toolbar-left">
        <SearchBar
          v-model="searchQuery"
          placeholder="搜索名称或描述..."
          @search="onSearch"
        />
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="openAddForm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          添加数据
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{{ errorMessage }}</span>
      <button class="alert-close" @click="errorMessage = ''">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div v-if="successMessage" class="alert alert-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span>{{ successMessage }}</span>
      <button class="alert-close" @click="successMessage = ''">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <DataTable
      :data="items"
      :loading="loading"
      :error="fetchError"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      @sort="onSort"
      @view="openDetail"
      @edit="openEditForm"
      @delete="openDeleteConfirm"
      @retry="loadData"
    />

    <Pagination
      v-if="totalPages > 0"
      :page="currentPage"
      :pageSize="pageSize"
      :total="total"
      :totalPages="totalPages"
      @update:page="onPageChange"
      @update:pageSize="onPageSizeChange"
    />

    <ItemForm
      :visible="showForm"
      :item="editingItem"
      :submitting="formSubmitting"
      @close="closeForm"
      @submit="onFormSubmit"
    />

    <ItemDetail
      :visible="showDetail"
      :item="detailItem"
      :loading="detailLoading"
      :error="detailError"
      @close="closeDetail"
    />

    <ConfirmDialog
      :visible="showDeleteConfirm"
      :loading="deleting"
      :message="`确定要删除「${deletingItem?.name}」吗？此操作不可撤销。`"
      @confirm="onDeleteConfirm"
      @cancel="closeDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import type { Item, CreateItemInput, UpdateItemInput } from '~/types'

const { fetchItems, fetchItem, createItem, updateItem, deleteItem, loading, error: apiError } = useItems()

const items = ref<Item[]>([])
const total = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const sortBy = ref('id')
const sortOrder = ref('DESC')
const fetchError = ref<string | null>(null)
const errorMessage = ref('')
const successMessage = ref('')

const showForm = ref(false)
const editingItem = ref<Item | null>(null)
const formSubmitting = ref(false)

const showDetail = ref(false)
const detailItem = ref<Item | null>(null)
const detailLoading = ref(false)
const detailError = ref<string | null>(null)

const showDeleteConfirm = ref(false)
const deletingItem = ref<Item | null>(null)
const deleting = ref(false)

async function loadData() {
  try {
    fetchError.value = null
    const result = await fetchItems({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value || undefined,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    })
    items.value = result.data
    total.value = result.total
    totalPages.value = result.totalPages
  } catch {
    fetchError.value = apiError.value || '加载数据失败'
  }
}

function onSearch(value: string) {
  searchQuery.value = value
  currentPage.value = 1
  loadData()
}

function onSort(column: string) {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortBy.value = column
    sortOrder.value = 'ASC'
  }
  loadData()
}

function onPageChange(page: number) {
  currentPage.value = page
  loadData()
}

function onPageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

function openAddForm() {
  editingItem.value = null
  showForm.value = true
}

function openEditForm(item: Item) {
  editingItem.value = item
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingItem.value = null
}

async function onFormSubmit(data: CreateItemInput | UpdateItemInput) {
  formSubmitting.value = true
  try {
    if (editingItem.value) {
      await updateItem(editingItem.value.id, data as UpdateItemInput)
      successMessage.value = '数据更新成功'
    } else {
      await createItem(data as CreateItemInput)
      successMessage.value = '数据添加成功'
    }
    closeForm()
    await loadData()
  } catch {
    errorMessage.value = apiError.value || '操作失败，请重试'
  } finally {
    formSubmitting.value = false
  }
}

async function openDetail(item: Item) {
  showDetail.value = true
  detailItem.value = null
  detailLoading.value = true
  detailError.value = null
  try {
    const result = await fetchItem(item.id)
    detailItem.value = result
  } catch {
    detailError.value = apiError.value || '加载详情失败'
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  showDetail.value = false
  detailItem.value = null
  detailError.value = null
}

function openDeleteConfirm(item: Item) {
  deletingItem.value = item
  showDeleteConfirm.value = true
}

function closeDeleteConfirm() {
  showDeleteConfirm.value = false
  deletingItem.value = null
}

async function onDeleteConfirm() {
  if (!deletingItem.value) return
  deleting.value = true
  try {
    await deleteItem(deletingItem.value.id)
    successMessage.value = '数据删除成功'
    closeDeleteConfirm()
    if (items.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    await loadData()
  } catch {
    errorMessage.value = apiError.value || '删除失败，请重试'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  max-width: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.toolbar-left {
  flex: 1;
  min-width: 200px;
}

.toolbar-right {
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius);
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-close {
  margin-left: auto;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 2px;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>