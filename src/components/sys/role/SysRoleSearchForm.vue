<template>
  <el-form :model="queryParams" ref="queryForm" :inline="true">
    <el-form-item label="角色编号" prop="id">
      <el-input
        v-model.trim="queryParams.id"
        placeholder="请输入角色编号"
        clearable
        size="small"
        style="width: 240px"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="角色名称" prop="name">
      <el-input
        v-model.trim="queryParams.name"
        placeholder="请输入角色名称"
        clearable
        size="small"
        style="width: 240px"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="权限标识" prop="permissionTag">
      <el-input
        v-model.trim="queryParams.permissionTag"
        placeholder="请输入权限标识"
        clearable
        size="small"
        style="width: 240px"
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
          id: undefined,
          name: undefined,
          permissionTag: undefined
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
