import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined, EnvironmentOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const asideMenuConfig: MenuDataItem[] = [
  {
    name: '工作台',
    path: '/',
    icon: <DashboardOutlined />,
  },
  {
    name: '表单',
    path: '/form',
    icon: <FormOutlined />,
  },
  {
    name: '列表',
    path: '/list',
    icon: <TableOutlined />,
  },
  {
    name: '设备管理',
    icon: <SettingOutlined />,
    children: [
      {
        name: '基站管理',
        path: '/base-station',
        icon: <EnvironmentOutlined />,
      },
      {
        name: '桌牌管理',
        path: '/desk-sign',
        icon: <TableOutlined />,
      },
      {
        name: '场地管理',
        path: '/site',
        icon: <HomeOutlined />,
      },
    ],
  },
  {
    name: '模板管理',
    icon: <SettingOutlined />,
    children: [
      {
        name: '公共模板',
        path: '/base-station',
        icon: <EnvironmentOutlined />,
      },
      {
        name: '自定义模板',
        path: '/desk-sign',
        icon: <TableOutlined />,
      },
    ],
  },
  {
    name: '结果&异常',
    icon: <WarningOutlined />,
    children: [
      {
        name: '成功',
        path: '/success',
      },
      {
        name: '404',
        path: '/404',
      },
    ],
  },
];

export { asideMenuConfig };
