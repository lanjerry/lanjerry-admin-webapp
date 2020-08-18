import request from '@/utils/request'

// 分页查询系统消息列表
export function pageNotifications(query) {
  return request({
    url: '/sys/notification/page',
    method: 'get',
    params: query
  })
}

// 新增系统消息
export function saveNotification(data) {
  return request({
    url: '/sys/notification',
    method: 'post',
    data: data
  })
}
