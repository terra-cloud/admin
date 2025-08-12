<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Sign Up</h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="success" class="alert alert-success">{{ success }}</div>
            
            <div class="mb-3">
              <label for="email" class="form-label">Email <span class="red">*</span></label>
              <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter email">
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input v-model="name" type="text" class="form-control" id="name" placeholder="Enter name">
            </div>
            <div class="mb-3 position-relative">
              <label for="password" class="form-label">Password</label>
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control" 
                id="password" 
                placeholder="Enter password"
              >
              <span 
                class="position-absolute end-0 pe-3" 
                style="cursor: pointer;"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <div class="mb-3 position-relative">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input 
                v-model="confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                class="form-control" 
                id="confirmPassword" 
                placeholder="Confirm password"
              >
              <span 
                class="position-absolute end-0 pe-3" 
                style="cursor: pointer;"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <button @click="signup" class="btn btn-primary w-100">Sign Up</button>
            <p class="mt-3 text-center">
              Already have an account? <router-link to="/login">Login</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Uncomment the following line if using axios for API calls
// import axios from 'axios';
import {
  apiRegister,
  apiLogin
} from '@/apis/auth'

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
      // Clear previous messages
      this.error = '';
      this.success = '';

      // Basic validation
      if (!this.name || !this.email || !this.password || !this.confirmPassword) {
        this.error = 'All fields are required';
        return;
      }

      // Password confirmation validation
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      // Optional: Example API call with axios (uncomment to use)
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

<style scoped>
/* Ensure the eye icon is properly positioned */
.position-absolute {
  top: 55%; /* Adjust to align with input field */
}

</style>