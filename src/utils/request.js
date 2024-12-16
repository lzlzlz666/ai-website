import axios from 'axios'
import { ElMessage } from 'element-plus'
const baseURL = '/api'
const instance = axios.create({baseURL})

instance.interceptors.response.use(
  result => {
    return result.data;
  },
  err => {
    ElMessage({
      message:' 服务异常 ',
      type: 'error',
    })
    return Promise.reject(err)
  }
)

export default instance;