import React, { Component } from 'react';
import { ConfigProvider, Layout } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import H from 'history';
import GlobalHeader from '@/components/GlobalHeader';

import styles from './index.scss';

const { Header, Content } = Layout;
const logo = require('../assets/img/logo.png');

export interface BasicLayoutProps {
  location: H.Location;
}

class BasicLayout extends Component<BasicLayoutProps, any> {
  render() {
    const { children, location } = this.props;
    const isLogin = location.pathname.includes('login');

    return (
      <ConfigProvider locale={zh_CN}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header className={styles.header}>
            <GlobalHeader {...this.props} logo={logo} isLogin={isLogin} />
          </Header>
          <Content>{children}</Content>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default BasicLayout;
