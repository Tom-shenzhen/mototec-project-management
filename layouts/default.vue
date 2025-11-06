<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <img class="h-8 w-auto" src="/mototec-logo.svg" alt="Mototec Logo">
              <span class="font-bold text-xl text-gray-700">MOTOTEC 项目管理</span>
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/projects" class="text-gray-500 hover:text-gray-900">项目列表</NuxtLink>
            <NuxtLink to="/personnel-management" class="text-gray-500 hover:text-gray-900">人员管理</NuxtLink>
            <NuxtLink to="/message-board" class="text-gray-500 hover:text-gray-900">留言板</NuxtLink>
            <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium">
              退出
            </button>
          </div>
        </div>
      </nav>
    </header>
    <main class="container mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
    <footer class="text-center py-4 text-gray-500 text-sm">
      © 2025 深圳MOTOTEC - 保留所有权利
    </footer>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
