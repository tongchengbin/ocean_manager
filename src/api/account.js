// 用户管理
import request from '@/utils/request'

export function CommonApi(model, method, data) {
  switch (method) {
    case 'get':
      return request({
        url: '/api/' + model + '/',
        params: data,
        method
      })
    case 'post':
      return request({
        url: '/api/' + model + '/',
        data: data,
        method
      })
    case 'put':
      return request({
        url: '/api/' + model + '/' + data.id + '/',
        data: data,
        method
      })
    case 'delete':
      return request({
        url: '/api/account/' + model + '/' + data.id + '/',
        data: data,
        method
      })
  }
}

