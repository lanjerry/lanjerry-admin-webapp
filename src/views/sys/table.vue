<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <sys-table-search-form ref="searchForm" @handleQuery="handleQuery"/>

    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="table.update">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="table.remove">删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column prop="id" label="测试编号"  />
      <el-table-column prop="testColumn01" label="测试字段1"  />
      <el-table-column prop="testColumn02" label="测试字段2"  />
      <el-table-column prop="testColumn03" label="测试字段3"  />
      <el-table-column prop="testColumnTime" label="测试字段4" width="155" />
      <el-table-column prop="testColumnPhone" label="测试字段5"  />
      <el-table-column prop="testColumnMail" label="测试字段6"  />
      <el-table-column prop="createdTime" label="创建时间" width="155" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="table.update">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="table.remove">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <common-pagination v-show="total>0" :total="total" :page.sync="page" :size.sync="size" @pagination="fetchData"/>

    <!-- 修改系统测试弹出层 -->
    <sys-table-modify-dialog :id="id" :title="title" v-model="showModifyDialog" @success="fetchData"/>
  </div>
</template>

<script>
  import mixin from '@/mixin'
  import { pageTables, removeTables } from '@/api/sys/table'
  import SysTableSearchForm from '@/components/sys/table/SysTableSearchForm'
  import SysTableModifyDialog from '@/components/sys/table/SysTableModifyDialog'

  export default {
    name: 'SysTable',
    components: { SysTableSearchForm, SysTableModifyDialog },
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
        table: {
          update: ['sys:table:update'],
          remove: ['sys:table:remove']
        },
        // 表格数据
        list: [],
        // 测试编号
        id: '',
        // 弹出层标题
        title: '',
        // 是否显示修改的弹出层
        showModifyDialog: false
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // 分页查询系统测试列表
      fetchData() {
        this.loading = true
        const { page: pageNum, size: pageSize } = this
        const params = Object.assign(this.$refs.searchForm.queryParams, { pageNum, pageSize })
        pageTables(params).then(res => {
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
      // 修改按钮操作
      handleUpdate(row) {
        this.id = row.id || (this.ids ? this.ids[0] : '')
        this.showModifyDialog = true
        this.title = '修改系统测试'
      },
      // 删除按钮操作
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除测试编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return removeTables(ids)
        }).then(() => {
          this.msgSuccess('删除成功')
          this.fetchData()
        }).catch(() => {
        })
      }
    }
  }
</script>