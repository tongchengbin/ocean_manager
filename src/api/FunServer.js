import request from '@/utils/request'

export function lezhi(url) {
  const data = {
    url
  }
  return request({
    url: '/funserver/lezhi/',
    method: 'get',
    data
  })
}
