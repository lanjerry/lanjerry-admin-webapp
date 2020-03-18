<template>
  <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
    <el-form-item label="测试字段1" prop="testColumn01">
      <el-input
        v-model="queryParams.testColumn01"
        placeholder="请输入测试字段1"
        maxlength="45"
        clearable
        size="small"
        style="width: 200px"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="测试字段3" prop="testColumn03">
      <el-select
        v-model="queryParams.testColumn03"
        placeholder="请选择测试字段3"
        clearable
        size="small"
        style="width: 200px"
        @change="handleQuery"
      >
        <el-option label="请选择测试字段3" :value="null"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="测试字段4" prop="testColumnTime">
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
    <el-form-item label="测试字段5" prop="testColumnPhone">
      <el-input
        v-model="queryParams.testColumnPhone"
        placeholder="请输入测试字段5"
        maxlength="11"
        clearable
        size="small"
        style="width: 200px"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'SysTableSearchForm',
    data() {
      return {
        // 查询参数
        queryParams: {
          testColumn01: undefined,
          testColumn03: undefined,
          testColumnTime: undefined,
          testColumnPhone: undefined
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