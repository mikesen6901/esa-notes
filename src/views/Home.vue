<template>
  <div class="home">
    <Toast :message="toastMessage" :type="toastType" />
    <div class="container">
      <header class="header">
        <h1 class="title">📝 ESA 在线便签</h1>
        <p class="subtitle">基于阿里云边缘计算的快速便签服务</p>
      </header>

      <div class="glass-card">
        <h2>创建便签</h2>
        <form @submit.prevent="createNote" class="form">
          <div class="form-group">
            <label>标题 (可选)</label>
            <input
              v-model="title"
              type="text"
              placeholder="便签标题"
            />
          </div>

          <div class="form-group">
            <label>内容</label>
            <textarea
              v-model="content"
              placeholder="输入便签内容，支持 Markdown 格式..."
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>过期时间</label>
              <select v-model="expiryTime" class="expiry-select">
                <option value="0">永久有效</option>
                <option value="3600">1小时</option>
                <option value="86400">1天</option>
                <option value="604800">7天</option>
                <option value="2592000">30天</option>
              </select>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="burnAfterReading" />
                阅后即焚
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '创建中...' : '创建便签' }}
          </button>
        </form>

        <div v-if="result" class="result">
          <h3>✅ 便签已创建</h3>
          <div class="url-box">
            <input :value="result.url" readonly class="url-input" />
            <button @click="copyToClipboard(result.url)" class="btn btn-copy">复制</button>
          </div>
          <p class="hint">分享此链接即可查看便签</p>
        </div>

        <div v-if="error" class="error-message">
          ❌ {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Toast from '../components/Toast.vue'

const title = ref('')
const content = ref('')
const expiryTime = ref('0')
const burnAfterReading = ref(false)
const loading = ref(false)
const result = ref(null)
const error = ref('')
const toastMessage = ref('')
const toastType = ref('success')

async function createNote() {
  loading.value = true
  error.value = ''
  result.value = null

  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.value,
        content: content.value,
        expiryTime: parseInt(expiryTime.value),
        burnAfterReading: burnAfterReading.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '创建失败')
    }

    result.value = {
      url: `${window.location.origin}/${data.id}`
    }

    // Clear form
    title.value = ''
    content.value = ''
    expiryTime.value = '0'
    burnAfterReading.value = false

  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      toastMessage.value = ''
      setTimeout(() => {
        toastMessage.value = '✅ 已复制到剪贴板'
        toastType.value = 'success'
      }, 10)
    }).catch(() => {
      fallbackCopyText(text)
    })
  } else {
    fallbackCopyText(text)
  }
}

function fallbackCopyText(text) {
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)

    toastMessage.value = ''
    setTimeout(() => {
      toastMessage.value = '✅ 已复制到剪贴板'
      toastType.value = 'success'
    }, 10)
  } catch (e) {
    toastMessage.value = ''
    setTimeout(() => {
      toastMessage.value = '❌ 复制失败，请手动复制'
      toastType.value = 'error'
    }, 10)
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.subtitle {
  font-size: 17px;
  color: var(--text-secondary);
}

.glass-card h2 {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.expiry-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 15px;
  cursor: pointer;
}

.result {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.result h3 {
  color: var(--success);
  font-size: 18px;
  margin-bottom: 16px;
}

.url-box {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.url-input {
  flex: 1;
  font-weight: 600;
  color: var(--primary);
}

.btn-copy {
  background: var(--success);
  color: white;
}

.hint {
  color: var(--text-secondary);
  font-size: 14px;
}

.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 14px;
}
</style>
