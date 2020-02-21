// 系统日志状态枚举
export const sysLogStatusEnum = [
  {
    value: 1,
    label: '成功'
  },
  {
    value: 2,
    label: '失败'
  }
]

// 系统权限类型枚举
export const sysPermissionTypeEnum = [
  {
    value: 1,
    label: '菜单'
  },
  {
    value: 2,
    label: '按钮'
  }
]

// 系统权限状态枚举
export const sysPermissionStatusEnum = [
  {
    value: 1,
    label: '启用'
  },
  {
    value: 2,
    label: '停用'
  }
]

// 系统权限是否外链枚举
export const sysPermissionFrameFlagEnum = [
  {
    value: false,
    label: '否'
  },
  {
    value: true,
    label: '是'
  }
]

// 系统用户状态枚举
export const sysUserStatusEnum = [
  {
    value: 1,
    label: '启用'
  },
  {
    value: 2,
    label: '停用'
  }
]

// 系统用户性别枚举
export const sysUserSexEnum = [
  {
    value: 1,
    label: '男'
  },
  {
    value: 2,
    label: '女'
  },
  {
    value: 3,
    label: '未知'
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
    label: '不分页列表'
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
    value: 'eq',
    label: '='
  },
  {
    value: 'ne',
    label: '!='
  },
  {
    value: 'gt',
    label: '>'
  },
  {
    value: 'ge',
    label: '>='
  },
  {
    value: 'lt',
    label: '<'
  },
  {
    value: 'le',
    label: '<='
  },
  {
    value: 'like',
    label: 'Like'
  },
]

// 代码生成显示类型枚举
export const toolGenHtmlTypeEnum = [
  {
    value: 'input',
    label: '文本框'
  },
  {
    value: 'textarea',
    label: '文本域'
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
    value: 'datetime',
    label: '日期控件'
  }
]
