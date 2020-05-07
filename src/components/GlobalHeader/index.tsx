import React, { PureComponent } from 'react';
import { Link } from 'umi';
import H from 'history';
import styles from './index.scss';

interface GlonbalHeaderProps {
  logo: string;
  location: H.Location;
}

class GlonbalHeader extends PureComponent<GlonbalHeaderProps, any> {
  render() {
    const { logo, location } = this.props;

    const navs = [
      { name: '首页', link: '/index' },
      { name: '门到门专区', link: '/zone' },
      { name: '关于我们', link: '/about' },
      { name: '控制中心', link: '/control-center' },
      { name: '登录｜注册', link: '/login' }
    ]

    return (
      <div className={styles.wrap}>
        <Link to="/">
          <img className={styles.logo} src={logo}/>
        </Link>
        <nav className={styles.navsWrap}>
          {
            navs.map(item => (
              <Link 
                to={item.link} 
                key={item.link} 
                className={`${styles.navItem} ${item.link === location.pathname ? styles.active : ''}`}
              >
                {item.name}
              </Link>
            ))
          }
        </nav>
      </div>
    )
  }
}

export default GlonbalHeader;
