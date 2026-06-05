<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '首页',
  },
})

function goChat() {
  uni.navigateTo({
    url: '/pages/ai_chat/index',
  })
}
</script>

<template>
  <div class="page">
    <view class="btn-chart" @click="goChat()">
      进入Ai_Chat页面：
    </view>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .btn-chart {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007AFF;
    color: #fff;
    border-radius: 4px;
    font-size: 16px;
  }
}
</style>
