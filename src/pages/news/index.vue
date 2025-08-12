<template>
  <div class="container-fluid">
    <h1 class="mb-4"><i class="fas fa-newspaper me-2" aria-hidden="true"></i> News</h1>
    <!-- Toast Container -->
    <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 1055;">
      <div
        class="toast"
        :class="toastType === 'success' ? 'bg-success text-white' : toastType === 'error' ? 'bg-danger text-white' : 'bg-warning text-dark'"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastElement"
      >
        <div class="toast-header">
          <strong class="me-auto">{{ toastType === 'success' ? 'Success' : toastType === 'error' ? 'Error' : 'Confirm' }}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" v-if="!showConfirmButtons" @click="hideToast"></button>
        </div>
        <div class="toast-body">
          {{ toastMessage }}
          <div v-if="showConfirmButtons" class="mt-2">
            <button class="btn btn-sm btn-outline-success me-2" @click="confirmDelete">Confirm</button>
            <button class="btn btn-sm btn-outline-secondary" @click="hideToast">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Add News Button -->
    <div class="mb-4 col-12 d-flex justify-content-end">
      <button class="btn btn-success" @click="showFormModal"><i class="fas fa-plus me-1" aria-hidden="true"></i> Add News</button>
    </div>
    <!-- News List -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">News List</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Type</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="news in paginatedNews" :key="news.id">
                <td>{{ news.title }}</td>
                <td>{{ $filters.truncate(news.description, 50) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(news.status)">
                    {{ mapStatus(news.status) }}
                  </span>
                </td>
                <td>{{ news.type }}</td>
                <td>
                  <img
                    v-if="news.image_url"
                    :src="news.image_url"
                    alt="News Image"
                    class="img-thumbnail"
                    style="max-width: 50px;"
                  />
                  <span v-else>N/A</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2" @click="editNews(news)"><i class="fas fa-edit me-1" aria-hidden="true"></i> Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteNews(news.id, news.image_url)"><i class="fas fa-trash me-1" aria-hidden="true"></i> Delete</button>
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
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="type" class="form-label">Type</label>
                  <select id="type" class="form-select" v-model="currentNews.type" required>
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
                    required
                    rows="4"
                    placeholder="Enter news description"
                  ></textarea>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select id="status" class="form-select" v-model.number="currentNews.status" required>
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
                  />
                  <div v-if="currentNews.image_url" class="mt-2">
                    <img :src="currentNews.image_url" alt="News Image" class="img-thumbnail" style="max-width: 100px;" />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                  <button type="submit" class="btn btn-success" style="margin-top:16px;"><i class="fas fa-plus me-1" aria-hidden="true"></i> {{ editMode ? 'Update' : 'Add' }}</button>
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
import { ref } from 'vue';
import { Modal, Toast } from 'bootstrap';

export default {
  components: {
    Pagination,
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
      originalImageUrl: '', // Store original Firebase image URL
      editMode: false,
      currentPage: 1,
      newsPerPage: 10,
      formModal: null, // Store form modal instance
      toastMessage: '',
      toastType: '', // success, error, confirm
      toastId: null, // For delete confirmation
      showConfirmButtons: false,
      toastInstance: null, // Store toast instance
    };
  },
  computed: {
    paginatedNews() {
      const start = (this.currentPage - 1) * this.newsPerPage;
      const end = start + this.newsPerPage;
      return this.newsList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.newsList.length / this.newsPerPage);
    },
    tableData() {
      const from = this.newsList.length === 0 ? 0 : (this.currentPage - 1) * this.newsPerPage + 1;
      const to = Math.min(from + this.paginatedNews.length - 1, this.newsList.length);
      return {
        from,
        to,
        totalItems: this.newsList.length,
      };
    },
  },
  methods: {
    showToast(message, type, showConfirmButtons = false, id = null) {
      this.toastMessage = message;
      this.toastType = type;
      this.showConfirmButtons = showConfirmButtons;
      this.toastId = id;
      this.$nextTick(() => {
        if (this.toastInstance) {
          this.toastInstance.hide();
        }
        this.toastInstance = new Toast(this.$refs.toastElement, {
          autohide: !showConfirmButtons,
          delay: 5000, // 5 seconds for success/error toasts
        });
        this.toastInstance.show();
      });
    },
    hideToast() {
      if (this.toastInstance) {
        this.toastInstance.hide();
        this.toastInstance = null;
        this.toastMessage = '';
        this.toastType = '';
        this.showConfirmButtons = false;
        this.toastId = null;
      }
    },
    async confirmDelete() {
      if (this.toastId) {
        try {
          await NewsDataService.delete(this.toastId, this.newsList.find(n => n.id === this.toastId)?.image_url);
          this.showToast('News deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting news:', error);
          this.showToast('Failed to delete news: ' + error.message, 'error');
        }
      }
      this.hideToast();
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
      if (!this.currentNews.title || !this.currentNews.description || !this.currentNews.type) {
        this.showToast('Please fill in all required fields (Title, Description, Type).', 'error');
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
            return;
          }
          await NewsDataService.update(this.currentNews.id, this.currentNews, this.imageFile);
          this.showToast('News updated successfully!', 'success');
        } else {
          const docRef = await NewsDataService.create(this.currentNews, this.imageFile);
          this.showToast('News created successfully!', 'success');
        }
        this.formModal.hide();
        this.resetForm();
      } catch (error) {
        console.error('Error saving news:', error);
        this.showToast('Failed to save news: ' + error.message, 'error');
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
      this.showToast('Are you sure you want to delete this news?', 'confirm', true, id);
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
    },
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
    if (this.toastInstance) {
      this.toastInstance.dispose();
    }
  },
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
/* Ensure buttons have the same height */
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
</style>