<template>
  <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
    <div></div>
    <!-- <button
      class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-300">
      <span class="material-symbols-outlined mr-2">add</span>
      <span class="truncate">Create New Job Posting</span>
    </button> -->
  </div>
  <div class="bg-white dark:bg-background-dark rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/20 p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      <!-- Search -->
      <div>
        <label for="searchQuery" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          id="searchQuery"
          type="text"
          v-model="searchQuery"
          placeholder="Search by posted by, email, title, details, or keywords..."
          class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary p-2 text-sm"
        />
      </div>

      <!-- Budget Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Budget Range (₱)</label>
        <div class="flex items-center space-x-2">
          <input
            type="number"
            v-model.number="budgetMin"
            placeholder="Min"
            min="0"
            class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary p-2 text-sm"
          />
          <span class="text-gray-500 text-sm">to</span>
          <input
            type="number"
            v-model.number="budgetMax"
            placeholder="Max"
            min="0"
            class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary p-2 text-sm"
          />
        </div>
      </div>

      <!-- Work Style -->
      <OptionDropdown
        label="Work Style"
        v-model="filterWorkStyles"
        :items="workStyleOptions"
      />

      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Created Date Range</label>
        <div class="flex items-center space-x-2">
          <input
            type="date"
            v-model="startDate"
            placeholder="Start Date"
            class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary p-2 text-sm"
          />
          <span class="text-gray-500 text-sm">to</span>
          <input
            type="date"
            v-model="endDate"
            placeholder="End Date"
            class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary p-2 text-sm"
          />
        </div>
      </div>

      <!-- Job Status -->
      <OptionDropdown
        label="Status"
        v-model="filterJobStatuses"
        :items="statusOptions"
      />

      <OptionDropdown
        label="Location Type"
        v-model="filterLocationTypes"
        :items="locationTypesOptions"
      />
    </div>

    <div class="flex flex-wrap items-center gap-4 mb-4">
      <div class="flex-grow">
        <label class="flex flex-col h-12 w-full">
          <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div
              class="text-gray-400 dark:text-gray-500 flex bg-gray-100 dark:bg-gray-900/50 items-center justify-center pl-4 rounded-l-lg">
              <span class="material-symbols-outlined text-2xl">search</span>
            </div>
            <input
              v-model="searchQuery"
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-gray-900/50 h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 pl-2 text-base font-normal"
              placeholder="Search by posted by, email, title, details, or keywords..." value="" />
          </div>
        </label>
      </div>
      <div class="flex gap-3">
        <button
          class="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-900/50 px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <p class="text-sm font-medium">Status</p>
          <span class="material-symbols-outlined text-xl text-gray-400 dark:text-gray-500">expand_more</span>
        </button>
        <button
          class="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-900/50 px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <p class="text-sm font-medium">Location</p>
          <span class="material-symbols-outlined text-xl text-gray-400 dark:text-gray-500">expand_more</span>
        </button>
      </div>
    </div>
    <div class="@container">
      <div class="overflow-x-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          <!-- Job Card -->
          <div 
          v-for="job in paginatedJobs"
          :key="job.id"
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 transition hover:shadow-md">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ job.title || 'N/A' }} ({{ _mapWorkStyle(job.details?.work_style) }})</h3>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ job?.author?.display_name || 'N/A' }} </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ job?.location?.stringified_address ? _replacePlaceholder(job?.location?.stringified_address) : 'N/A' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ _mapLocationType(job.location?.type) }}</div>
              </div>
              <MoreMenu
                :itemId="job.id"
                @view="viewItem"
              />
            </div>
            <div class="flex items-center mt-3">
              <div class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              :class="[_mapJobColor(job.job_status).bg, _mapJobColor(job.job_status).text]"
              >
                <span 
                class="size-2 rounded-full mr-2"
                :class="_mapJobColor(job.job_status).dot"
                ></span>
                {{_mapJobStatus(job.job_status)}}
              </div>
              <span class="ml-auto text-sm font-medium text-gray-700 dark:text-gray-300">₱{{ job.budget?.budget || 'N/A' }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">Schedule: {{ _formatDate(job.schedule?.date) }} ({{ job.schedule?.dateType || 'N/A' }}, {{ mapTimePreferences(job.schedule?.timePreferences) }})</p>
          </div>
        </div>

      </div>
    </div>
  </div>
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
</template>

<script>
import { db } from '@/firebase';
import { collection, query, orderBy, limit, startAfter, onSnapshot, getCountFromServer, doc, setDoc } from 'firebase/firestore';
import Pagination from '@/components/Pagination.vue';
import DropJobModal from './components/DropJobModal.vue';
import OptionDropdown from '@/components/form/OptionDropdown.vue';
import MoreMenu from '@/components/form/MenuDropdown.vue';

export default {
  components: {
    MoreMenu,
    OptionDropdown,
    Pagination,
    DropJobModal,
  },
  data() {
    return {
      jobs: [],
      currentPage: 1,
      jobsPerPage: 20,
      totalJobs: 0,
      lastVisible: null,
      searchQuery: '',
      budgetMin: null,
      budgetMax: null,
      filterWorkStyles: '',
      startDate: null,
      endDate: null,
      filterJobStatuses: '',
      filterLocationTypes: '',
      statusSet: [
        { value: 0, message: 'Pending' },
        { value: 1, message: 'Approved' },
        { value: -1, message: 'Rejected' },
      ],
      showDialog: false,
      selectedJobId: null,
      selectedJobTitle: '',
      selectedStatus: 'All',
      statusOptions: [
        { text: 'All', value: '' },
        { text: 'Open', value: 'Open' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Completed', value: 'Completed' },
        { text: 'Cancelled', value: 'Cancelled' },
        { text: 'Dropped', value: 'Dropped' },
      ],
      locationTypesOptions: [
        { text: 'All', value: '' },
        { text: 'In person', value: 'In person' },
        { text: 'Remote', value: 'Remote' },
      ],
      workStyleOptions: [
        { text: 'All', value: '' },
        { text: 'Full time', value: 'Full time' },
        { text: 'Contract', value: 'Contract' },
        { text: 'Part time', value: 'Part time' },
      ]
    };
  },
  computed: {
    jobStatusCounts() {
      const counts = {
        Open: 0,
        'In Progress': 0,
        Completed: 0,
        Cancelled: 0,
        Dropped: 0,
        Unknown: 0,
      };
      this.jobs.forEach(job => {
        const status = this._mapJobStatus(job.job_status);
        counts[status] = (counts[status] || 0) + 1;
      });
      return counts;
    },
    filteredJobs() {
      return this.jobs.filter(job => {
        const searchQuery = this.searchQuery.toLowerCase();
        const displayName = job.author?.display_name?.toLowerCase() || '';
        const email = job.author?.email?.toLowerCase() || '';
        const title = job.job_request?.title?.toLowerCase() || '';
        const details = job.details?.details?.toLowerCase() || '';
        const keywords = job.search_keywords?.join(' ').toLowerCase() || '';
        const matchesSearch = !this.searchQuery ||
          displayName.includes(searchQuery) ||
          email.includes(searchQuery) ||
          title.includes(searchQuery) ||
          details.includes(searchQuery) ||
          keywords.includes(searchQuery);

        const budget = job.budget?.budget || 0;
        const matchesBudget = (!this.budgetMin || budget >= this.budgetMin) &&
          (!this.budgetMax || budget <= this.budgetMax);

        const workStyle = this.mapWorkStyle(job.details?.work_style);
        const effectiveWorkStyles = this.filterWorkStyles.includes('All') ? ['Full time', 'Contract', 'Part time'] : this.filterWorkStyles;
        const matchesWorkStyle = !this.filterWorkStyles.length || effectiveWorkStyles.includes(workStyle);

        const jobDate = job.created_at ? new Date(job.created_at).toISOString().split('T')[0] : null;
        const startDate = this.startDate || null;
        const endDate = this.endDate ? new Date(new Date(this.endDate).setDate(new Date(this.endDate).getDate() + 1)).toISOString().split('T')[0] : null;
        const matchesDate = (!startDate || !jobDate || jobDate >= startDate) &&
          (!endDate || !jobDate || jobDate < endDate);

        const jobStatus = this._mapJobStatus(job.job_status);
        const effectiveJobStatuses = this.filterJobStatuses.includes('All') ? ['Open', 'In Progress', 'Completed', 'Cancelled', 'Dropped'] : this.filterJobStatuses;
        const matchesJobStatus = !this.filterJobStatuses.length || effectiveJobStatuses.includes(jobStatus);

        const locationType = this._mapLocationType(job.location?.type);
        const effectiveLocationTypes = this.filterLocationTypes.includes('All') ? ['Unknown', 'In person', 'Remote'] : this.filterLocationTypes;
        const matchesLocationType = !this.filterLocationTypes.length || effectiveLocationTypes.includes(locationType);

        return matchesSearch && matchesBudget && matchesWorkStyle && matchesDate && matchesJobStatus && matchesLocationType;
      });
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      const end = start + this.jobsPerPage;
      return this.filteredJobs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredJobs.length / this.jobsPerPage);
    },
    tableData() {
      const from = this.filteredJobs.length === 0 ? 0 : (this.currentPage - 1) * this.jobsPerPage + 1;
      const to = Math.min(from + this.paginatedJobs.length - 1, this.filteredJobs.length);
      return {
        from,
        to,
        totalItems: this.filteredJobs.length,
      };
    },
  },
  methods: {
    viewItem(id){
      this.$router.push({ name: 'jobDetails', params: { jobId: id } })
    },
    handleMenuSelect(job) {
      return (item) => {
        if (item.value === 'view') {
          this.$router.push({ name: 'jobDetails', params: { jobId: job.id } })
        } else if (item.value === 'delete') {
          console.log('Delete job:', job.id)
        }
      }
    },
    async fetchJobs() {
      const jobsQuery = query(
        collection(db, 'job-posting'),
        orderBy('created_at', 'desc')
      );
      onSnapshot(jobsQuery, (snapshot) => {
        this.jobs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          schedule: doc.data().job_request?.schedule || {},
          title: doc.data().job_request?.title || 'N/A',
          job_status: doc.data().job_status || 0,
        }));
        this.lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      }, (error) => {
        console.error('Error fetching jobs:', error);
        alert('Failed to load job postings');
      });
    },
    async fetchTotalJobs() {
      const coll = collection(db, 'job-posting');
      const snapshot = await getCountFromServer(coll);
      this.totalJobs = snapshot.data().count;
    },
    showDropDialog(jobId, jobTitle) {
      this.selectedJobId = jobId;
      this.selectedJobTitle = jobTitle;
      this.showDialog = true;
    },
    async confirmDrop(jobId) {
      try {
        const jobRef = doc(db, 'job-posting', jobId);
        await setDoc(jobRef, { job_status: 4 }, { merge: true });
        this.showDialog = false;
        this.selectedJobId = null;
        this.selectedJobTitle = '';
      } catch (error) {
        console.error('Error dropping job:', error);
        alert('Failed to drop job posting');
      }
    },
    cancelDrop() {
      this.showDialog = false;
      this.selectedJobId = null;
      this.selectedJobTitle = '';
    },
    mapAccountType(accountType) {
      const types = {
        1: 'User',
        2: 'Employer',
      };
      return types[accountType] || 'Unknown';
    },
    displayStatus(status) {
      const index = this.statusSet.findIndex(item => item.value === status);
      return index !== -1 ? this.statusSet[index].message : 'Unknown';
    },
    mapWorkStyle(workStyle) {
      const styles = {
        1: 'Full time',
        2: 'Contract',
        3: 'Part time',
      };
      return styles[workStyle] || 'Unknown';
    },
    mapTimePreferences(pref) {
      const prefs = {
        '0': 'Any Time',
        '1': 'Morning',
        '2': 'Afternoon',
        '3': 'Evening',
      };
      return prefs[pref] || 'Unknown';
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
    resetPagination() {
      this.currentPage = 1;
      this.lastVisible = null;
    },
  },
  watch: {
    searchQuery() {
      this.resetPagination();
    },
    budgetMin() {
      this.resetPagination();
    },
    budgetMax() {
      this.resetPagination();
    },
    filterWorkStyles() {
      this.resetPagination();
    },
    startDate() {
      this.resetPagination();
    },
    endDate() {
      this.resetPagination();
    },
    filterJobStatuses() {
      this.resetPagination();
    },
    filterLocationTypes() {
      this.resetPagination();
    },
  },
  mounted() {
    this.fetchTotalJobs();
    this.fetchJobs();
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

.card.h-100 {
  display: flex;
  flex-direction: column;
}

.form-select[multiple] {
  height: 100px;
}

.btn-sm.me-2 {
  margin-right: 0.5rem;
}
</style>