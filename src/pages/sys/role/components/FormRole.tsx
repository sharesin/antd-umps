import { Form, Button, Input } from 'antd';
import React from 'react';

const FormItem = Form.Item;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

interface FormRoleProps {
  onSubmit: (fieldsValue: {}) => boolean;
  onClose: () => void;
  type: string;
  entity?: any;
}

const FormRole: React.FC<FormRoleProps> = props => {
  const [form] = Form.useForm();
  const { onSubmit: handleAdd, onClose, type, entity } = props;

  const okHandle = () => {
    form.validateFields().then(fields => {
      if (handleAdd(fields)) {
        form.resetFields();
      }
    });
  };

  return (
    <Form {...layout} form={form} initialValues={entity}>
      <FormItem
        name="roleName"
        label="角色名"
        rules={[{ required: true, message: '请输入角色名称!' }]}
      >
        <Input placeholder="请输入用户账户" />
      </FormItem>

      {entity ? (
        <>
          <FormItem name="roleId" style={{ display: 'none' }}>
            <Input type="hidden" readOnly />
          </FormItem>
          <FormItem
            name="roleCode"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码!' }]}
          >
            <Input placeholder="请输入角色编码" readOnly />
          </FormItem>
        </>
      ) : (
        <FormItem
          name="roleCode"
          label="角色编码"
          rules={[{ required: true, message: '请输入角色编码!' }]}
        >
          <Input placeholder="请输入角色编码" />
        </FormItem>
      )}
      <FormItem name="description" label="描述" rules={[]}>
        <TextArea placeholder="请输入描述" autoSize={{ minRows: 5, maxRows: 5 }} />
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

export default FormRole;
