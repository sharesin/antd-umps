import { Drawer } from 'antd';
import React from 'react';

import FormUser from './FormUser';

const { onSubmit: formUserOnSubmit } = FormUser;

interface FormUserCreateProps {
  roles?: any;
  modalVisible: boolean;
  onSubmit: formUserOnSubmit;
  onClose: () => void;
}

const FromUserCreate: React.FC<FormUserCreateProps> = props => {
  const { roles, modalVisible, onSubmit: handleAdd, onClose } = props;

  // 获取当前浏览器宽度
  const width = window.innerWidth < 600 ? window.innerWidth : 600;

  return (
    <Drawer
      title="新增用户"
      width={width}
      onClose={onClose}
      visible={modalVisible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <FormUser onSubmit={handleAdd} onClose={onClose} type="create" roles={roles} />
    </Drawer>
  );
};

export default FromUserCreate;
