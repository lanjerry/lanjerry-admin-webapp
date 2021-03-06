import request from '@/utils/request'

// 登录方法
export function login(account, password, captchaCode, captchaKey) {
  const data = {
    account,
    password,
    captchaCode,
    captchaKey
  }
  return request({
    url: '/sys/user/login',
    method: 'post',
    data: data
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/util/captchaCode/create',
    method: 'get'
  })
}
