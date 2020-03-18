import request from '@/utils/request'

// 分页查询系统测试列表
export function pageTables(query) {
  return request({
    url: '/sys/table/page',
    method: 'get',
    params: query
  })
}

// 根据测试编号查询系统测试信息
export function getTable(id) {
  return request({
    url: '/sys/table/' + id,
    method: 'get'
  })
}

// 更新系统测试
export function updateTable(id, data) {
  return request({
    url: '/sys/table/' + id,
    method: 'put',
    data: data
  })
}

// 删除系统测试
export function removeTables(ids) {
  return request({
    url: '/sys/table/' + ids,
    method: 'delete'
  })
}
