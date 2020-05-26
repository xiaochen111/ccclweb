import React, { Component } from 'react';
import { Row, Col, Form, Input, Checkbox, Button, Modal } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { StateType } from './model';
// import { formItemLayout } from '@/utills/config';
import REGEX from '@/utils/regex';
import styles from './index.scss';
import md5 from 'js-md5';
import router from 'umi/router';

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
  modalVisible: boolean;
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


// 注册协议
const Protocols = (modalVisible, setModalVisible) => {
  return (<Modal
    wrapClassName={styles.wrapClassName}
    visible={modalVisible}
    title="注册协议"
    width={890}
    onCancel={() => setModalVisible(false)}
    footer={null}
  >
    <h3 className={styles.mainTitle}>《环球义达会员注册协议》</h3>
    <p className={styles.pTitle}>欢迎您进行注册成为环球义达会员，请您在注册时阅读以下交易条款：</p>
    <p className={styles.pTitle}>一、关于会员资格</p>
    <p className={styles.pTxt}>1、凡承认本网站会员注册条款的自然人均可成为环球义达会员。</p>
    <p className={styles.pTxt}>2、会员须提供详尽、准确的个人资料，且经常更新注册资料以符</p>
    <p className={styles.pTitle}>二、本网站会员注册条款的接受</p>
    <p className={styles.pTxt}>1、本网站运作权和解释权归www.ccc-l.com所有。</p>
    <p className={styles.pTxt}>2、用户要想成为本网站会员，享受本网站的服务，必须完全接受和严格遵守会员注册条款。如果用户注册成功，即表示用户同意接受本注册条款，成为本网站会员，享受本网站规定的服务。</p>
    <p className={styles.pTitle}>三、会员应遵守的重要条款：</p>
    <p className={styles.pTxt}>1、本网站提供的所有内容仅供会员个人使用。</p>
    <p className={styles.pTxt}>2、严禁传播网上电子书籍，一经发现，将追究其相关责任。</p>
    <p className={styles.pTxt}>(1)任何人注册成为www.ccc-l.com会员必须接受www.ccc-l.com网站使用条款，同时成为网站会员，拥有www.ccc-l.com会员所具有的权利，同时需承担www.ccc-l.com会员的义务。</p>
    <p className={styles.pTxt}>(2)会员应当自觉遵守：爱国、守法、自律、真实、文明的原则；会员应当崇尚网上道德规范，遵守《全国人民代表大会常务委员会关于维护互联网安全的决定》以及中华人民共和国其他各项相关法律、法规。</p>
    <p className={styles.pTxt}>(3)严禁发布任何含有违反国家法律、法规、危害国家安全、破坏民族团结及社会稳定内容的文章、言论，严禁发表任何包含种族、性别、宗教等歧视性内容，或者含有色情内容的文章、言论，不得对任何人进行侮辱、谩骂或其他任何形式的人身攻击。本站有权对会员的文章、言论进行审核，对违反上述禁止事项的文章、言论予以删除；情节严重者，本站将取消其注册用户资格。</p>
    <p className={styles.pTxt}>(4)会员应当自行承担一切因自身行为而直接或者间接导致的民事或刑事法律责任。</p>
    <p className={styles.pTxt}>(5)未经本站的授权或许可，任何会员不得借用本站的名义从事任何商业活动，也不得将本站作为从事商业活动的场所、平台或其他任何形式的媒介。禁止将本站用作从事各种非法活动的场所、平台或者其他任何形式的媒介。违反者若触犯法律，一切后果自负，本站不承担任何责任。</p>
    <p className={styles.pTxt}>(6)本站将保留修改规则、删除不良言论及不定期清理版面的权力。</p>
    <p className={styles.pTitle}>四、会员的帐号，密码和安全性</p>
    <p className={styles.pTxt}>用户一旦注册成功，即成为本网站的会员，将得到一个会员帐号和密码。</p>
    <p className={styles.pTitle}>五、用户隐私制度</p>
    <p className={styles.pTxt}>尊重会员个人隐私是环球义达的基本政策。我们不会在未经会员授权时公开、编辑或透露其注册资料，或将客户名单出售、出租或租借给第三方。但为便于提供服务，我们有时会将信息提供给为我们工作的其他公司，并与该类公司签署详细的保密协议以保证会员个人隐私的安全。</p>
    <p className={styles.pTitle}>六、会员有以下行为而导致帐户被取消，责任自负</p>
    <p className={styles.pTxt}>1、违反本网站注册条款。</p>
    <p className={styles.pTxt}>2、有损害他人的的行为。</p>
    <p className={styles.pTxt}>3、违反中国的法律、法规。</p>
    <p className={styles.pTitle}>七、知识产权与版权声明</p>
    <p className={styles.pTxt}>1、本网站中所有内容均受著作权法、版权法及其它相关法律的保护。任何人不能擅自复制、仿造这些内容。</p>
    <p className={styles.pTxt}>2、本网站提供的内容仅供会员个人使用，不得用于其它目的。</p>
    <p className={styles.pTitle}>八．法律声明及其它</p>
    <p className={styles.pTxt}>1、本服务条款受约于中华人民共和国国家法律，会员和本网站须一致同意服从中华人民共和国法院管辖。如发生会员注册条款与中华人民共和国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它条款则依旧保持对会员产生法律效力和影响。</p>
    <p className={styles.pTxt}>2、本网站中的帮助信息、栏目的相关介绍及注意事项为本条款的附件，作为解释本条款的具体依据。</p>
  </Modal>);
};

@connect(({ login, loading, global }) => ({
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
    modalVisible: false
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

    form.validateFields(async (err, values) => {
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

      const res = await dispatch({
        type: 'login/register',
        payload: params,
      });

      const userLogin =  { userName: selectedTab === 1 ? phone : email, password: md5(password) };

      this.autoLogin(res, userLogin);

    });
  };


  // 自动登录
  autoLogin = async (res:any, params:any) => {
    const { dispatch } = this.props;

    if (res){
      const loginRes = await dispatch({
        type: 'login/sendLoginInfo',
        payload: params,
      });

      if (loginRes){
        const getUseres = await  dispatch({
          type: 'global/getGlobalUserInfo',
        });

        if (getUseres){
          router.push('/home');
        }
      }
    }
  }

  sendPhoneRegistMsg = async () => {
    const { clickFlag } = this.state;

    if (!clickFlag) return;
    const { form, userLogin, dispatch } = this.props;
    // const { captchaKey } = userLogin.captchaImage;
    const values = form.getFieldsValue(['phone']);
    // const values = form.getFieldsValue(['phone', 'imgValue']);

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
      pageLoading } = this.props;

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

        {/* <Form.Item label="图形验证码">
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
        </Form.Item> */}

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
            rules: [
              { required: true, message: '请输入密码' },
              {
                min: 6,
                message: '密码长度不能小于6位',
              },
            ],
          })(
            <Input size="large" placeholder="不少于六位数" style={{ width: 370 }} type="password" />,
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
        <Form.Item label="公司名称">
          {getFieldDecorator('company', {
            getValueFromEvent: event => event.target.value.trim(),
            rules: [{ required: true, message: '公司名称' }],
          })(<Input size="large" placeholder="请输入公司名称" style={{ width: 370 }} />)}
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
      </Form>
    );
  };

  setModalVisible = (b:boolean) => {
    this.setState({
      modalVisible: b
    });
  }

  render() {
    const { tabs, selectedTab, modalVisible } = this.state;
    const {
      form: { getFieldDecorator },
      pageLoading,
    } = this.props;

    return (
      <div className={styles.registerContainer} onSubmit={this.handleSubmit}>
        {Protocols(modalVisible, this.setModalVisible)}
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
                initialValue: false,
                rules: [
                  {
                    validator: this.readXy,
                  },
                ],
              })(<Checkbox>请同意会员协议</Checkbox>)}

              <span className={styles.desc} onClick={() => this.setModalVisible(true)}>
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
