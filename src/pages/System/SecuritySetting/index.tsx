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
            <p>安全性高的密码可以使账户号更安全.建议您定期更换密码,且设置一个包含数字和字母，且长度超过6位以上的密码</p>
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
