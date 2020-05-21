import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { PageHeader, Button, Form, Input } from 'antd';
import styles from './index.scss';

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
    sm: { span: 8 },
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
  submitLoading: loading.effects['system/doUpdateUserPwd'],
}))
export class modify extends Component<IProps, any> {
  state = {
    showIntension: false,
    intension: 0, //强度
  };

  modifyPw = () => {
    const { form, dispatch } = this.props;

    form.validateFields((err, values) => {
      if (err) return;
      const { oldPwd, newPwd } = values;

      dispatch({
        type: 'system/doUpdateUserPwd',
        payload: { oldPwd, newPwd },
      });
    });
  };

  changePw = e => {
    const value = e.target.value;
    const flag = value.length >= 6;

    this.setState({
      showIntension: flag,
    });

    if (!flag) return;
    // https://blog.csdn.net/shi851051279/article/details/79992228 判断强弱参考
    const strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g'); //强
    const mediumRegex = new RegExp(
      '^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
      'g',
    ); //中
    const enoughRegex = new RegExp('(?=.{6,}).*', 'g'); //弱
    const regexList = [strongRegex, mediumRegex, enoughRegex];

    for (let i = 0, len = regexList.length; i < len; i++) {
      if (regexList[i].test(value)) {
        this.setState({
          intension: i,
        });
        break;
      }
    }
  };

  intensionRender = () => {
    const { intension } = this.state;
    const intensionTxt = {
      0: '强',
      1: '中',
      2: '弱',
    };

    return (
      <div className={styles.intension}>
        <span className={intension <= 2 ? `${styles.spanAct}` : ''}></span>
        <span className={intension <= 1 ? `${styles.spanAct}` : ''}></span>
        <span className={intension <= 0 ? `${styles.spanAct}` : ''}></span>
        密码强度{intensionTxt[intension]}
      </div>
    );
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('newPwd')) {
      callback('两次输入的密码不一样');
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitLoading,
    } = this.props;

    const { showIntension } = this.state;

    return (
      <div>
        <PageHeader title="安全设置 / 修改密码" />
        <div className={styles.main}>
          <Form {...formItemLayout}>
            <Form.Item label="请先输入旧密码 :">
              {getFieldDecorator('oldPwd', {
                rules: [
                  {
                    required: true,
                    message: '请先输入旧密码',
                  },
                  {
                    min: 6,
                    message: '密码长度不能小于6位',
                  },
                ],
              })(<Input type="password" />)}
            </Form.Item>
            <Form.Item label="请设置密码 :" extra={showIntension ? this.intensionRender() : ''}>
              {getFieldDecorator('newPwd', {
                rules: [
                  {
                    required: true,
                    message: '请设置密码',
                  },
                  {
                    min: 6,
                    message: '密码长度不能小于6位',
                  },
                ],
              })(
                <Input type="password" onChange={(e) => { this.changePw(e); }}/>,
              )}
            </Form.Item>
            <Form.Item label="再次输入密码 :">
              {getFieldDecorator('newPwd1', {
                rules: [
                  {
                    required: true,
                    message: '再次输入密码',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input type="password" />)}
            </Form.Item>
          </Form>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" loading={submitLoading} onClick={this.modifyPw}>
              保存
            </Button>
          </Form.Item>
        </div>
      </div>
    );
  }
}

export default Form.create()(modify);
