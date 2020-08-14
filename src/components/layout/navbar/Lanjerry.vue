<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'Lanjerry',
  data() {
    return {
      url: 'https://gitee.com/lanjerry/lanjerry-admin-webapp'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
