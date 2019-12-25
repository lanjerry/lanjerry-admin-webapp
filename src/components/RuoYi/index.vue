<template>
  <div>
    <svg-icon icon-class="download" @click="handleDownload"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYi',
  data() {
    return {
      url: 'https://gitee.com/lanjerry/lanjerry-admin-webapp'
    }
  },
  methods: {
    handleDownload() {
      window.open(this.url)
    }
  }
}
</script>
