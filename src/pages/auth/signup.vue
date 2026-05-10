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
            <p class="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Create Account</p>
            <p class="text-text-muted-light dark:text-text-muted-dark text-base font-normal">Join Terra PH Admin today.</p>
          </div>
        </div>

        <div v-if="error" class="w-full mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">{{ error }}</div>
        <div v-if="success" class="w-full mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">{{ success }}</div>

        <div class="w-full flex flex-col gap-6">
          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Name</p>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">badge</span>
              <input v-model="name" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-4 text-base font-normal shadow-soft" placeholder="Enter your name"/>
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Email <span class="text-primary">*</span></p>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">email</span>
              <input v-model="email" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-4 text-base font-normal shadow-soft" placeholder="Enter your email"/>
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Password</p>
            <div class="relative flex w-full items-center rounded-lg">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">lock</span>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-12 text-base font-normal shadow-soft" placeholder="Enter your password"/>
              <button type="button" aria-label="Toggle password visibility" class="absolute right-4 text-text-muted-light dark:text-text-muted-dark cursor-pointer" @click="showPassword = !showPassword">
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Confirm Password</p>
            <div class="relative flex w-full items-center rounded-lg">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">lock</span>
              <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-12 text-base font-normal shadow-soft" placeholder="Confirm your password"/>
              <button type="button" aria-label="Toggle password visibility" class="absolute right-4 text-text-muted-light dark:text-text-muted-dark cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </label>
        </div>

        <div class="w-full mt-8 flex flex-col gap-4">
          <button @click="signup" class="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold tracking-wide shadow-soft hover:bg-primary/90 transition-all duration-200">
            <span class="truncate">Sign Up</span>
          </button>
          <p class="text-text-muted-light dark:text-text-muted-dark text-sm text-center">
            Already have an account?
            <router-link class="font-medium text-primary hover:underline" to="/login">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiRegister, apiLogin } from '@/apis/auth'

export default {
  name: 'Signup',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      error: '',
      success: '',
    };
  },
  methods: {
    async signup() {
      this.error = '';
      this.success = '';

      if (!this.name || !this.email || !this.password || !this.confirmPassword) {
        this.error = 'All fields are required';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      try {
        const response = await apiRegister({
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.confirmPassword,
        });
        this.success = 'Registration successful! Redirecting to dashboard...';
        if(response.status == 200){
          setTimeout(() => {
            this.handleLogin()
          }, 1500);
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
      }
    },
    handleLogin(){
      apiLogin({
        email: this.email,
        password: this.password
      })
      .then(({data}) => {
        if(data && data.token) {
          localStorage.setItem('token', data.token)
          this.$router.push({name: 'dashboard'})
        }
      })
      .catch((error) => {
        this._catchErrors(error)
      })
    }
  },
};
</script>
