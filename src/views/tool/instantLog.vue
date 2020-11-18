<template>
  <div>
    <el-header style="line-height: 60px">
      <el-button size="mini" @click="openSocket">开启日志</el-button>
      <el-button type="danger" size="mini" @click="closeSocket">关闭日志</el-button>
    </el-header>
    <div
      style="width: 100%; height: 760px; overflow-y: scroll; background: #0f1521; color: #aaaaaa; padding: 10px; font-size: 14px">
      <div v-html="log"></div>
    </div>
  </div>
</template>

<script>
  import SockJS from 'sockjs-client'
  import Stomp from 'stompjs'

  export default {
    name: 'instantLog',
    data() {
      return {
        stompClient: null,
        log: ''
      }
    },
    methods: {
      openSocket() {
        if (this.stompClient == null) {
          this.log = '<div style="color: #18d035;font-size: 14px;padding-bottom: 7px;padding-left: 14px;">通道连接成功</div>'
          // 建立连接对象
          const url = window.location.host + process.env.VUE_APP_BASE_API + '/ws/logger'
          const wsuri = process.env.NODE_ENV == 'development' ? 'http://' + url : 'https://' + url
          let socket = new SockJS(wsuri)
          // 获取STOMP子协议的客户端对象
          this.stompClient = Stomp.over(socket)
          this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/topic/pullLogger', (event) => {
              let content = JSON.parse(event.body)
              let level = content.level
              let levelStyle = '<span>' + level + '</span>'
              switch (level) {
                case 'INFO':
                  levelStyle = '<span style="color: #90ad2b">' + level + '</span>'
                  break
                case 'DEBUG':
                  levelStyle = '<span style="color: #A8C023">' + level + '</span>'
                  break
                case 'WARN':
                  levelStyle = '<span style="color: #fffa1c">' + level + '</span>'
                  break
                case 'ERROR':
                  levelStyle = '<span style="color: #e3270e">' + level + '</span>'
                  break
              }
              this.log += '&nbsp;&nbsp;&nbsp;'
              this.log += levelStyle
              this.log += '&nbsp;&nbsp;&nbsp;'
              this.log += content.timestamp
              this.log += '&nbsp;&nbsp;-&nbsp;&nbsp;'
              this.log += '<span style="color: #396F8C;">' + content.fileName + ':' + content.lineNumber + '</span>'
              this.log += '&nbsp;&nbsp;-&nbsp;&nbsp;'
              this.log += '<span style="color: #d2d5dB;">' + content.body + '</span>'
              this.log += '<br/>'
            })
          })
        }
      },
      closeSocket() {
        if (this.stompClient != null) {
          this.stompClient.disconnect()
          this.stompClient = null
          this.log = '<div style="color: #18d035;font-size: 14px;padding-bottom: 7px;padding-left: 14px;">通道连接已关闭....</div>'
        }
      }
    },
    //销毁页面之前，断开连接
    beforeDestroy: function() {
      //页面离开时断开连接,清除定时器
      this.closeSocket()
    },
    mounted() {
      //调用初始化websocket方法
      this.openSocket()
    }
  }
</script>
