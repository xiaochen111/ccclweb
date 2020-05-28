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
    qrcodes: null
  }
  private timer;
  private timer2;

  paymentMethods = [
    { label: '支付宝', value: 1, icon: 'alipay-icon' },
    { label: '微信', value: 2, icon: 'wechat-icon'  },
  ]

  componentDidMount() {
    this.handleGetDetail();
    this.handleGetQrcodes();

    this.timer = setInterval(() => {
      this.handleGetDetail();
    }, 1000);
    // 每4分钟重新获取最新的支付码
    this.timer2 = setInterval(() => {
      this.handleGetQrcodes();
    }, 240000);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer = () => {
    clearInterval(this.timer);
    clearInterval(this.timer2);
  }


  handleGetDetail = async() => {
    const { id } = this.state;
    const { dispatch } = this.props;

    let result = await dispatch({
      type: 'order/getOrderDetail',
      payload: { id }
    });

    if (result['feeStatus'] === 40) {
      this.clearTimer();
      this.setState({
        flag: true,
      });
    }
  };

  handleGetQrcodes = async() => {
    const { id } = this.state;
    const { dispatch } = this.props;
    let result = await dispatch({
      type: 'order/getQrcode',
      payload: {
        orderId: id,
      }
    });

    console.log(result);
    if (result) {
      this.setState({
        qrcodes: result
      });
    } else {
      clearInterval(this.timer);
      this.setState({
        qrcodes: []
      });
    }

    // // 如果二维码获取失败，取消定时操作
    // if (!result.filter(o => o).length) {
    //   clearInterval(this.timer);
    //   // return;
    // }
    // this.setState({
    //   qrcodes: result
    // });
  }

  handleGetQrcode = type => {
    this.setState({
      currentType: type
    });
  }

  handleBack = () => {
    router.goBack();
  }

  render() {
    const { currentType, flag, qrcodes } = this.state;
    const { orderDetail, qrLoading } = this.props;

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
                      qrLoading || !Array.isArray(qrcodes) ? <Icon type="loading"/> :
                        qrcodes[currentType - 1] ?
                          (
                            <div className={styles.qrcode}>
                              <QRCode
                                value={qrcodes[currentType - 1]}  //value参数为生成二维码的链接
                                size={200} //二维码的宽高尺寸
                                fgColor="#000000"  //二维码的颜色
                              />
                            </div>
                          ) :
                          (
                            <div className={styles.waringQrcode}>
                              <Result
                                status="warning"
                                title={<span style={{ fontSize: 16 }}>生成二维码失败，请联系客服</span>}
                                // extra={
                                //   <Button type="primary" key="console">
                                //     Go Console
                                //   </Button>
                                // }
                              />
                            </div>
                          )
                    }

                  </li>
                </ul>
              </Card>
              <div className={styles.payBtn}>
                <Button type="primary" size="large" onClick={this.handleBack}>返回</Button>
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
