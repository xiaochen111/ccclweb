import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Input, Checkbox, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
// import { formItemLayout } from '@/utills/config';
import REGEX from '@/utills/regex';
import styles from './index.scss';

interface RegisterProps extends FormComponentProps {

}

interface RegisterState {
  readonly tabs: any[];
  readonly selectedTab: number;
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

class RegisterPage extends Component<RegisterProps, RegisterState> {
  state = {
    tabs: [
      { label: '手机注册', value: 1 },
      { label: '邮箱注册', value: 2 },
    ],
    selectedTab: 1
  }

  handleChangeTab = (tab: any) => {
    this.setState({
      selectedTab: tab
    })
  }

  handleSubmit = (e: any) => {
    e.persist();

    const { form } = this.props;

    form.validateFields((err, values) => {
      if(err) return;
    })

  }

  renderPhone = () => {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form {...formItemLayout}>
        <Form.Item label='手机号'>
          {
            getFieldDecorator('phoneNum', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [
                { required: true, message: '请输入手机号' },
                { pattern: REGEX.MOBILE, message: '手机号格式不正确' }
              ], 
            })(<Input size="large" placeholder="请输入手机号" style={{ width: 370 }}/>)
          }
        </Form.Item>
        <Form.Item label="图形验证码">
          <Row gutter={10}>
            <Col span={16}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入图形验证码' }],
              })(<Input size="large" placeholder='请输入验证码' width={234}/>)}
            </Col>
            <Col span={8}>
              <Button size="large" block style={{ width: 136 }}>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="手机验证码">
          <Row gutter={10}>
            <Col span={16}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入验证码' }],
              })(<Input size="large" placeholder='请输入验证码' width={234}/>)}
            </Col>
            <Col span={8}>
              <Button size="large" block style={{ width: 136 }}>获取验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label='密码'>
          {
            getFieldDecorator('phoneNum', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [
                { required: true, message: '请输入密码' },
              ], 
            })(<Input size="large" placeholder="请输入密码" style={{ width: 370 }}/>)
          }
        </Form.Item>
        <Form.Item label='再次输入密码'>
          {
            getFieldDecorator('phoneNum', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [{ required: true, message: '请再次输入密码' }], 
            })(<Input size="large" placeholder="请再次输入密码" style={{ width: 370 }}/>)
          }
        </Form.Item>
        <Form.Item label='邮箱地址'>
          {
            getFieldDecorator('phoneNum')
            (<Input size="large" placeholder="请输入邮箱" style={{ width: 370 }}/>)
          }
        </Form.Item>
        <Form.Item label='公司名称'>
          {
            getFieldDecorator('phoneNum')
            (<Input size="large" placeholder="请输入公司名称" style={{ width: 370 }}/>)
          }
        </Form.Item>
      </Form>
    )
  }

  renderEmail = () => {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form {...formItemLayout}>
        <Form.Item label='邮箱'>
          {
            getFieldDecorator('phoneNum', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [
                { required: true, message: '请输入邮箱' },
                { pattern: REGEX.MOBILE, message: '手机号格式不正确' }
              ], 
            })(<Input size="large" placeholder="请输入手机号" style={{ width: 370 }}/>)
          }
        </Form.Item>
        <Form.Item label="图形验证码">
          <Row gutter={10}>
            <Col span={16}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入图形验证码' }],
              })(<Input size="large" placeholder='请输入验证码' width={234}/>)}
            </Col>
            <Col span={8}>
              <Button size="large" block style={{ width: 136 }}>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="邮箱验证码">
          <Row gutter={10}>
            <Col span={16}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入验证码' }],
              })(<Input size="large" placeholder='请输入验证码' width={234}/>)}
            </Col>
            <Col span={8}>
              <Button size="large" block style={{ width: 136 }}>获取验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label='密码'>
          {
            getFieldDecorator('phoneNum', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [
                { required: true, message: '请输入密码' },
              ], 
            })(<Input size="large" placeholder="请输入密码" style={{ width: 370 }}/>)
          }
        </Form.Item>
        <Form.Item label='再次输入密码'>
          {
            getFieldDecorator('phoneNum', {
              getValueFromEvent: event => event.target.value.trim(),
              rules: [{ required: true, message: '请再次输入密码' }], 
            })(<Input size="large" placeholder="请再次输入密码" style={{ width: 370 }}/>)
          }
        </Form.Item>
        <Form.Item label='公司名称'>
          {
            getFieldDecorator('phoneNum')
            (<Input size="large" placeholder="请输入公司名称" style={{ width: 370 }}/>)
          }
        </Form.Item>
      </Form>
    )
  }

  render() {
    const { tabs, selectedTab } = this.state;
    const { form: { getFieldDecorator } } = this.props;

    return (
      <div className={styles.registerContainer} onSubmit={this.handleSubmit}>
        <div className={styles.registerContent}>
          <ul className={styles.registerTabs}>
            {
              tabs.map(item => (
                <li 
                  key={item.value}
                  className={selectedTab === item.value ? styles.activeTab : ''}
                  onClick={() => this.handleChangeTab(item.value)}
                >
                  {item.label}
                </li>
              ))
            }
          </ul>

          {
            selectedTab === 1 ?
            this.renderPhone() : this.renderEmail()
          }
          <Form>
            <Form.Item {...tailFormItemLayout}>
              {
                getFieldDecorator('phoneNum', {
                  rules: [
                    { required: true, message: '请同意会员协议' },
                  ], 
                })(
                  <Checkbox checked={true} />
              )}
              <span className={styles.desc}>
                <span className={styles.left}>已阅读会员协议</span>
                <strong>《环球义达用户协议》</strong>
              </span>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button 
                size="large" 
                type="primary" 
                htmlType="submit" 
                // loading={loading}
                className={styles.submitBtn}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default  Form.create()(RegisterPage);