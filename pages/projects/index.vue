<template>
  <NuxtLayout>
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="container mx-auto px-4 max-w-5xl">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">项目交接清单管理</h1>

        <div class="text-center mb-6">
          <button
            @click="showCreateModal = true"
            class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition mr-3"
          >
            创建新项目
          </button>
          <NuxtLink
            to="/"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition inline-block"
          >
            返回首页
          </NuxtLink>
        </div>

        <div v-if="loading" class="text-center py-10 text-gray-500">
          加载中...
        </div>

        <div v-else-if="projects.length === 0" class="bg-white rounded-lg shadow-md p-10 text-center text-gray-500">
          暂无项目，请点击"创建新项目"按钮添加
        </div>

        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
          <div
            v-for="project in projects"
            :key="project.id"
            class="border-b border-gray-200 last:border-b-0 p-5 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ project.name }}</h3>
              <p class="text-sm text-gray-500">创建时间: {{ formatDate(project.created_at) }}</p>
              <p v-if="project.description" class="text-sm text-gray-600 mt-2">
                描述: {{ project.description }}
              </p>
            </div>
            <div class="flex gap-3">
              <NuxtLink
                :to="`/projects/${project.id}`"
                class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition"
              >
                资料上传/下载
              </NuxtLink>
              <button
                @click="confirmDeleteProject(project)"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建项目弹窗 -->
    <el-dialog v-model="showCreateModal" title="创建新项目" width="500px">
      <el-form :model="newProject" label-width="100px">
        <el-form-item label="项目名称" required>
          <el-input v-model="newProject.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            v-model="newProject.description"
            type="textarea"
            :rows="3"
            placeholder="可选"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateModal = false">取消</el-button>
          <el-button type="primary" @click="createProject">创建</el-button>
        </span>
      </template>
    </el-dialog>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const { $supabase } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

interface Project {
  id: string
  name: string
  description: string
  data: any
  created_at: string
  updated_at: string
}

const projects = ref<Project[]>([])
const loading = ref(false)
const showCreateModal = ref(false)

const newProject = ref({
  name: '',
  description: ''
})

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  fetchProjects()
})

const fetchProjects = async () => {
  loading.value = true
  try {
    const { data, error } = await $supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    projects.value = data || []
  } catch (error) {
    console.error('获取项目列表失败:', error)
    ElMessage.error('加载项目列表失败')
  } finally {
    loading.value = false
  }
}

const createProject = async () => {
  if (!newProject.value.name.trim()) {
    ElMessage.warning('请输入项目名称')
    return
  }

  try {
    const { error } = await $supabase
      .from('projects')
      .insert([
        {
          name: newProject.value.name,
          description: newProject.value.description,
          data: {}
        }
      ])

    if (error) throw error

    ElMessage.success('项目创建成功！')
    showCreateModal.value = false
    newProject.value = { name: '', description: '' }
    await fetchProjects()
  } catch (error: any) {
    console.error('创建项目失败:', error)
    ElMessage.error('创建失败：' + error.message)
  }
}

const confirmDeleteProject = async (project: Project) => {
  ElMessageBox.confirm(
    `确定要删除项目「${project.name}」吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { error } = await $supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) throw error
      ElMessage.success('项目已成功删除！')
      await fetchProjects()
    } catch (error) {
      console.error('删除项目失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>
