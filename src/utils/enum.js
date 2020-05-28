// 系统用户状态枚举
export const sysUserStatusEnum = [
  {
    value: 1,
    text: '启用',
    name: 'ENABLE'
  },
  {
    value: 2,
    text: '停用',
    name: 'DISABLE'
  }
]

// 系统用户性别枚举
export const sysUserSexEnum = [
  {
    value: 1,
    text: '男',
    name: 'MALE'
  },
  {
    value: 2,
    text: '女',
    name: 'FEMALE'
  },
  {
    value: 3,
    text: '未知',
    name: 'UNKNOWN'
  }
]

// 系统权限类型枚举
export const sysPermissionTypeEnum = [
  {
    value: 1,
    text: '菜单',
    name: 'MENU'
  },
  {
    value: 2,
    text: '按钮',
    name: 'BUTTON'
  }
]

// 系统权限状态枚举
export const sysPermissionStatusEnum = [
  {
    value: 1,
    text: '启用',
    name: 'ENABLE'
  },
  {
    value: 2,
    text: '停用',
    name: 'DISABLE'
  }
]

// 系统权限是否外链枚举
export const sysPermissionFrameFlagEnum = [
  {
    value: false,
    text: '否'
  },
  {
    value: true,
    text: '是'
  }
]

// 系统日志状态枚举
export const sysLogStatusEnum = [
  {
    value: 1,
    text: '成功',
    name: 'SUCCESS'
  },
  {
    value: 2,
    text: '失败',
    name: 'FAIL'
  }
]

// 代码生成模板功能枚举
export const toolGenTplFunctionEnum = [
  {
    value: 'pageList',
    label: '分页列表'
  },
  {
    value: 'list',
    label: '列表'
  },
  {
    value: 'add',
    label: '新增'
  },
  {
    value: 'update',
    label: '修改'
  },
  {
    value: 'delete',
    label: '删除'
  },
  {
    value: 'export',
    label: '导出'
  },
  {
    value: 'import',
    label: '导入'
  }
]

// 代码生成查询方式枚举
export const toolGenQueryTypeEnum = [
  {
    value: 'like',
    label: '模糊查询'
  },
  {
    value: 'eq',
    label: '精确查询'
  },
  {
    value: 'between',
    label: '范围查询'
  },
  {
    value: 'ne',
    label: '不等于 <>'
  },
  {
    value: 'gt',
    label: '大于 >'
  },
  {
    value: 'ge',
    label: '大于等于 >='
  },
  {
    value: 'lt',
    label: '小于 <'
  },
  {
    value: '小于等于 <=',
    label: '<='
  }
]

// 代码生成显示类型枚举
export const toolGenHtmlTypeEnum = [
  {
    value: 'input',
    label: '文本框'
  },
  {
    value: 'select',
    label: '下拉框'
  },
  {
    value: 'datetime',
    label: '日期控件'
  },
  {
    value: 'radio',
    label: '单选框'
  },
  {
    value: 'checkbox',
    label: '复选框'
  },
  {
    value: 'textarea',
    label: '文本域'
  }
]
