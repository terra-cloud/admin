<template>
  <div class="container-fluid">
    <h1 class="mb-4"><i class="fas fa-newspaper me-2" aria-hidden="true"></i> News</h1>
    <!-- Toast Component -->
    <Toast
      :message="toastMessage"
      :type="toastType"
      :showConfirmButtons="false"
      @cancel="hideToast"
    />
    <!-- Confirm Dialog Component -->
    <ConfirmDialog
      :show="isConfirmDialogVisible"
      :message="confirmMessage"
      :currentId="confirmId"
      @confirm="confirmDelete"
      @close="hideConfirmDialog"
    />
    <!-- Add News Button -->
    <div class="mb-4 col-12 d-flex justify-content-end">
      <button class="btn btn-success" @click="showFormModal"><i class="fas fa-plus me-1" aria-hidden="true"></i> Add News</button>
    </div>
    <!-- News List -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th class="text-center" scope="col">Image</th>
                <th @click="sort('title')">Title <i class="fas" :class="sortIcon('title')"></i></th>
                <th @click="sort('description')">Description <i class="fas" :class="sortIcon('description')"></i></th>
                <th @click="sort('status')">Status <i class="fas" :class="sortIcon('status')"></i></th>
                <th @click="sort('type')">Type <i class="fas" :class="sortIcon('type')"></i></th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="news in paginatedNews" :key="news.id">
                <td class="text-center">
                  <img
                    v-if="news.image_url"
                    :src="news.image_url"
                    alt="News Image"
                    class="img-thumbnail"
                    style="max-width: 50px;"
                  />
                  <span v-else>N/A</span>
                </td>
                <td>{{ news.title }}</td>
                <td>{{ $filters.truncate(news.description, 50) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(news.status)">
                    {{ mapStatus(news.status) }}
                  </span>
                </td>
                <td>{{ news.type }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="editNews(news)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteNews(news.id, news.image_url)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Pagination -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :tableData="tableData"
        @setPage="setPage"
        @prevPage="prevPage"
        @nextPage="nextPage"
        @firstPage="setPage(1)"
        @lastPage="setPage(totalPages)"
      />
    </div>
    <!-- Form Modal -->
    <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="formModalLabel">{{ editMode ? 'Edit News' : 'Add News' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cancelEdit"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveNews">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input
                    id="title"
                    type="text"
                    class="form-control"
                    v-model="currentNews.title"
                    required
                    placeholder="Enter news title"
                    :disabled="isSaving"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="type" class="form-label">Type</label>
                  <select id="type" class="form-select" v-model="currentNews.type" required :disabled="isSaving">
                    <option value="General">General</option>
                    <option value="Event">Event</option>
                    <option value="Update">Update</option>
                  </select>
                </div>
                <div class="col-12 mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    id="description"
                    class="form-control"
                    v-model="currentNews.description"
                    rows="4"
                    placeholder="Enter news description"
                    :disabled="isSaving"
                  ></textarea>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select id="status" class="form-select" v-model.number="currentNews.status" required :disabled="isSaving">
                    <option :value="0">Draft</option>
                    <option :value="1">Published</option>
                    <option :value="2">Archived</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="image" class="form-label">Image</label>
                  <input
                    id="image"
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="handleImageUpload"
                    :disabled="isSaving"
                  />
                  <div v-if="currentNews.image_url" class="mt-2">
                    <img :src="currentNews.image_url" alt="News Image" class="img-thumbnail" style="max-width: 100px;" />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="cancelEdit" :disabled="isSaving">Cancel</button>
                  <button type="submit" class="btn btn-success" style="margin-top:16px;" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    <i v-if="!isSaving" class="fas fa-plus me-1" aria-hidden="true"></i>
                    {{ isSaving ? 'Saving...' : editMode ? 'Update' : 'Add' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewsDataService from '@/services/NewsDataService';
import Pagination from '@/components/Pagination.vue';
import Toast from '@/components/Toast.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { ref } from 'vue';
import { Modal } from 'bootstrap';

export default {
  components: {
    Pagination,
    Toast,
    ConfirmDialog
  },
  data() {
    return {
      newsList: [],
      currentNews: {
        id: null,
        title: '',
        description: '',
        status: 0,
        type: 'General',
        image_url: ''
      },
      imageFile: null,
      originalImageUrl: '',
      editMode: false,
      currentPage: 1,
      newsPerPage: 10,
      formModal: null,
      toastMessage: '',
      toastType: '',
      isConfirmDialogVisible: false,
      confirmMessage: '',
      confirmId: null,
      isSaving: false,
      sortKey: '',
      sortOrder: 'asc'
    };
  },
  computed: {
    sortedNews() {
      if (!this.sortKey) return this.newsList;
      const sorted = [...this.newsList];
      const order = this.sortOrder === 'asc' ? 1 : -1;
      return sorted.sort((a, b) => {
        let aValue = a[this.sortKey];
        let bValue = b[this.sortKey];
        // Handle string sorting (case-insensitive)
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        // Handle null/undefined values
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        return aValue > bValue ? order : aValue < bValue ? -order : 0;
      });
    },
    paginatedNews() {
      const start = (this.currentPage - 1) * this.newsPerPage;
      const end = start + this.newsPerPage;
      return this.sortedNews.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedNews.length / this.newsPerPage);
    },
    tableData() {
      const from = this.sortedNews.length === 0 ? 0 : (this.currentPage - 1) * this.newsPerPage + 1;
      const to = Math.min(from + this.paginatedNews.length - 1, this.sortedNews.length);
      return {
        from,
        to,
        totalItems: this.sortedNews.length,
      };
    }
  },
  methods: {
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
        this.currentPage = 1; // Reset to first page on new sort
      }
    },
    sortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
      }
      return 'fa-sort';
    },
    showToast(message, type) {
      if (['success', 'error'].includes(type)) {
        this.toastMessage = message;
        this.toastType = type;
      }
    },
    hideToast() {
      this.toastMessage = '';
      this.toastType = '';
    },
    showConfirmDialog(message, id) {
      this.confirmMessage = message;
      this.confirmId = id;
      this.isConfirmDialogVisible = true;
    },
    hideConfirmDialog() {
      this.isConfirmDialogVisible = false;
      this.confirmMessage = '';
      this.confirmId = null;
    },
    async confirmDelete(id) {
      if (id) {
        try {
          await NewsDataService.delete(id, this.newsList.find(n => n.id === id)?.image_url);
          this.showToast('News deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting news:', error);
          this.showToast('Failed to delete news: ' + error.message, 'error');
        }
      }
      this.hideConfirmDialog();
    },
    async fetchNews() {
      NewsDataService.getAll((news) => {
        this.newsList = news.filter(n => {
          if (!n.id) {
            console.error('Skipping news item with null ID:', n);
            return false;
          }
          return true;
        });
        if (this.newsList.length !== news.length) {
          console.warn('Filtered out', news.length - this.newsList.length, 'news items with null IDs');
        }
      });
    },
    showFormModal() {
      this.resetForm();
      this.editMode = false;
      this.formModal.show();
    },
    async saveNews() {
      if (this.isSaving) return;
      this.isSaving = true;
      if (!this.currentNews.title || !this.currentNews.type) {
        this.showToast('Please fill in all required fields (Title, Type).', 'error');
        this.isSaving = false;
        return;
      }
      try {
        if (!this.imageFile && this.originalImageUrl) {
          this.currentNews.image_url = this.originalImageUrl;
        }
        if (this.editMode) {
          if (!this.currentNews.id) {
            console.error('Cannot update: Invalid document ID:', this.currentNews.id);
            this.showToast('Error: Cannot update news. No valid document ID provided.', 'error');
            this.isSaving = false;
            return;
          }
          await NewsDataService.update(this.currentNews.id, this.currentNews, this.imageFile);
          this.showToast('News updated successfully!', 'success');
        } else {
          await NewsDataService.create(this.currentNews, this.imageFile);
          this.showToast('News created successfully!', 'success');
        }
        this.formModal.hide();
        this.resetForm();
      } catch (error) {
        console.error('Error saving news:', error);
        this.showToast('Failed to save news: ' + error.message, 'error');
      } finally {
        this.isSaving = false;
      }
    },
    editNews(news) {
      if (!news.id) {
        console.error('Cannot edit news: Invalid document ID:', news.id);
        this.showToast('Error: Cannot edit news. Invalid document ID.', 'error');
        return;
      }
      this.currentNews = { ...news, id: news.id };
      this.originalImageUrl = news.image_url || '';
      this.imageFile = null;
      this.editMode = true;
      this.formModal.show();
    },
    deleteNews(id, image_url) {
      if (!id) {
        console.error('Cannot delete news: Invalid document ID:', id);
        this.showToast('Error: Cannot delete news. Invalid document ID.', 'error');
        return;
      }
      this.showConfirmDialog('Are you sure you want to delete this news?', id);
    },
    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
      if (this.imageFile) {
        this.currentNews.image_url = URL.createObjectURL(this.imageFile);
      } else {
        this.currentNews.image_url = this.originalImageUrl;
      }
    },
    resetForm() {
      if (this.currentNews.image_url && this.currentNews.image_url.startsWith('blob:')) {
        URL.revokeObjectURL(this.currentNews.image_url);
      }
      this.currentNews = {
        id: null,
        title: '',
        description: '',
        status: 0,
        type: 'General',
        image_url: ''
      };
      this.imageFile = null;
      this.originalImageUrl = '';
      this.editMode = false;
      this.isSaving = false;
    },
    cancelEdit() {
      this.resetForm();
      this.formModal.hide();
    },
    mapStatus(status) {
      const statuses = {
        0: 'Draft',
        1: 'Published',
        2: 'Archived',
      };
      return statuses[status] || 'Unknown';
    },
    getStatusBadgeClass(status) {
      const classes = {
        0: 'badge bg-secondary',
        1: 'badge bg-success',
        2: 'badge bg-warning',
      };
      return classes[status] || 'badge bg-dark';
    },
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  mounted() {
    this.fetchNews();
    this.formModal = new Modal(document.getElementById('formModal'), {
      backdrop: 'static',
      keyboard: false
    });
  },
  beforeUnmount() {
    if (this.currentNews.image_url && this.currentNews.image_url.startsWith('blob:')) {
      URL.revokeObjectURL(this.currentNews.image_url);
    }
    if (this.formModal) {
      this.formModal.dispose();
    }
  }
};
</script>

<style scoped>
.card-body p {
  margin-bottom: 0.5rem;
}
.card-body strong {
  font-weight: 600;
}
.badge {
  font-size: 0.8rem;
}
.table-responsive {
  margin-bottom: 1rem;
}
.img-thumbnail {
  max-width: 100px;
}
.fas {
  font-size: 1.2rem;
}
.btn-success {
  margin-bottom: 1rem;
}
.btn {
  min-height: 38px;
  line-height: 1.5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn i {
  line-height: inherit;
  vertical-align: middle;
}
.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable:hover {
  background-color: #f8f9fa;
}
.sorted {
  font-weight: bold;
  color: #007bff;
}
</style>