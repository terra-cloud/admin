<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-soft overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-text-primary">Email</h2>
      </div>

      <div class="px-6 py-4">
        <div v-if="emailSaved" class="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
          Email updated successfully.
        </div>
        <div v-if="emailError" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ emailError }}
        </div>

        <form @submit.prevent="updateEmail">
          <div class="mb-4">
            <label for="currentEmail" class="block text-sm font-medium text-gray-700 mb-1">Current Email</label>
            <input
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
              id="currentEmail"
              :value="currentEmail"
              disabled
            />
          </div>
          <div class="mb-4">
            <label for="newEmail" class="block text-sm font-medium text-gray-700 mb-1">New Email</label>
            <input
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="newEmail"
              v-model="emailForm.new_email"
              required
            />
          </div>
          <div class="flex items-center justify-end">
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              :disabled="emailSaving"
            >
              {{ emailSaving ? 'Updating...' : 'Update Email' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-soft overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-text-primary">Password</h2>
      </div>

      <div class="px-6 py-4">
        <div v-if="passwordSaved" class="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
          Password updated successfully.
        </div>
        <div v-if="passwordError" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ passwordError }}
        </div>

        <form @submit.prevent="updatePassword">
          <div class="mb-4">
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="currentPassword"
              v-model="passwordForm.current_password"
              required
            />
          </div>
          <div class="mb-4">
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="newPassword"
              v-model="passwordForm.new_password"
              required
              minlength="8"
            />
          </div>
          <div class="mb-4">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="confirmPassword"
              v-model="passwordForm.new_password_confirmation"
              required
            />
          </div>
          <div class="flex items-center justify-end">
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              :disabled="passwordSaving"
            >
              {{ passwordSaving ? 'Updating...' : 'Update Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { state, setAdmin } from '@/stores/auth';
import { apiUpdateEmail, apiUpdatePassword } from '@/apis/profile';

export default {
  data() {
    return {
      emailForm: {
        new_email: '',
      },
      emailSaving: false,
      emailSaved: false,
      emailError: null,
      passwordForm: {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      },
      passwordSaving: false,
      passwordSaved: false,
      passwordError: null,
    };
  },
  computed: {
    currentEmail() {
      return state.admin?.email || '';
    },
  },
  methods: {
    async updateEmail() {
      this.emailSaving = true;
      this.emailSaved = false;
      this.emailError = null;
      try {
        const { data } = await apiUpdateEmail({ email: this.emailForm.new_email });
        if (data?.success && data?.admin) {
          setAdmin(data.admin);
        }
        this.emailSaved = true;
        this.emailForm.new_email = '';
      } catch (err) {
        this.emailError = err.response?.data?.error || 'Failed to update email.';
      } finally {
        this.emailSaving = false;
      }
    },
    async updatePassword() {
      if (this.passwordForm.new_password !== this.passwordForm.new_password_confirmation) {
        this.passwordError = 'Passwords do not match.';
        return;
      }
      this.passwordSaving = true;
      this.passwordSaved = false;
      this.passwordError = null;
      try {
        await apiUpdatePassword({
          current_password: this.passwordForm.current_password,
          new_password: this.passwordForm.new_password,
          new_password_confirmation: this.passwordForm.new_password_confirmation,
        });
        this.passwordSaved = true;
        this.passwordForm = {
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        };
      } catch (err) {
        this.passwordError = err.response?.data?.error || 'Failed to update password.';
      } finally {
        this.passwordSaving = false;
      }
    },
  },
};
</script>
