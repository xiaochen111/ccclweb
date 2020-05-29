import React, { PureComponent } from 'react';
import { PageHeader, Button } from 'antd';
import styles from './index.scss';
import { router } from 'umi';

const imgIcon = require('../../../assets/img/icon-xiugaimima.png');

class SecuritySettingPage extends PureComponent {
  goModify = () => {
    router.push('/control/system/security-setting/modify');
  };

  render() {
    return (
      <div>
        <PageHeader title="安全设置" />
        <div className={styles.main}>
          <p className={styles.title}>登录密码管理</p>
          <div className={styles.contxt}>
            <img src={imgIcon} alt="" />
            <p>请设置包含数字或字母且长度在8-16位的密码。</p>
            <Button type="primary" onClick={this.goModify}>
              修改密码
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SecuritySettingPage;
