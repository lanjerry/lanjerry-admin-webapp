import request from '@/utils/request'

// 查询用户列表
export function pageUsers(query) {
  return request({
    url: '/sys/user/page',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'get'
  })
}

// 新增用户
export function saveUser(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/sys/user/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除用户
export function removeUsers(ids) {
  return request({
    url: '/sys/user/' + ids,
    method: 'delete'
  })
}

// 用户状态修改
export function changeUserStatus(id, status) {
  const url = status == '1' ? '/sys/user/unlock/' : '/sys/user/lock/'
  return request({
    url: url + id,
    method: 'put'
  })
}

// 用户密码重置
export function resetUserPwd(data) {
  return request({
    url: '/sys/user/resetPassword',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}
