<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-text-primary">Edit User</h2>
    </div>
    <div class="px-6 py-4">
      <form @submit.prevent="saveUser">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="mb-4">
            <label for="editName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="editName"
              v-model="form.name"
              required
            />
          </div>
          <div class="mb-4">
            <label for="editLastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="editLastName"
              v-model="form.last_name"
              required
            />
          </div>
          <div class="mb-4">
            <label for="editDisplayName" class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="editDisplayName"
              v-model="form.display_name"
            />
          </div>
          <div class="mb-4">
            <label for="editAccountType" class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              id="editAccountType"
              v-model="form.account_type"
              required
            >
              <option value="1">User</option>
              <option value="2">Employer</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="editBirthdate" class="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
            <input
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="editBirthdate"
              v-model="form.birthdate"
              required
            />
          </div>
          <div class="mb-4">
            <label for="editGender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              id="editGender"
              v-model="form.gender"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            @click="$router.back()"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Save changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default {
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {
      saving: false,
    };
  },
  computed: {
    form() {
      return {
        name: this.user.name || '',
        last_name: this.user.last_name || '',
        display_name: this.user.display_name || '',
        email: this.user.email || '',
        birthdate: this.user.birthdate ? new Date(this.user.birthdate).toISOString().split('T')[0] : '',
        gender: this.user.gender || '',
        account_type: this.user.account_type ? String(this.user.account_type) : '1',
      };
    },
  },
  methods: {
    async saveUser() {
      this.saving = true;
      try {
        await setDoc(doc(db, 'users', this.$route.params.id), {
          name: this.form.name,
          last_name: this.form.last_name,
          display_name: this.form.display_name,
          birthdate: this.form.birthdate,
          gender: this.form.gender,
          account_type: parseInt(this.form.account_type),
        }, { merge: true });
        this.$emit('saved');
      } catch (err) {
        this.$emit('save-error', 'Failed to update user.');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
