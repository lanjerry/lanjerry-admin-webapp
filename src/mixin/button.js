const button = {
  data() {
    return {
      button: {
        save: false,
      },
    }
  },

  methods: {
    clearButtonStatus() {
      this.button.save = false
    }
  }
}

export default button
