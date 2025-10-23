import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import type { SiteDO } from '@/interfaces/site';
import { SiteStatus } from '@/interfaces/site';
import {
  getAllSites,
  createSite,
  updateSite,
  deleteSite,
} from '@/services/site';

// 状态映射配置
const statusMap = {
  [SiteStatus.NORMAL]: { text: '正常', status: 'success' },
  [SiteStatus.ABNORMAL]: { text: '异常', status: 'error' },
  [SiteStatus.MAINTENANCE]: { text: '维护中', status: 'warning' },
  [SiteStatus.INACTIVE]: { text: '停用', status: 'default' },
};

const SiteList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const editFormRef = useRef<any>();
  const addFormRef = useRef<any>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SiteDO | null>(null);

  // 定义列配置
  const columns: Array<ProColumns<SiteDO>> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '场地编号',
      dataIndex: 'siteCode',
      width: 150,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入场地编号',
          },
        ],
      },
    },
    {
      title: '场地名称',
      dataIndex: 'siteName',
      width: 180,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入场地名称',
          },
        ],
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusMap,
      valueType: 'select',
      hideInSearch: true,
      formItemProps: {
        initialValue: SiteStatus.NORMAL,
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
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
          title="确定要删除这个场地吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a key="delete" style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  // 处理编辑
  const handleEdit = (record: SiteDO) => {
    setCurrentRecord(record);
    setIsEditModalVisible(true);
    // 使用setTimeout确保Modal已经渲染后再设置数据
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.setFieldsValue(record);
      }
    }, 0);
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    const success = await deleteSite(id);
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error('删除失败');
    }
  };

  // 处理打开新增表单
  const handleAdd = () => {
    // 确保表单重置，避免历史数据残留
    if (addFormRef.current) {
      addFormRef.current.resetFields();
    }
    setIsAddModalVisible(true);
  };

  // 处理表单提交（添加）
  const handleAddSubmit = async (values: any) => {
    const success = await createSite(values);
    if (success) {
      message.success('添加成功');
      // 先重置表单再关闭模态框
      addFormRef.current?.resetFields();
      setIsAddModalVisible(false);
      actionRef.current?.reload();
    } else {
      message.error('添加失败');
    }
  };



  // 处理表单提交（编辑）
  const handleEditSubmit = async (values: any) => {
    if (!currentRecord) return;
    const success = await updateSite(currentRecord.id, values);
    if (success) {
      message.success('更新成功');
      setIsEditModalVisible(false);
      // 清除当前记录，防止下次打开显示错误数据
      setCurrentRecord(null);
      actionRef.current?.reload();
    } else {
      message.error('更新失败');
    }
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const sites = await getAllSites(params);
          return {
            data: sites,
            success: true,
            total: sites.length,
          };
        }}
        rowKey="id"
        tableAlertRender={({ selectedRowKeys }) => (selectedRowKeys && selectedRowKeys.length > 0 ? (
          <div style={{ marginBottom: 8 }}>
            已选择 {selectedRowKeys.length} 项
          </div>
        ) : null)}
        tableAlertOptionRender={({ selectedRowKeys }) => (
          <Space>
            <Popconfirm
              title={`确定要删除这 ${selectedRowKeys.length} 个场地吗？`}
              onConfirm={async () => {
                const promises = selectedRowKeys.map((id) => deleteSite(Number(id)));
                const results = await Promise.all(promises);
                if (results.every(Boolean)) {
                  message.success('批量删除成功');
                  actionRef.current?.reload();
                } else {
                  message.error('批量删除失败');
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" danger>批量删除</Button>
            </Popconfirm>
          </Space>
        )}
        expandable={{}}
        rowSelection={{}}
        pagination={{ pageSize: 10 }}
        headerTitle="场地管理"
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新建场地
          </Button>,
        ]}
      />

      {/* 添加场地模态框 */}
      <Modal
        title="添加场地"
        open={isAddModalVisible}
        onCancel={() => {
          // 在关闭模态框时重置表单
          if (addFormRef.current) {
            addFormRef.current.resetFields();
          }
          setIsAddModalVisible(false);
        }}
        footer={null}
        width={600}
      >
        <ProForm
          formRef={addFormRef}
          onFinish={handleAddSubmit}
          layout="vertical"
        >
          <ProFormText
            name="siteCode"
            label="场地编号"
            rules={[{ required: true, message: '请输入场地编号' }]}
          />
          <ProFormText
            name="siteName"
            label="场地名称"
            rules={[{ required: true, message: '请输入场地名称' }]}
          />
          <ProFormText
            name="siteType"
            label="场地类型"
            rules={[{ required: true, message: '请输入场地类型' }]}
            placeholder="例如：办公室、会议室、仓库等"
          />
          <ProFormTextArea
            name="address"
            label="地址"
            placeholder="请输入场地地址"
          />
          <ProFormTextArea
            name="description"
            label="描述"
            placeholder="请输入场地描述"
          />
          <ProFormSelect
            name="status"
            label="状态"
            initialValue={SiteStatus.NORMAL}
            options={[
              { value: SiteStatus.NORMAL, label: '正常' },
              { value: SiteStatus.ABNORMAL, label: '异常' },
              { value: SiteStatus.MAINTENANCE, label: '维护中' },
              { value: SiteStatus.INACTIVE, label: '停用' },
            ]}
          />
          {/* ProForm会自动添加提交和重置按钮 */}
        </ProForm>
      </Modal>

      {/* 编辑场地模态框 */}
      <Modal
        title="编辑场地"
        open={isEditModalVisible}
        onCancel={() => {
          // 重置表单（如果存在）
          if (editFormRef.current) {
            editFormRef.current.resetFields();
          }
          // 关闭模态框
          setIsEditModalVisible(false);
          // 清除当前记录，防止下次打开显示错误数据
          setCurrentRecord(null);
        }}
        footer={null}
        width={600}
      >
        <ProForm
          formRef={editFormRef}
          initialValues={currentRecord}
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <ProFormText
            name="siteCode"
            label="场地编号"
            rules={[{ required: true, message: '请输入场地编号' }]}
          />
          <ProFormText
            name="siteName"
            label="场地名称"
            rules={[{ required: true, message: '请输入场地名称' }]}
          />
          <ProFormText
            name="siteType"
            label="场地类型"
            rules={[{ required: true, message: '请输入场地类型' }]}
            placeholder="例如：办公室、会议室、仓库等"
          />
          <ProFormTextArea
            name="address"
            label="地址"
            placeholder="请输入场地地址"
          />
          <ProFormTextArea
            name="description"
            label="描述"
            placeholder="请输入场地描述"
          />
          <ProFormSelect
            name="status"
            label="状态"
            options={[
              { value: SiteStatus.NORMAL, label: '正常' },
              { value: SiteStatus.ABNORMAL, label: '异常' },
              { value: SiteStatus.MAINTENANCE, label: '维护中' },
              { value: SiteStatus.INACTIVE, label: '停用' },
            ]}
          />
          {/* ProForm会自动添加提交和重置按钮 */}
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default SiteList;

export const pageConfig = definePageConfig({
  pageTitle: '场地管理',
});