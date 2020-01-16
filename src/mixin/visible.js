const visible = {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false
    }
  },

  watch: {
    value: function(val) {
      this.visible = val
    },

    visible: function(val) {
      this.$emit('input', val)
    }
  }
}

export default visible
