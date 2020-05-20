import React, { PureComponent } from 'react';
import { Form, PageHeader, Tabs, Card, Input, Button } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/lib/form';
import styles from './index.scss';

const { TabPane } = Tabs;

interface IProps extends FormComponentProps {}

interface IState {
  pageNo: number;
  pageSize: number;
  status: number;
}
@connect(({ loading, door, global }) => ({
  lclOrderInfo: door.lclOrderInfo,
  globalPackageTypeList: global.globalPackageTypeList,
}))
class OrderPage extends PureComponent<IProps, IState> {
  state = {
    pageNo: 1,
    pageSize: 10,
    status: -1,
  };

  tabs = [
    { label: '全部', value: -1 },
    { label: '待接单', value: 0 },
    { label: '已接单', value: 4 },
    { label: '已退单', value: 3 },
  ];

  componentDidMount() {
    this.handleSearchList();
  }

  handleSearchList = () => {
    const { pageNo, pageSize, status } = this.state;
  };

  handleTabChange = key => {
    this.setState({
      status: key,
    });
  };

  render() {
    const { status } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

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
                {getFieldDecorator('orderNo')(<Input placeholder="请输入CCCL NO" />)}
              </Form.Item>
              <Form.Item label="发货地">
                {getFieldDecorator('startTruck')(<Input placeholder="请输入发货地" />)}
              </Form.Item>
              <Form.Item label="收货地">
                {getFieldDecorator('endTruck')(<Input placeholder="请输入收货地" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Card bordered={false}>1</Card>
        </div>
      </div>
    );
  }
}

export default Form.create()(OrderPage);
