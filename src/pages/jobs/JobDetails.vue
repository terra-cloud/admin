```html
<template>
  <div class="container-fluid">
    <h1 class="mb-4">Job Request Details</h1>
    <div class="row mb-4">
      <!-- Back Button -->
      <div class="col-12 mb-3">
        <router-link to="/job-postings" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i> Back to Job Postings
        </router-link>
      </div>
      <!-- Job Request Details -->
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Job Details</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted">Poster Information</h6>
            <p>
              <strong>Photo:</strong>
              <span v-if="job.author?.photo_url">
                <img :src="job.author?.photo_url" class="user-photo" alt="Poster Photo" />
              </span>
              <span v-else>N/A</span>
            </p>
            <p><strong>Posted By:</strong> {{ job.author?.display_name || 'N/A' }}</p>
            <p><strong>Email:</strong> {{ job.author?.email || 'N/A' }}</p>
            <p><strong>Name:</strong> {{ job.author?.name || 'N/A' }} {{ job.author?.last_name || '' }}</p>
            <p><strong>Account Type:</strong> {{ mapAccountType(job.author?.account_type) }}</p>
            <p><strong>KYC Status:</strong> {{ displayStatus(job.author?.kyc_validated) }}</p>
            <p><strong>Birthdate:</strong> {{ formatDate(job.author?.birthdate) }}</p>
            <p><strong>Gender:</strong> {{ job.author?.gender || 'N/A' }}</p>
            <p><strong>Phone Number:</strong> {{ job.author?.phone_number || 'N/A' }}</p>
            <hr>
            <h6 class="card-subtitle mb-2 text-muted">Job Information</h6>
            <p><strong>Title:</strong> {{ job.job_request?.title || 'N/A' }}</p>
            <p><strong>Details:</strong> {{ job.details?.details || 'N/A' }}</p>
            <p><strong>Work Style:</strong> {{ mapWorkStyle(job.details?.work_style) }}</p>
            <p><strong>Budget:</strong> ₱{{ job.budget?.budget || 'N/A' }} <span v-if="job.budget?.is_negotiable">(Negotiable)</span></p>
            <p><strong>Created At:</strong> {{ formatDate(job.created_at) }}</p>
            <p><strong>Schedule Date:</strong> {{ formatDate(job.job_request?.schedule?.date) }}</p>
            <p><strong>Date Type:</strong> {{ job.job_request?.schedule?.dateType || 'N/A' }}</p>
            <p><strong>Time Preferences:</strong> {{ mapTimePreferences(job.job_request?.schedule?.timePreferences) }}</p>
            <p><strong>Job Status:</strong> {{ mapJobStatus(job.job_request?.job_status) }}</p>
            <p><strong>Location Address:</strong> {{ job.location?.stringified_address || 'N/A' }}</p>
            <p><strong>Location Type:</strong> {{ mapLocationType(job.location?.type) }}</p>
            <p><strong>Coordinates:</strong> {{ job.location?.coordinates || 'N/A' }}</p>
            <p><strong>Accepted Offer ID:</strong> {{ job.accepted_offer_id || 'N/A' }}</p>
            <p><strong>Search Keywords:</strong>
              <span v-if="job.search_keywords && job.search_keywords.length">
                <span v-for="(keyword, index) in job.search_keywords" :key="index" class="badge bg-primary me-1">{{ keyword }}</span>
              </span>
              <span v-else>N/A</span>
            </p>
            <hr>
            <h6 class="card-subtitle mb-2 text-muted">Job Offers</h6>
            <div v-if="jobOffers.length">
              <div v-for="offer in jobOffers" :key="offer.id" class="mb-3">
                <h6 class="card-subtitle mb-2 text-muted">Offer {{ offer.id }}</h6>
                <p>
                  <strong>Offerer Photo:</strong>
                  <span v-if="offer.author?.photo_url">
                    <img :src="offer.author?.photo_url" class="user-photo" alt="Offerer Photo" />
                  </span>
                  <span v-else>N/A</span>
                </p>
                <p><strong>Offerer:</strong> {{ offer.author?.display_name || 'N/A' }}</p>
                <p><strong>Email:</strong> {{ offer.author?.email || 'N/A' }}</p>
                <p><strong>Name:</strong> {{ offer.author?.name || 'N/A' }} {{ offer.author?.last_name || '' }}</p>
                <p><strong>Account Type:</strong> {{ mapAccountType(offer.author?.account_type) }}</p>
                <p><strong>KYC Status:</strong> {{ displayStatus(offer.author?.kyc_validated) }}</p>
                <p><strong>Birthdate:</strong> {{ formatDate(offer.author?.birthdate) }}</p>
                <p><strong>Gender:</strong> {{ offer.author?.gender || 'N/A' }}</p>
                <p><strong>Phone Number:</strong> {{ offer.author?.phone_number || 'N/A' }}</p>
                <p><strong>Counter Offer:</strong> ₱{{ offer.counter_offer || 'N/A' }}</p>
                <p><strong>Offer Created At:</strong> {{ formatDate(offer.created_at) }}</p>
                <p><strong>Offer Details:</strong> {{ offer.details || 'N/A' }}</p>
                <p><strong>Offer ID:</strong> <span class="badge bg-info">{{ offer.id }}</span></p>
              </div>
            </div>
            <p v-else>No offers available for this job.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      job: {},
      jobOffers: [],
    };
  },
  methods: {
    async fetchJob() {
      try {
        const jobId = this.$route.params.jobId;
        const jobDoc = await getDoc(doc(db, 'job-posting', jobId));
        if (jobDoc.exists()) {
          this.job = { id: jobDoc.id, ...jobDoc.data() };
          await this.fetchJobOffers(jobId);
        } else {
          alert('Job not found');
          this.$router.push('/job-postings');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        alert('Failed to load job details');
      }
    },
    async fetchJobOffers(jobId) {
      try {
        const offersQuery = query(
          collection(db, 'job-offers'),
          where('job_id', '==', jobId)
        );
        const querySnapshot = await getDocs(offersQuery);
        this.jobOffers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error('Error fetching job offers:', error);
        alert('Failed to load job offers');
      }
    },
    mapAccountType(accountType) {
      const types = {
        1: 'User',
        2: 'Employer',
      };
      return types[accountType] || 'Unknown';
    },
    displayStatus(status) {
      const statusSet = [
        { value: 0, message: 'Pending' },
        { value: 1, message: 'Approved' },
        { value: -1, message: 'Rejected' },
      ];
      const index = statusSet.findIndex(item => item.value === status);
      return index !== -1 ? statusSet[index].message : 'Unknown';
    },
    mapWorkStyle(workStyle) {
      const styles = {
        1: 'Full time',
        2: 'Contract',
        3: 'Part time',
      };
      return styles[workStyle] || 'Unknown';
    },
    mapJobStatus(status) {
      const statuses = {
        0: 'Open',
        1: 'In Progress',
        2: 'Completed',
        3: 'Cancelled',
      };
      return statuses[status] || 'Unknown';
    },
    mapLocationType(type) {
      const types = {
        1: 'In person',
        2: 'Remote',
      };
      return types[type] || 'Unknown';
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
    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  mounted() {
    this.fetchJob();
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
.user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
  margin-left: 0.5rem;
}
</style>
```