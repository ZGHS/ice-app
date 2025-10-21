// 基站数据模型接口
// 更新接口定义，移除不存在的address字段，添加后端返回的实际字段
export interface BaseStationDO {
  id: number;
  stationCode: string;
  stationName: string;
  ipAddress: string;
  port: number | null;
  bindStatus: number;
  deskSigns: any[];
  status: number;
  lastOnlineTime: string | null;
  createTime: string;
  updateTime: string;
  remark: string | null;
  attributes: any | null;
  isDeleted: boolean;
}

// 基站状态枚举
export enum BaseStationStatus {
  NORMAL = 1, // 正常
  ABNORMAL = 2, // 异常
  MAINTENANCE = 3, // 维护中
  INACTIVE = 4, // 停用
}
