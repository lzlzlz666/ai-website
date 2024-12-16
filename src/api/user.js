import request from '@/utils/request.js'

export const userRegisterService = (registerData, key) => {
  const params = new URLSearchParams()
  for (let keyItem in registerData) {
    params.append(keyItem, registerData[keyItem]);
  }
  // 在请求的 URL 后面添加 key 参数
  return request.post(`/user/register?key=${key}`, params)
}

export const userLoginService = (loginData) => {
  const params = new URLSearchParams()
  for (let keyItem in loginData) {
    params.append(keyItem, loginData[keyItem]);
  }

  return request.post('/user/login', params)
}
