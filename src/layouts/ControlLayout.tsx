import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { ConfigProvider, Layout } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import { connect } from 'dva';
import Context from './MenuContext.js';
import H from 'history';
import 'moment/locale/zh-cn';
import SiderMenu from '@/components/SiderMenu';
import ControlHeader from '@/components/ControlHeader/ControlHeader';
import { StateType } from '@/models/menu';

const { Header, Content } = Layout;

moment.locale('zh-cn');

export interface ControlLayoutProps extends StateType {
  route: {
    routes: any[];
  };
  dispatch: Dispatch<AnyAction>;
  location: H.Location;
  collapsed: boolean;
  changePasswordVisible: boolean;
  changePassWordLoading: boolean;
  baseUserInfo: any;
}

@connect(({ menu, global }) => ({
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  collapsed: global.collapsed,
}))
class ControlLayout extends Component<ControlLayoutProps, any> {
  componentDidMount() {
    this.handleGetMenuData();
  }

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleGetMenuData = () => {
    const {
      dispatch,
      route: { routes },
    } = this.props;

    dispatch({
      type: 'menu/getMenuData',
      payload: { routes },
    });
  };

  getContext() {
    const { location, breadcrumbNameMap } = this.props;

    return {
      location,
      breadcrumbNameMap,
    };
  }

  render() {
    const { children, menuData, collapsed } = this.props;
    const logo = require('../assets/img/logo.png');

    const layout = (
      <Layout>
        <SiderMenu logo={logo} menuData={menuData} collapsed={collapsed} {...this.props} />
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ padding: 0, overflow: 'hidden' }}>
            <ControlHeader collapsed={collapsed} onCollapse={this.handleMenuCollapse} />
          </Header>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    );
    return (
      <ConfigProvider locale={zh_CN}>
        <Context.Provider value={this.getContext()}>{layout}</Context.Provider>
      </ConfigProvider>
    );
  }
}

export default ControlLayout;
