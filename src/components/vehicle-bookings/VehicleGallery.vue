<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
        :class="i === 0 ? 'sm:col-span-2 sm:row-span-2 min-h-[200px] sm:min-h-[320px]' : 'min-h-[120px] sm:min-h-[180px]'"
        @click="openLightbox(i)"
      >
        <img
          :src="img"
          :alt="`Vehicle photo ${i + 1}`"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span class="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl">fullscreen</span>
        </div>
      </div>
      <div
        v-if="images.length === 0"
        class="sm:col-span-2 min-h-[200px] rounded-xl bg-gray-100 flex items-center justify-center"
      >
        <div class="text-center">
          <span class="material-symbols-outlined text-4xl text-text-muted-light">image</span>
          <p class="text-sm text-text-muted-light mt-2">No images available</p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <button class="absolute top-4 right-4 text-white/80 hover:text-white z-10" @click="closeLightbox">
          <span class="material-symbols-outlined text-3xl">close</span>
        </button>
        <button
          v-if="images.length > 1"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
          @click="prevImage"
        >
          <span class="material-symbols-outlined text-4xl">chevron_left</span>
        </button>
        <button
          v-if="images.length > 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
          @click="nextImage"
        >
          <span class="material-symbols-outlined text-4xl">chevron_right</span>
        </button>
        <img
          :src="images[activeIndex]"
          class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          alt="Vehicle photo"
        />
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {{ activeIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  props: {
    images: { type: Array, default: () => [] }
  },
  emits: [],
  data() {
    return {
      lightboxOpen: false,
      activeIndex: 0
    };
  },
  methods: {
    openLightbox(index) {
      this.activeIndex = index;
      this.lightboxOpen = true;
      document.body.style.overflow = 'hidden';
    },
    closeLightbox() {
      this.lightboxOpen = false;
      document.body.style.overflow = '';
    },
    prevImage() {
      this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    },
    nextImage() {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    }
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  }
};
</script>
