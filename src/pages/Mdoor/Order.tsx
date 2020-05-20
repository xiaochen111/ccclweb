import React, { PureComponent } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import DoorPlaceOrder, { RegisterProps } from '@/components/DoorPrice/Order';

interface IProps extends RegisterProps {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  lclOrderInfo: any;
}
interface IState {
  id: string;
}

@connect(({ loading, door }) => ({
  lclOrderInfo: door.lclOrderInfo,
  pageLoading: loading.global,
}))
class DoorPlaceOrderPage extends PureComponent<IProps, IState> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
  };

  componentDidMount() {
    const { id } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'door/getLclDetail',
      payload: {
        freightLclId: id,
        kgs: 1,
      },
    });

    dispatch({
      type: 'global/getGlobalPackageTypeList',
    });
  }

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
    const { pageLoading, lclOrderInfo } = this.props;

    return (
      <div style={{ width: '100%', padding: '0 20px' }}>
        <DoorPlaceOrder
          pageLoading={pageLoading}
          defaultInfo={lclOrderInfo}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default DoorPlaceOrderPage;
