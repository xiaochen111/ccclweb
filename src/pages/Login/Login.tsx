import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { Form, Input, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import { StateType } from './model';
import { FormComponentProps } from 'antd/lib/form';
import { Link, router } from 'umi';
import md5 from 'js-md5';
import styles from './index.scss';
import REGEX from '@/utils/regex';
import { stringify } from 'qs';
import { GetPageQuery } from '../../utils/utils';
import { SetLocalStorage, GetLocalStorage, RemoveLocalStorage } from '../../utils/storage/local';

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

  state = {
    userName: '',
    password: ''
  }

  private toOrderParmse:any = {}
  private modifyLoginInfo:boolean = false; //是否修改过账号或密码

  componentDidMount(){
    const loginInfo = GetLocalStorage('loginInfo') || '';

    console.log(loginInfo);
    if (loginInfo){
      const { password, userName } = loginInfo;

      console.log(password, userName);
      this.setState({ password, userName });
    }
    if (Object.keys(GetPageQuery()).length){
      const { cbm, kgs, id } =  GetPageQuery();

      this.toOrderParmse = { cbm, kgs, id };
    }
  }

  handleSubmit = e => {
    e.persist();
    const { form, dispatch } = this.props;

    form.validateFields(async (err, values) => {
      if (err) return;

      const loginInfo = GetLocalStorage('loginInfo') || '';
      const { password: cookPassword, userName: cookUserName } = loginInfo;
      const { password: formPassword, userName: formUserName } = values;
      let params = loginInfo && (!this.modifyLoginInfo) ? { password: cookPassword, userName: cookUserName } : { password: md5(formPassword), userName: formUserName };

      if (Object.keys(this.toOrderParmse).length){
        params['toOrder'] = true;
      }
      const res = await  dispatch({
        type: 'login/sendLoginInfo',
        payload: params,
      });

      if (res){
        const { id, cbm, kgs } = this.toOrderParmse;

        this.rememberPw();
        if (params['toOrder']){
          router.push({
            pathname: `/door/place-order/${id}`,
            search: stringify({
              cbm, kgs
            }),
          });
        } else {
          router.push('/home');
        }
      }
    });
  };

  toRetrievePassword = () => {
    const { form } = this.props;
    const username = form.getFieldValue('userName');
    const params = {
      username,
      type: REGEX.EMAIL.test(username) ? 2 : 1
    };

    router.push({
      pathname: '/login/retrievePassword',
      search: stringify(params)
    });
  }


  rememberPw = () => {
    const { form } = this.props;
    const { remember, userName, password } = form.getFieldsValue();

    if (remember && this.modifyLoginInfo) {
      // 记住密码且修改过密码
      SetLocalStorage('loginInfo', { userName, password: md5(password) });
    } else if (!remember) {
      // 不记住密码
      RemoveLocalStorage('loginInfo');
    }
  }


  changeLoginInfo = e => {
    if (e.target.value.trim()){
      this.modifyLoginInfo = true;
    }
  }

  loginRender = () => {
    const { submitLoading, form } = this.props;
    const { password, userName } = this.state;
    const { getFieldDecorator } = form;

    console.log(password, userName);

    return (
      <Form>
        <Form.Item>
          {getFieldDecorator('userName', {
            initialValue: userName,
            rules: [{ required: true, message: '手机号/邮箱' }],
          })(
            <Input
              size="large"
              onChange={ e => this.changeLoginInfo(e) }
              prefix={<i className="iconfont iconicon_yonghu" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="手机号/邮箱"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            initialValue: password,
            rules: [
              { required: true, message: '请输入密码' },
            ],
          })(
            <Input
              size="large"
              prefix={<i className="iconfont iconicon_mima" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
          <span className={styles.loginFormForgot} onClick={this.toRetrievePassword}>忘记密码</span>
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
          <span className={styles.logo}>
            <img src={require('../../assets/img/login-logo.png')} alt="logo"/>
          </span>
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
