import React, { Component } from 'react';
import { Button  } from 'antd';
import styles from './index.scss';

interface IProps {

}

const SpecialOfferItem = ()=>{
  return (
      <div className={styles.SpecialOfferItem}>
        <div className={styles.picPort}>
          <p className={styles.ports}>义乌 — 俄罗斯</p>
        </div>
        <div className={styles.bottomPart}>
            <ul>
              <li>
                <p>CBM</p>
                <p>$400</p>
              </li>
              <li>
                <p>CBM</p>
                <p>$400</p>
              </li>
            </ul>
            <Button type="primary">立即抢购</Button>
        </div>
      </div>
  )
}


const ServiceAdvantages = () => {
  return (
    <div className={styles.serviceMain}></div>
  )
}


class HomePage extends Component {
  render() {
    const arrList = [1,1,1,1,1,1,1,1];
    return (
      <main className={styles.conatiner}>
        <div className={styles.banner}>
          banner
        </div>
        <p className={styles.title}>专线特价区</p>
        <div className={`${styles.middleWrap} ${styles.clearfloat}`}>
          {
            arrList.map((item, index) => <SpecialOfferItem key={index}/>)
          }
        </div>
        <ServiceAdvantages/>
      </main>
    )
  }
}

export default HomePage; 
