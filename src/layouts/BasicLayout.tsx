import React, { Component } from 'react';
<<<<<<< HEAD
// import { Layout } from 'antd';
=======
import { Layout } from 'antd';
>>>>>>> umi-old
import H from 'history';
import GlobalHeader from '@/components/GlobalHeader';

import styles from './index.scss';

<<<<<<< HEAD
// const { Header, Content } = Layout;
=======
const { Header, Content } = Layout;
>>>>>>> umi-old

export interface BasicLayoutProps {
  location: H.Location;
}

class BasicLayout extends Component<BasicLayoutProps, any> {
  render() {
    const { children } = this.props;
<<<<<<< HEAD
    console.log(children);
    return (
      <div>
        <div className={styles.header}>
          <GlobalHeader {...this.props} logo={''} />
        </div>
        <div>{children}</div>
      </div>
    );
=======

    return (
      <Layout>
        <Header className={styles.header}>
          <GlobalHeader {...this.props} logo={''}/>
        </Header>
        <Content>
          {children}
        </Content>
      </Layout>
    )
>>>>>>> umi-old
  }
}

export default BasicLayout;
