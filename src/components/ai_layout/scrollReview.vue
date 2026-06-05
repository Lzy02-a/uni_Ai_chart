<template>
  <div class="chat-panel">
    <div ref="scrollRef" class="chat-list">
      <div
        v-for="item in messages" :key="item.id" class="chat-item"
        :class="item.role === 'user' ? 'chat-item-user' : 'chat-item-system'"
      >
        <div class="avatar">
          {{ item.role === 'user' ? '我' : '系统' }}
        </div>
        <div class="bubble">
          <p class="bubble-text">
            {{ item.content }}
          </p>
        </div>
      </div>
      <div v-if="!messages || messages.length === 0" class="empty-tip">
        暂无对话，开始聊天吧
      </div>
    </div>

    <div v-if="showInput" class="chat-input-wrapper">
      <textarea
        ref="textareaRef" v-model="inputText" class="chat-textarea" :placeholder="placeholder"
        :style="{ height: `${inputHeight}px` }" rows="1" @input="updateInputHeight"
        @keydown.enter.prevent="handleEnter"
      />
      <button class="chat-send-button" :disabled="!inputText.trim()" @click="sendMessage">
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'

type ChatRole = 'system' | 'user'
interface ChatMessage {
  id: string | number
  role: ChatRole
  content: string
}

const props = defineProps({
  messages: {
    type: Array as PropType<ChatMessage[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请输入消息...',
  },
  maxInputHeight: {
    type: Number,
    default: 140,
  },
  showInput: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'send', value: string): void
  (e: 'update:inputHeight', value: number): void
}>()

const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const inputHeight = ref(48)

function updateInputHeight() {
  const textarea = textareaRef.value
  if (!textarea)
    return

  textarea.style.height = 'auto'
  const nextHeight = Math.min(textarea.scrollHeight, props.maxInputHeight)
  textarea.style.height = `${nextHeight}px`
  inputHeight.value = nextHeight
  emit('update:inputHeight', nextHeight)
}

function scrollToBottom() {
  nextTick(() => {
    const box = scrollRef.value
    if (box)
      box.scrollTop = box.scrollHeight
  })
}

function sendMessage() {
  const content = inputText.value.trim()
  if (!content)
    return

  emit('send', content)
  inputText.value = ''
  updateInputHeight()
  scrollToBottom()
}

function handleEnter() {
  sendMessage()
}

watch(
  () => props.messages,
  () => {
    scrollToBottom()
  },
  { deep: true },
)

onMounted(() => {
  updateInputHeight()
  scrollToBottom()
})
</script>

<style scoped>
.chat-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  box-sizing: border-box;
}

.chat-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.chat-item-system {
  justify-content: flex-start;
}

.chat-item-user {
  justify-content: flex-end;
}

.chat-item-user .bubble {
  order: 1;
}

.chat-item-user .avatar {
  order: 2;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #ffffff;
  background: #5b8cff;
}

.chat-item-user .avatar {
  background: #38b48b;
}

.bubble {
  max-width: 72%;
  padding: 12px 14px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  word-break: break-word;
}

.chat-item-user .bubble {
  background: #409eff;
  color: #ffffff;
}

.bubble-text {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.empty-tip {
  padding: 24px 12px;
  text-align: center;
  color: #999999;
}

.chat-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #ffffff;
}

.chat-textarea {
  flex: 1;
  min-height: 48px;
  max-height: 140px;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 22px;
  resize: none;
  overflow-y: auto;
  background: #fafafa;
  line-height: 1.6;
  font-size: 14px;
  outline: none;
}

.chat-textarea:focus {
  border-color: #409eff;
}

.chat-textarea::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.chat-textarea {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-send-button {
  min-width: 72px;
  height: 42px;
  border: none;
  border-radius: 22px;
  background: #409eff;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.chat-send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
