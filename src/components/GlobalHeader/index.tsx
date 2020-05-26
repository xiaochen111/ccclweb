import React, { PureComponent } from 'react';
import { Link, router } from 'umi';
import H from 'history';
import styles from './index.scss';
import { GetGlobalFlag, GetGlobalToken, GetAccountInfo } from '@/utils/cache';
import { RemoveLocalStorage } from '@/utils/storage/local';

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

  render() {
    const { logo, location, isLogin } = this.props;
    const navs = isLogin
      ? []
      : [
        { name: '首页', link: '/home' },
        { name: '门到门专区', link: '/door' },
        { name: '新闻中心', link: '/news' },
        // { name: '关于我们', link: '/about' },
      ];

    return (
      <div className={styles.wrap}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt=""/>
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
            <div className={styles.loginer}>
              <span>{GetAccountInfo().userName}</span>
              <div className={styles.controlNav}>
                <ul>
                  <li>
                    <Link to={'/control'}>工作台</Link>
                  </li>
                  <li>
                    <Link to={'/control/system/modify'}>修改密码</Link>
                  </li>
                  <li>
                    <span onClick={this.logout}>退出登录</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link to={'/login/index'} className={`${styles.navItem} ${styles.otherItem}`}>
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
