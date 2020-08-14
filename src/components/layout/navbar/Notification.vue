<template>
  <div>
    <el-badge :value="badge" :max="99" class="item">
      <i class="el-icon-message-solid"></i>
    </el-badge>
  </div>
</template>

<script>
  export default {
    name: 'Notification',
    data() {
      return {
        badge: 11
      }
    },
    methods: {
      initNotification() {
        this.badge = 80
      }
    },
    mounted() {
      //调用初始化websocket方法
      this.initNotification()
    }
  }
</script>

<style scoped>
  .el-badge__content el-badge__content--undefined is-fixed {
    top: 8px;
  }
</style>
