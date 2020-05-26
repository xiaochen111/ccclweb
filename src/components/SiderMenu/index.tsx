import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import H from 'history';
import Link from 'umi/link';
import styles from './index.scss';

const { Sider } = Layout;

const SubMenu = Menu.SubMenu;

interface SilderMenuProps {
  location: H.Location;
  logo: string;
  menuData: any[];
  collapsed: boolean;
}

class SiderMenu extends PureComponent<SilderMenuProps, any> {
  getSubMenuOrItem = (item: any) => {
    if (item.children && item.children.some((child: { name: any }) => child.name)) {
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                <Icon type={item.icon} />
                <span>{item.name}</span>
              </span>
            ) : (
              item.name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getMenuItemPath = item => {
    const { location } = this.props;
    const { icon, name, path } = item;

    return (
      <Link to={path} replace={item.path === location.pathname}>
        {icon ? <Icon type={icon} /> : null}
        <span>{name}</span>
      </Link>
    );
  };

  getNavMenuItems = (menuData: any[]) => {
    if (!menuData || !menuData.length) {
      return [];
    }

    return menuData
      .filter(item => item.name)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  render() {
    const { logo, menuData, location, collapsed } = this.props;

    return (
      <Sider className={styles.slider} collapsed={collapsed}>
        <div className={styles.logo} id="logo">
          <Link to="/" style={{ display: 'inline-block' }}>
            {/* <img src={logo} alt="logo" style={{ width: '80%', height: '32px' }} /> */}
            <i className={'iconfont iconlogo'} style={{ fontSize: '40px', color: '#fff', verticalAlign: 'middle' }}></i>
          </Link>
          {/* {collapsed ? null : <span>环球义达</span>} */}
        </div>
        <Menu mode={'inline'} theme="dark" selectedKeys={[location.pathname]}>
          {this.getNavMenuItems(menuData)}
        </Menu>
      </Sider>
    );
  }
}

export default SiderMenu;
