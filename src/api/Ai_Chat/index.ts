const SK = 'Bearer sk-c62f4f2a28ce4e22882f308badf22591'

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AiChatRequest {
  messages: AiChatMessage[]
  model: string
  [key: string]: any
}

export interface AiChatResponse {
  id: string
  choices?: Array<{
    index?: number
    message?: {
      role?: 'assistant'
      content?: string
    }
    [key: string]: any
  }>
  [key: string]: any
}

/**
 * 第三方 AI 接口返回的是原始 JSON，不走项目内 code/data 包装协议。
 */
export function Ai_Chat(data: any) {
  return new Promise<AiChatResponse>((resolve, reject) => {
    uni.request({
      url: 'https://api.deepseek.com/chat/completions',
      method: 'POST',
      data,
      dataType: 'json',
      header: {
        'Authorization': SK,
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as AiChatResponse)
          return
        }

        reject(res.data || res)
      },
      fail: reject,
    })
  })
}
