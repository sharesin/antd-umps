import { Drawer, Tree, Button, Dropdown, Menu, Input } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import React from 'react';
import FormRole from './FormRole';

const { onSubmit: formUserOnSubmit } = FormRole;
const { TreeNode } = Tree;
const { Search } = Input;
interface DrawerMenuProps {
  modalVisible: boolean;
  onSubmit: formUserOnSubmit;
  onClose: () => void;
  menus?: any;
  entity?: any;
  permissionIds?: any;
}

class DrawerMenu extends React.PureComponent<DrawerMenuProps> {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
  };

  // 获取当前浏览器宽度
  width = window.innerWidth < 600 ? window.innerWidth : 600;

  componentWillReceiveProps() {
    if (this.props.permissionIds) {
      this.setState({ checkedKeys: this.props.permissionIds });
    }
  }

  render() {
    const { modalVisible, onSubmit: handleAdd, onClose, menus } = this.props;
    // 菜单数据格式转换
    // 处理menus为treeselect数据
    const treeData = [];
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

    const renderTreeNodes = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} {...item} />;
      });

    const onExpand = expandedKeys => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    };

    const onCheck = checkedKeys => {
      this.setState({
        checkedKeys,
      });
    };

    const onSelect = selectedKeys => {
      this.setState({
        checkedKeys: selectedKeys,
        selectedKeys,
      });
    };

    const self = this;

    const drawerClose = () => {
      self.setState({
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
      });
      onClose();
    };

    const drawerSubmit = () => {
      handleAdd(self.state.checkedKeys);
    };
    return (
      <Drawer
        title="配置角色权限"
        width={this.width}
        onClose={drawerClose}
        visible={modalVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Search style={{ marginBottom: 8 }} placeholder="菜单名称" onChange={{}} />
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {renderTreeNodes(treeData)}
        </Tree>
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
          <Dropdown
            overlay={
              <Menu style={{ textAlign: 'center' }} onClick={async () => {}} selectedKeys={[]}>
                <Menu.Item key="relevance">父子关联</Menu.Item>
                <Menu.Item key="unrelevance">取消关联</Menu.Item>
                <Menu.Item key="all">全部勾选</Menu.Item>
                <Menu.Item key="cancel">取消全选</Menu.Item>
                <Menu.Item key="spread">展开所有</Menu.Item>
                <Menu.Item key="close">合并所有</Menu.Item>
              </Menu>
            }
          >
            <Button type="tree" style={{ float: 'left' }}>
              树操作
              <UpOutlined />
            </Button>
          </Dropdown>
          <Button onClick={drawerClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={drawerSubmit} type="primary">
            保存
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default DrawerMenu;
