import { Form, Input, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

interface FormUserPwdProps extends FormComponentProps {
  entity?: any;
  roles?: any;
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const FormUserPwd: React.FC<FormUserPwdProps> = props => {
  const { entity, modalVisible, onSubmit: handleAdd, onCancel } = props;
  const [form] = Form.useForm();

  const okHandle = () => {
    form.validateFields().then(fields => {
      // eslint-disable-next-line no-param-reassign
      delete fields.loginPwdR;
      if (handleAdd(fields)) {
        form.resetFields();
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      title="重置密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        {...layout}
        form={form}
        initialValues={{
          userId: entity ? entity.userId : '',
          loginId: entity ? entity.loginId : '',
        }}
      >
        <FormItem name="userId" style={{ display: 'none' }}>
          <Input type="hidden" />
        </FormItem>
        <FormItem name="loginId" label="用户名">
          <Input placeholder="请输入用户账户" readOnly />
        </FormItem>

        <FormItem
          name="loginPwd"
          label="登录密码"
          rules={[{ required: true, message: '密码由8位数字、大小写字母和特殊符号组成!' }]}
        >
          <Input.Password type="password" placeholder="请输入登录密码" />
        </FormItem>
        <FormItem
          name="loginPwdR"
          label="确认密码"
          rules={[
            { required: true, message: '请重新输入登录密码!' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('loginPwd') === value) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('密码输入不一致!');
              },
            }),
          ]}
        >
          <Input.Password type="password" placeholder="请重新输入登录密码" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default FormUserPwd;
