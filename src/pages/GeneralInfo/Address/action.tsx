import React, { Component } from 'react';
import { Form, Input, Button, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import { StateType } from '../../../models/model';
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
    console.log(this.state.id);
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
    history.go(-1);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { flag, portEndAddress, contactDefault } = this.state;
    return (
      <div className={styles.address}>
        <p className={styles.title}>
          <Link to="/control/general/adress">目的港送货地址</Link>/{flag == '1' ? '新增' : '修改'}
        </p>
        <div className={styles.editMain}>
          <Form {...formItemLayout}>
            <Form.Item label="目的港送货地址">
              {getFieldDecorator('portEndAddress', {
                initialValue: portEndAddress,
                rules: [
                  {
                    required: true,
                    message: '请输入目的港送货地址',
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
                {flag == '1' ? '新增' : '修改'}
              </Button>
              <Button onClick={this.goback} style={{ marginLeft: '20px' }}>
                返回
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(action);
