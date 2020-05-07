import React, { Component } from 'react';
// import { Layout } from 'antd';
import H from 'history';
import GlobalHeader from '@/components/GlobalHeader';

import styles from './index.scss';

// const { Header, Content } = Layout;

export interface BasicLayoutProps {
  location: H.Location;
}

class BasicLayout extends Component<BasicLayoutProps, any> {
  render() {
    const { children } = this.props;
    console.log(children);
    return (
      <div>
        <div className={styles.header}>
          <GlobalHeader {...this.props} logo={''} />
        </div>
        <div>{children}</div>
      </div>
    );
  }
}

export default BasicLayout;
