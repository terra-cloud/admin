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
              <label for="username" class="form-label">Username</label>
              <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username">
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter email">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password">
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
export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      error: '',
      success: '',
    };
  },
  methods: {
    signup() {
      // Clear previous messages
      this.error = '';
      this.success = '';

      // Basic validation
      if (!this.username || !this.email || !this.password) {
        this.error = 'All fields are required';
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
    },
  },
};
</script>