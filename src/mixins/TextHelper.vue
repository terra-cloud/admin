<script>
export default {
  methods: {
		_mapWorkStyle(workStyle) {
      const styles = {
        1: 'Full time',
        2: 'Contract',
        3: 'Part time',
      };
      return styles[workStyle] || 'Unknown';
    },
    _replacePlaceholder(text) {
      const safeText = text ?? ''
      return safeText.replace(/<\|\|>/g, ' ')
    },
		_mapJobColor(status) {
			const colorClasses = {
				0: {
					bg: 'bg-green-100',
					text: 'text-green-700',
					dot: 'bg-green-500'
				},
				1: {
					bg: 'bg-blue-100',
					text: 'text-blue-700',
					dot: 'bg-blue-500'
				},
				2: {
					bg: 'bg-gray-100',
					text: 'text-gray-700',
					dot: 'bg-gray-500'
				},
				3: {
					bg: 'bg-red-100',
					text: 'text-red-700',
					dot: 'bg-red-500'
				},
				4: {
					bg: 'bg-yellow-100',
					text: 'text-yellow-700',
					dot: 'bg-yellow-500'
				},
			};
			return colorClasses[status] || colorClasses[2];
		},
		_mapJobStatus(status) {
			const statuses = {
				0: 'Open',
				1: 'In Progress',
				2: 'Completed',
				3: 'Cancelled',
				4: 'Dropped',
			};
			return statuses[status] || 'Unknown';
		},
		_mapLocationType(type) {
      const types = {
        0: 'Unknown',
        1: 'In person',
        2: 'Remote',
      };
      return types[type] || 'Unknown';
    },
  },

  
}
</script>