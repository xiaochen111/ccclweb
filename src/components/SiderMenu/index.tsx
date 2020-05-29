import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import H from 'history';
import Link from 'umi/link';
import { urlToList } from '@/utils/utils';
import { getFlatMenuKeys, getMenuMatches, getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import styles from './index.scss';

const { Sider } = Layout;

const SubMenu = Menu.SubMenu;

interface SilderMenuProps {
  location: H.Location;
  // logo: string;
  menuData: any[];
  collapsed: boolean;
}

class SiderMenu extends PureComponent<SilderMenuProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }
  isMainMenu = (key: any) => {
    const { menuData } = this.props;

    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

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

  getSelectedMenuKeys = (pathname: string) => {
    const { menuData } = this.props;
    const flatMenuKeys = getFlatMenuKeys(menuData);

    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  }

  handleOpenChange = (openKeys) => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;

    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  }

  render() {
    const { openKeys } = this.state;
    const { menuData, location, collapsed } = this.props;
    let selectedKeys = this.getSelectedMenuKeys(location.pathname).filter(item => item);

    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};

    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    return (
      <Sider className={styles.slider} collapsed={collapsed}>
        <div className={styles.logo} id="logo">
          <Link to="/" style={{ display: 'inline-block', color: '#fff' }}>
            <i className={`iconfont ${collapsed ? 'iconjingyulogo3' : 'iconjingyulogo'}`} style={{ fontSize: '40px', verticalAlign: 'middle' }}></i>
          </Link>
        </div>
        <Menu
          mode={'inline'}
          theme="dark"
          selectedKeys={selectedKeys}
          onOpenChange={this.handleOpenChange}
          {...props}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
      </Sider>
    );
  }
}

export default SiderMenu;
