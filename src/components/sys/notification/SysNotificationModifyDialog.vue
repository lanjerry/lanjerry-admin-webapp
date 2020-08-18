<template>
  <el-dialog :title="title" :visible.sync="visible" @open="open" @closed="closed" width="600px">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="用户编号" prop="userId">
        <el-input v-model.trim="form.userId" placeholder="请输入用户编号"  clearable />
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input v-model.trim="form.content" placeholder="请输入消息内容" maxlength="500" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closed">关 闭</el-button>
      <el-button type="primary" :loading="button.save" @click="handleSave">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from '@/mixin'
  import { saveNotification } from '@/api/sys/notification'

  export default {
    name: 'SysNotificationModifyDialog',
    mixins: [
      mixin.visible,
      mixin.button
    ],
    props: {
      title: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        // 遮罩层
        loading: false,
        // 表单参数
        form: this.initForm(),
        // 表单校验
        rules: {
          userId: [
            { required: true, message: '用户编号不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '消息内容不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 初始化表单
      initForm() {
        this.resetForm('form')
        return {
          userId: null,
          content: ''
        }
      },
      // 打开弹出层
      open() {
        this.form = this.initForm()
      },
      // 关闭弹出层
      closed() {
        this.$refs.form.clearValidate()
        this.$emit('input', false)
        this.$emit('closed')
        this.form = this.initForm()
      },
      // 保存按钮操作
      handleSave() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.button.save = true
            saveNotification(this.form).then(res => {
              this.msgSuccess('新增成功')
              this.closed()
              this.$emit('success')
            }).catch(() => {
            }).then(() => {
              this.clearButtonStatus()
            })
          }
        })
      }
    }
  }
</script>