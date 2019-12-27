<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="角色编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入角色编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限标识" prop="permissionTag">
        <el-input
          v-model="queryParams.permissionTag"
          placeholder="请输入权限标识"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['sys:role:save']"
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
          v-hasPermi="['sys:role:update']"
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
          v-hasPermi="['sys:role:remove']"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column prop="id" label="角色编号"/>
      <el-table-column prop="name" label="角色名称"/>
      <el-table-column prop="permissionTag" label="权限标识"/>
      <el-table-column prop="creatorName" label="创建人"/>
      <el-table-column prop="createdTime" label="创建时间"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sys:role:update']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:role:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getPageRoles"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input :disabled="form.id != undefined" v-model="form.name" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="权限标识" prop="permissionTag">
          <el-input v-model="form.permissionTag" placeholder="请输入权限标识"/>
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { pageRoles, getRole, saveRole, updateRole, removeRoles, getRolePermissionIds } from '@/api/sys/role'
  import { treePermissions } from '@/api/sys/permission'

  export default {
    name: 'SysRole',
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
        // 角色表格数据
        roleList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 权限列表
        permissionOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          id: undefined,
          name: undefined,
          permissionTag: undefined
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          permissionTag: [
            { required: true, message: '权限标识不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getPageRoles()
    },
    methods: {
      // 分页查询系统角色列表
      getPageRoles() {
        this.loading = true
        pageRoles(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.roleList = response.data.records
            this.total = response.data.total
            this.loading = false
          }
        )
      },
      // 查询树形结构系统权限列表
      getTreePermissions() {
        treePermissions().then(response => {
          this.permissionOptions = response.data
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
        getRolePermissionIds(id).then(response => {
          this.getTreePermissions()
          if (response.data) {
            this.$refs.tree.setCheckedKeys(response.data)
          }
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        if (this.$refs.tree != undefined) {
          this.$refs.tree.setCheckedKeys([])
        }
        this.form = {
          id: undefined,
          name: undefined,
          permissionTag: undefined,
          permissionIds: []
        }
        this.resetForm('form')
      },
      // 搜索按钮操作
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getPageRoles()
      },
      // 重置按钮操作
      resetQuery() {
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      // 新增按钮操作
      handleAdd() {
        this.reset()
        this.getTreePermissions()
        this.open = true
        this.title = '添加角色'
      },
      // 修改按钮操作
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getRole(id).then(response => {
          this.$nextTick(() => {
            this.getRolePermissionTree(id)
          })
          this.form = response.data
          this.form.id = id
          this.open = true
          this.title = '修改角色'
        })
      },
      // 提交按钮
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.form.permissionIds = this.getTreeAllCheckedKeys()
            if (this.form.id != undefined) {
              updateRole(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getPageRoles()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              saveRole(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getPageRoles()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
      },
      // 删除按钮操作
      handleDelete(row) {
        const roleIds = row.id || this.ids
        this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return removeRoles(roleIds)
        }).then(() => {
          this.getPageRoles()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      }
    }
  }
</script>
