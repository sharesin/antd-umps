import { Drawer } from 'antd';
import React from 'react';

import FormUser from './FormUser';

interface FormUserUpdateProps {
  entity: any;
  roles: any;
  modalVisible: boolean;
  onSubmit: userSubmit;
  onClose: () => void;
  dispatch: Dispatch;
}

const FormUserUpdate: React.FC<FormUserUpdateProps> = props => {
  const { modalVisible, onSubmit: handleAdd, onClose, entity, roles } = props;
  // 获取当前浏览器宽度
  const width = window.innerWidth < 600 ? window.innerWidth : 600;

  return (
    <Drawer
      title="编辑用户"
      width={width}
      onClose={onClose}
      visible={modalVisible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <FormUser onSubmit={handleAdd} onClose={onClose} entity={entity} roles={roles} />
    </Drawer>
  );
};
export default FormUserUpdate;
