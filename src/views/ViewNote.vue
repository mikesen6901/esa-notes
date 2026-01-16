<template>
  <div class="view-note">
    <Toast :message="toastMessage" :type="toastType" />
    <div class="container">
      <div v-if="loading" class="loading">加载中...</div>

      <div v-else-if="error" class="error-card">
        <h2>❌ {{ error }}</h2>
        <router-link to="/" class="btn btn-primary">创建新便签</router-link>
      </div>

      <div v-else-if="note" class="glass-card">
        <div class="note-header">
          <h1 v-if="note.title">{{ note.title }}</h1>
          <div class="note-meta">
            <span>创建于: {{ formatDate(note.createdAt) }}</span>
            <span v-if="note.expiresAt"> | 过期: {{ formatDate(note.expiresAt) }}</span>
          </div>
        </div>

        <div class="note-content" v-html="renderedContent"></div>

        <div class="note-actions">
          <button @click="copyContent" class="btn btn-primary">复制内容</button>
          <router-link to="/" class="btn">创建新便签</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Toast from '../components/Toast.vue'

const route = useRoute()
const note = ref(null)
const loading = ref(true)
const error = ref('')
const toastMessage = ref('')
const toastType = ref('success')

const renderedContent = computed(() => {
  if (!note.value) return ''
  // Simple markdown-like rendering
  let html = note.value.content
  // Convert line breaks
  html = html.replace(/\n/g, '<br>')
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')
  return html
})

onMounted(async () => {
  await loadNote()
})

async function loadNote() {
  try {
    const response = await fetch(`/api/notes/${route.params.id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '便签不存在')
    }

    note.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function copyContent() {
  if (!note.value) return

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(note.value.content).then(() => {
      toastMessage.value = ''
      setTimeout(() => {
        toastMessage.value = '✅ 内容已复制'
        toastType.value = 'success'
      }, 10)
    })
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
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
.view-note {
  min-height: 100vh;
  padding: 40px 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: var(--text-secondary);
  padding: 60px 20px;
}

.error-card {
  text-align: center;
  padding: 60px 20px;
}

.error-card h2 {
  color: var(--danger);
  margin-bottom: 24px;
}

.note-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.note-header h1 {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.note-meta {
  color: var(--text-secondary);
  font-size: 14px;
}

.note-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 32px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.note-content code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.note-actions {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
</style>
