<script>
export default {
  methods: {
    _formatNumber(number, format = "en") {
      if (!isNaN(number)) {
        let formatter = new Intl.NumberFormat(format, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        return formatter.format(number);
      } else {
        return 0;
      }
    },
    _truncate(string, length){
      if (!string) return;
      if (string.length <= length) return string;
      return string.substring(0, Math.min(length, string.length)) + "...";
    },
    _capitalizeString(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    _validEmail(email){
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      let result = pattern.test(email);
      return result
    },
    _catchErrors(error){
      const data = error.response?.data
      if (!data) {
        this.error = error.message || 'An unexpected error occurred'
        return
      }
      if (typeof data.error === 'string') {
        this.error = data.error
        return
      }
      if (typeof data.errors === 'object' && data.errors !== null) {
        const keys = Object.keys(data.errors)
        const first = data.errors[keys[0]]
        this.error = Array.isArray(first) ? first[0] : first
        return
      }
      if (data.error_key) {
        this.error = data.error_key.replace(/_/g, ' ')
        return
      }
      this.error = 'An unexpected error occurred'
    },
    _readableNumbers(number) {
      new Intl.NumberFormat('en', { notation: 'compact' }).format(number)
    },
  },
  
}
</script>