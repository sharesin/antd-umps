import { Drawer } from 'antd';
import React from 'react';

import FormRole from './FormRole';

const { onSubmit: formUserOnSubmit } = FormRole;

interface FormRoleCreateProps {
  modalVisible: boolean;
  onSubmit: formUserOnSubmit;
  onClose: () => void;
}

const FormRoleCreate: React.FC<FormRoleCreateProps> = props => {
  const { modalVisible, onSubmit: handleAdd, onClose } = props;
  // 获取当前浏览器宽度
  const width = window.innerWidth < 600 ? window.innerWidth : 600;
  return (
    <Drawer
      title="新增角色"
      width={width}
      onClose={onClose}
      visible={modalVisible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <FormRole onSubmit={handleAdd} onClose={onClose} type="create" />
    </Drawer>
  );
};

export default FormRoleCreate;
