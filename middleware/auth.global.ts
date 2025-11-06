import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // 公开页面
  const publicPages = ['/login']
  const isPublicPage = publicPages.includes(to.path)
  
  if (!isPublicPage && !authStore.isLoggedIn) {
    return navigateTo('/login')
  }
  
  if (to.path === '/login' && authStore.isLoggedIn) {
    return navigateTo('/')
  }
})
