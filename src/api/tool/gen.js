import request from '@/utils/request'

// 分页查询代码生成业务列表
export function pageGens(query) {
  return request({
    url: '/tool/gen/page',
    method: 'get',
    params: query
  })
}

// 删除代码生成业务
export function removeGens(ids) {
  return request({
    url: '/tool/gen/' + ids,
    method: 'delete'
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
