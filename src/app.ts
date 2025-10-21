import { defineAppConfig, history, defineDataLoader } from 'ice';
import { fetchUserInfo } from './services/user';
import { defineAuthConfig } from '@ice/plugin-auth/types';
import { defineStoreConfig } from '@ice/plugin-store/types';
import { defineRequestConfig } from '@ice/plugin-request/types';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({}));

export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;

  if (userInfo.error) {
    history?.push(`/login?redirect=${window.location.pathname}`);
  }

  return {
    initialAuth: {
      admin: userInfo.userType === 'admin',
      user: userInfo.userType === 'user',
    },
  };
});

export const storeConfig = defineStoreConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialStates: {
      user: {
        currentUser: userInfo,
      },
    },
  };
});

// 直接配置完整的后端服务地址
export const request = defineRequestConfig(() => ({
  // 使用完整的后端服务地址
  baseURL: 'http://127.0.0.1:8080/api',
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
        return Promise.reject(error);
      },
    },
  },
}));

export const dataLoader = defineDataLoader(async () => {
  const userInfo = await getUserInfo();
  return {
    userInfo,
  };
});

async function getUserInfo() {
  try {
    const userInfo = await fetchUserInfo();
    return userInfo;
  } catch (error) {
    return {
      error,
    };
  }
}
