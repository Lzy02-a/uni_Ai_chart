<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ScrollReview from '@/components/ai_layout/scrollReview.vue'
import BottomInput from '@/components/ai_layout/bottomInput.vue'
import { Ai_Chat } from '@/api/Ai_Chat'

definePage({
  style: {
    navigationBarTitleText: 'ai_chat',
  },
})

interface ChatMessage {
  id: string | number
  role: 'system' | 'user'
  content: string
}

const messages = ref<ChatMessage[]>([
  { id: 1, role: 'system', content: '系统消息将在这里展示，顶部为滚动聊天区域。' },
  { id: 2, role: 'user', content: '用户消息在右侧展示，底部输入区占页面高度的 20%。' },
])
const ContentInput = ref('')
async function handelSend(e: any) {
  console.log('ContentInput', ContentInput.value)
  const params = {
    messages: [
      {
        content: 'You are a helpful assistant',
        role: 'system',
      },
      {
        content: ContentInput.value,
        role: 'user',
      },
    ],
    model: 'deepseek-v4-pro',
    thinking: {
      type: 'enabled',
    },
    reasoning_effort: 'high',
    max_tokens: 4096,
    response_format: {
      type: 'text',
    },
    stop: null,
    stream: false,
    stream_options: null,
    temperature: 1,
    top_p: 1,
    tools: null,
    tool_choice: 'none',
    logprobs: false,
    top_logprobs: null,
  }
  const res = await Ai_Chat(params)
  console.log('ddsddddd------------', res?.choices?.message?.content)
}

onShow(() => {
  uni.setNavigationBarTitle({
    title: 'ai_chat',
  })
})
</script>

<template>
  <view class="page-container">
    <view class="chat-area">
      <scroll-review :messages="messages" :show-input="false" />
    </view>
    <view class="bottom-input-area">
      <BottomInput @send="handelSend" @update:model-value="ContentInput" />
    </view>
  </view>
</template>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
}

.chat-area {
  flex: 9;
  min-height: 0;
  padding: 0;
}

.bottom-input-area {
  flex: 1;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.bottom-input-placeholder {
  height: 100%;
  border: 1px dashed #dcdfe6;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  padding: 0 12px;
  background: #fafafa;
}
</style>
