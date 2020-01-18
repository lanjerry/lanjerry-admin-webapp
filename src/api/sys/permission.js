import request from '@/utils/request'

// 查询系统权限列表
export function listPermissions() {
  return request({
    url: '/sys/permission/list',
    method: 'get'
  })
}

// 根据权限编号查询系统权限信息
export function getPermission(id) {
  return request({
    url: '/sys/permission/' + id,
    method: 'get'
  })
}

// 新增系统权限
export function savePermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data: data
  })
}

// 更新系统权限
export function updatePermission(id, data) {
  return request({
    url: '/sys/permission/' + id,
    method: 'put',
    data: data
  })
}

// 删除系统权限
export function removePermission(id) {
  return request({
    url: '/sys/permission/' + id,
    method: 'delete'
  })
}

// 启用或者停用系统权限
export function changePermissionStatus(id, status) {
  const url = status == '1' ? '/sys/permission/enable/' : '/sys/permission/disable/'
  return request({
    url: url + id,
    method: 'put'
  })
}

// 查询树形结构系统权限列表
export function treePermissions() {
  return request({
    url: '/sys/permission/tree',
    method: 'get'
  })
}
