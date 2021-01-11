import request from '@/api/public'

export function login(data) {
  return request.post('/admin/login', data)
}

export function logout() {
  return request.post('/admin/logout')
}

export function getUserInfo() {
  return request.get('/admin/info')
}

