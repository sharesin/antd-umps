import { Drawer } from 'antd';
import React from 'react';

import FormRole from './FormRole';

const { onSubmit: userSubmit } = FormRole;

interface FormRoleUpdateProps {
  entity: any;
  modalVisible: boolean;
  onSubmit: userSubmit;
  onClose: () => void;
}

const FormRoleUpdate: React.FC<FormRoleUpdateProps> = props => {
  const { modalVisible, onSubmit: handleAdd, onClose, entity } = props;
  // 获取当前浏览器宽度
  const width = window.innerWidth < 600 ? window.innerWidth : 600;
  return (
    <Drawer
      title="编辑角色"
      width={width}
      onClose={onClose}
      visible={modalVisible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <FormRole onSubmit={handleAdd} onClose={onClose} entity={entity} />
    </Drawer>
  );
};
export default FormRoleUpdate;
