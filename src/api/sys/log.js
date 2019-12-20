import request from '@/utils/request'

// 查询分页日志列表
export function pageLogs(query) {
  return request({
    url: '/sys/log/page',
    method: 'get',
    params: query
  })
}

// 查询日志详细
export function getLog(id) {
  return request({
    url: '/sys/log/' + id,
    method: 'get'
  })
}

// 删除操作日志
export function removLogs(operId) {
  return request({
    url: '/sys/log/' + operId,
    method: 'delete'
  })
}
