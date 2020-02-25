import { Form, Button, Input, Radio, Select } from 'antd';
import React from 'react';

const FormItem = Form.Item;
const { Option } = Select;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

interface FormUserProps {
  onSubmit: (fieldsValue: {}) => boolean;
  onClose: () => void;
  type: string;
  entity?: any;
  roles?: any;
}

const FormUser: React.FC<FormUserProps> = props => {
  const [form] = Form.useForm();
  const { onClose, onSubmit: handleAdd, type, entity, roles } = props;

  const okHandle = () => {
    form.validateFields().then(fields => {
      // eslint-disable-next-line no-param-reassign
      delete fields.loginPwdR;
      if (handleAdd(fields)) {
        form.resetFields();
      }
    });
  };

  const handleChange = value => {
    if (entity && entity.roleIds) {
      entity.roleIds = value;
    }
  };
  const children = [];
  for (let k = 0; k < roles.length; k += 1) {
    const role = roles[k];
    children.push(<Option key={role.roleId}>{role.roleName}</Option>);
  }

  // 动态化
  const projects = [];
  projects.push(<Option key={1}>超级管理员系统</Option>);

  const userTypeRadio = (userType: number) => {
    if (userType === 1) {
      return (
        <Radio.Group>
          <Radio value={1}>超级管理员</Radio>
          <Radio value={2}>平台管理员</Radio>
          <Radio value={0}>普通用户</Radio>
        </Radio.Group>
      );
    }
    if (userType === 2) {
      return (
        <Radio.Group>
          <Radio value={2}>平台管理员</Radio>
          <Radio value={0}>普通用户</Radio>
        </Radio.Group>
      );
    }
    return <></>;
  };

  const { userType } = window.currentUser;

  return (
    <Form {...layout} form={form} initialValues={entity}>
      {userType === 1 || userType === 2 ? (
        <FormItem
          name="userType"
          label="用户类型"
          rules={[{ required: true, message: '请选择用户类型！' }]}
        >
          {userTypeRadio(userType)}
        </FormItem>
      ) : null}

      {userType === 1 ? (
        <FormItem name="projectId" label="选择平台">
          <Select placeholder="选择平台">{projects}</Select>
        </FormItem>
      ) : null}
      {userType === 2 ? (
        <FormItem name="projectId" style={{ display: 'none' }}>
          <Input type="hidden" readOnly />
        </FormItem>
      ) : null}

      <FormItem name="roleIds" label="角色分配">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择用户角色"
          onChange={handleChange}
        >
          {children}
        </Select>
      </FormItem>

      {entity ? (
        <>
          <FormItem name="loginId" label="用户名">
            <Input placeholder="请输入用户账户" readOnly />
          </FormItem>
          <FormItem name="userId" style={{ display: 'none' }}>
            <Input type="hidden" readOnly />
          </FormItem>
        </>
      ) : (
        <FormItem
          name="loginId"
          label="用户名"
          rules={[{ required: true, message: '请输入用户账户!' }]}
        >
          <Input placeholder="请输入用户账户" />
        </FormItem>
      )}

      {type === 'create' ? (
        <>
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
        </>
      ) : null}

      <FormItem name="email" label="邮箱">
        <Input placeholder="请输入邮箱" />
      </FormItem>
      <FormItem name="phone" label="手机号">
        <Input placeholder="请输入手机号" />
      </FormItem>

      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={okHandle} type="primary">
          {type === 'create' ? '提交' : '保存'}
        </Button>
      </div>
    </Form>
  );
};

export default FormUser;
