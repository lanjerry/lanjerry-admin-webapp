<template>
  <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
    <el-form-item label="用户编号" prop="id">
      <el-input
        v-model.trim="queryParams.id"
        placeholder="请输入用户编号"
        clearable
        size="small"
        style="width: 200px"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="帐号" prop="account">
      <el-input
        v-model.trim="queryParams.account"
        placeholder="请输入帐号"
        clearable
        size="small"
        style="width: 200px"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="昵称" prop="name">
      <el-input
        v-model.trim="queryParams.name"
        placeholder="请输入昵称"
        clearable
        size="small"
        style="width: 200px"
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
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { sysUserStatusEnum } from '@/utils/enum'

  export default {
    name: 'SysUserSearchForm',
    data() {
      return {
        // 状态选项
        statusOptions: sysUserStatusEnum,
        // 查询参数
        queryParams: {
          id: undefined,
          account: undefined,
          name: undefined,
          status: null
        }
      }
    },
    methods: {
      // 搜索按钮操作
      handleQuery() {
        this.$emit('handleQuery')
      },
      // 重置按钮操作
      resetQuery() {
        this.resetForm('queryForm')
        this.$emit('handleQuery')
      }
    }
  }
</script>
