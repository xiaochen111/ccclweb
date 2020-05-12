import React, { PureComponent } from 'react';
import { Link } from 'umi';
import H from 'history';
import styles from './index.scss';

interface GlonbalHeaderProps {
  logo: string;
  location: H.Location;
  isLogin: boolean;
}

class GlonbalHeader extends PureComponent<GlonbalHeaderProps, any> {
  render() {
    const { logo, location, isLogin } = this.props;
    const navs = isLogin
      ? []
      : [
          { name: '首页', link: '/home' },
          { name: '门到门专区', link: '/door' },
          { name: '关于我们', link: '/about' },
          { name: '控制中心', link: '/control-center' },
        ];

    return (
      <div className={styles.wrap}>
        <Link to="/">
          <img className={styles.logo} src={logo} />
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
          <Link to={'/login/index'} className={`${styles.navItem} ${styles.otherItem}`}>
            登录
          </Link>
          &nbsp;&#x007C;&nbsp;
          <Link to={'/login/register'} className={`${styles.navItem} ${styles.otherItem}`}>
            注册
          </Link>
        </nav>
      </div>
    );
  }
}

export default GlonbalHeader;
