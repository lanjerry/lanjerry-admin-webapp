<template>
  <el-dialog title="代码预览" :visible.sync="visible" width="85%" @open="open" @closed="closed" top="5vh">
    <el-tabs v-model="preview.activeName">
      <el-tab-pane
        v-for="(value, key) in preview.data"
        :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
        :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
        :key="key"
      >
        <pre>{{ value }}</pre>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closed">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from '@/mixin'
  import { previewGen } from '@/api/tool/gen'

  export default {
    name: "ToolGenPreviewDialog",
    mixins: [
      mixin.visible
    ],
    props: {
      id: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        // 遮罩层
        loading: false,
        // 表单参数
        preview: this.initData()
      }
    },
    methods: {
      // 初始化表单
      initData() {
        return {
          activeName: 'entity.java',
          data: {}
        }
      },
      // 打开弹出层
      open() {
        this.loading = true
        previewGen(this.id).then(res => {
          this.preview.data = res.data
        }).catch(() => {
          this.preview = this.initData()
        }).then(() => {
          this.loading = false
        })
      },
      // 关闭弹出层
      closed() {
        this.$emit('input', false)
        this.$emit('closed')
        this.preview = this.initData()
      }
    }
  }
</script>
