<template>
  <NuxtLayout>
    <div class="bg-gray-50 min-h-screen">
      <div class="container mx-auto px-4 py-6">
        <div class="mb-6">
          <h2 class="text-3xl font-bold">用户权限管理</h2>
          <p class="text-gray-500 mt-1">管理系统用户、角色及相关权限配置</p>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-lg">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
            <h3 class="font-bold text-lg">用户列表</h3>
            <div class="flex flex-wrap gap-3">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="按用户名搜索..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <select
                v-model="filterRole"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">所有角色</option>
                <option value="superadmin">超级管理员</option>
                <option value="admin">管理员</option>
                <option value="user">用户</option>
              </select>
              <button
                @click="showUserModal(null)"
                class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <span>➕</span> 新建用户
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">用户信息</th>
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">角色</th>
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">文件权限</th>
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">创建时间</th>
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {{ user.username[0].toUpperCase() }}
                      </div>
                      <div>
                        <p class="font-medium text-sm">{{ user.username }}</p>
                        <p class="text-xs text-gray-500">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ getRoleText(user.role) }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-600">
                    {{ getPermissionText(user.file_permission) }}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-500">
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <button
                        @click="showUserModal(user)"
                        class="text-primary hover:text-primary/80 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        v-if="canDeleteUser(user)"
                        @click="confirmDelete(user)"
                        class="text-red-500 hover:text-red-700 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6">
            <p class="text-sm text-gray-500">共 {{ filteredUsers.length }} 条记录</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingUser ? '编辑用户' : '新建用户'"
      width="500px"
    >
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item v-if="!editingUser" label="密码">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="用户" value="user" />
            <el-option label="管理员" value="admin" />
            <el-option label="超级管理员" value="superadmin" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件权限">
          <el-select v-model="userForm.file_permission" placeholder="请选择文件权限">
            <el-option label="可上传下载" value="both" />
            <el-option label="仅上传" value="upload" />
            <el-option label="仅下载" value="download" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import type { User } from '~/stores/auth'

const { $supabase } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

const users = ref<User[]>([])
const searchTerm = ref('')
const filterRole = ref('all')
const dialogVisible = ref(false)
const editingUser = ref<User | null>(null)

const userForm = ref({
  username: '',
  email: '',
  password: '',
  role: 'user',
  file_permission: 'both'
})

onMounted(() => {
  if (!authStore.isLoggedIn || !authStore.canManageUsers()) {
    router.push('/')
    return
  }
  fetchUsers()
})

const fetchUsers = async () => {
  try {
    const { data, error } = await $supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('获取用户失败:', error)
    ElMessage.error('加载用户列表失败')
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesRole = filterRole.value === 'all' || user.role === filterRole.value
    return matchesSearch && matchesRole
  })
})

const showUserModal = (user: User | null) => {
  editingUser.value = user
  if (user) {
    userForm.value = {
      username: user.username,
      email: user.email || '',
      password: '',
      role: user.role,
      file_permission: user.file_permission
    }
  } else {
    userForm.value = {
      username: '',
      email: '',
      password: '',
      role: 'user',
      file_permission: 'both'
    }
  }
  dialogVisible.value = true
}

const saveUser = async () => {
  try {
    if (editingUser.value) {
      // 更新用户
      const { error } = await $supabase
        .from('users')
        .update({
          username: userForm.value.username,
          email: userForm.value.email,
          role: userForm.value.role,
          file_permission: userForm.value.file_permission,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.value.id)

      if (error) throw error
      ElMessage.success('用户信息更新成功！')
    } else {
      // 创建新用户
      const { error } = await $supabase
        .from('users')
        .insert([{
          username: userForm.value.username,
          email: userForm.value.email,
          password_hash: '$2a$10$3euPcmQFCiblsZeEu5s7p.z5Zz5Zz5Zz5Zz5Zz5Zz5Zz5Zz5Zz5a', // 默认密码hash
          role: userForm.value.role,
          file_permission: userForm.value.file_permission
        }])

      if (error) throw error
      ElMessage.success('新用户添加成功！')
    }

    dialogVisible.value = false
    await fetchUsers()
  } catch (error: any) {
    console.error('保存用户失败:', error)
    ElMessage.error('保存失败：' + error.message)
  }
}

const confirmDelete = async (user: User) => {
  ElMessageBox.confirm(
    `确定要删除用户「${user.username}」吗？此操作不可撤销。`,
    '确认删除',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { error } = await $supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (error) throw error
      ElMessage.success('用户已删除！')
      await fetchUsers()
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const canDeleteUser = (user: User) => {
  if (user.id === authStore.user?.id) return false
  if (authStore.user?.role === 'superadmin' && user.role !== 'superadmin') return true
  if (authStore.user?.role === 'admin' && user.role === 'user') return true
  return false
}

const getRoleBadgeClass = (role: string) => {
  const classes = 'px-2.5 py-1 rounded-full text-xs font-semibold '
  switch (role) {
    case 'superadmin':
      return classes + 'bg-primary/10 text-primary'
    case 'admin':
      return classes + 'bg-yellow-100 text-yellow-800'
    case 'user':
      return classes + 'bg-blue-100 text-blue-800'
    default:
      return classes + 'bg-gray-100 text-gray-800'
  }
}

const getRoleText = (role: string) => {
  const map: Record<string, string> = {
    superadmin: '超级管理员',
    admin: '管理员',
    user: '用户'
  }
  return map[role] || role
}

const getPermissionText = (permission: string) => {
  const map: Record<string, string> = {
    both: '可上传下载',
    upload: '仅上传',
    download: '仅下载'
  }
  return map[permission] || permission
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>
