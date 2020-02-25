import {
  DownOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  LockOutlined,
  DeleteOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Alert } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import FormUserCreate from './components/FormUserCreate';
import FormUserUpdate from './components/FormUserUpdate';
import FormUserPwd from './components/FormUserPwd';

import { asyncRequest } from '@/utils/request';
import upms from '@/api/upms';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  const response = await asyncRequest(upms.api_upms_sys_user_save, fields);
  if (response.code === 0) {
    hide();
    message.success('添加成功');
    return true;
  }
  hide();
  message.error(response.message);
  return false;
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在编辑');
  const response = await asyncRequest(upms.api_upms_sys_user_edit, fields);
  if (response.code === 0) {
    hide();
    message.success('编辑成功');
    return true;
  }
  hide();
  message.error(response.message);
  return false;
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: string | any[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  const data = [];
  // 遍历数组
  for (let i = 0; i < selectedRows.length; i += 1) {
    data.push({ userId: selectedRows[i].userId });
  }
  const response = await asyncRequest(upms.api_upms_sys_user_remove, data);
  if (response.code === 0) {
    const params = response.result;
    let success = true;
    let msg = '';
    // 校验data与响应结果一致
    for (let j = 0; j < data.length; j += 1) {
      const id = data[j].userId;
      if (params[id] !== true) {
        success = false;
        msg = params[id].message!;
        break;
      }
    }

    if (success) {
      hide();
      message.success('删除成功，即将刷新');
      return true;
    }
    hide();
    message.error(msg);
    return true;
  }
  hide();
  message.error(response.message);
  return false;
};

/**
 * 禁用或启用用户
 * @param fields
 */
const handleForbiddenOrUse = async (records, flag) => {
  const hide = message.loading('正在配置');
  if (!records) return true;

  const arr = [];

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    let statusa = 1;
    if (flag === true) {
      statusa = 2;
    }
    arr.push({ userId: record.userId, loginId: record.loginId, status: statusa });
  }
  const response = await asyncRequest(upms.api_upms_sys_user_edit_batch, arr);
  if (response.code === 0) {
    hide();
    message.success('配置成功');
    return true;
  }
  hide();
  message.error(response.message);
  return false;
};

const SysUserList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState({});

  const [userId, handleUserId] = useState<string>('');
  const [entity, handleEntity] = useState<any>();
  const [roles, handleRoles] = useState<any>();

  const [total, handleTotal] = useState<any>(0);

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [updatePwdModalVisible, handleUpdatePwdModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<{}>[] = [
    {
      align: 'center',
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 64,
    },
    {
      title: '用户名',
      dataIndex: 'loginId',
    },
    {
      title: '角色',
      dataIndex: 'roleNames',
      render: (_, record) => (
        <>{record.roleNames && record.roleNames.length > 0 ? record.roleNames.join(',') : '-'}</>
      ),
      hideInSearch: true,
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      hideInSearch: true,
      valueEnum: {
        1: { text: '超级管理员', status: 'Error' },
        2: { text: '平台管理员', status: 'Processing' },
        0: { text: '普通管理员', status: 'Warning' },
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      placeholder: '请选择',
      valueEnum: {
        1: { text: '正常', status: 'Processing' },
        2: { text: '冻结', status: 'Error' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              handleUserId(record.userId);
              const response = await asyncRequest(upms.api_upms_sys_user_detail, {
                userId: record.userId,
              });
              handleEntity(null);
              handleEntity(response.result);
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu
                onClick={async e => {
                  const records = [record];
                  // 删除
                  if (e.key === 'remove') {
                    // 提示删除
                    await handleRemove(records);
                    actionRef.current!.reload();
                  } else if (e.key === 'freeze') {
                    await handleForbiddenOrUse(records, true);
                    actionRef.current!.reload();
                  } else if (e.key === 'unfreeze') {
                    await handleForbiddenOrUse(records, false);
                    actionRef.current!.reload();
                  }
                }}
                selectedKeys={[]}
              >
                <Menu.Item
                  key="detail"
                  onClick={async () => {
                    handleUserId(record.userId);
                    const response = await asyncRequest(upms.api_upms_sys_user_detail, {
                      userId: record.userId,
                    });
                    handleEntity(null);
                    handleEntity(response.result);
                    handleUpdateModalVisible(true);
                  }}
                >
                  <InfoCircleOutlined />
                  详情
                </Menu.Item>
                <Menu.Item
                  key="password"
                  onClick={async () => {
                    handleEntity(record);
                    handleUpdatePwdModalVisible(true);
                  }}
                >
                  <LockOutlined />
                  密码
                </Menu.Item>

                <Menu.Item key="remove">
                  <DeleteOutlined />
                  删除
                </Menu.Item>
                {record.status === 1 ? (
                  <Menu.Item key="freeze">
                    <LockOutlined />
                    冻结
                  </Menu.Item>
                ) : (
                  <Menu.Item key="unfreeze">
                    <UnlockOutlined />
                    解冻
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <a>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <GridContent>
      <ProTable
        headerTitle={
          <div style={{ paddingRight: '24px' }}>
            <Alert message={`共检索记录：${total} 条`} type="info" showIcon />
          </div>
        }
        actionRef={actionRef}
        size="middle"
        rowKey="userId"
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    } else if (e.key === 'freeze') {
                      await handleForbiddenOrUse(selectedRows, true);
                      actionRef.current!.reload();
                    } else if (e.key === 'unfreeze') {
                      await handleForbiddenOrUse(selectedRows, false);
                      actionRef.current!.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">
                    <DeleteOutlined />
                    批量删除
                  </Menu.Item>
                  <Menu.Item key="freeze">
                    <LockOutlined />
                    批量冻结
                  </Menu.Item>
                  <Menu.Item key="unfreeze">
                    <UnlockOutlined />
                    批量解冻
                  </Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={false}
        request={async params => {
          const pagination = {
            current: params.current,
            size: params.pageSize,
            orders: [{ column: 'id', asc: false }],
          };

          delete params.current;
          delete params.pageSize;
          delete params.sorter;
          // delete params._timestamp;

          const query = params;
          pagination.query = query;
          const response = await asyncRequest(upms.api_upms_sys_user_list, pagination);
          handleTotal(response.result.total);
          // 获取角色信息
          const result = await asyncRequest(upms.api_upms_sys_role_list, { size: 1000 });
          handleRoles(result.result.records);

          return {
            data: response.result.records,
            page: pagination.current,
            success: true,
            total: response.result.total,
          };
        }}
        columns={columns}
        rowSelection={{}}
      />
      <FormUserCreate
        onSubmit={async (value: any) => {
          handleEntity(value);
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef.current!.reload();
          }
          return success;
        }}
        onClose={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        roles={roles}
      />
      {entity && Object.keys(entity).length ? (
        <FormUserUpdate
          onSubmit={async (value: any) => {
            handleEntity(value);
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              actionRef.current!.reload();
            }
            return success;
          }}
          onClose={() => handleUpdateModalVisible(false)}
          modalVisible={updateModalVisible}
          userId={userId}
          entity={entity}
          roles={roles}
        />
      ) : null}
      <FormUserPwd
        onSubmit={async value => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdatePwdModalVisible(false);
            actionRef.current!.reload();
          }
          return success;
        }}
        onCancel={() => handleUpdatePwdModalVisible(false)}
        modalVisible={updatePwdModalVisible}
        userId={userId}
        entity={entity}
      />
    </GridContent>
  );
};

export default SysUserList;
