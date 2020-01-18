import request from '@/utils/request'

// 分页查询系统角色列表
export function pageRoles(query) {
  return request({
    url: '/sys/role/page',
    method: 'get',
    params: query
  })
}

// 根据角色编号查询角色信息
export function getRole(id) {
  return request({
    url: '/sys/role/' + id,
    method: 'get'
  })
}

// 新增系统角色
export function saveRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data: data
  })
}

// 更新系统角色
export function updateRole(id, data) {
  return request({
    url: '/sys/role/' + id,
    method: 'put',
    data: data
  })
}

// 删除系统角色
export function removeRoles(ids) {
  return request({
    url: '/sys/role/' + ids,
    method: 'delete'
  })
}

// 根据角色编号查询角色的权限编号集
export function getRolePermissionIds(id) {
  return request({
    url: '/sys/role/permissionIds/' + id,
    method: 'get'
  })
}

// 查询系统角色列表
export function listRole() {
  return request({
    url: '/sys/role/list',
    method: 'get'
  })
}
