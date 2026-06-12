<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="onCancel">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑数据' : '添加数据' }}</h3>
          <button class="modal-close" @click="onCancel" title="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">
              名称 <span class="required">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              :class="{ 'input-error': errors.name }"
              placeholder="请输入名称"
              @input="errors.name = ''"
            />
            <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">描述</label>
            <textarea
              v-model="form.description"
              class="form-textarea"
              placeholder="请输入描述信息（可选）"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">状态</label>
            <select v-model="form.status" class="form-select">
              <option value="active">启用</option>
              <option value="inactive">停用</option>
              <option value="draft">草稿</option>
              <option value="archived">归档</option>
            </select>
          </div>
          <FileUpload v-if="!isEdit" :item-id="undefined" />
          <FileUpload v-else :item-id="item?.id" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="onCancel">取消</button>
          <button class="btn btn-primary" :disabled="submitting" @click="onSubmit">
            <span v-if="submitting" class="btn-spinner"></span>
            {{ isEdit ? '保存修改' : '确认添加' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Item, CreateItemInput, UpdateItemInput } from '~/types'

const props = defineProps<{
  visible: boolean
  item?: Item | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: CreateItemInput | UpdateItemInput]
}>()

const isEdit = computed(() => !!props.item)

const form = reactive({
  name: '',
  description: '',
  status: 'active' as string
})

const errors = reactive({
  name: ''
})

watch(() => props.visible, (val) => {
  if (val) {
    if (props.item) {
      form.name = props.item.name
      form.description = props.item.description
      form.status = props.item.status
    } else {
      form.name = ''
      form.description = ''
      form.status = 'active'
    }
    errors.name = ''
  }
})

function validate(): boolean {
  if (!form.name.trim()) {
    errors.name = '名称不能为空'
    return false
  }
  if (form.name.trim().length > 255) {
    errors.name = '名称不能超过255个字符'
    return false
  }
  return true
}

function onSubmit() {
  if (!validate()) return

  if (isEdit.value) {
    emit('submit', {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status
    } as UpdateItemInput)
  } else {
    emit('submit', {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status
    } as CreateItemInput)
  }
}

function onCancel() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: var(--color-surface);
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.required {
  color: var(--color-danger);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input.input-error {
  border-color: var(--color-danger);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-text {
  display: block;
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--color-danger);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 0 8px;
  }
}
</style>