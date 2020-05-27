import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { StateType } from './model';
// import { formItemLayout } from '@/utills/config';
import REGEX from '@/utils/regex';
import styles from './index.scss';
import { GetPageQuery } from '../../utils/utils';

interface RegisterProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  pageLoading: boolean;
}

interface RegisterState {
  readonly tabs: any[];
  readonly selectedTab: number;
  btnTxt: string;
  clickFlag: boolean;
  phoneUser:string;
  emailUser:string;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

@connect(({ login, loading }) => ({
  userLogin: login,
  pageLoading: loading.models['login'],
}))
class RegisterPage extends Component<RegisterProps, RegisterState> {
  state = {
    tabs: [
      { label: '手机找回密码', value: 1 },
      { label: '邮箱找回密码', value: 2 },
    ],
    selectedTab: 1,
    btnTxt: '获取验证码',
    clickFlag: true,
    phoneUser: '',
    emailUser: ''
  };

  timer: any;

  componentDidMount() {
    this.init();
    this.stopCountdown();
    const { username, type } = GetPageQuery();

    this.setState({
      selectedTab: type * 1,
      phoneUser: type === '1' ? username : '',
      emailUser: type === '2' ? username : ''
    });
  }

  init = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'login/getCaptchImage',
    });
    // this.setCountdown();
  };

  handleChangeTab = (tab: any) => {
    this.setState({
      selectedTab: tab,
      btnTxt: '获取验证码',
      clickFlag: true,
    });
    const { form } = this.props;

    form.resetFields();
  };

  handleSubmit = (e: any) => {
    e.persist();
    const { selectedTab } = this.state;
    const { form, dispatch } = this.props;

    form.validateFields((err, values) => {
      if (err) return;
      const { email, password, phone, veriyCode } = values;

      const params = {
        userName: selectedTab === 1 ? phone : email,
        password,
        veriyCode,
      };

      dispatch({
        type: 'login/resetPassword',
        payload: params,
      });
    });
  };

  sendPhoneRegistMsg = async () => {
    const { clickFlag } = this.state;

    if (!clickFlag) return;
    const { form, dispatch } = this.props;
    // const { captchaKey } = userLogin.captchaImage;
    const values = form.getFieldsValue(['phone']);

    if (!values.phone.trim()) {
      form.setFields({
        phone: {
          value: values.phone,
          errors: [new Error('手机号不能为空')],
        },
      });
      return;
    }
    if (!REGEX.MOBILE.test(values.phone.trim())) {
      form.setFields({
        phone: {
          value: values.phone,
          errors: [new Error('手机号格式不正确')],
        },
      });
      return;
    }
    // if (!values.imgValue || !values.imgValue.trim()) {
    //   form.setFields({
    //     imgValue: {
    //       value: values.imgValue,
    //       errors: [new Error('图片不能为空')],
    //     },
    //   });
    //   return;
    // }
    // values.imgKey = captchaKey;
    const res = await dispatch({
      type: 'login/getPhoneRepasswordMsg',
      payload: values,
    });

    if (res) {
      this.setCountdown();
    }
  };

  sendEmailRegistMsg = async () => {
    const { clickFlag } = this.state;

    if (!clickFlag) return;
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue(['email']);

    if (!values.email) {
      form.setFields({
        email: {
          value: values.email,
          errors: [new Error('邮箱不能为空')],
        },
      });
      return;
    }
    if (!REGEX.EMAIL.test(values.email.trim())) {
      form.setFields({
        email: {
          value: values.email,
          errors: [new Error('邮箱号格式不正确')],
        },
      });
      return;
    }

    let res = await dispatch({
      type: 'login/getEmailRepasswordMsg',
      payload: values,
    });

    if (res) {
      this.setCountdown();
    }
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一样');
    } else {
      callback();
    }
  };

  setCountdown = () => {
    let num = 60;

    this.timer = setInterval(() => {
      if (num <= 0) {
        this.stopCountdown();
        return;
      }
      this.setState({
        btnTxt: `${--num}秒后重试`,
        clickFlag: false,
      });
    }, 1000);
  };

  stopCountdown = () => {
    clearInterval(this.timer);
    this.setState({
      btnTxt: '获取验证码',
      clickFlag: true,
    });
  };

  renderHtml = selectedTab => {
    const {
      form: { getFieldDecorator },
      pageLoading,
    } = this.props;

    const { btnTxt, phoneUser, emailUser } = this.state;

    return (
      <Form {...formItemLayout} hideRequiredMark>
        {selectedTab === 1 ? (
          <Form.Item label="手机号(必填)">
            {getFieldDecorator('phone', {
              getValueFromEvent: event => event.target.value.trim(),
              initialValue: phoneUser,
              rules: [
                { required: true, message: '请输入手机号' },
                { pattern: REGEX.MOBILE, message: '手机号格式不正确' },
              ],
            })(<Input size="large" placeholder="请输入手机号" style={{ width: 370 }} />)}
          </Form.Item>
        ) : (
          <Form.Item label="邮箱(必填)">
            {getFieldDecorator('email', {
              initialValue: emailUser,
              getValueFromEvent: event => event.target.value.trim(),
              rules: [
                { required: true, message: '请输入邮箱' },
                { pattern: REGEX.EMAIL, message: '邮箱格式不正确' },
              ],
            })(<Input size="large" placeholder="请输入邮箱" style={{ width: 370 }} />)}
          </Form.Item>
        )}



        <Form.Item label={`${selectedTab === 1 ? '手机' : '邮箱'}验证码(必填)`}>
          <Row gutter={10}>
            <Col span={15}>
              {getFieldDecorator('veriyCode', {
                getValueFromEvent: event => event.target.value.trim(),
                rules: [{ required: true, message: '请输入验证码' }],
              })(<Input size="large" placeholder="请输入验证码" width={234} />)}
            </Col>
            <Col span={9}>
              <Button
                size="large"
                block
                style={{ width: 136 }}
                onClick={selectedTab === 1 ? this.sendPhoneRegistMsg : this.sendEmailRegistMsg}
                loading={pageLoading}
              >
                {btnTxt}
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="密码(必填)">
          {getFieldDecorator('password', {
            getValueFromEvent: event => event.target.value.trim(),
            rules: [
              { required: true, message: '请输入密码' },
              {
                min: 6,
                message: '密码长度不能小于6位',
              },
            ],
          })(
            <Input size="large" placeholder="请输入密码" style={{ width: 370 }} type="password" />,
          )}
        </Form.Item>
        <Form.Item label="再次输入密码(必填)">
          {getFieldDecorator('password1', {
            getValueFromEvent: event => event.target.value.trim(),
            rules: [
              { required: true, message: '请再次输入密码' },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <Input
              size="large"
              placeholder="请再次输入密码"
              style={{ width: 370 }}
              type="password"
            />,
          )}
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { tabs, selectedTab } = this.state;
    const { pageLoading } = this.props;

    return (
      <div className={styles.registerContainer} onSubmit={this.handleSubmit}>
        <div className={styles.registerContent}>
          <ul className={styles.registerTabs}>
            {tabs.map(item => (
              <li
                key={item.value}
                className={selectedTab === item.value ? styles.activeTab : ''}
                onClick={() => this.handleChangeTab(item.value)}
              >
                {item.label}
              </li>
            ))}
          </ul>
          {this.renderHtml(selectedTab)}
          <Form>
            <Form.Item {...tailFormItemLayout}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={pageLoading}
                className={styles.submitBtn}
              >
                确定
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(RegisterPage);
