import React, { Component, FC } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

import styles from './index.scss';

// type PageProps = PageStateProps & UmiComponentProps;
// const NormalLoginForm:FC<PageProps> = () => {
//   const onFinish = values => {
//     console.log('Received values of form: ', values);
//   };

//   return (
//     <Form
//       name="normal_login"
//       className="login-form"
//       initialValues={{ remember: true }}
//       onFinish={onFinish}
//     >
//       <Form.Item
//         name="username"
//         rules={[{ required: true, message: 'Please input your Username!' }]}
//       >
//         <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
//       </Form.Item>
//       <Form.Item
//         name="password"
//         rules={[{ required: true, message: 'Please input your Password!' }]}
//       >
//         <Input
//           prefix={<LockOutlined className="site-form-item-icon" />}
//           type="password"
//           placeholder="Password"
//         />
//       </Form.Item>
//       <Form.Item>
//         <Form.Item name="remember" valuePropName="checked" noStyle>
//           <Checkbox>Remember me</Checkbox>
//         </Form.Item>

//         <a className="login-form-forgot" href="">
//           Forgot password
//         </a>
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit" className="login-form-button">
//           Log in
//         </Button>
//         Or <a href="">register now!</a>
//       </Form.Item>
//     </Form>
//   );
// };

export class LoginPage extends Component {
  render() {
    const a = 1;
    return (
      <div className={styles.conatiner}>
        <div className={styles.middleLoginBox}>
          <span className={styles.logo}>logo</span>
          <p className={styles.title}>账户登录{a}</p>
          <main>999</main>
        </div>
      </div>
    );
  }
}

export default LoginPage;
