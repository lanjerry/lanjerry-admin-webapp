<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <sys-notification-search-form ref="searchForm" @handleQuery="handleQuery"/>
    <!-- 操作栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="notification.save">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" >
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="userAccount" label="用户账号" />
      <el-table-column prop="content" label="消息内容" />
      <el-table-column label="是否已读" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.readFlag" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="155"/>
    </el-table>
    <common-pagination v-show="total>0" :total="total" :page.sync="page" :size.sync="size" @pagination="fetchData"/>

    <!-- 新增系统消息弹出层 -->
    <sys-notification-modify-dialog  :title="title" v-model="showModifyDialog" @success="fetchData"/>
  </div>
</template>

<script>
  import mixin from '@/mixin'
  import { pageNotifications } from '@/api/sys/notification'
  import SysNotificationSearchForm from '@/components/sys/notification/SysNotificationSearchForm'
  import SysNotificationModifyDialog from '@/components/sys/notification/SysNotificationModifyDialog'

  export default {
    name: 'SysNotification',
    components: { SysNotificationSearchForm, SysNotificationModifyDialog },
    mixins: [
      mixin.search,
      mixin.pager
    ],
    data() {
      return {
        // 遮罩层
        loading: false,
        // 权限标识
        notification: {
          save: ['sys:notification:save'],
        },
        // 表格数据
        list: [],
        // 弹出层标题
        title: '',
        // 是否显示新增的弹出层
        showModifyDialog: false
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // 分页查询系统消息列表
      fetchData() {
        this.loading = true
        const { page: pageNum, size: pageSize } = this
        const params = Object.assign(this.$refs.searchForm.queryParams, { pageNum, pageSize })
        pageNotifications(params).then(res => {
          this.list = res.data.records
          this.total = res.data.total
        }).catch(() => {
          this.list = []
          this.total = 0
        }).then(() => {
          this.loading = false
        })
      },
      // 新增按钮操作
      handleAdd() {
        this.showModifyDialog = true
        this.title = '添加系统消息'
      },
    }
  }
</script>
