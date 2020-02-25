import { Form, Button, Input, Radio, TreeSelect } from 'antd';
import React from 'react';

const FormItem = Form.Item;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

interface FormMenuProps {
  onSubmit: (fieldsValue: {}) => boolean;
  onClose: () => void;
  type: string;
  entity?: any;
  menus?: [];
}

const FormMenu: React.FC<FormMenuProps> = props => {
  const { onSubmit: handleAdd, onClose, type, entity, menus } = props;
  const [form] = Form.useForm();

  const okHandle = () => {
    form.validateFields().then(fields => {
      if (handleAdd(fields)) {
        form.resetFields();
      }
    });
  };
  // 处理menus为treeselect数据
  const treeData = [];
  treeData.push({ title: '根节点', value: '', key: '-1' });
  // 递归处理
  function makeNode(node, item) {
    item.title = node.nameTxt;
    item.value = node.permissionId;
    item.key = node.permissionId;
    if (node && !node.hasOwnProperty('children')) {
      return item;
    }
    item.children = [];
    for (let j = 0; j < node.children.length; j += 1) {
      item.children.push(makeNode(node.children[j], {}));
    }
    return item;
  }
  if (menus) {
    for (let i = 0; i < menus.length; i += 1) {
      treeData.push(makeNode(menus[i], {}));
    }
  }

  return (
    <Form {...layout} form={form} initialValues={entity}>
      {entity ? (
        <>
          <FormItem name="permissionId" style={{ display: 'none' }}>
            <Input type="hidden" readOnly />
          </FormItem>
        </>
      ) : null}
      <FormItem name="menuType" label="菜单类型">
        <Radio.Group>
          <Radio value="1">系统菜单</Radio>
          <Radio value="2">内嵌链接</Radio>
          <Radio value="3">跳出链接</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem name="parentId" label="父级菜单">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="选择父级菜单"
        />
      </FormItem>
      <FormItem
        name="locale"
        label="国际化标识"
        rules={[{ required: true, message: '请输入国际化标识!' }]}
      >
        <Input placeholder="请输入国际化标识" />
      </FormItem>
      <FormItem
        name="nameTxt"
        label="菜单名称"
        rules={[{ required: true, message: '请输入菜单名称!' }]}
      >
        <Input placeholder="请输入菜单名称" />
      </FormItem>
      <FormItem
        name="name"
        label="菜单编码"
        rules={[{ required: true, message: '请输入菜单编码!' }]}
      >
        <Input placeholder="请输入菜单编码" />
      </FormItem>
      <FormItem
        name="path"
        label="菜单路径"
        rules={[{ required: true, message: '请输入菜单路径!' }]}
      >
        <Input placeholder="请输入菜单编码" />
      </FormItem>
      <FormItem name="component" label="菜单组件" rules={[]}>
        <Input placeholder="请输入菜单组件" />
      </FormItem>
      <FormItem name="icon" label="菜单图标" rules={[]}>
        <Input placeholder="请输入菜单图标" />
      </FormItem>
      <FormItem name="sortNo" label="排序" rules={[]}>
        <Input type="number" placeholder="请输入排序" />
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

export default FormMenu;
