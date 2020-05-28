<template>
  <el-dialog :title="title" :visible.sync="visible" @open="open" @closed="closed" width="600px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="账号" prop="account">
        <el-input :disabled="this.id != ''" v-model.trim="form.account" placeholder="请输入账号"/>
      </el-form-item>
      <el-form-item v-if="!this.id" label="密码" prop="password">
        <el-input v-model.trim="form.password" placeholder="请输入密码" type="password"/>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入昵称" maxlength="50"/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio
            v-for="sex in sexOptions"
            :key="sex.value"
            :label="sex.name"
          >{{sex.text}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" placeholder="请输入邮箱" maxlength="50"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model.trim="form.phone" placeholder="请输入手机号码" maxlength="50"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="status in statusOptions"
            :key="status.value"
            :label="status.name"
          >{{status.text}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="form.roleIds" multiple placeholder="请选择">
          <el-option
            v-for="role in roleOptions"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          ></el-option>
        </el-select>
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
  import { getUser, saveUser, updateUser } from '@/api/sys/user'
  import { listRole } from '@/api/sys/role'
  import { sysUserSexEnum, sysUserStatusEnum } from '@/utils/enum'

  export default {
    name: 'SysUserModifyDialog',
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
        // 性别选项
        sexOptions: sysUserSexEnum,
        // 状态选项
        statusOptions: sysUserStatusEnum,
        // 角色选项
        roleOptions: [],
        // 表单校验
        rules: {
          account: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '昵称不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          roleIds: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          email: [
            {
              type: 'email',
              message: '\'请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          phone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
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
          account: '',
          password: '',
          name: '',
          sex: 'MALE',
          email: '',
          phone: '',
          status: 'ENABLE',
          roleIds: []
        }
      },
      // 打开弹出层
      open() {
        this.loading = true
        listRole().then(res => {
          // 初始化系统角色列表
          this.roleOptions = res.data
          if (this.id) {
            // 查询系统角色信息
            getUser(this.id).then(res => {
              this.form = res.data
              this.form.sex = res.data.sex.name
              this.form.status = res.data.status.name
            })
          }
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
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.button.save = true
            if (this.id) {
              updateUser(this.id, this.form).then(res => {
                this.msgSuccess('修改成功')
                this.closed()
                this.$emit('success')
              }).catch(() => {
              }).then(() => {
                this.clearButtonStatus()
              })
            } else {
              saveUser(this.form).then(res => {
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
