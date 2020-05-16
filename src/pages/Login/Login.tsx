import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import { StateType } from './model';
import { FormComponentProps } from 'antd/lib/form';
import { Link } from 'umi';
import styles from './index.scss';

interface LoginProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitLoading: boolean;
}

@connect(({ login, loading }) => ({
  userLogin: login,
  submitLoading: loading.effects['login/sendLoginInfo'],
}))
export class LoginPage extends Component<LoginProps, any> {
  handleSubmit = e => {
    e.persist();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { userName, password } = values;

        dispatch({
          type: 'login/sendLoginInfo',
          payload: { userName, password },
        });
      }
    });
  };

  loginRender = () => {
    const { submitLoading, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住密码</Checkbox>)}
          <Link className={styles.loginFormForgot} to="/login/retrievePassword">
            忘记密码
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className={styles.submitBtn}
            loading={submitLoading}
          >
            登录
          </Button>
          <p className={styles.registerLink}>
            如您还没有账户请先 <Link to="/login/register">注册账号</Link>
          </p>
        </Form.Item>
      </Form>
    );
  };

  render() {
    return (
      <div className={styles.conatiner}>
        <div className={styles.middleLoginBox}>
          <span className={styles.logo}>logo</span>
          <p className={styles.title}>账户登录</p>
          <div className={styles.loginMain} onSubmit={this.handleSubmit}>
            {this.loginRender()}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(LoginPage);
