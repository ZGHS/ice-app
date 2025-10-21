import { request } from 'ice';
import type { BaseStationDO } from '@/interfaces/baseStation';

// 获取所有基站 - 修改为接收查询参数
export async function getAllBaseStations(params?: any): Promise<BaseStationDO[]> {
  try {
    console.log('获取基站列表，查询参数:', params);
    // 将查询参数传递给API请求
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/base-stations`, {
      params,
    });
    console.log('服务层获取到的完整响应:', response);
    
    // 检查响应数据的各种可能格式
    // 1. 直接返回数组
    if (Array.isArray(response)) {
      console.log('响应本身是数组:', response);
      return response;
    }
    
    // 2. 数据在response.data中
    if (response && response.data) {
      // 检查data是否是数组
      if (Array.isArray(response.data)) {
        console.log('响应data是数组:', response.data);
        return response.data;
      }
      // 检查data是否包含items、list或records等常见的数组字段
      const arrayFields = ['items', 'list', 'records', 'content'];
      for (const field of arrayFields) {
        if (response.data[field] && Array.isArray(response.data[field])) {
          console.log(`响应data.${field}是数组:`, response.data[field]);
          return response.data[field];
        }
      }
      console.log('响应data不是数组，尝试转换为数组:', response.data);
      return [response.data];
    }
    
    console.warn('未找到有效数据格式');
    return [];
  } catch (error) {
    console.error('获取基站数据时出错:', error);
    return [];
  }
}

// 根据ID获取基站
export async function getBaseStationById(id: number): Promise<BaseStationDO | null> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/base-stations/${id}`);
    return response?.data || null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// 根据基站编号获取基站
export async function getBaseStationByCode(stationCode: string): Promise<BaseStationDO | null> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/base-stations/code/${stationCode}`);
    return response?.data || null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// 根据IP地址获取基站
export async function getBaseStationByIp(ipAddress: string): Promise<BaseStationDO | null> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/base-stations/ip/${ipAddress}`);
    return response?.data || null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// 创建新基站
export async function createBaseStation(data: Omit<BaseStationDO, 'id' | 'createTime' | 'updateTime'>): Promise<BaseStationDO | null> {
  try {
    const response = await request.post(`${process.env.ICE_BASE_URL}/api/base-stations`, data);
    console.log('创建基站的完整响应:', response);
    
    // 处理各种可能的响应格式
    if (response) {
      // 1. 直接返回response.data（保留原有行为）
      if (response.data) {
        console.log('创建基站响应data:', response.data);
        return response.data;
      }
      // 2. 如果后端返回成功状态但没有data字段，也认为创建成功
      // 这种情况下返回包含传入数据的对象（假设后端会自动生成id等字段）
      console.log('创建基站成功但无data字段，返回处理后的数据');
      return {
        ...data,
        id: 0, // 临时id，实际使用时会被刷新
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      } as BaseStationDO;
    }
    
    console.warn('创建基站响应为空');
    return null;
  } catch (error) {
    console.error('创建基站时出错:', error);
    // 如果是400或422等验证错误，直接抛出以便前端处理
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw error;
    }
    // 其他错误返回null
    return null;
  }
}

// 更新基站
export async function updateBaseStation(id: number, data: Partial<BaseStationDO>): Promise<BaseStationDO | null> {
  try {
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/base-stations/${id}`, data);
    console.log('更新基站的完整响应:', response);
    
    // 处理各种可能的响应格式
    if (response) {
      // 1. 直接返回response.data（保留原有行为）
      if (response.data) {
        console.log('更新基站响应data:', response.data);
        return response.data;
      }
      // 2. 如果后端返回成功状态但没有data字段，也认为更新成功
      // 这种情况下返回包含传入数据的对象
      console.log('更新基站成功但无data字段，返回处理后的数据');
      return {
        id,
        ...data,
        updateTime: new Date().toISOString()
      } as BaseStationDO;
    }
    
    console.warn('更新基站响应为空');
    return null;
  } catch (error) {
    console.error('更新基站时出错:', error);
    // 如果是400或422等验证错误，直接抛出以便前端处理
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw error;
    }
    // 其他错误返回null
    return null;
  }
}

// 删除基站
export async function deleteBaseStation(id: number): Promise<boolean> {
  try {
    await request.delete(`${process.env.ICE_BASE_URL}/api/base-stations/${id}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
}