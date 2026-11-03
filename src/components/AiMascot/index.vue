<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 整体宽度，单位 px，高度按原比例缩放。 */
  size?: number
  /** 关闭后保留静态造型。 */
  animated?: boolean
  bodyColor?: string
  accentColor?: string
  surfaceColor?: string
}>(), {
  size: 184,
  animated: true,
  bodyColor: '#252820',
  accentColor: '#d7f58a',
  surfaceColor: '#f8f8f2',
})

const size = computed(() => Number.isFinite(props.size) && props.size > 0 ? props.size : 184)
const mascotStyle = computed(() => ({
  'width': `${size.value}px`,
  'height': `${size.value * 144 / 184}px`,
  '--mascot-body': props.bodyColor,
  '--mascot-accent': props.accentColor,
  '--mascot-surface': props.surfaceColor,
}))
</script>

<template>
  <view class="ai-mascot" :class="{ 'is-animated': animated }" :style="mascotStyle" aria-hidden="true">
    <view class="mascot-canvas" :style="{ transform: `scale(${size / 184})` }">
      <view class="mascot-shadow" />
      <view class="mascot-body">
        <view class="mascot-eye" />
        <view class="mascot-eye" />
        <view class="mascot-cheek mascot-cheek-left" />
        <view class="mascot-cheek mascot-cheek-right" />
      </view>
      <view class="mascot-bubble">
        <view class="bubble-dot" />
        <view class="bubble-dot" />
        <view class="bubble-dot" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.ai-mascot {
  position: relative;
  flex-shrink: 0;
}

.mascot-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 184px;
  height: 144px;
  transform-origin: top left;
}

.mascot-shadow {
  position: absolute;
  right: 26px;
  bottom: 0;
  left: 20px;
  height: 12px;
  border-radius: 50%;
  background: var(--mascot-body);
  opacity: 0.08;
}

.mascot-body {
  position: absolute;
  bottom: 12px;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 23px;
  width: 136px;
  height: 108px;
  border-radius: 48% 48% 40% 40%;
  background: var(--mascot-body);
  transform: rotate(-8deg);
}

.mascot-eye {
  width: 10px;
  height: 17px;
  border-radius: 50%;
  background: var(--mascot-accent);
}

.mascot-cheek {
  position: absolute;
  top: 65px;
  width: 16px;
  height: 7px;
  border-radius: 50%;
  background: #edb9a7;
}

.mascot-cheek-left {
  left: 28px;
}

.mascot-cheek-right {
  right: 28px;
}

.mascot-bubble {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 58px;
  height: 42px;
  border: 4px solid var(--mascot-surface);
  border-radius: 20px 20px 20px 5px;
  background: var(--mascot-accent);
  transform: rotate(8deg);
}

.bubble-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--mascot-body);
}

.is-animated .mascot-body {
  animation: mascot-sway 3.6s ease-in-out infinite;
}

.is-animated .mascot-eye {
  animation: mascot-blink 5s ease-in-out infinite;
}

@keyframes mascot-sway {
  0%,
  100% {
    transform: translateY(0) rotate(-8deg);
  }
  50% {
    transform: translateY(-5px) rotate(-4deg);
  }
}

@keyframes mascot-blink {
  0%,
  42%,
  48%,
  100% {
    transform: scaleY(1);
  }
  45% {
    transform: scaleY(0.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-animated .mascot-body,
  .is-animated .mascot-eye {
    animation: none;
  }
}
</style>
