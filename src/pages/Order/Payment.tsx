import React, { PureComponent } from 'react';
import { PageHeader, Card } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import styles from './index.scss';


interface IProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  submitLoading: boolean;
  orderDetail: any
  payTypeQrcode: string;
}

@connect(({ order, loading }) => ({
  orderDetail: order.orderDetail,
  payTypeQrcode: order.payTypeQrcode,
  submitLoading: loading.effects['system/doUpdateWebUserInfo'],
}))
class OrderPaymentPage extends PureComponent<IProps, any> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
    currentType: -1
  }
  paymentMethods = [
    { label: '支付宝', value: 1, icon: 'alipay-icon' },
    { label: '微信', value: 2, icon: 'wechat-icon'  },
  ]

  componentDidMount() {
    this.handleGetDetial();
  }

  handleGetDetial = () => {
    const { id } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'order/getOrderDetail',
      payload: { id }
    });
  };

  handleGetQrcode = type => {
    const { id } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'order/getQrcode',
      payload: {
        orderId: id,
        payType: type
      }
    });

    this.setState({
      currentType: type
    });
  }

  render() {
    const { currentType } = this.state;
    const { orderDetail, payTypeQrcode, submitLoading } = this.props;

    if (!orderDetail) return <PageLoading/>;

    return (
      <div className={styles.orderPaymentWrapper}>
        <PageHeader title="我的订单/待费用支付" />
        <div className={styles.main}>
          <Card bordered={false}>
            <ul className={styles.content}>
              <li>
                <span className={styles.label}>支付方式：</span>
                <div className={styles.types}>
                  {this.paymentMethods.map(item => (
                    <div className={`${styles.typesItem} ${currentType === item.value ? styles.active : ''}`} key={item.value} onClick={() => this.handleGetQrcode(item.value)}>
                      <img src={require(`../../assets/img/${item.icon}.svg`)} alt=""/>
                      <span>{item.label}</span>
                      {
                        currentType === item.value ?
                          <i className={styles.checkIcon}/> : null
                      }
                    </div>
                  ))}
                </div>
              </li>
              <li>
                <span className={styles.label}>支付金额：</span>
                <span className={styles.price}>
                  <strong>{orderDetail.totalPrice}</strong>元
                </span>
              </li>
              <li>
                <span className={styles.label}>付款码：</span>
                {
                  payTypeQrcode ? (
                    <div className={styles.qrcode}>
                      <img alt="支付二维码" src={payTypeQrcode}/>
                    </div>
                  ) : <span>请选择支付方式</span>
                }
              </li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }
}

export default OrderPaymentPage;
