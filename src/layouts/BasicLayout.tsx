import React, { Component } from 'react';
import { Layout } from 'antd';
const { Header, Content } = Layout;

class BasicLayout extends Component {
  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Header style={{ padding: 0, overflow: 'hidden' }}>
          1
        </Header>
        <Content>
          {children}
        </Content>
      </Layout>
    )
  }
}

export default BasicLayout;
