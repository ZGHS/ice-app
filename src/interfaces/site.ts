// 场地数据模型接口
export interface SiteDO {
  id: number;
  siteCode: string;
  siteName: string;
  siteType: string; // 场地类型（必填）
  address?: string;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  isDeleted?: boolean;
}

// 场地状态枚举
export enum SiteStatus {
  NORMAL = 1, // 正常
  ABNORMAL = 2, // 异常
  MAINTENANCE = 3, // 维护中
  INACTIVE = 4, // 停用
}