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
      let errors;
      if(typeof error.response?.data?.errors != 'undefined'){
        errors = error.response?.data?.errors
      }

      if(typeof error.response?.data?.error_key !== 'undefined'){
        return error.response?.data?.error_key.replace('_', ' ');  
      }

      if(typeof error.response?.data?.error !== 'undefined'){
        errors = error.response?.data?.error
      }

      if(errors){
        let keys = Object.keys(errors)
        keys.forEach(item => {
          let [first] = errors[item]
          return first;  
        })
      }

      this.error = JSON.parse(JSON.stringify(errors))
    },
    _readableNumbers(number) {
      new Intl.NumberFormat('en', { notation: 'compact' }).format(number)
    },
  },
  
}
</script>