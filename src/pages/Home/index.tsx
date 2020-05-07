import React, { Component } from 'react';
import styles from './index.scss';

interface IProps {}

class HomePage extends Component {
  render() {
    return (
      <div className={styles.conatiner}>
        <div className={styles.banner}>banner</div>
        <div className={styles.middleWrap}>1</div>
      </div>
    );
  }
}

export default HomePage;
