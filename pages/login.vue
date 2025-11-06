<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col relative overflow-hidden">
    <!-- 背景装饰圆圈 -->
    <div class="absolute w-[600px] h-[600px] rounded-full bg-primary opacity-30 -top-[300px] -left-[300px]"></div>
    <div class="absolute w-[400px] h-[400px] rounded-full bg-secondary opacity-30 -bottom-[200px] -right-[200px]"></div>

    <div class="relative z-10 flex-1 flex items-center justify-center px-4">
      <div class="bg-white/85 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">深圳项目资料上传下载平台</h1>
          <MototecLogo class="justify-center mb-6" />
          <h2 class="text-xl font-semibold text-gray-700">登录</h2>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </button>

          <div v-if="errorMessage" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          <p>测试账号：superadmin / admin123</p>
        </div>
      </div>
    </div>

    <footer class="relative z-10 bg-white/85 backdrop-blur-sm py-4 border-t border-gray-200">
      <div class="container mx-auto px-4 text-center text-sm text-gray-600">
        <p class="mb-2">© {{ currentYear }} 深圳MOTOTEC - 保留所有权利</p>
        <p>
          <a href="#" @click.prevent="showPrivacy" class="text-gray-600 hover:text-primary">隐私政策</a> |
          <a href="#" @click.prevent="showTerms" class="text-gray-600 hover:text-primary mx-2">使用条款</a> |
          <a href="#" @click.prevent="showContact" class="text-gray-600 hover:text-primary">联系我们</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const { $supabase } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

const currentYear = new Date().getFullYear()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await $supabase.functions.invoke('login', {
      body: {
        username: form.value.username,
        password: form.value.password
      }
    })

    if (error) {
      throw error
    }

    if (data.success && data.user) {
      authStore.setUser(data.user)
      router.push('/')
    } else {
      errorMessage.value = data.error || '登录失败'
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    errorMessage.value = error.message || '网络错误，请检查后端服务器是否已启动'
  } finally {
    loading.value = false
  }
}

const showPrivacy = () => {
  alert('隐私政策')
}

const showTerms = () => {
  alert('使用条款')
}

const showContact = () => {
  alert('联系我们\n邮箱: tom.shen@motomotionfurniture.com\n电话: 18144996280')
}

// 如果已登录，重定向到首页
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})
</script>
