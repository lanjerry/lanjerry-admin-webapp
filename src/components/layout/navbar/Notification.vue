<template>
  <div>
    <el-badge :value="badge" :max="99" class="item">
      <i class="el-icon-message-solid"></i>
    </el-badge>
  </div>
</template>

<script>
  import store from '@/store'
  import { getUserNotificationCount } from '@/api/global/currentUser'

  export default {
    name: 'Notification',
    data() {
      return {
        websocket: null,
        badge: 0
      }
    },
    methods: {
      initCount() {
        getUserNotificationCount().then(response => {
          this.badge = response.data
        })
      },
      initNotification() {
        this.websocket = new WebSocket('ws://127.0.0.1:1000/ws/notification/' + store.getters.id)
        this.websocket.onopen = this.onWsOpen
        this.websocket.onmessage = this.onWsMessage
        this.websocket.onclose = this.onWsClose
        this.websocket.onerror = this.onWsError
      },
      onWsOpen() {
        console.log('成功连接webstock')
      },
      onWsMessage(e) {
        this.$notify.info({
          position: 'bottom-right',
          title: '提示',
          message: e.data,
          duration: 0
        })
        this.initCount()
      },
      onWsClose() {
        console.log('关闭webstock')
      },
      onWsError() {
        this.$notify.error({
          title: '错误',
          message: 'webstock出现异常'
        })
      }
    },
    beforeDestroy: function() {
      this.onWsClose()
    },
    mounted() {
      this.initCount()
      this.initNotification()
    }
  }
</script>

<style scoped>
  .el-badge__content el-badge__content--undefined is-fixed {
    top: 8px;
  }
</style>
