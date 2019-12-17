<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入id"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="帐号" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入帐号"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入昵称"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请输入状态"
          clearable
          size="small"
          style="width: 200px"
          @change="handleQuery"
        >
          <el-option label="请选择状态" :value="null"></el-option>
          <el-option label="正常" :value="'NORMAL'"></el-option>
          <el-option label="冻结" :value="'LOCKING'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sys:user:save']"
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
          v-hasPermi="['sys:user:update']"
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
          v-hasPermi="['sys:user:remove']"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="id" align="center" prop="id"/>
      <el-table-column label="帐号" align="center" prop="account"/>
      <el-table-column label="昵称" align="center" prop="name"/>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="NORMAL"
            inactive-value="LOCKING"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles">{{ role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creatorName"/>
      <el-table-column label="创建时间" align="center" prop="createdTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sys:user:update']"
          >修改
          </el-button>
          <el-button
            v-if="scope.row.account !== 'admin'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:user:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleResetPwd(scope.row)"
            v-hasPermi="['sys:user:resetPassword']"
          >重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号" prop="account">
          <el-input :disabled="form.userId != undefined" v-model="form.account" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item v-if="form.userId == undefined" label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" placeholder="请输入昵称" maxlength="50"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio class="radio" label="MALE">男</el-radio>
            <el-radio class="radio" label="FEMALE">女</el-radio>
            <el-radio class="radio" label="UNKNOWN">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="50"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio class="radio" label="NORMAL">正常</el-radio>
            <el-radio class="radio" label="LOCKING">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addUser,
    changeUserStatus,
    delUser,
    getUser,
    listUser,
    resetUserPwd,
    updateUser
  } from '@/api/sys/user'
  import { listRole } from '@/api/sys/role'

  export default {
    name: 'User',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 用户表格数据
        userList: null,
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 角色选项
        roleOptions: [],
        // 表单参数
        form: {},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          id: null,
          account: undefined,
          name: undefined,
          status: null
        },
        // 表单校验
        rules: {
          account: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
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
    created() {
      this.getList()
    },
    methods: {
      /** 查询用户列表 */
      getList() {
        this.loading = true
        listUser(this.queryParams).then(response => {
            response.data.records.forEach((item) => {
              item.status = item.status.enumName
            })
            this.userList = response.data.records
            this.total = response.data.total
            this.loading = false
          }
        )
      },
      /** 查询角色列表 */
      getRoles() {
        listRole().then(response => {
          this.roleOptions = response.data
        })
      },
      // 用户状态修改
      handleStatusChange(row) {
        let text = row.status === 'NORMAL' ? '启用' : '停用'
        this.$confirm('确认要' + text + '“' + row.account + '”用户吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return changeUserStatus(row.id, row.status)
        }).then(() => {
          this.msgSuccess(text + '成功')
        }).catch(function() {
          row.status = row.status === 'NORMAL' ? 'LOCKING' : 'NORMAL'
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          userId: undefined,
          account: undefined,
          password: undefined,
          name: undefined,
          sex: 'MALE',
          email: undefined,
          phone: undefined,
          status: 'NORMAL',
          roleIds: []
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.getRoles()
        this.open = true
        this.title = '添加用户'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        this.getRoles()
        const userId = row.id || this.ids
        getUser(userId).then(response => {
          this.form = response.data
          this.form.userId = userId
          this.form.sex = response.data.sex.enumName
          this.form.status = response.data.status.enumName
          this.form.roleIds = response.data.roleIds
          this.open = true
          this.title = '修改用户'
          this.form.password = ''
        })
      },
      /** 重置密码按钮操作 */
      handleResetPwd(row) {
        this.$prompt('请输入"' + row.name + '"的新密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S+$/,
          inputPlaceholder: '请输入新密码',
          inputErrorMessage: '新密码不能为空'
        }).then(({ value }) => {
          resetUserPwd(row.id, value).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功，新密码是：' + value)
            } else {
              this.msgError(response.msg)
            }
          })
        }).catch(() => {
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.userId != undefined) {
              updateUser(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              addUser(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                }
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const userIds = row.id || this.ids
        this.$confirm('是否确认删除id为"' + userIds + '"的用户?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delUser(userIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .cell .el-tag {
    margin-right: 6px;
    text-align: left;
  }
</style>
