<template>
  <el-dialog title="操作日志详细" :visible.sync="visible" @open="open" @closed="closed" width="700px">
    <el-form ref="form" v-loading="loading" :model="form" label-width="100px" size="mini">
      <el-row>
        <el-col :span="24">
          <el-form-item label="动作名称：">{{ form.actionName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录信息：">{{ form.userAccount }} / {{ form.ipAddress }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="异步请求：">{{ form.ajaxFlag }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址：">{{ form.requestUri }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="操作方法：">{{ form.classMethod }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请求参数：">{{ form.requestParams }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：">{{ form.status.text }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作时间：">{{ form.createdTime }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行时间：" v-if="form.status.value == 1">
            <el-tag type="danger">{{ form.executionTime }}秒</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="异常信息：" v-if="form.status.value == 2">{{ form.exceptionMsg }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closed">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from '@/mixin'
  import { getLog } from '@/api/sys/log'

  export default {
    name: 'SysLogDetailDialog',
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
        loading: true,
        // 表单参数
        form: this.initForm()
      }
    },
    methods: {
      initForm() {
        return {
          actionName: '',
          userAccount: '',
          ipAddress: '',
          requestMethod: '',
          ajaxFlag: '',
          requestUri: '',
          classMethod: '',
          requestParams: '',
          status: '',
          createdTime: '',
          executionTime: '',
          exceptionMsg: ''
        }
      },
      open() {
        this.loading = true
        getLog(this.id).then(res => {
          this.form = res.data
        }).catch(() => {
          this.form = this.initForm()
        }).then(() => {
          this.loading = false
        })
      },
      closed() {
        this.$emit('input', false)
        this.$emit('closed')
        this.form = this.initForm()
      }
    }
  }
</script>
