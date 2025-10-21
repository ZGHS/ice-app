import { request } from 'ice';
import type { DeskSignDO } from '@/interfaces/deskSign';

/**
 * 获取所有桌牌列表
 */
export async function getAllDeskSigns(params?: any): Promise<DeskSignDO[]> {
  try {
    console.log('获取桌牌列表，查询参数:', params);
    // 将查询参数传递给API请求
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/desksigns`, {
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
    console.error('获取桌牌数据时出错:', error);
    return [];
  }
}

/**
 * 根据ID获取桌牌
 */
export async function getDeskSignById(id: string | number): Promise<DeskSignDO | null> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/desksigns/${id}`);
    console.log(`获取桌牌(ID:${id})的响应:`, response);
    
    // 检查响应格式
    if (response && (response.code === 200 || response.success)) {
      return response.data || response.result || response.content || null;
    }
    return null;
  } catch (error) {
    console.error(`获取桌牌(ID:${id})失败:`, error);
    return null;
  }
}

/**
 * 根据基站ID获取桌牌列表
 */
export async function getDeskSignsByBaseStationId(baseStationId: string | number): Promise<DeskSignDO[]> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/desksigns/base-station/${baseStationId}`);
    console.log(`根据基站ID(${baseStationId})获取桌牌列表响应:`, response);
    
    // 处理不同的响应格式
    if (Array.isArray(response)) return response;
    if (response && response.data) {
      if (Array.isArray(response.data)) return response.data;
      const arrayFields = ['items', 'list', 'records', 'content'];
      for (const field of arrayFields) {
        if (response.data[field] && Array.isArray(response.data[field])) {
          return response.data[field];
        }
      }
    }
    return [];
  } catch (error) {
    console.error(`根据基站ID获取桌牌列表失败:`, error);
    return [];
  }
}

/**
 * 根据状态获取桌牌列表
 */
export async function getDeskSignsByStatus(status: string | number): Promise<DeskSignDO[]> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/desksigns/status/${status}`);
    console.log(`根据状态(${status})获取桌牌列表响应:`, response);
    
    // 处理不同的响应格式
    if (Array.isArray(response)) return response;
    if (response && response.data) {
      if (Array.isArray(response.data)) return response.data;
      const arrayFields = ['items', 'list', 'records', 'content'];
      for (const field of arrayFields) {
        if (response.data[field] && Array.isArray(response.data[field])) {
          return response.data[field];
        }
      }
    }
    return [];
  } catch (error) {
    console.error(`根据状态获取桌牌列表失败:`, error);
    return [];
  }
}

/**
 * 创建桌牌
 */
export async function createDeskSign(deskSignData: Partial<DeskSignDO>): Promise<boolean> {
  try {
    console.log('创建桌牌的数据:', deskSignData);
    // 直接将数据作为第二个参数传递，这是正确的POST请求格式
    const response = await request.post(
      `${process.env.ICE_BASE_URL}/api/desksigns`,
      deskSignData
    );
    console.log('创建桌牌的响应:', response);
    
    // 扩展成功条件判断，处理更多可能的成功响应格式
    if (response) {
      // 检查常见的成功标志
      if (response.code === 200 || response.code === 201 || 
          response.success || response.status === 'success' ||
          response.result === 'success' || response.message?.includes('成功')) {
        return true;
      }
      // 如果响应是一个对象但没有明确的失败标志，也可以视为成功
      // 这是为了兼容可能只返回创建数据而没有状态码的情况
      if (typeof response === 'object' && !response.error && !response.fail && !response.code?.toString().startsWith('4')) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('创建桌牌失败:', error);
    return false;
  }
}

/**
 * 更新桌牌
 */
export async function updateDeskSign(id: string | number, deskSignData: Partial<DeskSignDO>): Promise<boolean> {
  try {
    console.log(`更新桌牌(ID:${id})的数据:`, deskSignData);
    // 直接将数据作为第二个参数传递，这是正确的PUT请求格式
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/desksigns/${id}`, deskSignData);
    console.log(`更新桌牌(ID:${id})的响应:`, response);
    
    if (response && (response.code === 200 || response.success)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(`更新桌牌(ID:${id})失败:`, error);
    return false;
  }
}

/**
 * 删除桌牌
 */
export async function deleteDeskSign(id: string | number): Promise<boolean> {
  try {
    const response = await request.delete(`${process.env.ICE_BASE_URL}/api/desksigns/${id}`);
    console.log(`删除桌牌(ID:${id})的响应:`, response);
    
    if (response && (response.code === 200 || response.success)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(`删除桌牌(ID:${id})失败:`, error);
    return false;
  }
}

/**
 * 软删除桌牌
 */
export async function softDeleteDeskSign(id: string | number): Promise<boolean> {
  try {
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/desksigns/${id}/soft-delete`);
    console.log(`软删除桌牌(ID:${id})的响应:`, response);
    
    if (response && (response.code === 200 || response.success)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(`软删除桌牌(ID:${id})失败:`, error);
    return false;
  }
}

/**
 * 批量更新桌牌状态
 */
export async function batchUpdateDeskSignStatus(ids: string[] | number[], status: string | number): Promise<boolean> {
  try {
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/desksigns/batch-status`, {
      data: { ids, status },
    });
    console.log('批量更新桌牌状态的响应:', response);
    
    if (response && (response.code === 200 || response.success)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('批量更新桌牌状态失败:', error);
    return false;
  }
}

/**
 * 获取未删除的活跃桌牌
 */
export async function getActiveDeskSigns(): Promise<DeskSignDO[]> {
  try {
    const response = await request.get(`${process.env.ICE_BASE_URL}/api/desksigns/active`);
    console.log('获取活跃桌牌的响应:', response);
    
    // 处理不同的响应格式
    if (Array.isArray(response)) return response;
    if (response && response.data) {
      if (Array.isArray(response.data)) return response.data;
      const arrayFields = ['items', 'list', 'records', 'content'];
      for (const field of arrayFields) {
        if (response.data[field] && Array.isArray(response.data[field])) {
          return response.data[field];
        }
      }
    }
    return [];
  } catch (error) {
    console.error('获取活跃桌牌失败:', error);
    return [];
  }
}

/**
 * 更新桌牌状态
 */
export async function updateDeskSignStatus(id: string | number, status: number): Promise<DeskSignDO | null> {
  try {
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/desksigns/${id}/status`, {
      data: { status },
    });
    console.log(`更新桌牌(ID:${id})状态的响应:`, response);
    
    if (response && (response.code === 200 || response.success)) {
      return response.data || response.result || response.content || null;
    }
    return null;
  } catch (error) {
    console.error(`更新桌牌状态失败:`, error);
    return null;
  }
}

/**
 * 更新桌牌功耗模式
 */
export async function updateDeskSignPowerMode(id: string | number, powerMode: number): Promise<DeskSignDO | null> {
  try {
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/desksigns/${id}/power-mode`, {
      data: { powerMode },
    });
    console.log(`更新桌牌(ID:${id})功耗模式的响应:`, response);
    
    if (response && (response.code === 200 || response.success)) {
      return response.data || response.result || response.content || null;
    }
    return null;
  } catch (error) {
    console.error(`更新桌牌功耗模式失败:`, error);
    return null;
  }
}

/**
 * 更新桌牌清理状态
 */
export async function updateDeskSignClearStatus(id: string | number, clearStatus: number): Promise<DeskSignDO | null> {
  try {
    const response = await request.put(`${process.env.ICE_BASE_URL}/api/desksigns/${id}/clear-status`, {
      data: { clearStatus },
    });
    console.log(`更新桌牌(ID:${id})清理状态的响应:`, response);
    
    if (response && (response.code === 200 || response.success)) {
      return response.data || response.result || response.content || null;
    }
    return null;
  } catch (error) {
    console.error(`更新桌牌清理状态失败:`, error);
    return null;
  }
}