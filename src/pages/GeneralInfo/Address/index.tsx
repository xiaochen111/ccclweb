import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import StandardTable from '@/components/StandardTable';
import { StateType } from '@/models/address';
import styles from './index.scss';
import { connect } from 'dva';
import { router } from 'umi';
import { stringify } from 'qs';

const { TextArea } = Input;

interface IState {
  pageNo: number;
  pageSize: number;
  selectedRowKeys: any[];
  selectedRows: any[];
}

interface IProps extends FormComponentProps, StateType {
  tableLoading: boolean;
  dispatch: Dispatch<AnyAction>;
}

@connect(({ address, Loading }) => ({
  addressList: address.addressList,
  addressTotal: address.addressTotal,
  tableLoading: Loading,
}))
export class index extends Component<IProps, IState> {
  state = {
    pageNo: 0,
    pageSize: 0,
    selectedRowKeys: [],
    selectedRows: [],
  };

  private columns = [
    {
      title: '送货地址',
      dataIndex: 'portEndAddress',
      key: 'portEndAddress',
      render: (text, record) => (
        <>
          {record.contactDefault === 1 ? <span className={styles.default}>默认</span> : ''}
          {record.portEndAddress}
        </>
      ),
    },
  ];

  componentDidMount() {
    this.getAddressList();
  }

  handleActions = async type => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (type === 'add') {
      router.push({
        pathname: '/control/general/action',
        search: stringify({ flag: '1' }),
      });
    }
    if (type === 'edit') {
      if (selectedRows.length > 1) {
        message.warn('最多只能选择一条修改');
        return;
      }
      if (selectedRows.length === 0) {
        message.warn('至少选择一条修改');
        return;
      }
      router.push({
        pathname: `/control/general/action${selectedRows[0].lclContactId}`,
        search: stringify({
          portEndAddress: selectedRows[0].portEndAddress,
          contactDefault: selectedRows[0].contactDefault,
          flag: '2',
        }),
      });
    }

    if (type === 'default') {
      if (selectedRows.length > 1) {
        message.warn('最多只能选择一条设置默认');
        return;
      }
      if (selectedRows.length === 0) {
        message.warn('至少选择一条设置默认');
        return;
      }
      const res = await dispatch({
        type: 'address/doSetContactDefaultAddress',
        payload: { lclContactId: selectedRows[0].lclContactId * 1 },
      });

      if (res) {
        this.getAddressList();
        this.resetState();
      }
    }

    if (type === 'cancal') {
      if (selectedRows.length > 1) {
        message.warn('最多只能选择一条取消默认');
        return;
      }
      if (selectedRows.length === 0) {
        message.warn('至少选择一条取消默认');
        return;
      }
      const res = await dispatch({
        type: 'address/doCancelContactDefaultAddress',
        payload: { lclContactId: selectedRows[0].lclContactId * 1 },
      });

      if (res) {
        this.getAddressList();
        this.resetState();
      }
    }
  };

  resetState = () => {
    this.setState({
      pageNo: 0,
      pageSize: 0,
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  getAddressList = async () => {
    const { dispatch, form } = this.props;
    const { pageNo, pageSize } = this.state;
    const params = {
      pageNo,
      pageSize,
    };
    const values = form.getFieldsValue();
    const res = await dispatch({
      type: 'address/getContactAddress',
      payload: values,
    });
    if (res) {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    }
  };

  handleTabelChange = pagination => {
    this.setState(
      {
        pageNo: pagination.current,
      },
      this.getAddressList,
    );
  };

  handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, selectedRows);
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      addressList,
      tableLoading,
      addressTotal,
    } = this.props;
    const { pageNo, pageSize, selectedRowKeys } = this.state;
    const pagination = {
      total: addressTotal,
      current: pageNo,
      pageSize,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectionChange,
    };
    return (
      <div className={styles.address}>
        <p className={styles.title}>目的港送货地址</p>
        <Form>
          <Row gutter={20}>
            <Col span={22}>
              <Form.Item>{getFieldDecorator('portEndAddress')(<TextArea rows={4} />)}</Form.Item>
            </Col>

            <Col span={2}>
              <div style={{ textAlign: 'right' }}>
                <Button type="primary" size="large" block onClick={this.getAddressList}>
                  搜索
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        <div className={styles.tableMain}>
          <div className={styles.btns}>
            <button
              onClick={() => {
                this.handleActions('default');
              }}
            >
              设置默认
            </button>
            <button
              onClick={() => {
                this.handleActions('add');
              }}
            >
              新增
            </button>
            <button
              onClick={() => {
                this.handleActions('edit');
              }}
            >
              修改
            </button>
            <button
              onClick={() => {
                this.handleActions('cancal');
              }}
            >
              取消默认
            </button>
          </div>
          <StandardTable
            rowKey={'createTime'}
            size={'middle'}
            columns={this.columns}
            dataSource={addressList}
            loading={tableLoading}
            pagination={pagination}
            rowSelection={rowSelection}
            onChange={this.handleTabelChange}
            // scroll={{ x: 1400 }}
          />
        </div>
      </div>
    );
  }
}

export default Form.create()(index);
