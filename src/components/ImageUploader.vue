<template>
  <CropDialog
    :title="formTitle"
    :mainAspectRatio="mainAspectRatio"
    :dialogVisible="myDialogVisible"
    :passFile="cropFile"
    @close="myDialogVisible = false"
    @cropImage="cropImage"
  />
  <div :class="imageBackground === 'image-background-light' ? 'bg-background-light border-2 border-white' : 'bg-gray-200 border-2 border-white'">
    <input
      @change="onFilesSelected($event)"
      type="file"
      accept="image/*"
      ref="fileAttachUpload"
      style="display: none"
    />
    <div v-if="mainPhoto" class="relative border border-gray-300 rounded">
      <img
        :src="mainPhoto"
        class="max-w-full h-auto rounded"
        :style="{ 'min-height': minHeight + 'px', 'max-height': maxHeight + 'px' }"
        alt="Uploaded Image"
      />
      <div v-if="showCameraButton && !disabled" :class="cameraButtonClass" class="absolute bottom-2 right-2">
        <button
          type="button"
          class="inline-flex items-center gap-1 px-4 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90 transition-colors"
          @click="$refs.fileAttachUpload.click()"
        >
          <i class="fas fa-camera" aria-hidden="true"></i>
          {{ buttonText || '' }}
        </button>
      </div>
    </div>
    <div
      v-else
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      class="border border-gray-300 rounded p-8 text-center leading-relaxed text-lg transition-colors"
      :class="{ 'bg-gray-200': dragover }"
    >
      <div class="font-semibold mb-2">{{ dimensionText || 'Upload an Image' }}</div>
      <button
        type="button"
        v-if="!disabled"
        class="inline-flex items-center gap-1 px-4 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90 transition-colors"
        @click="$refs.fileAttachUpload.click()"
      >
        <i class="fas fa-upload" aria-hidden="true"></i> Upload Photo
      </button>
    </div>
  </div>
</template>

<script>
import CropDialog from './CropDialog.vue';

export default {
  components: { CropDialog },
  props: {
    mainAspectRatio: {
      type: Number,
      default: 1
    },
    cameraButtonClass: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    },
    dimensionText: {
      type: String,
      default: ''
    },
    minHeight: {
      type: String,
      default: '180'
    },
    maxHeight: {
      type: String,
      default: '170'
    },
    imageBackground: {
      type: String,
      default: 'image-background-dark'
    },
    showCameraButton: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cropFile: null,
      dragover: false,
      mainPhoto: '',
      myDialogVisible: false,
    };
  },
  watch: {
    photo: {
      handler(val) {
        this.mainPhoto = val;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cropImage(image) {
      this.mainPhoto = image;
      this.myDialogVisible = false;
      this.cropFile = null;
      this.$emit('setPhoto', image);
    },
    onDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file && file.type.indexOf('image/') !== -1) {
        this.cropFile = file;
        this.myDialogVisible = true;
      }
      this.dragover = false;
    },
    onFilesSelected(event) {
      const file = event.target.files[0];
      if (file && file.type.indexOf('image/') !== -1) {
        this.cropFile = file;
        this.myDialogVisible = true;
      }
    },
  }
};
</script>
