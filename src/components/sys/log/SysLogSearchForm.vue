<template>
  <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
    <el-form-item label="用户账号" prop="userAccount">
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
        <el-option
          v-for="status in statusOptions"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
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
</template>

<script>
  export default {
    name: 'SysUserSearchForm',
    props: {
      statusOptions: {
        type: Array
      }
    },
    data() {
      return {
        queryParams: {
          userAccount: undefined,
          ipAddress: undefined,
          requestUri: undefined,
          requestMethod: undefined,
          actionName: undefined,
          status: null,
        },
        dateRange: []
      }
    },
    methods: {
      handleQuery() {
        this.$emit('handleQuery')
      },
      resetQuery() {
        this.dateRange = []
        this.resetForm('queryForm')
        this.$emit('handleQuery')
      }
    }
  }
</script>
