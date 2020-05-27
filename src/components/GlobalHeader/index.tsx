import React, { PureComponent } from 'react';
import { Link, router } from 'umi';
import { Menu, Dropdown, Icon } from 'antd';
import H from 'history';
import { stringify } from 'qs';
import { RemoveLocalStorage } from '@/utils/storage/local';
import { GetGlobalFlag, GetGlobalToken, GetAccountInfo } from '@/utils/cache';

import styles from './index.scss';
interface GlonbalHeaderProps {
  logo: string;
  location: H.Location;
  isLogin: boolean;
}

class GlonbalHeader extends PureComponent<GlonbalHeaderProps, any> {
  logout = () => {
    RemoveLocalStorage('auth_website');
    RemoveLocalStorage('globalFlag');
    RemoveLocalStorage('accountInfo');
    router.replace('/');
  }

  handleMenuClick = ({ key }) => {
    switch (key) {
    case 'control':
      router.push('/control');
      break;
    case 'mdify':
      router.push('/control/system/modify');
      break;
    case 'logout':
      this.logout();
      break;
    default:
      break;
    }
  }

  render() {
    const { logo, location, isLogin } = this.props;

    console.log('render -> location', window.location);
    const navs = isLogin
      ? []
      : [
        { name: '首页', link: '/home' },
        { name: '门到门专区', link: '/door' },
        { name: '新闻中心', link: '/news' },
        // { name: '关于我们', link: '/about' },
      ];

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="control">
          <span>工作台</span>
        </Menu.Item>
        <Menu.Item key="mdify">
          <span>修改密码</span>
        </Menu.Item>
        <Menu.Item key="logout">
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.wrap}>
        <Link to="/">
          <i className={`${styles.logo}  iconfont iconCCC`} style={{ fontSize: '50px', color: '#fff', verticalAlign: 'middle' }}/>
          <i className={`${styles.logo}  iconfont iconlogo`} style={{ fontSize: '40px', color: '#fff', verticalAlign: 'middle' }}/>
        </Link>
        <nav className={styles.navsWrap}>
          {navs.map(item => (
            <Link
              to={item.link}
              key={item.link}
              className={`${styles.navItem} ${
                location.pathname.includes(item.link) ? styles.active : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
          {GetGlobalToken(GetGlobalFlag()) ? (
            <Dropdown overlay={menu} trigger={['click', 'hover']}>
              <div style={{ display: 'inline-block' }}>
                <span style={{  cursor: 'pointer' }}>{GetAccountInfo().userName}</span>
                <Icon type="caret-down" />
              </div>
            </Dropdown>
          ) : (
            <>
              <Link to={{
                pathname: '/login/index',
                search: stringify(window.location.hash.indexOf('register') === -1 ? { backUrl: window.location.hash.split('#')[1] } : {})
              }} className={`${styles.navItem} ${styles.otherItem}`}>
                登录
              </Link>
              &nbsp;&#x007C;&nbsp;
              <Link to={'/login/register'} className={`${styles.navItem} ${styles.otherItem}`}>
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    );
  }
}

export default GlonbalHeader;
