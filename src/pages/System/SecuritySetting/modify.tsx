import React, { Component } from 'react';
import { PageHeader, Button } from 'antd';
import styles from './index.scss';

export class modify extends Component {
  render() {
    return (
      <div>
        <PageHeader title="安全设置 / 修改密码" />
        <div className={styles.main}></div>
      </div>
    );
  }
}

export default modify;
