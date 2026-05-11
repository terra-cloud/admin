<template>
  <div class="auth-bg relative flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col justify-center w-full max-w-md">
      <div class="flex flex-col items-center justify-center p-6 md:p-10 bg-card-light dark:bg-card-dark rounded-xl shadow-lifted">
        <div class="flex flex-col items-center gap-4 mb-8">
          <svg class="text-primary" fill="none" height="48" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <div class="flex flex-col items-center gap-2 text-center">
            <p class="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Terra PH Admin</p>
            <p class="text-text-muted-light dark:text-text-muted-dark text-base font-normal">Welcome back! Please enter your details.</p>
          </div>
        </div>

        <div v-if="error" class="w-full mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">{{ error }}</div>

        <div class="w-full flex flex-col gap-6">
          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Email</p>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">person</span>
              <input v-model="email" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-4 text-base font-normal shadow-soft" placeholder="Enter your email"/>
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Password</p>
            <div class="relative flex w-full items-center rounded-lg">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">lock</span>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-12 text-base font-normal shadow-soft" placeholder="Enter your password" @keyup.enter="handleLogin"/>
              <button type="button" aria-label="Toggle password visibility" class="absolute right-4 text-text-muted-light dark:text-text-muted-dark cursor-pointer" @click="showPassword = !showPassword">
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </label>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <input class="form-checkbox h-4 w-4 rounded text-primary focus:ring-primary/50 border-gray-300 dark:border-gray-600 bg-input-light dark:bg-input-dark" id="remember-me" type="checkbox" v-model="rememberMe"/>
              <label class="text-sm text-text-muted-light dark:text-text-muted-dark" for="remember-me">Remember me</label>
            </div>
            <a class="text-primary text-sm font-medium hover:underline" href="#">Forgot Password?</a>
          </div>
        </div>

        <div class="w-full mt-8 flex flex-col gap-4">
          <button @click="handleLogin" :disabled="loading" class="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold tracking-wide shadow-soft hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200">
            <span v-if="loading" class="truncate">Signing in...</span>
            <span v-else class="truncate">Login</span>
          </button>
          <p class="text-text-muted-light dark:text-text-muted-dark text-sm text-center">
            Don't have an account?
            <router-link class="font-medium text-primary hover:underline" to="/signup">Sign Up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiLogin } from '@/apis/auth'
import { setAccessToken, setAdmin } from '@/stores/auth'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
      showPassword: false,
      rememberMe: false,
    };
  },
  methods: {
    handleLogin(){
      this.error = ''
      this.loading = true
      apiLogin({
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe
      })
      .then(({data}) => {
        if (data?.access_token) {
          setAccessToken(data.access_token, this.rememberMe)
          setAdmin(data.admin)
          this.$router.push({name: 'dashboard'})
        }
      })
      .catch((error) => {
        this.error = error.response?.data?.error || error.message || 'Login failed'
      })
      .finally(() => {
        this.loading = false
      })
    }
  },
};
</script>
