import { Drawer } from 'antd';
import React from 'react';

import FormMenu from './FormMenu';

const { onSubmit: formUserOnSubmit } = FormMenu;

interface FormMenuCreateProps {
  entity?: any;
  menus?: any;
  modalVisible: boolean;
  onSubmit: formUserOnSubmit;
  onClose: () => void;
}

const FromMenuCreate: React.FC<FormMenuCreateProps> = props => {
  const { menus, modalVisible, onSubmit: handleAdd, onClose, entity } = props;
  // 获取当前浏览器宽度
  const width = window.innerWidth < 600 ? window.innerWidth : 600;
  return (
    <Drawer
      title="新增菜单"
      width={width}
      onClose={onClose}
      visible={modalVisible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <FormMenu
        onSubmit={handleAdd}
        onClose={onClose}
        type="create"
        menus={menus}
        entity={entity}
      />
    </Drawer>
  );
};

export default FromMenuCreate;
