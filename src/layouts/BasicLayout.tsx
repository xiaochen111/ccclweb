import React, { Component } from 'react';
import { Layout } from 'antd';
import H from 'history';
import GlobalHeader from '@/components/GlobalHeader';

import styles from './index.scss';

const { Header, Content } = Layout;

export interface BasicLayoutProps {
  location: H.Location;
}

class BasicLayout extends Component<BasicLayoutProps, any> {
  render() {
    const { children, location } = this.props;
    // 如果是登录页面，全局头部不展示普通导航菜单
    const isLogin = location.pathname.includes('login');

    return (
      <Layout>
        <Header className={styles.header}>
          <GlobalHeader {...this.props} logo={''} isLogin={isLogin}/>
        </Header>
        <Content>
          {children}
        </Content>
      </Layout>
    )
  }
}

export default BasicLayout;
