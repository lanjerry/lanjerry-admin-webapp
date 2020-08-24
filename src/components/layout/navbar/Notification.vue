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
        badge: 0,
        websocket: null,
        lockReconnect: false,
        wsCreateHandler: null
      }
    },
    methods: {
      initCount() {
        getUserNotificationCount().then(response => {
          this.badge = response.data
        })
      },
      createWebSocket() {
        try {
          this.websocket = new WebSocket('ws://127.0.0.1:1000/ws/notification/' + store.getters.id)
          this.initWsEventHandle()
        } catch (e) {
          console.log('webstocket连接出现异常')
          this.reconnect()
        }
      },
      initWsEventHandle() {
        try {
          this.websocket.onopen = this.onWsOpen
          this.websocket.onmessage = this.onWsMessage
          this.websocket.onclose = this.onWsClose
          this.websocket.onerror = this.onWsError
        } catch (e) {
          console.log('绑定事件没有成功')
          this.reconnect()
        }
      },
      reconnect() {
        if (this.lockReconnect) {
          return
        }
        this.lockReconnect = true
        this.wsCreateHandler && clearTimeout(this.wsCreateHandler)
        const that = this;
        this.wsCreateHandler = setTimeout(function() {
          console.log('开始重连')
          that.createWebSocket()
          that.lockReconnect = false
          console.log('重连完成')
        }, 1000)
      },
      onWsOpen() {
        console.log('成功连接webstocket')
      },
      onWsMessage(e) {
        let json = JSON.parse(e.data)
        if (json.type == 'CONTENT') {
          this.$notify.info({
            position: 'bottom-right',
            title: '提示',
            message: json.message,
            duration: 0
          })
        }
        if (json.type == 'NUMBER') {
          this.badge = json.message
        }
      },
      onWsClose() {
        console.log('关闭webstocket')
        this.reconnect()
      },
      onWsError() {
        this.reconnect()
        this.$notify.error({
          title: '错误',
          message: 'webstocket出现异常'
        })
      }
    },
    beforeDestroy: function() {
      this.onWsClose()
    },
    mounted() {
      this.initCount()
      this.createWebSocket()
    }
  }
</script>

<style scoped>
  .el-badge__content el-badge__content--undefined is-fixed {
    top: 8px;
  }
</style>
