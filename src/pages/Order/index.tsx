import React, { PureComponent } from 'react';
import { Form, PageHeader, Tabs, Card, Input, Button, Modal, Popconfirm, Popover, message } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import router from 'umi/router';
import { FormComponentProps } from 'antd/lib/form';
import { StateType } from './model';
import StandardTable from '@/components/StandardTable';
import styles from './index.scss';

const { TabPane } = Tabs;

interface IProps extends FormComponentProps, StateType {
  dispatch: Dispatch<AnyAction>;
  tableLoading: boolean;
}

interface IState {
  pageNo: number;
  pageSize: number;
  status: number;
  searchValues: {
    orderNo: string;
    startTruck: string;
    endTruck: string;
  };
  visible: boolean;
  currentOrderId: string;
  detailList: any[];
  detailPriceInfo: any;
}
@connect(({ loading, order, global }) => ({
  orderList: order.orderList,
  orderTotal: order.orderTotal,
  globalPackageTypeList: global.globalPackageTypeList,
  tableLoading: loading.global,
}))
class OrderPage extends PureComponent<IProps, IState> {
  state = {
    pageNo: 1,
    pageSize: 10,
    status: -1,
    searchValues: {
      orderNo: '',
      startTruck: '',
      endTruck: '',
    },
    visible: false,
    detailList: [],
    currentOrderId: '',
    detailPriceInfo: {
      unPayMoney: 0,
      unPayMoneyCurrency: ''
    },
  };

  tabs = [
    { label: '全部', value: -1 },
    { label: '待接单', value: 0 },
    { label: '已接单', value: 3 },
    { label: '商家拒单', value: 1 },
    { label: '用户取消', value: 2 },
  ];

  private columns = [
    {
      title: 'CCCL NO',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => <span style={{ color: '#2556F2', cursor: 'pointer' }} onClick={() => this.handleActions('detail', record)}>{text}</span>,
    },
    { title: '发货地', dataIndex: 'startTruck', key: 'startTruck' },
    { title: '收货地', dataIndex: 'endTruck', key: 'endTruck' },
    { title: '品名', dataIndex: 'goodsType', key: 'goodsType', render: text =>  <p style={{ width: '300px', wordBreak: 'break-all' }}>{text ? text.substring(0, 50) : ''}</p> },

    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        // if (record.feeStatus === 40) {
        //   return <span style={{ color: '#FF0808' }}>已支付</span>;
        // }
        if (text === 1 || text === 2) {
          return (
            <Popover content={record.statusDesc} trigger="hover">
              <span style={{ color: '#999' }}>已退单</span>
            </Popover>
          );
        }
        return <span style={{ color: record.statusColor }}>{record.statusDesc}</span>;
      }
    },
    {
      title: '支付状态',
      dataIndex: 'feeStatus',
      key: 'feeStatus',
      render: (text, record) => {
        if (record.status === 0) {
          return <span style={{ color: '#FE7100' }}>- - - - -</span>;
        }
        // if (record.feeStatus === 40) {
        //   return <span style={{ color: '#FF0808' }}>已支付</span>;
        // }
        // if (record.status === 1 || record.status === 2) {
        //   return <span style={{ color: '#333', cursor: 'pointer' }}>- - - - -</span>;
        // }
        return <span style={{ color: record.status === 1 || record.status === 2 ? '#999' : record.feeStatusColor }}>{record.feeStatusDesc}</span>;
      }
    },
    {
      title: '操作',
      render: (text, record) => {
        if (record.status === 0) {
          return (
            <Popconfirm onConfirm={() => this.handleActions('cancel', record)} title="是否确认取消订单">
              <span style={{ color: '#333', cursor: 'pointer' }}>取消订单</span>
            </Popconfirm>
          );
        }
        if (record.status === 1 || record.status === 2) {
          return <span style={{ color: '#333', cursor: 'pointer' }}>- - - - -</span>;
        }
        if (record.feeStatus === 30 || record.feeStatus === 40) {
          return <span style={{ color: '#333', cursor: 'pointer' }}>- - - - -</span>;
        }

        return <span style={{ color: '#333', cursor: 'pointer' }} onClick={() => this.handleActions('action', record)}>
          {record.feeStatusDesc}
        </span>;
      }
    },
  ];

  private detailColumns = [
    { title: '费用名称', dataIndex: 'feeName', key: 'feeName' },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: text => <span>${text}</span>,
    },
    { title: '数量', dataIndex: 'count', key: 'count' },
    {
      title: '应付金额',
      dataIndex: 'amount',
      key: 'amount',
      render: text => <span style={{ color: '#FE7100' }}>${text}</span>,
    },
    { title: '币种', dataIndex: 'currency', key: 'currency' },
    { title: '汇率', dataIndex: 'rate', key: 'rate' },
  ];

  componentDidMount() {
    this.handleSearchList();
  }

  handleSearchList = () => {
    const {
      pageNo,
      pageSize,
      status,
      searchValues: { orderNo, startTruck, endTruck },
    } = this.state;
    const { dispatch } = this.props;

    const params = {
      pageNo,
      pageSize,
    };

    if (status !== -1) {
      params['status'] = status;
    }
    if (orderNo) {
      params['orderNo'] = orderNo;
    }
    if (startTruck) {
      params['startTruck'] = startTruck;
    }
    if (endTruck) {
      params['endTruck'] = endTruck;
    }

    dispatch({
      type: 'order/getOrderList',
      payload: params,
    });
  };

  handleActions = (column, record) => {
    // column为action 根据订单费用类型， 非action单独处理订单状态
    if (column === 'action') {
      switch (record.feeStatus) {
      case 0:
        this.handleGetFeeDetail(record);
        break;
      case 10:
        if (record.totalPriceCurrency !== 'CNY') {
          message.info('资费存在外币，暂不支持支付');
          return;
        }
        router.push(`/control/order/my/payment/${record.id}`);
        break;
      default:
        break;
      }
    } else if (column === 'detail') {
      router.push(`/control/order/my/detail/${record.id}`);
    } else if (column === 'cancel') {
      this.handleCancelOrder(record);
    }
  };

  // 获取费用明细
  handleGetFeeDetail = async record => {
    const { dispatch } = this.props;

    let result: any = await dispatch({
      type: 'order/getOrderFeeDetail',
      payload: {
        id: record.id,
      },
    });

    this.setState({
      detailList: result.orderPayfeeList,
      currentOrderId: record.id,
      detailPriceInfo: {
        unPayMoney: result.unPayMoney || 0,
        unPayMoneyCurrency: result.unPayMoneyCurrency || ''
      },
      visible: true,
    });
  };

  // 取消订单
  handleCancelOrder = async record => {
    const { dispatch } = this.props;

    let result: any = await dispatch({
      type: 'order/cancelOrder',
      payload: {
        id: record.id,
      },
    });

    if (result) {
      this.handleSearchList();
    }
  };

  // 订单费用确认
  handleFeeConfirm = async() => {
    const { currentOrderId } = this.state;
    const { dispatch } = this.props;

    let result: any = await dispatch({
      type: 'order/orderFeeConfirm',
      payload: {
        orderId: currentOrderId,
        // 费用确认传true
        confirmFee: true,
      },
    });

    if (result) {
      this.handleSearchList();
      this.handleModalCancel();
    }
  }

  handleModalCancel = () => {
    this.setState({
      currentOrderId: '',
      detailList: [],
      visible: false,
    });
  };

  handleTabChange = key => {
    this.setState(
      {
        status: Number(key),
      },
      this.handleSearchList,
    );
  };

  handleSearch = () => {
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (err) return;

      this.setState({
        searchValues: values,
      }, this.handleSearchList);
    });
  };

  handleTabelChange = pagination => {
    this.setState(
      {
        pageNo: pagination.current,
      },
      this.handleSearchList,
    );
  };

  render() {
    const { status, pageNo, pageSize, detailList, detailPriceInfo, visible } = this.state;
    const {
      form: { getFieldDecorator },
      orderList,
      orderTotal,
      tableLoading,
    } = this.props;

    const pagination = {
      total: orderTotal,
      current: pageNo,
      pageSize,
    };

    return (
      <div className={styles.container}>
        <PageHeader
          title="我的订单"
          footer={
            <Tabs activeKey={status.toString()} size="small" onChange={this.handleTabChange}>
              {this.tabs.map(item => (
                <TabPane tab={item.label} key={item.value.toString()} />
              ))}
            </Tabs>
          }
        />
        <div className={styles.main}>
          <div className={styles.search}>
            <Form layout="inline">
              <Form.Item label="CCCL NO">
                {getFieldDecorator('orderNo')(<Input placeholder="请输入CCCL NO" allowClear />)}
              </Form.Item>
              <Form.Item label="发货地">
                {getFieldDecorator('startTruck')(<Input placeholder="请输入发货地" allowClear />)}
              </Form.Item>
              <Form.Item label="收货地">
                {getFieldDecorator('endTruck')(<Input placeholder="请输入收货地" allowClear />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.handleSearch}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Card bordered={false}>
            <StandardTable
              rowKey={'id'}
              columns={this.columns}
              dataSource={orderList}
              loading={tableLoading}
              pagination={pagination}
              onChange={this.handleTabelChange}
            />
          </Card>
        </div>

        <Modal
          title="费用明细"
          visible={visible}
          width={800}
          destroyOnClose
          footer={null}
          onCancel={this.handleModalCancel}
        >
          <>
            <StandardTable rowKey={'feeId'} columns={this.detailColumns} dataSource={detailList} />
            <div className={styles.modalFooter}>
              <div className={styles.footerContent}>
                <div className={styles.text}>
                  总金额
                  <span className={styles.price}>
                    <strong>{detailPriceInfo.unPayMoney}</strong>
                    <i>{detailPriceInfo.unPayMoneyCurrency}</i>
                  </span>
                </div>
                <Button type="primary" onClick={this.handleFeeConfirm}>确认</Button>
              </div>
            </div>
          </>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(OrderPage);
