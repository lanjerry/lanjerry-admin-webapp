import request from '@/utils/request'

// 分页查询角色列表
export function pageRole(query) {
  return request({
    url: '/sys/role/page',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/sys/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/sys/role/' + data.roleId,
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/sys/role/' + roleId,
    method: 'delete'
  })
}

// 查询角色权限编号集
export function getRolePermission(roleId) {
  return request({
    url: '/sys/role/permissionIds/' + roleId,
    method: 'get'
  })
}

// 查询角色列表
export function listRole() {
  return request({
    url: '/sys/role/list',
    method: 'get'
  })
}
