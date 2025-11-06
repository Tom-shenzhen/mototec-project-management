<template>
  <NuxtLayout>
    <div class="bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">留言板</h1>

        <!-- 留言表单 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 class="text-xl font-semibold mb-4 text-gray-700">添加新留言</h2>
          <form @submit.prevent="submitMessage" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                留言人
              </label>
              <input
                id="name"
                v-model="newMessage.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div>
              <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
                留言内容
              </label>
              <textarea
                id="content"
                v-model="newMessage.content"
                rows="4"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md transition flex items-center disabled:opacity-50"
            >
              <span class="mr-2">✈️</span> 提交留言
            </button>
          </form>
        </div>

        <!-- 留言列表 -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <span class="mr-2 text-secondary">💬</span> 留言列表
          </h2>

          <div v-if="loading" class="text-center text-gray-500 py-10">
            加载中...
          </div>

          <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-10">
            暂无留言，快来添加第一条留言吧！
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="message in messages"
              :key="message.id"
              class="bg-white rounded-lg shadow-md p-5"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800 flex items-center">
                  <span class="mr-2 text-primary">👤</span>{{ message.name }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500">{{ formatDate(message.created_at) }}</span>
                  <button
                    v-if="authStore.canDeleteMessages()"
                    @click="deleteMessage(message.id)"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
              <p class="text-gray-700">{{ message.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const { $supabase } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

interface Message {
  id: number
  name: string
  content: string
  created_at: string
}

const messages = ref<Message[]>([])
const loading = ref(false)
const submitting = ref(false)

const newMessage = ref({
  name: '',
  content: ''
})

// 检查登录状态
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  fetchMessages()
})

const fetchMessages = async () => {
  loading.value = true
  try {
    const { data, error } = await $supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    messages.value = data || []
  } catch (error) {
    console.error('获取留言失败:', error)
    ElMessage.error('加载留言失败')
  } finally {
    loading.value = false
  }
}

const submitMessage = async () => {
  submitting.value = true
  try {
    const { error } = await $supabase
      .from('messages')
      .insert([
        {
          name: newMessage.value.name,
          content: newMessage.value.content,
          user_id: authStore.user?.id
        }
      ])

    if (error) throw error

    ElMessage.success('留言添加成功！')
    newMessage.value = { name: '', content: '' }
    await fetchMessages()
  } catch (error) {
    console.error('提交留言失败:', error)
    ElMessage.error('留言失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const deleteMessage = async (id: number) => {
  if (!confirm('确定要删除这条留言吗？')) return

  try {
    const { error } = await $supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) throw error

    ElMessage.success('留言已删除！')
    await fetchMessages()
  } catch (error) {
    console.error('删除留言失败:', error)
    ElMessage.error('删除失败，请稍后重试')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>
