<template>
  <el-dialog title="导入表" :visible.sync="visible" @open="open" @closed="closed" width="800px" top="5vh">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model.trim="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model.trim="queryParams.tableComment"
          placeholder="请输入表描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="handleRowClick" ref="table" :data="list" @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="表名称"></el-table-column>
        <el-table-column prop="tableComment" label="表描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
      <common-pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :size.sync="size"
        @pagination="fetchData"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closed">关 闭</el-button>
      <el-button type="primary" :disabled="multiple" :loading="button.save" @click="handleOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from '@/mixin'
  import { pageDbTables,importDbTables } from '@/api/tool/gen'

  export default {
    name: "ToolGenImportDialog",
    mixins: [
      mixin.visible,
      mixin.button,
      mixin.pager
    ],
    data() {
      return {
        // 遮罩层
        loading: false,
        // 选中数组
        tableNames: [],
        // 非多个禁用
        multiple: true,
        // 表格数据
        list: [],
        // 查询参数
        queryParams: {
          tableName: undefined,
          tableComment: undefined
        }
      }
    },
    methods: {
      // 打开弹出层
      open() {
        this.fetchData()
      },
      // 关闭弹出层
      closed() {
          this.list = []
          this.page = 1
          this.$emit('input', false)
          this.$emit('closed')
      },
      // 搜索按钮操作
      handleQuery() {
        this.page = 1
        this.fetchData()
      },
      // 重置按钮操作
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 分页查询系统用户列表
      fetchData() {
        this.loading = true
        const { page: pageNum, size: pageSize } = this
        const params = Object.assign(this.queryParams, { pageNum, pageSize })
        pageDbTables(params).then(res => {
          this.list = res.data.records
          this.total = res.data.total
        }).catch(() => {
          this.list = []
          this.total = 0
        }).then(() => {
          this.loading = false
        })
      },
      // 单击表格的行
      handleRowClick(row) {
        this.$refs.table.toggleRowSelection(row);
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.tableNames = selection.map(item => item.tableName)
        this.multiple = !selection.length
      },
      // 确定按钮操作
      handleOk() {
          importDbTables(this.tableNames).then(res => {
          this.msgSuccess('导入成功')
          this.closed()
          this.$emit('success')
        }).catch(() => {
        }).then(() => {
            this.clearButtonStatus()
        })
      }
    }
  }
</script>
