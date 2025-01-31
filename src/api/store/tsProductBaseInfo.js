import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/tsProductBaseInfo',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/tsProductBaseInfo/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/tsProductBaseInfo',
    method: 'put',
    data
  })
}

/**
 * 查询分类
 */
export function listClassify(data) {
  return request({
    url: '/api/tsProductClassify/list',
    method: 'get',
    data
  })
}

/**
 * 查询商品
 */
export function searchProduct(data) {
  console.log(data)
  return request({
    url: 'api/tsProductBaseInfo/byName',
    method: 'post',
    data
  })
}

export default { add, edit, del, listClassify, searchProduct }
