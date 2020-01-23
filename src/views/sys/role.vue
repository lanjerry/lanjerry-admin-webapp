<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <sys-role-search-form ref="searchForm" @handleQuery="fetchData"/>

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
    <common-pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :size.sync="size"
      @pagination="fetchData"
    />

    <!-- 添加或修改角色弹出层 -->
    <sys-role-modify-dialog :id="id" :title="title" v-model="showModifyDialog" @success="fetchData"/>
  </div>
</template>

<script>
  import mixin from '@/mixin'
  import { pageRoles, removeRoles } from '@/api/sys/role'
  import SysRoleSearchForm from '@/components/sys/role/SysRoleSearchForm'
  import SysRoleModifyDialog from '@/components/sys/role/SysRoleModifyDialog'

  export default {
    name: 'SysRole',
    components: { SysRoleSearchForm, SysRoleModifyDialog },
    mixins: [
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
          save: ['sys:role:save'],
          update: ['sys:role:update'],
          remove: ['sys:role:remove']
        },
        // 表格数据
        list: [],
        // 角色编号
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
      // 分页查询系统角色列表
      fetchData() {
        this.loading = true
        const { page: pageNum, size: pageSize } = this
        const params = Object.assign(this.$refs.searchForm.queryParams, { pageNum, pageSize })
        pageRoles(this.addDateRange(params, this.$refs.searchForm.dateRange)).then(res => {
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
      // 新增按钮操作
      handleAdd() {
        this.id = ''
        this.showModifyDialog = true
        this.title = '添加角色'
      },
      // 修改按钮操作
      handleUpdate(row) {
        this.id = row.id || (this.ids ? this.ids[0] : '')
        this.showModifyDialog = true
        this.title = '修改角色'
      },
      // 删除按钮操作
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除日志编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return removeRoles(ids)
        }).then(() => {
          this.msgSuccess('删除成功')
          this.fetchData()
        }).catch(() => {
        })
      }
    }
  }
</script>
