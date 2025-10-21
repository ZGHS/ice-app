import { definePageConfig } from "ice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Modal, Popconfirm } from "antd";
import React, { useRef, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-form";
import type { DeskSignDO } from "@/interfaces/deskSign";
import { DeskSignStatus, PowerMode, ClearStatus } from "@/interfaces/deskSign";
import {
  getAllDeskSigns as fetchAllDeskSigns,
  createDeskSign as createDeskSignApi,
  updateDeskSign as updateDeskSignApi,
  deleteDeskSign as deleteDeskSignApi,
} from "@/services/deskSign";

// 状态映射配置
const statusMap = {
  [DeskSignStatus.NORMAL]: { text: "正常", status: "success" },
  [DeskSignStatus.ABNORMAL]: { text: "异常", status: "error" },
  [DeskSignStatus.MAINTENANCE]: { text: "维护中", status: "warning" },
  [DeskSignStatus.INACTIVE]: { text: "停用", status: "default" },
};

// 电源模式映射配置
const powerModeMap = {
  [PowerMode.ALWAYS_ON]: { text: "常亮", status: "success" },
  [PowerMode.SCHEDULE]: { text: "定时", status: "warning" },
  [PowerMode.AUTO_SLEEP]: { text: "自动休眠", status: "default" },
};

// 清理状态映射配置
const clearStatusMap = {
  [ClearStatus.CLEARED]: { text: "已清理", status: "success" },
  [ClearStatus.UNCLEANED]: { text: "未清理", status: "error" },
};

// 服务函数封装
async function createDeskSign(data: any): Promise<any | null> {
  try {
    const success = await createDeskSignApi(data);
    if (success) {
      return data; // 返回创建的数据作为成功标识
    }
    return null;
  } catch (error) {
    console.error("创建桌牌失败:", error);
    return null;
  }
}

async function updateDeskSign(id: string, data: any): Promise<any | null> {
  try {
    const success = await updateDeskSignApi(id, data);
    if (success) {
      return { id, ...data }; // 返回更新后的数据作为成功标识
    }
    return null;
  } catch (error) {
    console.error("更新桌牌失败:", error);
    return null;
  }
}

async function deleteDeskSign(id: string): Promise<boolean> {
  try {
    return await deleteDeskSignApi(id);
  } catch (error) {
    console.error("删除桌牌失败:", error);
    return false;
  }
}

const DeskSignList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const editFormRef = useRef<any>();
  const addFormRef = useRef<any>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any | null>(null);

  // 定义列配置
  const columns: Array<ProColumns<any>> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      hideInSearch: true,
    },
    {
      title: "桌牌名称",
      dataIndex: "signName",
      width: 150,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入桌牌名称",
          },
        ],
      },
    },
    {
      title: "桌牌编号",
      dataIndex: "signCode",
      width: 150,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入桌牌编号",
          },
        ],
      },
    },
    {
      title: "基站信息",
      dataIndex: ["baseStationDO", "stationName"],
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        return record.baseStationDO ? record.baseStationDO.stationName : "-";
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: statusMap,
      valueType: "select",
      hideInSearch: true,
      formItemProps: {
        initialValue: DeskSignStatus.NORMAL,
      },
    },
    {
      title: "功耗模式",
      dataIndex: "powerMode",
      valueEnum: powerModeMap,
      valueType: "select",
      hideInSearch: true,
    },
    {
      title: "清屏状态",
      dataIndex: "clearStatus",
      valueEnum: clearStatusMap,
      valueType: "select",
      hideInSearch: true,
    },
    {
      title: "备注",
      dataIndex: "remark",
      hideInSearch: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      width: 150,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleEdit(record);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除这个桌牌吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a key="delete" style={{ color: "#ff4d4f" }}>
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];

  // 处理编辑
  const handleEdit = (record: any) => {
    setCurrentRecord(record);
    setIsEditModalVisible(true);
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.setFieldsValue(record);
      }
    }, 0);
  };

  // 处理新增
  const handleAdd = () => {
    if (addFormRef.current) {
      addFormRef.current.resetFields();
    }
    setIsAddModalVisible(true);
  };

  // 编辑表单提交
  const handleEditFinish = async (values: any) => {
    try {
      if (currentRecord) {
        const updated = await updateDeskSign(currentRecord.id, values);
        if (updated) {
          message.success("更新成功");
          setIsEditModalVisible(false);
          actionRef.current?.reload();
        } else {
          message.error("更新失败");
        }
      }
    } catch (error) {
      message.error(
        "更新失败：" + (error instanceof Error ? error.message : "未知错误")
      );
    }
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    try {
      const deleted = await deleteDeskSign(id);
      if (deleted) {
        message.success("删除成功");
        actionRef.current?.reload();
      } else {
        message.error("删除失败");
      }
    } catch (error) {
      message.error(
        "删除失败：" + (error instanceof Error ? error.message : "未知错误")
      );
    }
  };

  // 新增表单提交
  const handleAddFinish = async (values: any) => {
    try {
      const created = await createDeskSign(values);
      if (created) {
        message.success("创建成功");
        setIsAddModalVisible(false);
        actionRef.current?.reload();
      } else {
        message.error("创建失败");
      }
    } catch (error) {
      message.error(
        "创建失败：" + (error instanceof Error ? error.message : "未知错误")
      );
    }
  };

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        search={false}
        request={async (params) => {
          try {
            const result = await fetchAllDeskSigns(params);
            // 确保数据格式正确，处理API返回的不同格式
            const dataArray = Array.isArray(result) ? result : [];
            // 如果是分页数据，直接返回；否则构造简单的分页结构
            if (
              result &&
              typeof result === "object" &&
              "data" in result &&
              "total" in result
            ) {
              return result;
            }
            return {
              data: dataArray,
              total: dataArray.length,
            };
          } catch (error) {
            return {
              data: [],
              total: 0,
            };
          }
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增桌牌
          </Button>,
        ]}
        actionRef={actionRef}
        tableAlertOptionRender={({ selectedRowKeys }) => (
          <Popconfirm
            title="确定要删除选中的桌牌吗？"
            onConfirm={async () => {
              for (const id of selectedRowKeys) {
                await deleteDeskSign(String(id));
              }
              message.success("删除成功");
              actionRef.current?.reload();
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
          </Popconfirm>
        )}
      />

      {/* 编辑桌牌的Modal */}
      <Modal
        title="编辑桌牌"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setCurrentRecord(null);
        }}
        footer={null}
        width={600}
      >
        <ProForm
          formRef={editFormRef}
          layout="vertical"
          initialValues={currentRecord}
          onFinish={handleEditFinish}
          onCancel={() => {
            setIsEditModalVisible(false);
            setCurrentRecord(null);
          }}
        >
          <ProFormText
            name="signName"
            label="桌牌名称"
            placeholder="请输入桌牌名称"
          />
          <ProFormSelect
            name="status"
            label="状态"
            options={Object.values(DeskSignStatus)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                value,
                label: statusMap[value as DeskSignStatus].text,
              }))}
          />
          <ProFormSelect
            name="powerMode"
            label="功耗模式"
            options={Object.values(PowerMode)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                value,
                label: powerModeMap[value as PowerMode].text,
              }))}
          />
          <ProFormSelect
            name="clearStatus"
            label="清屏状态"
            options={Object.values(ClearStatus)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                value,
                label: clearStatusMap[value as ClearStatus].text,
              }))}
          />
          <ProFormTextArea
            name="remark"
            label="备注"
            placeholder="请输入备注信息"
          />
        </ProForm>
      </Modal>

      {/* 新增桌牌的Modal */}
      <Modal
        title="新增桌牌"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        width={600}
      >
        <ProForm
          formRef={addFormRef}
          layout="vertical"
          initialValues={{
            status: DeskSignStatus.NORMAL,
            powerMode: PowerMode.ALWAYS_ON,
            clearStatus: ClearStatus.CLEARED,
          }}
          onFinish={handleAddFinish}
          onCancel={() => setIsAddModalVisible(false)}
        >
          <ProFormText
            name="signName"
            label="桌牌名称"
            placeholder="请输入桌牌名称"
          />
          <ProFormText
            name="signCode"
            label="桌牌编号"
            placeholder="请输入桌牌编号"
          />
          <ProFormSelect
            name="status"
            label="状态"
            initialValue={DeskSignStatus.NORMAL}
            options={Object.values(DeskSignStatus)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                value,
                label: statusMap[value as DeskSignStatus].text,
              }))}
          />
          <ProFormSelect
            name="powerMode"
            label="功耗模式"
            initialValue={PowerMode.ALWAYS_ON}
            options={Object.values(PowerMode)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                value,
                label: powerModeMap[value as PowerMode].text,
              }))}
          />
          <ProFormSelect
            name="clearStatus"
            label="清屏状态"
            initialValue={ClearStatus.CLEARED}
            options={Object.values(ClearStatus)
              .filter((value) => typeof value === "number")
              .map((value) => ({
                value,
                label: clearStatusMap[value as ClearStatus].text,
              }))}
          />
          <ProFormTextArea
            name="remark"
            label="备注"
            placeholder="请输入备注信息"
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default DeskSignList;

// 页面配置
export const pageConfig = definePageConfig(() => {
  return {
    menu: {
      name: "桌牌管理",
      icon: "table",
    },
  };
});
