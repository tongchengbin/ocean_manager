import request from '@/api/public'

export function login(data) {
  return request.post('/api/admin/login', data)
}

export function logout() {
  return request.post('/api/admin/logout')
}

export function getUserInfo() {
  return request.get('/api/admin/login')
}

