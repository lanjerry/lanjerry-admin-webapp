<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <sys-user-search-form ref="searchForm" @handleQuery="handleQuery"/>

    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="permission.save"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="permission.update"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="permission.remove"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column prop="id" label="用户编号"/>
      <el-table-column prop="account" label="帐号"/>
      <el-table-column prop="name" label="昵称"/>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status.value"
            :active-value="1"
            :inactive-value="2"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles">{{ role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="loginIp" label="最后登陆IP"/>
      <el-table-column prop="loginTime" label="最后登陆时间" width="155"/>
      <el-table-column prop="creatorName" label="创建人"/>
      <el-table-column prop="createdTime" label="创建时间" width="155"/>
      <el-table-column
        label="操作"
        align="center"
        width="280"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="permission.update"
          >修改
          </el-button>
          <el-button
            v-if="scope.row.account !== 'admin'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="permission.remove"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleResetPwd(scope.row)"
            v-hasPermi="permission.resetPassword"
          >重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <common-pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :size.sync="size"
      @pagination="fetchData"
    />

    <!-- 添加或修改用户弹出层 -->
    <sys-user-modify-dialog :id="id" :title="title" v-model="showModifyDialog" @success="fetchData"/>
  </div>
</template>

<script>
  import mixin from '@/mixin'
  import { pageUsers, changeUserStatus, removeUsers, resetUserPwd } from '@/api/sys/user'
  import SysUserSearchForm from '@/components/sys/user/SysUserSearchForm'
  import SysUserModifyDialog from '@/components/sys/user/SysUserModifyDialog'

  export default {
    name: 'SysUser',
    components: { SysUserSearchForm, SysUserModifyDialog },
    mixins: [
      mixin.search,
      mixin.pager
    ],
    data() {
      return {
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 权限标识
        permission: {
          save: ['sys:user:save'],
          update: ['sys:user:update'],
          remove: ['sys:user:remove'],
          resetPassword: ['sys:user:resetPassword']
        },
        // 表格数据
        list: [],
        // 用户编号
        id: '',
        // 弹出层标题
        title: '',
        // 是否显示新增或者修改的弹出层
        showModifyDialog: false
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // 分页查询系统用户列表
      fetchData() {
        this.loading = true
        const { page: pageNum, size: pageSize } = this
        const params = Object.assign(this.$refs.searchForm.queryParams, { pageNum, pageSize })
        pageUsers(params).then(res => {
          this.list = res.data.records
          this.total = res.data.total
        }).catch(() => {
          this.list = []
          this.total = 0
        }).then(() => {
          this.loading = false
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      // 新增按钮操作
      handleAdd() {
        this.id = ''
        this.showModifyDialog = true
        this.title = '添加用户'
      },
      // 修改按钮操作
      handleUpdate(row) {
        this.id = row.id || (this.ids ? this.ids[0] : '')
        this.showModifyDialog = true
        this.title = '修改用户'
      },
      // 锁定或者解锁系统用户
      handleStatusChange(row) {
        let text = row.status.value == '1' ? '启用' : '停用'
        this.$confirm('确认要' + text + '“' + row.account + '”用户吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return changeUserStatus(row.id, row.status.value)
        }).then(() => {
          this.msgSuccess(text + '成功')
        }).catch(function() {
          row.status.value = row.status.value == '1' ? 2 : 1
        })
      },
      // 重置密码按钮操作
      handleResetPwd(row) {
        this.$prompt('请输入"' + row.name + '"的新密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S+$/,
          inputPlaceholder: '请输入新密码',
          inputErrorMessage: '新密码不能为空'
        }).then(({ value }) => {
          const data = {
            id: row.id,
            password: value
          }
          resetUserPwd(data).then(res => {
            this.msgSuccess('修改成功，新密码是：' + value)
          })
        }).catch(() => {
        })
      },
      // 删除按钮操作
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除用户编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return removeUsers(ids)
        }).then(() => {
          this.msgSuccess('删除成功')
          this.fetchData()
        }).catch(() => {
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .cell .el-tag {
    margin-right: 6px;
    text-align: left;
  }
</style>
