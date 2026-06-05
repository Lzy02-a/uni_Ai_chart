import { http } from '@/http/http'

const SK = 'Bearer sk-c62f4f2a28ce4e22882f308badf22591'

/**
 * 用户登录
 * @param Ai_Chat ai接口
 */
export function Ai_Chat(data: any) {
  console.log(SK)
  return http.post('https://api.deepseek.com/chat/completions', data, undefined, { Authorization: SK })
}
