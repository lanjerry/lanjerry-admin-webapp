<template>
  <el-dialog :title="title" :visible.sync="visible" @open="open" @closed="closed" width="600px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="测试字段1" prop="testColumn01">
        <el-input v-model="form.testColumn01" placeholder="请输入测试字段1" maxlength="45" clearable />
      </el-form-item>
      <el-form-item label="测试字段2" prop="testColumn02">
        <el-input v-model="form.testColumn02" placeholder="请输入测试字段2"  clearable />
      </el-form-item>
      <el-form-item label="测试字段3" prop="testColumn03">
        <el-select v-model="form.testColumn03" placeholder="请输入测试字段3" clearable>
          <el-option label="请选择测试字段3" :value="null"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试字段4" prop="testColumnTime">
        <el-date-picker v-model="form.testColumnTime" type="date" placeholder="请选择测试字段4" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="测试字段5" prop="testColumnPhone">
        <el-input v-model="form.testColumnPhone" placeholder="请输入测试字段5" maxlength="11" clearable />
      </el-form-item>
      <el-form-item label="测试字段6" prop="testColumnMail">
        <el-input v-model="form.testColumnMail" placeholder="请输入测试字段6" maxlength="20" clearable />
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
  import { getTable, saveTable, updateTable } from '@/api/sys/table'

  export default {
    name: 'SysTableModifyDialog',
    mixins: [
      mixin.visible,
      mixin.button
    ],
    props: {
      title: {
        type: String,
        required: true
      },
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
        form: this.initForm(),
        // 表单校验
        rules: {
          testColumn01: [
            { required: true, message: '测试字段1不能为空', trigger: 'blur' }
          ],
          testColumn02: [
            { required: true, message: '测试字段2不能为空', trigger: 'blur' }
          ],
          testColumn03: [
            { required: true, message: '测试字段3不能为空', trigger: 'change' }
          ],
          testColumnPhone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的测试字段5',
              trigger: 'blur'
            }
          ],
          testColumnMail: [
            {
              type: 'email',
              message: '\'请输入正确的测试字段6',
              trigger: ['blur', 'change']
            }
          ]
        }
      }
    },
    methods: {
      // 初始化表单
      initForm() {
        this.resetForm('form')
        return {
          testColumn01: '',
          testColumn02: 0,
          testColumn03: 0,
          testColumnTime: null,
          testColumnPhone: '',
          testColumnMail: ''
        }
      },
      // 打开弹出层
      open() {
        this.loading = true
          if (this.id) {
            // 查询系统测试信息
            getTable(this.id).then(res => {
              this.form = res.data
            })
          }).catch(() => {
            this.form = this.initForm()
          }).then(() => {
            this.loading = false
          })
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
            if (this.id) {
              updateTable(this.id, this.form).then(res => {
                this.msgSuccess('修改成功')
                this.closed()
                this.$emit('success')
              }).catch(() => {
              }).then(() => {
                this.clearButtonStatus()
              })
            } else {
              saveTable(this.form).then(res => {
                this.msgSuccess('新增成功')
                this.closed()
                this.$emit('success')
              }).catch(() => {
              }).then(() => {
                this.clearButtonStatus()
              })
            }
          }
        })
      }
    }
  }
</script>