import React, { PureComponent } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import PageWrapper from '@/components/PageWrapper';
import DoorPlaceOrder, { RegisterProps } from '@/components/DoorPrice/Order';
import { GetPageQuery } from '@/utils/utils';
import { GetAccountInfo } from '@/utils/cache';
import { debounce } from 'lodash';
interface IProps extends RegisterProps {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  lclOrderInfo: any;
  globalPackageTypeList: any[];
}
interface IState {
  id: string;
}

@connect(({ loading, door, global }) => ({
  lclOrderInfo: door.lclOrderInfo,
  globalPackageTypeList: global.globalPackageTypeList,
}))
class DoorPlaceOrderPage extends PureComponent<IProps, IState> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
  };

  componentDidMount() {
    const { id } = this.state;
    const { dispatch } = this.props;
    const params = GetPageQuery();

    dispatch({
      type: 'door/getLclDetail',
      payload: {
        freightLclId: id,
        kgs: params.kgs,
        cbm: params.cbm,
      },
    });
  }

  handlePackageTypeSearch = debounce(value => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getGlobalPackageTypeList',
      payload: { name: value },
    });
  }, 500);

  handleSubmit = params => {
    const { id } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'door/orderSubmit',
      payload: {
        ...params,
        freightLclId: id,
      },
    });
  };

  render() {
    const { lclOrderInfo, globalPackageTypeList } = this.props;
    const defalutInfo = Object.assign(GetAccountInfo() ? GetAccountInfo() : {}, lclOrderInfo);

    return (
      <PageWrapper>
        <DoorPlaceOrder
          defaultInfo={defalutInfo}
          onSubmit={this.handleSubmit}
          packageTypeSearch={this.handlePackageTypeSearch}
          packageTypeData={globalPackageTypeList}
        />
      </PageWrapper>
    );
  }
}

export default DoorPlaceOrderPage;
