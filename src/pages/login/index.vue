<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getWxCode } from '@/api/login'
import AiMascot from '@/components/AiMascot/index.vue'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录',
  },
})

const tokenStore = useTokenStore()
const errorMessage = ref('')
const loading = ref(false)
const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')

onLoad(() => {
  if (tokenStore.updateNowTime().hasLogin) {
    uni.switchTab({ url: '/pages/index/index' })
    return
  }
})

async function handlePasswordLogin() {
  if (loading.value)
    return

  errorMessage.value = ''
  loading.value = true
  try {
    const code = await getWxCode()
    await tokenStore.login({ code, username: username.value.trim(), password: password.value })
    uni.switchTab({ url: '/pages/index/index' })
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败，请重试；首次登录需填写用户名和密码'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="login-page">
    <view class="login-shell">
      <view class="brand">
        <view class="brand-mark" aria-hidden="true">
          <view class="brand-dot" />
          <view class="brand-dot" />
          <view class="brand-dot" />
        </view>
        <text class="brand-name">AI Chat</text>
      </view>

      <view class="login-card">
        <view class="login-mascot">
          <AiMascot />
        </view>

        <view class="login-heading">
          <text class="login-eyebrow">开启新的对话</text>
          <text class="login-title" role="heading" aria-level="1">欢迎回来</text>
          <text class="login-description">登录你的账号，继续与 AI 探索更多可能</text>
        </view>

        <view class="login-actions">
          <form class="login-form" @submit="handlePasswordLogin">
            <view class="form-field">
              <label class="field-label" for="login-username">用户名</label>
              <input
                id="login-username"
                v-model="username"
                class="login-input"
                :class="{ 'is-invalid': usernameError }"
                name="username"
                placeholder="请输入用户名"
                :disabled="loading"
                :maxlength="-1"
                confirm-type="next"
                @input="usernameError = ''; errorMessage = ''"
              >
              <text v-if="usernameError" class="field-error" role="alert">{{ usernameError }}</text>
            </view>
            <view class="form-field">
              <label class="field-label" for="login-password">密码</label>
              <input
                id="login-password"
                v-model="password"
                class="login-input"
                :class="{ 'is-invalid': passwordError }"
                name="password"
                password
                placeholder="请输入密码"
                :disabled="loading"
                :maxlength="-1"
                confirm-type="go"
                @input="passwordError = ''; errorMessage = ''"
                @confirm="handlePasswordLogin"
              >
              <text v-if="passwordError" class="field-error" role="alert">{{ passwordError }}</text>
            </view>
            <text v-if="errorMessage" class="submit-error" role="alert">{{ errorMessage }}</text>
            <button
              class="login-button"
              form-type="submit"
              :loading="loading"
              :disabled="loading"
            >
              {{ loading ? '正在登录' : '登录' }}
            </button>
          </form>
        </view>

        <view class="card-footer">
          <view class="footer-line" />
          <text>每一次对话，都有新的灵感</text>
          <view class="footer-line" />
        </view>
      </view>

      <text class="page-footer">AI Chat · 让想法从对话开始</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  --login-primary: #252820;
  --login-text: #252820;
  --login-muted: #717268;
  --login-border: #dedfd5;
  --login-accent: #d7f58a;
  --login-surface: #f8f8f2;
  --login-error: #b42318;

  display: flex;
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100dvh;
  padding: calc(40px + env(safe-area-inset-top)) 28px calc(24px + env(safe-area-inset-bottom));
  color: var(--login-text);
  background: var(--login-surface);
}

.login-shell {
  width: 100%;
  max-width: 380px;
  margin: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.brand-mark {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 30px;
  height: 30px;
  border-radius: 10px 10px 10px 3px;
  background: var(--login-primary);
}

.brand-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--login-accent);
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.login-card {
  padding: 0;
}

.login-mascot {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.login-heading {
  margin-bottom: 28px;
  text-align: center;
}

.login-eyebrow,
.login-title,
.login-description,
.login-hint,
.submit-error,
.page-footer {
  display: block;
}

.login-eyebrow {
  margin-bottom: 10px;
  color: var(--login-muted);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 3px;
}

.login-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.4;
}

.login-description {
  margin-top: 12px;
  color: var(--login-muted);
  font-size: 14px;
  line-height: 1.7;
}

.login-hint {
  margin-top: 16px;
  color: var(--login-muted);
  font-size: 13px;
  line-height: 1.7;
  text-align: center;
}

.form-field {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  color: var(--login-text);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}

.login-input {
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid var(--login-border);
  border-radius: 14px;
  color: var(--login-text);
  background: var(--login-surface);
  font-size: 16px;

  &:focus-within {
    border-color: var(--login-primary);
    outline: 2px solid var(--login-accent);
    outline-offset: 2px;
  }

  &.is-invalid {
    border-color: var(--login-error);
  }
}

.field-error {
  display: block;
  margin-top: 6px;
  color: var(--login-error);
  font-size: 13px;
  line-height: 1.5;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: var(--login-muted);
  font-size: 12px;
  line-height: 1.5;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--login-border);
}

.login-button::after {
  border: 0;
}

.submit-error {
  margin: 8px 0 16px;
  color: var(--login-error);
  font-size: 13px;
  line-height: 1.6;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  margin: 0;
  padding: 16px 20px;
  border-radius: 18px;
  color: var(--login-accent);
  background: var(--login-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease;

  &[disabled] {
    color: #f8f8f2;
    background: #73766b;
  }

  &:active:not([disabled]) {
    background: #404637;
    box-shadow: inset 0 0 0 2px var(--login-accent);
  }
}

.login-button:focus-visible {
  outline: 2px solid var(--login-primary);
  outline-offset: 4px;
}

.login-button-secondary {
  border: 1px solid var(--login-border);
  color: var(--login-primary);
  background: var(--login-surface);

  &:active:not([disabled]) {
    background: var(--login-accent);
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 36px;
  color: var(--login-muted);
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
}

.footer-line {
  flex: 1;
  max-width: 32px;
  height: 1px;
  background: var(--login-border);
}

.page-footer {
  margin-top: 32px;
  color: var(--login-muted);
  font-size: 12px;
  line-height: 1.7;
  text-align: center;
}

@media (max-width: 375px) {
  .login-page {
    padding-right: 16px;
    padding-left: 16px;
  }
}

@media (max-height: 600px) {
  .login-page {
    padding-top: calc(24px + env(safe-area-inset-top));
  }

  .brand {
    margin-bottom: 20px;
  }

  .login-mascot {
    margin-bottom: 20px;
  }

  .login-heading {
    margin-bottom: 24px;
  }

  .page-footer {
    margin-top: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-button {
    transition: none;
  }
}
</style>
