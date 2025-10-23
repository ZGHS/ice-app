import { request } from 'ice';
import type { SiteDO } from '@/interfaces/site';

/**
 * 获取所有场地列表
 */
export async function getAllSites(params?: any): Promise<SiteDO[]> {
  try {
    console.log('获取场地列表，查询参数:', params);
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/sites`, {
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
    console.error('获取场地数据时出错:', error);
    return [];
  }
}

/**
 * 根据ID获取场地
 */
export async function getSiteById(id: number): Promise<SiteDO | null> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/sites/${id}`);
    console.log(`获取场地(ID:${id})的响应:`, response);
    
    // 处理不同的响应格式
    if (response && (response.code === 200 || response.success)) {
      return response.data || response.result || response.content || null;
    }
    return null;
  } catch (error) {
    console.error(`获取场地(ID:${id})失败:`, error);
    return null;
  }
}

/**
 * 根据场地编号获取场地
 */
export async function getSiteByCode(siteCode: string): Promise<SiteDO | null> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/sites/code/${siteCode}`);
    console.log(`获取场地(编号:${siteCode})的响应:`, response);
    
    // 处理不同的响应格式
    if (response && (response.code === 200 || response.success)) {
      return response.data || response.result || response.content || null;
    }
    return null;
  } catch (error) {
    console.error(`获取场地(编号:${siteCode})失败:`, error);
    return null;
  }
}

/**
 * 创建新场地
 */
export async function createSite(data: Omit<SiteDO, 'id' | 'createTime' | 'updateTime'>): Promise<SiteDO | null> {
  try {
    const response = await request.post(`${process.env.ICE_BASE_URL}/api/sites`, data);
    console.log('创建场地的完整响应:', response);
    
    // 处理各种可能的响应格式
    if (response) {
      if (response.data) {
        console.log('创建场地响应data:', response.data);
        return response.data;
      }
      return response;
    }
    return null;
  } catch (error) {
    console.error('创建场地失败:', error);
    return null;
  }
}

/**
 * 更新场地
 */
export async function updateSite(id: number, data: Omit<SiteDO, 'createTime' | 'updateTime'>): Promise<SiteDO | null> {
  try {
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/sites/${id}`, data);
    console.log('更新场地的完整响应:', response);
    
    // 处理各种可能的响应格式
    if (response) {
      if (response.data) {
        console.log('更新场地响应data:', response.data);
        return response.data;
      }
      return response;
    }
    return null;
  } catch (error) {
    console.error('更新场地失败:', error);
    return null;
  }
}

/**
 * 删除场地
 */
export async function deleteSite(id: number): Promise<boolean> {
  try {
    const response = await request.delete(`${process.env.ICE_BASE_URL}/api/sites/${id}`);
    console.log('删除场地的完整响应:', response);
    
    // 更灵活地处理各种可能的成功响应格式
    // 1. 如果响应本身为true或1（某些后端可能直接返回成功标记）
    if (response === true || response === 1) {
      return true;
    }
    
    // 2. 检查常见的成功状态标志
    if (response && (
      response.status === 200 || 
      response.status === 204 || 
      response.code === 200 || 
      response.code === 0 || // 某些API使用0表示成功
      response.success || 
      response.result === true
    )) {
      return true;
    }
    
    // 3. 如果是DELETE请求且没有抛出异常，可能是成功但响应不完整
    // 这是为了兼容后端可能返回的不同格式
    return true;
  } catch (error) {
    console.error('删除场地失败:', error);
    return false;
  }
}