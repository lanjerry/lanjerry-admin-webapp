import request from '@/utils/request'

// 分页查询代码生成业务列表
export function pageGens(query) {
  return request({
    url: '/tool/gen/page',
    method: 'get',
    params: query
  })
}

// 根据表编号查询代码生成业务
export function getGen(id) {
  return request({
    url: '/tool/gen/' + id,
    method: 'get'
  })
}

// 更新代码生成
export function updateGen(id, data) {
  return request({
    url: '/tool/gen/' + id,
    method: 'put',
    data: data
  })
}

// 删除代码生成
export function removeGens(ids) {
  return request({
    url: '/tool/gen/' + ids,
    method: 'delete'
  })
}

// 预览代码生成
export function previewGen(id) {
  return request({
    url: '/tool/gen/preview/' + id,
    method: 'get'
  })
}

// 分页查询数据库表
export function pageDbTables(query) {
  return request({
    url: '/tool/gen/pageDbTables',
    method: 'get',
    params: query
  })
}

// 导入数据库表
export function importDbTables(tableNames) {
  return request({
    url: '/tool/gen/importDbTables/' + tableNames,
    method: 'post'
  })
}
