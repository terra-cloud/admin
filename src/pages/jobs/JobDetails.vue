<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="py-6">
      <router-link to="/job-postings" class="inline-flex items-center gap-2 text-text-muted-light hover:text-text-light mb-6">
        <i class="fas fa-arrow-left"></i> Back to Job Postings
      </router-link>

      <div class="bg-white rounded-xl shadow-soft overflow-hidden">
        <div class="flex border-b border-gray-200">
          <button
            @click="activeTab = 'poster'"
            class="px-6 py-3 text-sm font-medium transition-colors"
            :class="activeTab === 'poster' ? 'border-b-2 border-primary text-primary' : 'text-text-muted-light hover:text-text-light'"
          >
            Poster Information
          </button>
          <button
            @click="activeTab = 'job'"
            class="px-6 py-3 text-sm font-medium transition-colors"
            :class="activeTab === 'job' ? 'border-b-2 border-primary text-primary' : 'text-text-muted-light hover:text-text-light'"
          >
            Job Information
          </button>
          <button
            @click="activeTab = 'offers'"
            class="px-6 py-3 text-sm font-medium transition-colors"
            :class="activeTab === 'offers' ? 'border-b-2 border-primary text-primary' : 'text-text-muted-light hover:text-text-light'"
          >
            Offers and Counter-Offers
          </button>
        </div>

        <div class="p-6">
          <div v-if="activeTab === 'poster'" class="space-y-3">
            <h6 class="text-sm font-semibold text-text-muted-light mb-2">Poster Information</h6>
            <p>
              <span class="font-medium text-text-light">Photo:</span>
              <span v-if="job.author?.photo_url">
                <img :src="job.author?.photo_url" class="w-10 h-10 rounded-full object-cover inline-block ml-2" alt="Poster Photo" />
              </span>
              <span v-else class="text-text-muted-light ml-2">N/A</span>
            </p>
            <p><span class="font-medium text-text-light">Posted By:</span><span class="text-text-muted-light ml-2">{{ job.author?.display_name || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Email:</span><span class="text-text-muted-light ml-2">{{ job.author?.email || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Name:</span><span class="text-text-muted-light ml-2">{{ job.author?.name || 'N/A' }} {{ job.author?.last_name || '' }}</span></p>
            <p><span class="font-medium text-text-light">Account Type:</span><span class="text-text-muted-light ml-2">{{ mapAccountType(job.author?.account_type) }}</span></p>
            <p><span class="font-medium text-text-light">KYC Status:</span><span class="text-text-muted-light ml-2">{{ displayStatus(job.author?.kyc_validated) }}</span></p>
            <p><span class="font-medium text-text-light">Birthdate:</span><span class="text-text-muted-light ml-2">{{ formatDate(job.author?.birthdate) }}</span></p>
            <p><span class="font-medium text-text-light">Gender:</span><span class="text-text-muted-light ml-2">{{ job.author?.gender || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Phone Number:</span><span class="text-text-muted-light ml-2">{{ job.author?.phone_number || 'N/A' }}</span></p>
          </div>

          <div v-if="activeTab === 'job'" class="space-y-3">
            <h6 class="text-sm font-semibold text-text-muted-light mb-2">Job Information</h6>
            <p><span class="font-medium text-text-light">Title:</span><span class="text-text-muted-light ml-2">{{ job.job_request?.title || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Details:</span><span class="text-text-muted-light ml-2">{{ job.details?.details || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Work Style:</span><span class="text-text-muted-light ml-2">{{ mapWorkStyle(job.details?.work_style) }}</span></p>
            <p><span class="font-medium text-text-light">Budget:</span><span class="text-text-muted-light ml-2">₱{{ job.budget?.budget || 'N/A' }} <span v-if="job.budget?.is_negotiable">(Negotiable)</span></span></p>
            <p><span class="font-medium text-text-light">Created At:</span><span class="text-text-muted-light ml-2">{{ formatDate(job.created_at) }}</span></p>
            <p><span class="font-medium text-text-light">Schedule Date:</span><span class="text-text-muted-light ml-2">{{ formatDate(job.job_request?.schedule?.date) }}</span></p>
            <p><span class="font-medium text-text-light">Date Type:</span><span class="text-text-muted-light ml-2">{{ job.job_request?.schedule?.dateType || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Time Preferences:</span><span class="text-text-muted-light ml-2">{{ mapTimePreferences(job.job_request?.schedule?.timePreferences) }}</span></p>
            <p><span class="font-medium text-text-light">Job Status:</span><span class="text-text-muted-light ml-2">{{ mapJobStatus(job.job_request?.job_status) }}</span></p>
            <p><span class="font-medium text-text-light">Location Address:</span><span class="text-text-muted-light ml-2">{{ job.location?.stringified_address || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Location Type:</span><span class="text-text-muted-light ml-2">{{ mapLocationType(job.location?.type) }}</span></p>
            <p><span class="font-medium text-text-light">Coordinates:</span><span class="text-text-muted-light ml-2">{{ job.location?.coordinates || 'N/A' }}</span></p>
            <p><span class="font-medium text-text-light">Accepted Offer ID:</span><span class="text-text-muted-light ml-2">{{ job.accepted_offer_id || 'N/A' }}</span></p>
            <p>
              <span class="font-medium text-text-light">Search Keywords:</span>
              <span v-if="job.search_keywords && job.search_keywords.length" class="ml-2">
                <span v-for="(keyword, index) in job.search_keywords" :key="index" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">{{ keyword }}</span>
              </span>
              <span v-else class="text-text-muted-light ml-2">N/A</span>
            </p>
          </div>

          <div v-if="activeTab === 'offers'" class="space-y-3">
            <h6 class="text-sm font-semibold text-text-muted-light mb-2">Offers and Counter-Offers</h6>
            <div v-if="jobOffers.length">
              <div v-for="offer in jobOffers" :key="offer.id" class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <h6 class="text-sm font-semibold text-text-muted-light mb-2">Offer {{ offer.id }}</h6>
                <p>
                  <span class="font-medium text-text-light">Offerer Photo:</span>
                  <span v-if="offer.author?.photo_url">
                    <img :src="offer.author?.photo_url" class="w-10 h-10 rounded-full object-cover inline-block ml-2" alt="Offerer Photo" />
                  </span>
                  <span v-else class="text-text-muted-light ml-2">N/A</span>
                </p>
                <p><span class="font-medium text-text-light">Offerer:</span><span class="text-text-muted-light ml-2">{{ offer.author?.display_name || 'N/A' }}</span></p>
                <p><span class="font-medium text-text-light">Email:</span><span class="text-text-muted-light ml-2">{{ offer.author?.email || 'N/A' }}</span></p>
                <p><span class="font-medium text-text-light">Name:</span><span class="text-text-muted-light ml-2">{{ offer.author?.name || 'N/A' }} {{ offer.author?.last_name || '' }}</span></p>
                <p><span class="font-medium text-text-light">Phone Number:</span><span class="text-text-muted-light ml-2">{{ offer.author?.phone_number || 'N/A' }}</span></p>
                <p><span class="font-medium text-text-light">Counter Offer:</span><span class="text-text-muted-light ml-2">₱{{ offer.counter_offer || 'N/A' }}</span></p>
                <p><span class="font-medium text-text-light">Offer Created At:</span><span class="text-text-muted-light ml-2">{{ formatDate(offer.created_at) }}</span></p>
                <p><span class="font-medium text-text-light">Offer Details:</span><span class="text-text-muted-light ml-2">{{ offer.details || 'N/A' }}</span></p>
                <p v-if="offer.doc_id !== offer.id"><span class="font-medium text-text-light">Internal Offer ID:</span><span class="text-text-muted-light ml-2">{{ offer.doc_id || 'N/A' }}</span></p>
                <p><span class="font-medium text-text-light">Job ID:</span><span class="text-text-muted-light ml-2">{{ offer.job_id || 'N/A' }}</span></p>
                <div v-if="offer.counterOffers && offer.counterOffers.length" class="ml-6 pl-4 border-l-2 border-gray-200 mt-3">
                  <h6 class="text-sm font-semibold text-text-muted-light mb-2">Counter-Offers</h6>
                  <div v-for="counterOffer in offer.counterOffers" :key="counterOffer.id" class="mb-3">
                    <h6 class="text-sm font-semibold text-text-muted-light mb-2">Counter-Offer {{ counterOffer.id }}</h6>
                    <p>
                      <span v-if="counterOffer.author?.photo_url">
                        <img :src="counterOffer.author?.photo_url" class="w-10 h-10 rounded-full object-cover inline-block ml-2" alt="Counter-Offerer Photo" />
                      </span>
                      <span v-else class="text-text-muted-light">N/A</span>
                    </p>
                    <p><span class="font-medium text-text-light">Counter-Offerer:</span><span class="text-text-muted-light ml-2">{{ counterOffer.author?.display_name || 'N/A' }}</span></p>
                    <p><span class="font-medium text-text-light">Email:</span><span class="text-text-muted-light ml-2">{{ counterOffer.author?.email || 'N/A' }}</span></p>
                    <p><span class="font-medium text-text-light">Name:</span><span class="text-text-muted-light ml-2">{{ counterOffer.author?.name || 'N/A' }} {{ counterOffer.author?.last_name || '' }}</span></p>
                    <p><span class="font-medium text-text-light">Phone Number:</span><span class="text-text-muted-light ml-2">{{ counterOffer.author?.phone_number || 'N/A' }}</span></p>
                    <p><span class="font-medium text-text-light">Counter Offer:</span><span class="text-text-muted-light ml-2">₱{{ counterOffer.counter_offer || 'N/A' }}</span></p>
                    <p><span class="font-medium text-text-light">Counter-Offer Created At:</span><span class="text-text-muted-light ml-2">{{ formatDate(counterOffer.created_at) }}</span></p>
                    <p><span class="font-medium text-text-light">Counter-Offer Details:</span><span class="text-text-muted-light ml-2">{{ counterOffer.details || 'N/A' }}</span></p>
                    <p><span class="font-medium text-text-light">Job Offer ID:</span><span class="text-text-muted-light ml-2">{{ counterOffer.job_offer_id || 'N/A' }}</span></p>
                  </div>
                </div>
                <p v-else class="ml-6 pl-4 border-l-2 border-gray-200 mt-3 text-text-muted-light">No counter-offers available for this offer.</p>
              </div>
            </div>
            <p v-else class="text-text-muted-light">No offers available for this job.</p>
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
      activeTab: 'poster',
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
          console.error('Job not found for ID:', jobId);
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
        const offers = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            reference_id: doc.id,
            id: doc.id,
            doc_id: data.id,
            ...data,
            counterOffers: [],
          };
        });

        const allCounterOffersQuery = query(collection(db, 'job-counter-offers'));
        const allCounterOffersSnapshot = await getDocs(allCounterOffersQuery);
        const allJobOfferIds = allCounterOffersSnapshot.docs.map(doc => doc.data().job_offer_id);

        for (const offer of offers) {
          const counterOffersQuery = query(
            collection(db, 'job-counter-offers'),
            where('job_offer_id', '==', offer.reference_id)
          );
          const counterOffersSnapshot = await getDocs(counterOffersQuery);
          offer.counterOffers = counterOffersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (offer.counterOffers.length === 0) {
            console.warn(`No counter-offers found for offer ${offer.id}. Expected job_offer_id: ${offer.id}`);
          }
        }

        this.jobOffers = offers;
        
      } catch (error) {
        console.error('Error fetching job offers or counter-offers:', error);
        alert('Failed to load job offers or counter-offers');
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
