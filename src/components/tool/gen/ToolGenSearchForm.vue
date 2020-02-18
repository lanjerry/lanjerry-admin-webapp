<template>
  <el-form :model="queryParams" ref="queryForm" :inline="true">
    <el-form-item label="表名称" prop="tableName">
      <el-input
        v-model="queryParams.tableName"
        placeholder="请输入表名称"
        clearable
        size="small"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="表描述" prop="tableComment">
      <el-input
        v-model="queryParams.tableComment"
        placeholder="请输入表描述"
        clearable
        size="small"
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
</template>

<script>
  export default {
    name: 'SysRoleSearchForm',
    data() {
      return {
        // 查询参数
        queryParams: {
          tableName: undefined,
          tableComment: undefined
        },
        // 日期范围
        dateRange: []
      }
    },
    methods: {
      // 搜索按钮操作
      handleQuery() {
        this.$emit('handleQuery')
      },
      // 重置按钮操作
      resetQuery() {
        this.dateRange = []
        this.resetForm('queryForm')
        this.$emit('handleQuery')
      }
    }
  }
</script>
