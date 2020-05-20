import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import StandardTable from '@/components/StandardTable';
import { StateType } from './model';
import styles from './index.scss';
import { connect } from 'dva';

const { TextArea } = Input;

interface IState {
  pageNo: number;
  pageSize: number;
  selectedRowKeys: any[];
}

interface Iprps extends FormComponentProps, StateType {
  tableLoading: boolean;
  dispatch: Dispatch<AnyAction>;
}

@connect(({ address, Loading }) => ({
  addressList: address.addressList,
  addressTotal: address.addressTotal,
  tableLoading: Loading,
}))
export class index extends Component<Iprps, IState> {
  state = {
    pageNo: 0,
    pageSize: 0,
    selectedRowKeys: [],
  };

  private columns = [
    {
      title: '送货地址',
      dataIndex: 'portEndAddress',
      key: 'portEndAddress',
    },
  ];

  saveContactAddress = () => {
    const { form, dispatch } = this.props;
    form.validateFields(async (err, values) => {
      if (err) return;
      console.log(values);
      const res = await dispatch({
        type: 'address/doSaveContactAddress',
        payload: values,
      });

      if (res) {
        this.getAddressList();
      }
    });
  };

  getAddressList = () => {
    const { dispatch } = this.props;
    const { pageNo, pageSize } = this.state;
    const params = {
      pageNo,
      pageSize,
    };
    dispatch({
      type: 'address/getContactAddress',
      payload: params,
    });
  };

  handleTabelChange = pagination => {
    this.setState(
      {
        pageNo: pagination.current,
      },
      this.getAddressList,
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      addressTotal,
    } = this.props;
    const { pageNo, pageSize, selectedRowKeys } = this.state;
    const pagination = {
      total: addressTotal,
      current: pageNo,
      pageSize,
    };
    return (
      <div className={styles.address}>
        <p className={styles.title}>常用收货地址</p>
        <Form>
          <Row gutter={20}>
            <Col span={22}>
              <Form.Item>
                {getFieldDecorator('portEndAddress', {
                  rules: [{ required: true, message: '请输入收货地址' }],
                })(<TextArea rows={4} />)}
              </Form.Item>
            </Col>

            <Col span={2}>
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" size="large" block onClick={this.saveContactAddress}>
                  搜索
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        <div className={styles.tableMain}>
          <div className={styles.btns}>
            <button>默认</button>
            <button>新增</button>
            <button>删除</button>
          </div>
          <StandardTable
            rowKey={'id'}
            size={'middle'}
            columns={this.columns}
            // dataSource={userList}
            // loading={tableLoading}
            // pagination={pagination}
            // rowSelection={rowSelection}
            // onChange={this.handleTabelChange}
            // scroll={{ x: 1400 }}
          />
        </div>
      </div>
    );
  }
}

export default Form.create()(index);
