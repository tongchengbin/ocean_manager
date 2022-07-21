import request from '@/utils/request'

export function goodslist(params) {
  return request({
    url: '/api/admin/imooc/',
    method: 'get',
    params
  })
}

export function goodsdelete(row) {
  return request({
    url: '/api/admin/imooc/' + row.id + '/',
    method: 'delete'
  })
}

export function goodslanglist(params) {
  return request({
    url: '/api/admin/imooclang/',
    method: 'get',
    params
  })
}

export function goodsdetail(id) {
  return request({
    url: '/api/admin/imooc/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function goodsupdate(data) {
  return request({
    url: '/api/admin/imooc/' + data.id + '/',
    method: 'put',
    data: data
  })
}

export function funserver(params) {
  // 商品可选资源列表
  return request({
    url: '/api/admin/funserver/',
    method: 'get',
    params
  })
}

// 巧虎
export function qiaohuorder(params) {
  // 商品可选资源列表
  return request({
    url: '/api/admin/qiaohuorder/',
    method: 'get',
    params
  })
}

export function qiaohurecord(params) {
  // 商品可选资源列表
  return request({
    url: '/api/admin/qiaohurecord/',
    method: 'get',
    params
  })
}

// 巧虎
// 添加

//  修改
export function qiaohuUpdate(data) {
  return request({
    url: '/api/admin/qiaohuorder/' + data.id + '/',
    method: 'put',
    data
  })
}

// qiaohu recored
export function qiaohuRecordList(params) {
  return request({
    url: '/api/admin/qiaohurecord/',
    method: 'get',
    params
  })
}

// qiaohu recored
export function sexxlist(params) {
  return request({
    url: '/api/admin/welfaresexx/',
    method: 'get',
    params: params
  })
}

// // 获取跳转链接
// export function get_location(url) {
//   const data = {
//     url
//   }
//   return request({
//     url: 'api/get_location/',
//     method: 'post',
//     data: data
//   }
//   )
// }

// 课程统计
export function courseStatiStics() {
  return request({
    url: '/api/admin/course_Statistics/',
    method: 'get'
  })
}

export function courselist(params) {
  return request({
      url: '/api/admin/course/',
      method: 'get',
      params
    }
  )
}

export function courseUpdate(data) {
  return request({
      url: '/api/admin/course/' + data.id + '/',
      method: 'put',
      data
    }
  )
}

// 云盘精灵
export function yunpanlist(params) {
  return request({
      url: '/api/admin/yunpan/',
      method: 'get',
      params
    }
  )
}

export function yunpanUpdate(data) {
  return request({
      url: '/api/admin/yunpan/' + data.id + '/',
      method: 'put',
      data
    }
  )
}

// taobaoCourse
export function taobaoCourselist(params) {
  return request({
    url: '/api/admin/tbcourse',
    method: 'get',
    params
  })
}

export function taobaoCourseUpdate(data) {
  return request({
    url: '/api/admin/tbcourse/' + data.id + '/',
    method: 'put',
    data
  })
}

export function taobaoCourseDelete(data) {
  return request({
    url: '/api/admin/tbcourse/' + data.id + '/',
    method: 'delete'
  })
}

export function taobaoCourseCreate(data) {
  return request({
    url: '/api/admin/tbcourse/',
    method: 'post',
    data
  })
}

export function get_location(url) {
  return request({
    url,
    method: 'get'
  })
}

export function featchCategoryTree() {
  return request({
    url: '/api/admin/shop/category/tree/',
    method: 'get'
  })
}

export function featchCategoryList(params) {
  return request({
    url: '/api/admin/shop/category/',
    params,
    method: 'get'
  })
}

