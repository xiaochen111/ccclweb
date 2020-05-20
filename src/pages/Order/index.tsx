import React, { PureComponent } from 'react';
import styles from './index.scss';
class OrderPage extends PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <header>
          <h4>我的订单</h4>
        </header>
      </div>
    );
  }
}

export default OrderPage;
