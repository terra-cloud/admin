<template>
<div class="relative flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 group/design-root overflow-x-hidden">

  <div class="w-full max-w-md bg-white dark:bg-slate-800/50 rounded-xl shadow-2xl p-8 backdrop-blur-sm border border-white/30 dark:border-slate-700/50">

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
    </div>

    <div class="flex flex-col gap-6">

      <div class="flex flex-col min-w-40 flex-1">
        <p class="text-[#0d141b] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Email</p>
        <input
        v-model="email"
        class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary h-12 dark:placeholder-slate-500 p-[15px] text-sm font-normal leading-normal shadow-sm" 
        placeholder="Enter your email address"
        />
      </div>
      <div class="flex flex-col min-w-40 flex-1">
        <p class="text-[#0d141b] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Password</p>
        <div class="flex w-full flex-1 items-stretch rounded-lg shadow-sm">
          <input 
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          @keyup.enter="handleLogin"
          class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary h-12 dark:placeholder-slate-500 p-[15px] rounded-r-none border-r-0 pr-2 text-sm font-normal leading-normal" 
          placeholder="Enter your password"
          />
          <button 
          @click="togglePassword"
          class="text-[#4c739a] dark:text-slate-400 flex border border-[#cfdbe7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 items-center justify-center px-4 rounded-r-lg border-l-0 hover:bg-slate-100 dark:hover:bg-slate-700">
            <span class="material-symbols-outlined text-xl">
              {{ showPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <button 
      @click="handleLogin"
      class="flex w-full items-center text-white justify-center rounded-lg h-12 px-6  font-medium leading-normal bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Login</button>
    </div>
    <div class="mt-6 text-center">
      <p class="text-sm text-[#4c739a] dark:text-slate-400">
      Don't have an account? 
      <a class="font-medium text-primary hover:underline" href="#">Register</a>
    </p>
    </div>
  </div>
</div>
</template>

<script>
import {
  apiLogin, apiCheckUser
} from '@/apis/auth'

export default {
  name: 'Login',
  data() {
    return {
      email: 'superadmin@terra.com',
      password: 'terra123123123',
      error: '',
      showPassword: false
    };
  },
  mounted(){
    this.checkLogin();
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    checkLogin() {
      apiCheckUser().then(({data}) => {
        if(data.result){
          this.$router.push('/dashboard')
        }
      })
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