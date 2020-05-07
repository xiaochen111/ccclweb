import React, { Component } from 'react';
import styles from './index.scss';

interface IProps {

}

class HomePage extends Component {
  render() {
    return (
      <main className={styles.conatiner}>
        <div className={styles.banner}>
          banner
        </div>
        <div className={styles.middleWrap}>
          1
        </div>
      </main>
    )
  }
}

export default HomePage; 
