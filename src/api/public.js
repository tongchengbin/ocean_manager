//  公用api接口
import request from '@/utils/request'

export default {
  get(url, params, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    return request({
      url,
      method: 'get',
      params
    })
  },
  post(url, data = {}, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    return request({
      url,
      method: 'post',
      data
    })
  },
  put(url, data, pk) {
    return request({
      url,
      method: 'put',
      data
    })
  },
  delete(url, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    return request({
      url,
      method: 'delete'
    })
  },
  patch(url, data, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    return request({
      url,
      method: 'patch',
      data
    })
  }

}
