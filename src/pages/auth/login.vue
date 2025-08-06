<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Login</h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password">
            </div>
            <button @click="login" class="btn btn-primary w-100">Login</button>
            <p class="mt-3 text-center">
              Don't have an account? <router-link to="/signup">Sign Up</router-link>
            </p>
          </div>
        </div>
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
      username: '',
      password: '',
      error: '',
    };
  },
  mounted(){
    this.checkLogin();
  },
  methods: {
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
        console.log(data, 'data')
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