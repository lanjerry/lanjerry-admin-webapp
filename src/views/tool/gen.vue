<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <tool-gen-search-form ref="searchForm" @handleQuery="fetchData"/>

    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleGen"
          v-hasPermi="permission.code"
        >生成
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload"
          size="mini"
          @click="handleImport"
          v-hasPermi="permission.import"
        >导入
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
      <el-table-column prop="id" label="表编号"/>
      <el-table-column prop="tableName" label="表名称"/>
      <el-table-column prop="tableComment" label="表描述"/>
      <el-table-column prop="className" label="实体"/>
      <el-table-column prop="creatorName" label="创建人"/>
      <el-table-column prop="createdTime" label="创建时间"/>
      <el-table-column prop="updatedTime" label="更新时间"/>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-view"
            @click="handlePreview(scope.row)"
          >预览
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-download"
            @click="handleGen(scope.row)"
            v-hasPermi="permission.code"
          >生成
          </el-button>
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="permission.remove"
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

    <!-- 导入弹出层 -->
    <tool-gen-import-dialog v-model="showImportDialog" @success="fetchData"/>
  </div>
</template>

<script>
  import mixin from '@/mixin'
  import {pageGens, removeGens} from '@/api/tool/gen'
  import ToolGenSearchForm from '@/components/tool/gen/ToolGenSearchForm'
  import ToolGenImportDialog from '@/components/tool/gen/ToolGenImportDialog'

  export default {
    name: 'ToolGen',
    components: {ToolGenSearchForm, ToolGenImportDialog},
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
          code: ['tool:gen:code'],
          import: ['tool:gen:import'],
          update: ['tool:gen:update'],
          remove: ['tool:gen:remove']
        },
        // 表格数据
        list: [],
        // 是否显示导入的弹出层
        showImportDialog: false
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // 分页查询代码生成业务列表
      fetchData() {
        this.loading = true
        const {page: pageNum, size: pageSize} = this
        const params = Object.assign(this.$refs.searchForm.queryParams, {pageNum, pageSize})
        pageGens(this.addDateRange(params, this.$refs.searchForm.dateRange)).then(res => {
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
      // 导入按钮操作
      handleImport() {
        this.showImportDialog = true
      },
      // 预览按钮操作
      handlePreview(row) {
        console.log("预览")
      },
      // 生成按钮操作
      handleGen(row) {
        console.log("生成")
      },
      // 修改按钮操作
      handleUpdate(row) {
        const id = row.id || this.ids[0];
        this.$router.push({ path: "/gen/edit", query: { id: id } });
      },
      // 删除按钮操作
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除表编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return removeGens(ids)
        }).then(() => {
          this.msgSuccess('删除成功')
          this.fetchData()
        }).catch(() => {
        })
      }
    }
  }
</script>
