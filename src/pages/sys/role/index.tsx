import { DownOutlined, PlusOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Alert } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import FormRoleCreate from './components/FormRoleCreate';
import FormRoleUpdate from './components/FormRoleUpdate';
import DrawerMenu from './components/DrawerMenu';

import { asyncRequest } from '@/utils/request';
import upms from '@/api/upms';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  const response = await asyncRequest(upms.api_upms_sys_role_save, fields);
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
  const response = await asyncRequest(upms.api_upms_sys_role_edit, fields);
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
    data.push({ roleId: selectedRows[i].roleId });
  }
  const response = await asyncRequest(upms.api_upms_sys_role_remove, data);
  if (response.code === 0) {
    const params = response.result;
    let success = true;
    let msg = '';
    // 校验data与响应结果一致
    for (let j = 0; j < data.length; j += 1) {
      const id = data[j].roleId;
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
 * 绑定用户角色权限
 */
const handleUpdateRolePermissions = async (params: { permissionIds: any; roleId: any }) => {
  const hide = message.loading('正在配置');
  const response = await asyncRequest(upms.api_upms_sys_role_permission_assignment, params);
  if (response.code === 0) {
    hide();
    message.success('配置成功');
    return true;
  }
  hide();
  message.error(response.message);
  return false;
};

const SysRoleList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState({});
  const [total, handleTotal] = useState<any>(0);

  const [entity, handleEntity] = useState<any>();
  const [menus, handleMenus] = useState<any>();
  const [permissionIds, handlePermissionIds] = useState<any>();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [createRoleDrawerVisible, handleRoleDrawerVisible] = useState<boolean>(false);

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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              // 获取菜单
              const response = await asyncRequest(upms.api_upms_sys_role_menus_permissions, {
                roleId: record.roleId,
              });
              if (response.code === 0) {
                handleMenus(response.result.menus);
                handlePermissionIds(response.result.permissionIds);
                handleEntity(record);
              }

              handleRoleDrawerVisible(true);
            }}
          >
            分配权限
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
                  }
                }}
                selectedKeys={[]}
              >
                <Menu.Item
                  key="detail"
                  onClick={async () => {
                    handleEntity(null);
                    const response = await asyncRequest(upms.api_upms_sys_role_detail, {
                      roleId: record.roleId,
                    });
                    handleEntity(response.result);
                    handleUpdateModalVisible(true);
                  }}
                >
                  <InfoCircleOutlined />
                  详情
                </Menu.Item>
                <Menu.Item key="remove">
                  <DeleteOutlined />
                  删除
                </Menu.Item>
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
        rowKey="roleId"
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
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">
                    <DeleteOutlined />
                    批量删除
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
          const response = await asyncRequest(upms.api_upms_sys_role_list, pagination);
          handleTotal(response.result.total);

          return {
            data: response.result.records,
            page: pagination.current,
            success: true,
            total: response.result.total,
          };
        }}
        columns={columns}
      />
      <FormRoleCreate
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
      />
      {entity && Object.keys(entity).length ? (
        <FormRoleUpdate
          onSubmit={async (value: any) => {
            handleEntity(value);
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              actionRef.current!.reload();
            }
            return success;
          }}
          onClose={() => {
            handleUpdateModalVisible(false);
            handleEntity(null);
          }}
          modalVisible={updateModalVisible}
          entity={entity}
        />
      ) : null}
      <DrawerMenu
        onSubmit={async (value: any) => {
          const success = await handleUpdateRolePermissions({
            permissionIds: value,
            roleId: entity.roleId,
          });

          if (success) {
            handleRoleDrawerVisible(false);
            actionRef.current!.reload();
          }
          return success;
        }}
        onClose={() => handleRoleDrawerVisible(false)}
        modalVisible={createRoleDrawerVisible}
        entity={entity}
        menus={menus}
        permissionIds={permissionIds}
      />
    </GridContent>
  );
};

export default SysRoleList;
