<template>
  <el-dialog :title="title" :visible.sync="visible" @open="open" @closed="closed" width="500px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input :disabled="form.id != undefined" v-model.trim="form.name" placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item label="权限标识" prop="permissionTag">
        <el-input v-model.trim="form.permissionTag" placeholder="请输入权限标识"/>
      </el-form-item>
      <el-form-item label="权限">
        <el-tree
          ref="tree"
          :data="permissionOptions"
          :expand-on-click-node="false"
          :show-checkbox="true"
          node-key="id"
          empty-text="加载中，请稍后"
          :props="defaultProps"
        ></el-tree>
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
  import { getRole, saveRole, updateRole, getRolePermissionIds } from '@/api/sys/role'
  import { treePermissions } from '@/api/sys/permission'

  export default {
    name: 'SysRoleModifyDialog',
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
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          permissionTag: [
            { required: true, message: '权限标识不能为空', trigger: 'blur' }
          ]
        },
        // 权限树选项
        permissionOptions: [],
        // 权限树的默认属性
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      // 初始化表单
      initForm() {
        this.resetForm('form')
        if (this.$refs.tree != undefined) {
          this.$refs.tree.setCheckedKeys([])
        }
        return {
          name: '',
          permissionTag: '',
          permissionIds: []
        }
      },
      // 打开弹出层
      open() {
        this.loading = true
        treePermissions().then(res => {
          // 初始化树形结构系统权限列表
          this.permissionOptions = res.data
          if (this.id) {
            // 查询系统角色信息
            getRole(this.id).then(res => {
              this.$nextTick(() => {
                this.getRolePermissionTree(this.id)
              })
              this.form = res.data
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
            this.form.permissionIds = this.getTreeAllCheckedKeys()
            if (this.id) {
              updateRole(this.id, this.form).then(res => {
                this.msgSuccess('修改成功')
                this.closed()
                this.$emit('success')
              }).catch(() => {
              }).then(() => {
                this.clearButtonStatus()
              })
            } else {
              saveRole(this.form).then(res => {
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
      },
      // 所有菜单节点数据
      getTreeAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.tree.getHalfCheckedKeys()
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.tree.getCheckedKeys()
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
        return checkedKeys
      },
      // 根据角色编号查询角色的权限编号集
      getRolePermissionTree(id) {
        getRolePermissionIds(id).then(res => {
          if (res.data) {
            this.$refs.tree.setCheckedKeys(res.data)
          }
        })
      }
    }
  }
</script>
