import type { IAuthLoginRes, ICaptcha, IDoubleTokenRes, IUpdateInfo, IUpdatePassword, IUserInfoRes } from './types/login'
import { http } from '@/http/http'

/**
 * 登录表单
 */
export interface ILoginForm {
  username: string
  password: string
  code: string
}

/**
 * 获取验证码
 * @returns ICaptcha 验证码
 */
export function getCode() {
  return http.get<ICaptcha>('/user/getCode')
}

/**
 * 用户登录
 * @param loginForm 登录表单
 */
export function login(loginForm: ILoginForm) {
  return http.post<IAuthLoginRes>('/user/login', loginForm)
}

/**
 * 刷新token
 * @param refreshToken 刷新token
 */
export function refreshToken(refreshToken: string) {
  return http.post<IDoubleTokenRes>('/user/refresh', { refreshToken })
}

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<IUserInfoRes> {
  const user = await http.get<IUserInfoRes & { id: number }>('/user/info')
  return { ...user, userId: user.id }
}

/**
 * 退出登录
 */
export function logout() {
  return http.post<void>('/user/logout')
}

/**
 * 修改用户信息
 */
export function updateInfo(data: IUpdateInfo) {
  return http.post('/user/updateInfo', data)
}

/**
 * 修改用户密码
 */
export function updateUserPassword(data: IUpdatePassword) {
  return http.post('/user/updatePassword', data)
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<string>((resolve, reject) => {
    // #ifndef MP-WEIXIN
    reject(new Error('请在微信小程序中登录'))
    return
    // #endif
    // #ifdef MP-WEIXIN
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.code)
          resolve(res.code)
        else
          reject(new Error('获取微信登录凭证失败'))
      },
      fail: err => reject(new Error(err.errMsg)),
    })
    // #endif
  })
}

/**
 * 微信登录
 * @param params 微信登录参数，包含code
 * @returns Promise 包含登录结果
 */
export function wxLogin(data: ILoginForm) {
  return login(data)
}
