<template>
  <div class="modal fade" id="cropModal" tabindex="-1" aria-labelledby="cropModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cropModalLabel">
            <i class="fas fa-crop me-2" aria-hidden="true"></i>{{ title }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <vue-cropper
                ref="cropper"
                :aspect-ratio="mainAspectRatio"
                :src="imgSrc"
                preview=".preview"
                class="cropper-container"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer sticky">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Cancel
          </button>
          <button type="button" class="btn btn-success" @click="cropImage">
            <i class="fas fa-crop me-1" aria-hidden="true"></i> Crop
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { Modal } from 'bootstrap';

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
      modal: null,
    };
  },
  computed: {
    intDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (this.modal) {
        if (newVal) {
          this.modal.show();
        } else {
          this.modal.hide();
        }
      }
    },
    passFile(newSrc) {
      if (newSrc) {
        this.setImage(newSrc);
      }
    },
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
  mounted() {
    this.modal = new Modal(document.getElementById('cropModal'), {
      backdrop: 'static',
      keyboard: false
    });
    if (this.dialogVisible) {
      this.modal.show();
    }
    if (this.passFile) {
      this.setImage(this.passFile);
    }
  },
  beforeUnmount() {
    if (this.modal) {
      this.modal.dispose();
    }
  },
};
</script>

<style scoped>
.cropper-container {
  max-height: 400px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}
.preview-container {
  text-align: center;
  margin-top: 20px;
}
.preview {
  border: 1px solid #ddd;
  border-radius: 4px;
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
.sticky {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 10px 0;
}
</style>