// 使用相对路径作为baseURL，配合代理使用
// 注意：路径前不要加http://，否则代理不会生效
// 路径末尾也不要加斜杠/，否则可能导致路径拼接错误
// 路径就是/api，不需要额外的/api前缀

export const request = defineRequestConfig(() => ({
  baseURL: '127.0.0.1:8080/api',
  timeout: 10000,
  interceptors: {
    request: {
      onConfig: (config) => {
        // 添加请求头
        config.headers = {
          ...config.headers,
          'Content-Type': 'application/json',
        };
        console.log('最终请求URL:', config.baseURL + config.url);
        return config;
      },
    },
    response: {
      onSuccess: (response) => {
        console.log('请求成功，响应数据:', response);
        return response;
      },
      onError: (error) => {
        console.error('请求失败:', error);
        // 添加更详细的错误信息，帮助排查
        if (error.response) {
          console.error('错误状态码:', error.response.status);
          console.error('错误数据:', error.response.data);
        } else if (error.request) {
          console.error('无响应:', error.request);
          console.error('可能是后端服务未启动或端口错误');
        } else {
          console.error('请求错误:', error.message);
        }
        return Promise.reject(error);
      },
    },
  },
}));