import { Drawer } from 'antd';
import React from 'react';

import FormMenu from './FormMenu';

const { onSubmit: userSubmit } = FormMenu;

interface FormMenuUpdateProps {
  entity: any;
  menus: any;
  modalVisible: boolean;
  onSubmit: userSubmit;
  onClose: () => void;
  dispatch: Dispatch;
}

const FormMenuUpdate: React.FC<FormMenuUpdateProps> = props => {
  const { modalVisible, onSubmit: handleAdd, onClose, entity, menus } = props;
  // 获取当前浏览器宽度
  const width = window.innerWidth < 600 ? window.innerWidth : 600;
  return (
    <Drawer
      title="编辑菜单"
      width={width}
      onClose={onClose}
      visible={modalVisible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <FormMenu onSubmit={handleAdd} onClose={onClose} entity={entity} menus={menus} />
    </Drawer>
  );
};
export default FormMenuUpdate;
