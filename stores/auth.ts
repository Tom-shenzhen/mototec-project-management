import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    error: null as any,
    loading: false,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  
  // 方法（非 actions）
  canManageUsers() {
    // 简单实现：所有登录用户都可以管理用户
    return this.isLoggedIn
  },
  
  actions: {
    // 设置用户信息（login.vue 需要调用）
    setUser(user: any) {
      this.user = user
    },
    
    // 登录方法（保留原有逻辑，但不会被使用）
    async login(credentials: any) {
      const supabase = useSupabaseClient()
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email || credentials.username,
          password: credentials.password,
        })

        if (error) {
          this.error = error
          this.user = null
          throw error
        } else {
          this.user = data.user
          return data
        }
      } finally {
        this.loading = false
      }
    },

    // 注册方法
    async signup(credentials: any) {
      const supabase = useSupabaseClient()
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              username: credentials.username,
              role: 'user',
              file_permission: 'both'
            }
          }
        })

        if (error) {
          this.error = error
          throw error
        }
        
        return data
      } finally {
        this.loading = false
      }
    },

    // 退出登录
    async logout() {
      const supabase = useSupabaseClient()
      this.loading = true
      
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          this.error = error
        } else {
          this.user = null
        }
      } finally {
        this.loading = false
      }
    },

    // 获取当前用户
    async fetchUser() {
      const supabase = useSupabaseClient()
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    }
  },
})
