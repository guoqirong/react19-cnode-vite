import axios from 'axios';

export interface resDataType<T> {
  success: boolean;
  data?: T;
}

// 处理请求链接
export const adornUrl = (path: string) => {
  return process.env.REACT_APP_API_BASE_URL + path;
};

// 请求方法创建
const httpRequest = axios.create({
  timeout: 1000 * 60,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// 请求拦截
httpRequest.interceptors.request.use((config) => {
  return config;
});

// 响应拦截
httpRequest.interceptors.response.use(
  (response) => {
    if (response && response.status === 403) {
      // 403, token失效
      console.error('登录失败');
    } else if (response && response.status !== 200) {
      // 403, token失效
      console.error('请求失败');
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default httpRequest;
