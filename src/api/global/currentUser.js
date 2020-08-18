import request from '@/utils/request'

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

// 查询当前登录用户基本资料
export function getUserProfile() {
  return request({
    url: '/sys/user/profile',
    method: 'get'
  })
}

// 更新当前登录用户基本资料
export function updateUserProfile(data) {
  return request({
    url: '/sys/user/profile',
    method: 'put',
    data: data
  })
}

// 更新当前登录用户密码
export function updateUserPwd(data) {
  return request({
    url: '/sys/user/profile/updatePassword',
    method: 'put',
    data: data
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

// 查询当前登录用户消息通知个数
export function getUserNotificationCount() {
  return request({
    url: '/sys/user/notification/count',
    method: 'get'
  })
}
