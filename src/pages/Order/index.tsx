import React, { PureComponent } from 'react';
import { Form, PageHeader, Tabs, Card, Input, Button } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
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
  };

  tabs = [
    { label: '全部', value: -1 },
    { label: '待接单', value: 0 },
    { label: '已接单', value: 4 },
    { label: '已退单', value: 3 },
  ];

  private columns = [
    {
      title: 'CCCL NO',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: text => <span style={{ color: '#2556F2' }}>{text}</span>,
    },
    { title: '发货地', dataIndex: 'startTruck', key: 'startTruck' },
    { title: '收货地', dataIndex: 'endTruck', key: 'endTruck' },
    { title: '品名', dataIndex: 'goodsType', key: 'goodsType' },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span style={{ color: record.statusColor }}>{record.statusDesc}</span>
      ),
    },
    {
      title: '操作',
      render: (text, record) => <span style={{ color: '#2556F2' }}>{record.feeStatusDesc}</span>,
    },
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

      this.setState(
        {
          searchValues: values,
        },
        this.handleSearchList,
      );
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
    const { status, pageNo, pageSize } = this.state;
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
      </div>
    );
  }
}

export default Form.create()(OrderPage);
