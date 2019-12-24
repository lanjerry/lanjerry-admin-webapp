<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户编号" prop="userAccount">
        <el-input
          v-model="queryParams.userAccount"
          placeholder="请输入用户账号"
          clearable
          style="width: 200px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="IP地址" prop="ipAddress">
        <el-input
          v-model="queryParams.ipAddress"
          placeholder="请输入IP地址"
          clearable
          style="width: 200px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求地址" prop="requestUri">
        <el-input
          v-model="queryParams.requestUri"
          placeholder="请输入请求地址"
          clearable
          style="width: 200px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求方法" prop="requestMethod">
        <el-input
          v-model="queryParams.requestMethod"
          placeholder="请输入请求方法"
          clearable
          style="width: 200px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="动作名称" prop="actionName">
        <el-input
          v-model="queryParams.actionName"
          placeholder="请输入动作名称"
          clearable
          style="width: 200px;"
          size="small"
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
          <el-option label="成功" :value="'SUCCESS'"></el-option>
          <el-option label="失败" :value="'FAIL'"></el-option>
        </el-select>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:operlog:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志编号" align="center" prop="id" />
      <el-table-column label="用户账号" align="center" prop="userAccount" />
      <el-table-column label="ip地址" align="center" prop="ipAddress" />
      <el-table-column label="请求地址" align="center" prop="requestUri" />
      <el-table-column label="请求方式" align="center" prop="requestMethod" />
      <el-table-column label="操作方法" align="center" prop="classMethod" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="动作名称" align="center" prop="actionName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间（秒）" align="center" prop="executionTime" />
      <el-table-column label="操作时间" align="center" width="180" prop="createdTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
            v-hasPermi="['monitor:operlog:query']"
          >详细</el-button>
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
      @pagination="getList"
    />

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item label="动作名称：">{{ form.actionName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录信息：">{{ form.userAccount }} / {{ form.ipAddress }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异步请求：">{{ form.ajaxFlag }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.requestUri }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.classMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.requestParams }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：">{{ form.status.desc }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ form.createdTime }} </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行时间：" v-if="form.status.enumName === 'SUCCESS'">{{ form.executionTime }} 秒</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status.enumName === 'FAIL'">{{ form.exceptionMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageLogs, removLogs, getLog } from "@/api/sys/log";

export default {
  name: 'Log',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {
        status:{}
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        ipAddress: undefined,
        requestUri: undefined,
        requestMethod: undefined,
        actionName: undefined,
        status: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      pageLogs(this.addDateRange(this.queryParams, this.dateRange)).then( response => {
          this.list = response.data.records
          this.total = response.data.total
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      const logId = row.id || this.ids
      getLog(logId).then(response => {
        this.open = true;
        this.form = response.data;
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.id || this.ids;
      this.$confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return removLogs(operIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
};
</script>
