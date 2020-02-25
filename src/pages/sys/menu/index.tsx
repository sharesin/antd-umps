import { DownOutlined, PlusOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Alert } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';

import FormMenuCreate from './components/FormMenuCreate';
import FormMenuUpdate from './components/FormMenuUpdate';

import { asyncRequest } from '@/utils/request';
import upms from '@/api/upms';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  const response = await asyncRequest(upms.api_upms_sys_menu_save, fields);
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
  const response = await asyncRequest(upms.api_upms_sys_menu_edit, fields);
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
    data.push({ permissionId: selectedRows[i].permissionId });
  }
  const response = await asyncRequest(upms.api_upms_sys_menu_remove, data);
  if (response.code === 0) {
    const params = response.result;
    let success = true;
    let msg = '';
    // 校验data与响应结果一致
    for (let j = 0; j < data.length; j += 1) {
      const id = data[j].permissionId;
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

const SysMenuList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState({});
  const [total, handleTotal] = useState<any>(0);

  const [entity, handleEntity] = useState<any>();
  const [menus, handleMenus] = useState<any>();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'nameTxt',
      key: 'nameTxt',
    },
    {
      title: '项目标识',
      dataIndex: 'projectId',
      key: 'projectId',
      width: 0,
      hide: true,
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      hideInSearch: true,
      valueEnum: {
        1: { text: '系统菜单', status: 'Processing' },
        2: { text: '内嵌链接', status: 'Processing' },
        3: { text: '跳出链接', status: 'Processing' },
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      hideInSearch: true,
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      hideInSearch: true,
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
      key: 'sortNo',
      align: 'center',
      hideInSearch: true,
    },
    {
      width: 150,
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              const response = await asyncRequest(upms.api_upms_sys_menu_detail, {
                permissionId: record.permissionId,
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
                  }
                }}
                selectedKeys={[]}
              >
                <Menu.Item
                  key="detail"
                  onClick={async () => {
                    const response = await asyncRequest(upms.api_upms_sys_menu_detail, {
                      permissionId: record.permissionId,
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
                  key="add"
                  onClick={() => {
                    handleEntity(null);
                    handleEntity({ parentId: record.permissionId });
                    handleModalVisible(true);
                  }}
                >
                  <PlusOutlined />
                  添加子菜单
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
        rowKey="permissionId"
        // search={false}
        onChange={(_, _filter, _sorter) => {
          setSorter(`${_sorter.field}_${_sorter.order}`);
        }}
        pagination={{
          defaultPageSize: 20,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
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
          // debugger;
          // const pagination = {
          //   current: params.current,
          //   size: params.pageSize,
          //   orders: [{ column: 'id', asc: false }],
          // };

          // delete params.current;
          // delete params.pageSize;
          // delete params.sorter;
          // // delete params._timestamp;

          // const query = params;
          // pagination.query = query;
          const obj = {};
          if (params?.projectId) {
            obj.projectId = params?.projectId;
          }

          const response = await asyncRequest(upms.api_upms_sys_permission_menus, obj);
          handleTotal(response.result.length);
          handleMenus(response.result);
          return {
            data: response.result,
            success: true,
          };
        }}
        columns={columns}
        rowSelection={{}}
      />
      <FormMenuCreate
        onSubmit={async (value: any) => {
          handleEntity(value);
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            actionRef.current!.reload();
          }
          return success;
        }}
        onClose={() => {
          handleEntity(null);
          handleModalVisible(false);
        }}
        modalVisible={createModalVisible}
        menus={menus}
        entity={entity}
      />
      {entity && Object.keys(entity).length ? (
        <FormMenuUpdate
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
            handleEntity(null);
            handleUpdateModalVisible(false);
          }}
          modalVisible={updateModalVisible}
          entity={entity}
          menus={menus}
        />
      ) : null}
    </GridContent>
  );
};

export default SysMenuList;
