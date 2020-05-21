import React, { PureComponent } from 'react';
import { PageHeader } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
// import PageLoading from '@/components/PageLoading';

interface IProps {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  pageLoading: boolean;
}

interface IState {
  id: string;
}

@connect(({ menu, loading, erpUser }) => ({
  globalPageSubMenu: menu.globalPageSubMenu,
  pageLoading: loading.models['erpUser'],
}))
class orderDetailPage extends PureComponent<IProps, IState> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
  }

  render() {
    return (
      <div>
        <PageHeader title="我的订单/订单详情"/>
      </div>
    );
  }
}

export default orderDetailPage;
