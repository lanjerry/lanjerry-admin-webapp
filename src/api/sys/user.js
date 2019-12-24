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

// 锁定或者解锁系统用户
export function changeUserStatus(id, status) {
  const url = status == '1' ? '/sys/user/unlock/' : '/sys/user/lock/'
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
