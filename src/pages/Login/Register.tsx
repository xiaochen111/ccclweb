import React, { Component } from 'react';
import { Row, Col, Form, Input, Checkbox, Button } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { StateType } from './model';
// import { formItemLayout } from '@/utills/config';
import REGEX from '@/utils/regex';
import styles from './index.scss';

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
      { label: '手机注册', value: 1 },
      { label: '邮箱注册', value: 2 },
    ],
    selectedTab: 1,
    btnTxt: '获取验证码',
    clickFlag: true,
  };

  timer: any;

  componentDidMount() {
    this.init();
    this.stopCountdown();
  }

  init = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'login/getCaptchImage',
    });
  };

  // 换图片验证码
  changeCodeImg = () => {
    const { dispatch } = this.props;

    console.log(this.props);
    dispatch({
      type: 'login/getCaptchImage',
    });
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
      const { company, email, password, phone, veriyCode } = values;
      const params = {
        source: '1',
        userName: selectedTab === 1 ? phone : email,
        company,
        email,
        password,
        phone,
        veriyCode,
      };

      dispatch({
        type: 'login/register',
        payload: params,
      });
    });
  };

  sendPhoneRegistMsg = async () => {
    const { clickFlag } = this.state;

    if (!clickFlag) return;
    const { form, userLogin, dispatch } = this.props;
    const { captchaKey } = userLogin.captchaImage;
    const values = form.getFieldsValue(['phone', 'imgValue']);

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
    if (!values.imgValue || !values.imgValue.trim()) {
      form.setFields({
        imgValue: {
          value: values.imgValue,
          errors: [new Error('图片不能为空')],
        },
      });
      return;
    }
    values.imgKey = captchaKey;
    let res = await dispatch({
      type: 'login/getPhoneRegiseMsg',
      payload: values,
    });

    if (res) {
      this.setCountdown();
    }
  };

  sendEmailRegistMsg = async () => {
    const { clickFlag } = this.state;

    if (!clickFlag) return;
    const { form, userLogin, dispatch } = this.props;
    const { captchaKey } = userLogin.captchaImage;
    const values = form.getFieldsValue(['email', 'imgValue']);

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
    if (!values.imgValue || !values.imgValue.trim()) {
      form.setFields({
        imgValue: {
          value: values.imgValue,
          errors: [new Error('图片不能为空')],
        },
      });
      return;
    }
    values.imgKey = captchaKey;
    let res = await dispatch({
      type: 'login/getEmailRegiseMsg',
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

  readXy = (rule, value, callback) => {
    if (!value) {
      callback('请阅读协议');
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
      userLogin,
      pageLoading } = this.props;

    const { captchaImage } = userLogin;
    const { btnTxt } = this.state;

    return (
      <Form {...formItemLayout}>
        {selectedTab === 1 ? (
          <Form.Item label="手机号">
            {getFieldDecorator('phone', {
              getValueFromEvent: event => event.target.value.trim(),
              initialValue: '',
              rules: [
                { required: true, message: '请输入手机号' },
                { pattern: REGEX.MOBILE, message: '手机号格式不正确' },
              ],
            })(<Input size="large" placeholder="请输入手机号" style={{ width: 370 }} />)}
          </Form.Item>
        ) : (
          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [
                { required: true, message: '请输入邮箱' },
                { pattern: REGEX.EMAIL, message: '邮箱号格式不正确' },
              ],
            })(<Input size="large" placeholder="请输入邮箱" style={{ width: 370 }} />)}
          </Form.Item>
        )}

        <Form.Item label="图形验证码">
          <Row gutter={10}>
            <Col span={15}>
              {getFieldDecorator('imgValue', {
                rules: [{ required: true, message: '请输入图形验证码' }],
              })(<Input size="large" placeholder="请输入验证码" width={234} />)}
            </Col>
            <Col span={9}>
              <div className={styles.imgCode}>
                <img src={captchaImage.imgBase64} alt="" width="80" />
                <span onClick={this.changeCodeImg}>换一张</span>
              </div>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label={`${selectedTab === 1 ? '手机' : '邮箱'}验证码`}>
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

        <Form.Item label="密码">
          {getFieldDecorator('password', {
            getValueFromEvent: event => event.target.value.trim(),
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input size="large" placeholder="请输入密码" style={{ width: 370 }} type="password" />,
          )}
        </Form.Item>
        <Form.Item label="再次输入密码">
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
        {selectedTab === 1 ? (
          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [{ pattern: REGEX.EMAIL, message: '邮箱号格式不正确' }],
            })(<Input size="large" placeholder="请输入邮箱" style={{ width: 370 }} />)}
          </Form.Item>
        ) : (
          <Form.Item label="手机号">
            {getFieldDecorator('phone', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [{ pattern: REGEX.MOBILE, message: '手机号格式不正确' }],
            })(<Input size="large" placeholder="请输入手机号" style={{ width: 370 }} />)}
          </Form.Item>
        )}
        <Form.Item label="公司名称">
          {getFieldDecorator('company', {
            getValueFromEvent: event => event.target.value.trim(),
            rules: [{ required: true, message: '公司名称' }],
          })(<Input size="large" placeholder="请输入公司名称" style={{ width: 370 }} />)}
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { tabs, selectedTab } = this.state;
    const {
      form: { getFieldDecorator },
      pageLoading,
    } = this.props;

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
              {getFieldDecorator('aa', {
                valuePropName: 'checked',
                initialValue: true,
                rules: [
                  {
                    validator: this.readXy,
                  },
                ],
              })(<Checkbox>请同意会员协议</Checkbox>)}

              <span className={styles.desc}>
                <strong>《环球义达用户协议》</strong>
              </span>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={pageLoading}
                className={styles.submitBtn}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(RegisterPage);
