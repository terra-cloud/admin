<template>
  <CropDialog
    :title="formTitle"
    :mainAspectRatio="mainAspectRatio"
    :dialogVisible="myDialogVisible"
    :passFile="cropFile"
    @close="myDialogVisible = false"
    @cropImage="cropImage"
  />
  <div :class="['image-background', imageBackground]">
    <input
      @change="onFilesSelected($event)"
      type="file"
      accept="image/*"
      ref="fileAttachUpload"
      style="display: none"
    />
    <div v-if="mainPhoto" class="card position-relative">
      <img
        :src="mainPhoto"
        class="img-fluid rounded"
        :style="{ 'min-height': minHeight + 'px', 'max-height': maxHeight + 'px' }"
        alt="Uploaded Image"
      />
      <div :class="['camera-button', cameraButtonClass]" v-if="showCameraButton && !disabled">
        <button
          type="button"
          class="btn btn-primary"
          @click="$refs.fileAttachUpload.click()"
        >
          <i class="fas fa-camera me-1" aria-hidden="true"></i>
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
      class="card upload-message"
      :class="{ 'drag-over': dragover }"
    >
      <div class="card-body text-center">
        <div class="font-weight-bold mb-2">{{ dimensionText || 'Upload an Image' }}</div>
        <button
          type="button"
          v-if="!disabled"
          class="btn btn-success main-button"
          @click="$refs.fileAttachUpload.click()"
        >
          <i class="fas fa-upload me-1" aria-hidden="true"></i> Upload Photo
        </button>
      </div>
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
      } else {
        // alert('Please drop an image file');
      }
      this.dragover = false;
    },
    onFilesSelected(event) {
      const file = event.target.files[0];
      if (file && file.type.indexOf('image/') !== -1) {
        this.cropFile = file;
        this.myDialogVisible = true;
      } else {
        // alert('Please select an image file');
      }
    },
  }
};
</script>

<style scoped>
.image-background {
  border: 3px solid #fff;
}
.image-background-dark {
  background: #ddd;
}
.image-background-light {
  background: #f6f6f6;
}
.upload-message {
  border: 1px solid #ddd;
  padding: 30px 0;
  line-height: 1.5;
  font-size: 18px;
}
.upload-message.drag-over {
  background: #e2e6ea;
}
.camera-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.card {
  border: 1px solid #ddd;
  border-radius: 5px;
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
.main-button {
  margin: 8px 0;
}
.font-weight-bold {
  font-weight: 600;
}
</style>