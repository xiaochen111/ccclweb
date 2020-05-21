import React, { PureComponent } from 'react';
import { Form, PageHeader, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import styles from './index.scss';
import { GetAccountInfo } from '../../../utils/cache';

interface IProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  submitLoading: boolean;
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

@connect(({ system, loading }) => ({
  submitLoading: loading.effects['system/doUpdateWebUserInfo'],
}))
class SystemMemberPage extends PureComponent<IProps, any> {
  state = {
    userName: '',
    companyName: '',
    name: '',
    phone: '',
    email: '',
    bussinessNo: '',
    companyAddress: '',
  };

  componentDidMount() {
    this.initUserInfo();
  }

  initUserInfo = () => {
    const {
      userName,
      companyName,
      name,
      phone,
      email,
      bussinessNo,
      companyAddress,
    } = GetAccountInfo();

    this.setState({
      userName,
      companyName,
      name,
      phone,
      email,
      bussinessNo,
      companyAddress,
    });
  };

  saveUserInfo = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: 'system/doUpdateWebUserInfo',
        payload: values,
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitLoading,
    } = this.props;
    const { companyName, name, phone, email, bussinessNo, companyAddress } = this.state;

    return (
      <div>
        <PageHeader title="会员信息" />
        <div className={styles.main}>
          <Form {...formItemLayout}>
            <Form.Item label="用户名">
              {getFieldDecorator('userName', {
                initialValue: '账号名',
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="公司名称">
              {getFieldDecorator('companyName', {
                initialValue: companyName,
                rules: [
                  {
                    required: true,
                    message: '请输入公司名称',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="手机号码">
              {getFieldDecorator('phone', {
                initialValue: phone,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                initialValue: email,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="商家摊位号">
              {getFieldDecorator('bussinessNo', {
                initialValue: bussinessNo,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="公司地址">
              {getFieldDecorator('companyAddress', {
                initialValue: companyAddress,
              })(<Input />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" loading={submitLoading} onClick={this.saveUserInfo}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(SystemMemberPage);
