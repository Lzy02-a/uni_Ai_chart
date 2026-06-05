<template>
  <div class="ai-input-wrapper">
    <textarea
      v-model="message" class="ai-textarea" :placeholder="placeholder" rows="1"
      @keydown.enter.prevent="handleEnter"
    />
    <button class="ai-send-button" :disabled="disabled || loading || !message.trim()" @click="sendMessage">
      {{ loading ? '思考中...' : '发送' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入消息...' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send', value: string): void
}>()

const message = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== message.value) {
      message.value = value
    }
  },
)

function sendMessage() {
  const text = message.value.trim()
  if (!text || props.disabled || props.loading)
    return
  emit('send', text)
  emit('update:modelValue', '')
  message.value = ''
}

function handleEnter() {
  sendMessage()
}
</script>

<style scoped>
.ai-input-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;
  box-sizing: border-box;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.ai-textarea {
  width: 90%;
  min-height: 42px;
  max-height: 42px;
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 22px;
  outline: none;
  resize: none;
  line-height: 1.5;
  font-size: 14px;
  color: #333333;
  overflow-y: auto;
  background: #fafafa;
}

.ai-textarea:focus {
  border-color: #409eff;
}

.ai-textarea::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.ai-textarea {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ai-send-button {
  width: 10%;
  min-width: 64px;
  height: 42px;
  border: none;
  border-radius: 22px;
  background: #409eff;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.ai-send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
