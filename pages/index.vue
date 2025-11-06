<template>
  <NuxtLayout>
    <div class="min-h-[calc(100vh-200px)] bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
      <!-- 3D 动画容器 -->
      <div class="animation-container">
        <div class="inner">
          <div class="card" style="--index: 0; --color-card: 0, 114, 198;"></div>
          <div class="card" style="--index: 1; --color-card: 247, 148, 29;"></div>
          <div class="card" style="--index: 2; --color-card: 102, 102, 102;"></div>
        </div>
      </div>

      <!-- 功能选项 -->
      <div class="function-options">
        <NuxtLink
          to="/projects"
          class="function-item"
        >
          <span class="func-icon">📤📥</span>
          <span class="func-text">资料上传下载</span>
        </NuxtLink>

        <NuxtLink
          v-if="authStore.canManageUsers()"
          to="/personnel-management"
          class="function-item"
        >
          <span class="func-icon">👥</span>
          <span class="func-text">人员管理</span>
        </NuxtLink>

        <NuxtLink
          to="/message-board"
          class="function-item"
        >
          <span class="func-icon">💬</span>
          <span class="func-text">留言板</span>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// 检查登录状态
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<style scoped>
.animation-container {
  width: 100%;
  height: 160px;
  position: absolute;
  top: 50%;
  transform: translateY(-150%);
}

.inner {
  --w: 80px;
  --h: 120px;
  --translateZ: 130px;
  --rotateX: -15deg;
  --perspective: 1000px;
  --quantity: 3;
  
  position: absolute;
  width: var(--w);
  height: var(--h);
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  transform: perspective(var(--perspective)) translateY(-50%) translateX(-50%);
  animation: rotating 20s linear infinite;
}

@keyframes rotating {
  from {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0);
  }
  to {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn);
  }
}

.card {
  position: absolute;
  border: 2px solid rgba(var(--color-card), 0.8);
  border-radius: 12px;
  overflow: hidden;
  inset: 0;
  transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(var(--color-card), 0.2) 0%,
    rgba(var(--color-card), 0.6) 80%,
    rgba(var(--color-card), 0.9) 100%
  );
}

.function-options {
  display: flex;
  gap: 80px;
  align-items: center;
  position: relative;
  top: 80px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 20px;
}

.function-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 22px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  padding: 20px 35px;
  border-radius: 35px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  text-decoration: none;
}

.function-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  color: #0072c6;
}

.func-icon {
  font-size: 26px;
}
</style>
