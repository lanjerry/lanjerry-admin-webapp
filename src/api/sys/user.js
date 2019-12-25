import request from '@/utils/request'

// 分页查询系统用户列表
export function pageUsers(query) {
  return request({
    url: '/sys/user/page',
    method: 'get',
    params: query
  })
}

// 根据用户编号查询用户信息
export function getUser(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'get'
  })
}

// 新增系统用户
export function saveUser(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}

// 更新系统用户
export function updateUser(data) {
  return request({
    url: '/sys/user/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除系统用户
export function removeUsers(ids) {
  return request({
    url: '/sys/user/' + ids,
    method: 'delete'
  })
}

// 启用或者停用系统用户
export function changeUserStatus(id, status) {
  const url = status == '1' ? '/sys/user/enable/' : '/sys/user/disable/'
  return request({
    url: url + id,
    method: 'put'
  })
}

// 重置系统用户密码
export function resetUserPwd(data) {
  return request({
    url: '/sys/user/resetPassword',
    method: 'put',
    data: data
  })
}
