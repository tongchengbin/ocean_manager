import request from '@/utils/request'

export function featchFood(query) {
  return request({
    url: '/api/admin/food',
    method: 'get',
    params: query
  })
}
