// 桌牌数据模型接口
export interface DeskSignDO {
  id: string;
  signName: string;
  baseStationDO: { id: string; stationName: string };
  baseStationId: string;
  signCode: string;
  status: DeskSignStatus;
  ipAddress: string;
  port: number;
  powerMode: PowerMode;
  clearStatus: ClearStatus;
  macAddress: string;
  createTime: string;
  updateTime: string;
  remark: string;
}

// 桌牌状态枚举
export enum DeskSignStatus {
  NORMAL = 0,
  ABNORMAL = 1,
  MAINTENANCE = 2,
  INACTIVE = 3,
}

// 电源模式枚举
export enum PowerMode {
  ALWAYS_ON = 0,
  SCHEDULE = 1,
  AUTO_SLEEP = 2,
}

// 清理状态枚举
export enum ClearStatus {
  CLEARED = 0,
  UNCLEANED = 1,
}