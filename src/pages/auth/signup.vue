<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Sign Up</h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}tsts</div>
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

export default {
  name: 'Signup',
  data() {
    return {
      username: '',
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
      if (!this.username || !this.email || !this.password || !this.confirmPassword) {
        this.error = 'All fields are required';
        return;
      }

      // Password confirmation validation
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      // Mock registration logic
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(user => user.username === this.username)) {
        this.error = 'Username already exists';
        return;
      }

      // Store user data
      users.push({ username: this.username, email: this.email, password: this.password });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto-login after signup
      localStorage.setItem('auth', 'true');
      this.success = 'Registration successful! Redirecting to dashboard...';
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        this.$router.push('/dashboard');
      }, 1500);

      // Optional: Example API call with axios (uncomment to use)
      /*
      try {
        const response = await axios.post('https://api.example.com/signup', {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('auth', 'true');
        this.success = 'Registration successful! Redirecting to dashboard...';
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1500);
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
      }
      */
    },
  },
};
</script>

<style scoped>
/* Ensure the eye icon is properly positioned */
.position-absolute {
  top: 55%; /* Adjust to align with input field */
}

</style>