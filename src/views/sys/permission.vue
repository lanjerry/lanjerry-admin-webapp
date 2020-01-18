<template>
  <div class="app-container">
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
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="icon" label="权限名称" width="300">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
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
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="permission.save"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="permission.remove"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改权限对话框 -->
    <sys-permission-modify-dialog :id="id" :parentId="parentId" :title="title" v-model="showModifyDialog" @success="fetchData"/>
  </div>
</template>

<script>
  import { listPermissions, removePermission, changePermissionStatus } from "@/api/sys/permission"
  import SysPermissionModifyDialog from '@/components/sys/permission/SysPermissionModifyDialog'

  export default {
    name: 'SysPermission',
    components: { SysPermissionModifyDialog },
    data() {
      return {
        // 遮罩层
        loading: false,
        // 权限标识
        permission: {
          save: ['sys:permission:save'],
          update: ['sys:permission:update'],
          remove: ['sys:permission:remove']
        },
        // 表格数据
        list: [],
        // 权限编号
        id: '',
        // 父级权限编号
        parentId: '',
        // 弹出层标题
        title: '',
        // 是否显示新增或者修改的弹出层
        showModifyDialog: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 查询系统权限列表
      fetchData() {
        this.loading = true
        listPermissions().then(res => {
          this.list = res.data
        }).catch(() => {
          this.list = []
        }).then(() => {
          this.loading = false
        })
      },
      // 启用或者停用系统权限
      handleStatusChange(row) {
        let text = row.status.value == '1' ? '启用' : '停用'
        this.$confirm('确认要' + text + '“' + row.name + '”权限吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return changePermissionStatus(row.id, row.status.value)
        }).then(() => {
          this.msgSuccess(text + '成功')
          this.fetchData()
        }).catch(function() {
          row.status.value = row.status.value == '1' ? 2 : 1
        })
      },
      // 新增按钮操作
      handleAdd(row) {
        if (row != null) {
          this.parentId = row.id
        }
        this.id = ''
        this.showModifyDialog = true
        this.title = '添加权限'
      },
      // 修改按钮操作
      handleUpdate(row) {
        this.id = row.id
        this.showModifyDialog = true
        this.title = '修改权限'
      },
      // 删除按钮操作
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return removePermission(row.id)
        }).then(() => {
          this.msgSuccess('删除成功')
          this.fetchData()
        }).catch(() => {})
      }
    }
  }
</script>
