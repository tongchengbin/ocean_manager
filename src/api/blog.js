import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/admin/blog/article/',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/api/admin/blog/article/' + id + '/',
    method: 'get'
  })
}

export function feachCategory() {
  return request({
    url: '/api/admin/blog/category/',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: {pv}
  })
}

export function createArticle(data) {
  return request({
    url: '/api/admin/blog/article/',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/api/admin/blog/article/' + data.id + '/',
    method: 'put',
    data
  })
}
