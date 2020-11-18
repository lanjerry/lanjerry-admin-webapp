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
        badge: 0, // 通知个数
        websocket: null, // 建立连接
        lockReconnect: false, // 是否真正建立连接
        wsCreateHandler: null, // 重新连接
        timeout: 5000, // 心跳倒计时
        timeoutObj: null, // 心跳连接
        serverTimeOutObj: null // 心跳内部倒计时
      }
    },
    methods: {
      // 初始化通知个数
      initCount() {
        getUserNotificationCount().then(response => {
          this.badge = response.data
        })
      },
      // 创建消息通知的websocket
      initWebSocket() {
        try {
          const url = window.location.host + process.env.VUE_APP_BASE_API + '/ws/notification/' + store.getters.id
          const wsuri = process.env.NODE_ENV == 'development' ? 'ws://' + url : 'wss://' + url
          this.websocket = new WebSocket(wsuri)
          this.websocket.onopen = this.onWsOpen
          this.websocket.onmessage = this.onWsMessage
          this.websocket.onclose = this.onWsClose
          this.websocket.onerror = this.onWsError
        } catch (e) {
          console.log('webstocket连接出现异常')
          this.reconnect()
        }
      },
      // websocket心跳机制
      start() {
        const self = this
        self.timeoutObj && clearTimeout(self.timeoutObj)
        self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
        self.timeoutObj = setTimeout(function() {
          console.log('发送ping到后台')
          self.websocket.send('ping')
          // 内嵌定时器
          self.serverTimeoutObj = setTimeout(() => {
            console.log('没有收到后台的数据，关闭连接')
            self.reconnect()
          }, self.timeout)
        }, self.timeout)
      },
      // 重置心跳
      reset() {
        const that = this
        //清除时间
        clearTimeout(that.timeoutObj)
        clearTimeout(that.serverTimeOutObj)
        //重启心跳
        that.start()
      },
      // websocket断线重连机制
      reconnect() {
        const that = this
        if (that.lockReconnect) {
          return
        }
        that.lockReconnect = true
        that.wsCreateHandler && clearTimeout(that.wsCreateHandler)
        that.wsCreateHandler = setTimeout(() => {
          console.log('开始重连')
          that.initWebSocket()
          that.lockReconnect = false
          console.log('重连完成')
        }, 5000)
      },
      onWsOpen() {
        console.log('成功连接webstocket')
        this.start()
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
        this.reset()
      },
      onWsClose() {
        console.log('关闭webstocket')
      },
      onWsError() {
        this.$notify.error({
          title: '错误',
          message: 'webstocket出现异常'
        })
        this.reconnect()
      }
    },
    created() {
      this.initCount() // 初始化通知个数
      this.initWebSocket() // 页面刚进入时开启长连接
    },
    destroyed: function() {
      this.onWsClose() // 页面销毁时关闭长连接
    }
  }
</script>

<style scoped>
  .el-badge__content el-badge__content--undefined is-fixed {
    top: 8px;
  }
</style>
