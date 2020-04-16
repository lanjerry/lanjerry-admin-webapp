<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <sys-log-search-form ref="searchForm" @handleQuery="handleQuery"/>

    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="permission.export"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" v-hasPermi="permission.remove"/>
      <el-table-column prop="id" label="日志编号" width="100"/>
      <el-table-column prop="userAccount" label="用户账号" width="120"/>
      <el-table-column prop="ipAddress" label="ip地址" width="120"/>
      <el-table-column prop="requestUri" label="请求地址" width="180"/>
      <el-table-column prop="requestMethod" label="请求方式" width="100"/>
      <el-table-column prop="classMethod" label="操作方法" :show-overflow-tooltip="true"/>
      <el-table-column prop="actionName" label="动作名称" width="180"/>
      <el-table-column prop="status" label="状态" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.status.text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" width="100">
        <template slot-scope="scope" v-if="scope.row.status.value == 1">
          <el-tag type="danger">{{ scope.row.executionTime }}秒</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="createdTime" align="center" width="180"/>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
          >详细
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

    <!-- 查看详细弹出层 -->
    <sys-log-detail-dialog :id="id" v-model="showDetailDialog"/>
  </div>
</template>

<script>
  import mixin from '@/mixin'
  import { exportLogs, pageLogs, removeLogs } from '@/api/sys/log'
  import SysLogSearchForm from '@/components/sys/log/SysLogSearchForm'
  import SysLogDetailDialog from '@/components/sys/log/SysLogDetailDialog'

  export default {
    name: 'SysLog',
    components: { SysLogSearchForm, SysLogDetailDialog },
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
        // 非多个禁用
        multiple: true,
        // 权限标识
        permission: {
          remove: ['sys:log:remove'],
          export: ['sys:log:export']
        },
        // 表格数据
        list: [],
        // 日志编号
        id: '',
        // 是否显示详情弹出层
        showDetailDialog: false
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // 分页查询系统日志列表
      fetchData() {
        this.loading = true
        const { page: pageNum, size: pageSize } = this
        const params = Object.assign(this.$refs.searchForm.queryParams, { pageNum, pageSize })
        pageLogs(this.addDateRange(params, this.$refs.searchForm.dateRange)).then(res => {
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
        this.multiple = !selection.length
      },
      // 详细按钮操作
      handleView(row) {
        this.id = row.id
        this.showDetailDialog = true
      },
      // 删除按钮操作
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除日志编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return removeLogs(ids)
        }).then(() => {
          this.msgSuccess('删除成功')
          this.fetchData()
        }).catch(() => {
        })
      },
      // 导出按钮操作
      handleExport() {
        const ids = this.ids
        const params = Object.assign(this.$refs.searchForm.queryParams, { ids })
        const data = this.addDateRange(params, this.$refs.searchForm.dateRange)
        this.$confirm('是否确认导出日志的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async function() {
          await exportLogs(data).then(res => {
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = window.URL.createObjectURL(new Blob([res]))
            link.setAttribute('download', '系统日志.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        }).then(() => {
          this.msgSuccess('导出成功')
          delete params.ids // 移除ids参数
        }).catch((res) => {
          if (res != 'cancel') {
            this.msgError('导出失败：' + res)
          }
        })
      }
    }
  }
</script>

