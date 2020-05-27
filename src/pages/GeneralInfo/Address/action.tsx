import React, { Component } from 'react';
import { Form, Input, Button, Switch, PageHeader } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import { StateType } from '@/models/address';
import { connect } from 'dva';
import styles from './index.scss';
import { Link } from 'umi';
import router from 'umi/router';
import { GetPageQuery } from '@/utils/utils';

const { TextArea } = Input;

interface Iprps extends FormComponentProps, StateType {
  tableLoading: boolean;
  match?: any;
  dispatch: Dispatch<AnyAction>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

@connect(({ address, Loading }) => ({
  addressList: address.addressList,
  addressTotal: address.addressTotal,
  tableLoading: Loading,
}))
export class action extends Component<Iprps, any> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
    flag: '1',
    portEndAddress: '',
    contactDefault: false,
  };

  componentDidMount() {
    const urlParams = GetPageQuery();

    console.log(urlParams);
    const { flag, portEndAddress, contactDefault } = urlParams;

    this.setState({
      flag,
      portEndAddress,
      contactDefault: Boolean(contactDefault * 1),
    });
  }

  saveContactAddress = () => {
    const { form, dispatch } = this.props;
    const { flag, id } = this.state;

    form.validateFields(async (err, values) => {
      if (err) return;
      console.log(values);
      values.contactDefault = Number(values.contactDefault);
      values.lclContactId = id;

      const dispathType =
        flag === '1' ? 'address/doSaveContactAddress' : 'address/doUpdateContactAddress';

      const res = await dispatch({
        type: dispathType,
        payload: values,
      });

      if (res) {
        router.push('/control/general/adress');
      }
    });
  };

  goback = () => {
    window.history.go(-1);
  };


  topFormRender=() => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {  portEndAddress, contactDefault, flag } = this.state;

    return (
      <div className={styles.editMain}>
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label="目的地送货地址（必填）">
            {getFieldDecorator('portEndAddress', {
              initialValue: portEndAddress,
              rules: [
                {
                  max: 250,
                  message: '文字不能超过250字',
                },
                {
                  required: true,
                  message: '请输入目的地送货地址',
                },
              ],
            })(<TextArea rows={4} />)}
          </Form.Item>
          <Form.Item label="默认">
            {getFieldDecorator('contactDefault', {
              valuePropName: 'checked',
              initialValue: contactDefault,
            })(<Switch />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" onClick={this.saveContactAddress}>
              {flag === '1' ? '新增' : '修改'}
            </Button>
            <Button onClick={this.goback} style={{ marginLeft: '20px' }}>
                返回
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    const { flag } = this.state;

    return (
      <div className={styles.address}>
        <PageHeader title={<><Link to="/control/general/adress" style={{ color: '#333' }}>目的地送货地址</Link>/{flag === '1' ? '新增' : '修改'}</>}
          footer={this.topFormRender()}/>
      </div>
    );
  }
}

export default Form.create()(action);
