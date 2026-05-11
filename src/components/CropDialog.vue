<template>
  <div v-if="dialogVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50"></div>
    <div class="relative bg-card-light rounded-lg shadow-lifted w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
        <h5 class="text-lg font-semibold text-text-light flex items-center gap-2">
          <i class="fas fa-crop" aria-hidden="true"></i>{{ title }}
        </h5>
        <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="$emit('close')" aria-label="Close">&times;</button>
      </div>
      <div class="p-6 overflow-y-auto">
        <vue-cropper
          ref="cropper"
          :aspect-ratio="mainAspectRatio"
          :src="imgSrc"
          preview=".preview"
          class="cropper-container"
        />
      </div>
      <div class="sticky bottom-0 bg-card-light px-6 py-4 border-t border-gray-200 flex justify-end gap-2 shrink-0">
        <button
          class="px-4 py-2 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
          @click="$emit('close')"
        >Cancel</button>
        <button
          class="px-4 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
          @click="cropImage"
        >
          <i class="fas fa-crop" aria-hidden="true"></i> Crop
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  components: { VueCropper },
  name: 'CropDialog',
  props: {
    mainAspectRatio: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: 'Crop Image',
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    passFile: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      imgSrc: '',
      cropImg: '',
    };
  },
  methods: {
    cropImage() {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$emit('cropImage', this.cropImg);
    },
    setImage(src) {
      if (typeof src === 'string' && src) {
        this.imgSrc = src;
        this.$refs.cropper.replace(src);
      } else if (src && src instanceof File) {
        if (src.type.indexOf('image/') === -1) {
          alert('Please select an image file');
          return;
        }
        if (typeof FileReader === 'function') {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.imgSrc = event.target.result;
            this.$refs.cropper.replace(event.target.result);
          };
          reader.readAsDataURL(src);
        } else {
          alert('Sorry, FileReader API not supported');
        }
      }
    },
  },
  watch: {
    passFile(newSrc) {
      if (newSrc) {
        this.setImage(newSrc);
      }
    },
  },
  mounted() {
    if (this.passFile) {
      this.setImage(this.passFile);
    }
  },
};
</script>

<style scoped>
.cropper-container {
  max-height: 400px;
  width: 100%;
}
</style>
