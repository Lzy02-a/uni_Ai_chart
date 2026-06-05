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

])
const ContentInput = ref('')
const isLoading = ref(false)
async function handelSend(value: string) {
  if (isLoading.value)
    return

  isLoading.value = true
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: value,
  })

  const params = {
    messages: [
      {
        content: 'You are a helpful assistant',
        role: 'system',
      },
      {
        content: value || '你好',
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

  try {
    const response = await Ai_Chat(params)
    const assistantMessage = response.choices?.[0]?.message?.content?.trim()

    if (!assistantMessage) {
      throw new Error('AI 接口返回成功，但未拿到回复内容')
    }

    messages.value.push({
      id: `${Date.now()}-assistant`,
      role: 'system',
      content: assistantMessage,
    })
  }
  catch (error) {
    console.error('Ai_Chat error:', error)
    uni.showToast({
      title: 'AI 回复解析失败',
      icon: 'none',
    })
  }
  finally {
    isLoading.value = false
  }
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
      <view v-if="isLoading" class="thinking-tip">
        AI 正在思考，请稍候...
      </view>
    </view>
    <view class="bottom-input-area">
      <BottomInput v-model="ContentInput" :disabled="isLoading" :loading="isLoading" @send="handelSend" />
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
  position: relative;
  flex: 9;
  min-height: 0;
  padding: 0;
}

.bottom-input-area {
  flex: 1;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.thinking-tip {
  position: absolute;
  left: 50%;
  bottom: 88px;
  transform: translateX(-50%);
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(64, 158, 255, 0.12);
  color: #2f6fb3;
  font-size: 13px;
  line-height: 1;
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
