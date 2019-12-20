import request from '@/utils/request'

// 查询菜单列表
export function listPermissions(query) {
  return request({
    url: '/sys/permission/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getPermission(id) {
  return request({
    url: '/sys/permission/' + id,
    method: 'get'
  })
}

// 新增菜单
export function savePermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updatePermission(data) {
  return request({
    url: '/sys/permission/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除菜单
export function removePermission(id) {
  return request({
    url: '/sys/permission/' + id,
    method: 'delete'
  })
}

// 查询权限树形结构列表
export function treePermissions() {
  return request({
    url: '/sys/permission/tree',
    method: 'get'
  })
}
