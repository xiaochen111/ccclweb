import React, { PureComponent } from 'react';
import { PageHeader, Card, Descriptions, Divider, Col, Row, Icon, Button } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import { StateType } from './model';
import PageLoading from '@/components/PageLoading';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from '@/components/FooterToolbar';
import styles from './index.scss';
interface IProps extends StateType {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  pageLoading: boolean;
}

interface IState {
  id: string;
  detailInfo: any
}

@connect(({ order }) => ({
  orderDetail: order.orderDetail,
}))
class orderDetailPage extends PureComponent<IProps, IState> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
    detailInfo: {}
  }


  private detailColumns = [
    { title: '费用名称', dataIndex: 'feeName', key: 'feeName' },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text, record) => <span>{record.currency === 'CNY' ? '¥' : '$'}{text}</span>
    },
    { title: '数量', dataIndex: 'count', key: 'count' },
    {
      title: '应付金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => <span style={{ color: '#FE7100' }}>{record.currency === 'CNY' ? '¥' : '$'}{text}</span>,
    },
    { title: '币种', dataIndex: 'currency', key: 'currency' },
    { title: '汇率', dataIndex: 'rate', key: 'rate' },
  ];

  componentDidMount() {
    const { id } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'order/getOrderDetail',
      payload: { id }
    });

    this.handleGetFeeDetail();
  }

  handleGetFeeDetail = async() => {
    const { id } = this.state;
    const { dispatch } = this.props;

    let result: any = await dispatch({
      type: 'order/getOrderFeeDetail',
      payload: { id },
    });

    this.setState({
      detailInfo: result,
    });
  };

  render() {
    const { detailInfo } = this.state;

    console.log('orderDetailPage -> render -> detailInfo', detailInfo);
    const { orderDetail } = this.props;

    if (!orderDetail) return <PageLoading/>;

    return (
      <div style={{ paddingBottom: 80 }}>
        <PageHeader title="我的订单/订单详情"/>
        <div className={styles.main}>
          <Card bordered={false}>
            <Descriptions title="基础信息">
              <Descriptions.Item label="订单编号">
                {orderDetail.orderNo}
              </Descriptions.Item>
              <Descriptions.Item label="运输专线">
                {orderDetail.startTruck}--{orderDetail.endTruck}
              </Descriptions.Item>
              <Descriptions.Item label="供应商">
                {orderDetail.supplierName}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">
                {moment(orderDetail.createTime).format('YYYY-MM-DD')}
              </Descriptions.Item>
            </Descriptions>
            <Divider/>
            <Descriptions title="费用明细">
              <div>
                <StandardTable rowKey={'feeId'} columns={this.detailColumns} dataSource={detailInfo['orderPayfeeList']} />
                <div className={styles.modalFooter} style={{ justifyContent: 'flex-start' }}>
                  <div className={styles.footerContent}>
                    <div className={styles.text}>
                    总金额
                      <span className={styles.price}>
                        <strong>{detailInfo['unPayMoney']}</strong>
                        <i>{detailInfo['unPayMoneyCurrency']}</i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Descriptions>
            <Divider/>
            <Descriptions title="附件">
              <ul>
                {
                  orderDetail.fileList.map(item => (
                    <li key={item.sysFileId}>
                      <Icon type="link" style={{ marginRight: 5 }}/>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">{item.nameUrl}</a>
                      {/* <a href={item.fileUrl} rel="external nofollow" download>{item.nameUrl}</a> */}
                      {/* <span style={{ color: '#2556F2' }}>{item.nameUrl}</span> */}
                    </li>
                  ))
                }
              </ul>
            </Descriptions>
            <Divider/>
            <Descriptions title="货物信息委托">
              <Descriptions.Item label="品名" span={3}>
                {orderDetail.goodsType}
              </Descriptions.Item>
              <Descriptions.Item label="包装类型">
                {orderDetail.packageType}
              </Descriptions.Item>
              <Descriptions.Item label="货物总件数">
                {orderDetail.totalPiece}
              </Descriptions.Item>
              <Descriptions.Item label="货物总重量(KGS)">
                {orderDetail.totalKgs}
              </Descriptions.Item>
              <Descriptions.Item label="货物总体积(CBM)">
                {orderDetail.totalCbm}
              </Descriptions.Item>
              <Descriptions.Item label="预计送货日">
                {orderDetail.deliveryDate}
              </Descriptions.Item>
            </Descriptions>
            <Divider/>
            <Descriptions title="委托人信息">
              <Descriptions.Item label="公司名称">
                {orderDetail.contactCompanyName}
              </Descriptions.Item>
              <Descriptions.Item label="联系人">
                {orderDetail.contact}
              </Descriptions.Item>
              <Descriptions.Item label="目的地送货地址">
                {orderDetail.portEndAddress}
              </Descriptions.Item>
              <Descriptions.Item label="手机">
                {orderDetail.contactTel}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {orderDetail.contactEmail}
              </Descriptions.Item>
            </Descriptions>
            <Divider/>
            <Descriptions title="备注">
              <Descriptions.Item label="备注信息">
                {orderDetail.remark}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
        <FooterToolbar>
          <Button onClick={() => { router.goBack(); } }>返回</Button>
        </FooterToolbar>
      </div>
    );
  }
}

export default orderDetailPage;
