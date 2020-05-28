import React, { PureComponent } from 'react';
import { PageHeader, Card, Result, Button, Icon } from 'antd';
import { router } from 'umi';
import QRCode  from 'qrcode.react';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import styles from './index.scss';


interface IProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  qrLoading: boolean;
  orderDetail: any
  payTypeQrcode: string;
}

@connect(({ order, loading }) => ({
  orderDetail: order.orderDetail,
  payTypeQrcode: order.payTypeQrcode,
  qrLoading: loading.effects['order/getQrcode'],
}))
class OrderPaymentPage extends PureComponent<IProps, any> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
    currentType: 1,
    flag: false,
    loading: false
  }
  private timer;

  paymentMethods = [
    { label: '支付宝', value: 1, icon: 'alipay-icon' },
    { label: '微信', value: 2, icon: 'wechat-icon'  },
  ]

  componentDidMount() {
    this.handleGetDetial();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    clearInterval(this.timer);
    dispatch({
      type: 'order/saveQrcode',
      payload: null
    });
  }

  handleGetDetial = async() => {
    const { id } = this.state;
    const { dispatch } = this.props;

    let result = await dispatch({
      type: 'order/getOrderDetail',
      payload: { id }
    });

    if (result['feeStatus'] === 40) {
      this.setState({
        flag: true,
        loading: false
      });
    }
  };

  handleGetQrcode = type => {
    const { id, currentType, loading } = this.state;
    const { dispatch } = this.props;

    if (currentType === type || loading) return;

    dispatch({
      type: 'order/saveQrcode',
      payload: null
    });
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

  handlePay = () => {
    let num = 0;

    this.setState({
      loading: true
    });

    this.timer = setInterval(() => {
      num = num + 5;
      if (num >= 12) {
        clearInterval(this.timer);
        return;
      }
      this.handleGetDetial();
    }, 5000);
  }

  handleBack = () => {
    router.goBack();
  }

  render() {
    const { currentType, flag, loading } = this.state;
    const { orderDetail, payTypeQrcode, qrLoading } = this.props;

    if (!orderDetail) return <PageLoading/>;

    return (
      <div className={styles.orderPaymentWrapper}>
        <PageHeader title="我的订单/待费用支付"/>
        {
          !flag ? (
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
                      <strong>{orderDetail.unPayMoney}</strong>元
                    </span>
                  </li>
                  <li>
                    <span className={styles.label}>付款码：</span>
                    {
                      payTypeQrcode ? (
                        <div className={styles.qrcode}>
                          <QRCode
                            value={payTypeQrcode}  //value参数为生成二维码的链接
                            size={200} //二维码的宽高尺寸
                            fgColor="#000000"  //二维码的颜色
                          />
                        </div>
                      ) : qrLoading ? <Icon type="loading"/> : <span>请选择支付方式</span>
                    }
                  </li>
                </ul>
              </Card>
              <div className={styles.payBtn}>
                <Button type="primary" size="large" onClick={this.handlePay} loading={loading}>返回</Button>
              </div>
            </div>
          ) : (
            <Card>
              <Result
                status="success"
                title="支付成功"
                extra={[
                  <Button type="primary" key="console" onClick={this.handleBack}>返回</Button>
                ]}
              />
            </Card>
          )
        }

      </div>
    );
  }
}

export default OrderPaymentPage;
