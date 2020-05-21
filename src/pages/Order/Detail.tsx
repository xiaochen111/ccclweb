import React, { PureComponent } from 'react';
import { PageHeader, Card, Descriptions, Divider, Col, Row, Icon, Button } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { router } from 'umi';
import { StateType } from './model';
import PageLoading from '@/components/PageLoading';
import FooterToolbar from '@/components/FooterToolbar';
import styles from './index.scss';
interface IProps extends StateType {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  pageLoading: boolean;
}

interface IState {
  id: string;
}

@connect(({ order }) => ({
  orderDetail: order.orderDetail,
}))
class orderDetailPage extends PureComponent<IProps, IState> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
  }

  componentDidMount() {
    const { id } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'order/getOrderDetail',
      payload: { id }
    });
  }

  render() {
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
            </Descriptions>
            <Divider/>
            <Descriptions title="附件">
              <Row>
                {
                  orderDetail.fileList.map(item => (
                    <Col span={12} key={item.sysFileId}>
                      <Icon type="link"/>
                      <a href={item.fileUrl}>{item.nameUrl}</a>
                      {/* <span style={{ color: '#2556F2' }}>{item.nameUrl}</span> */}
                    </Col>
                  ))
                }
              </Row>
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
