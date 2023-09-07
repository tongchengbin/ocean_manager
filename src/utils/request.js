import axios from 'axios'
import {Message} from 'element-ui'
// import store from '@/store'
import {getToken} from '@/utils/auth'
import router from '../router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
      // config.headers.token = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    return response.data

  },
  error => {
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    if(error.response===undefined){
      Message({
        message: "网络异常，请稍后再试！",
        type:"error",
        duration:5*1000
      })
    }
    switch (error.response.status) {
      case 401:
        router.push('/login')
        break
      case 400:
          Message({
            message: error.response.data.msg,
            type:"error",
            duration:5*1000
          })
        break
      case 403:
        Message({
          message: error.response.data.msg,
          type:"error",
          duration:5*1000
        })
        break
      case 500:
        Message({
          message: "服务器错误："+ error.response.data.msg,
          type:"error",
          duration:5*1000
        })
        break
    }
    return Promise.reject(error)
  }
)

export default service
