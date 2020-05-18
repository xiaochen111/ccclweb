import React, { PureComponent } from 'react';
import { Menu, Dropdown, Icon, Avatar } from 'antd';
import styles from './index.scss';

export interface GlobalHeaderRightProps {}

class GlobalHeaderRight extends PureComponent<GlobalHeaderRightProps, any> {
  render() {
    // const { currentName, onMenuClick } = this.props;

    const menu = (
      <Menu>
        <Menu.Item key="mdify">
          <Icon type="edit" />
          <span>修改密码</span>
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.right}>
        <Dropdown overlay={menu} trigger={['click', 'hover']}>
          <span className={`${styles.action} ${styles.account}`}>
            {/* <span className={styles.name}>{currentOrganizeName}</span> */}
            <Avatar icon="user" size="small" />
            <span className={styles.name}>{11}</span>
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default GlobalHeaderRight;
