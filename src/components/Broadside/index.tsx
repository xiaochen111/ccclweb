import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import styles from './index.scss';

class Broadside extends PureComponent {
  state = {
    modal1Visible: false,
  };
  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
  }
  render() {
    const mask = require('../../assets/img/mask.png');

    return (
      <div className={styles.broadSideMain}>
        <ul className={styles.broadSide}>
          <li onClick={() => this.setModal1Visible(true)}>
            <div className={styles.point}></div>
            <i className="icon-gonggao iconfont"></i>
            <span>公告</span>
          </li>
          <li>
            <i className="icon-qq iconfont"></i>
            <span>客服</span>
          </li>
        </ul>
        <Modal
          wrapClassName={styles.wrapClassName}
          visible={this.state.modal1Visible}
          bodyStyle={{
            paddingTop: '130px',
            paddingBottom: '50px',
            borderRadius: '11px',
            overflow: 'hidden',
            background: `url(${mask}) top no-repeat`,
          }}
          width={890}
          onCancel={() => this.setModal1Visible(false)}
          footer={null}
        >
          <h3 className={styles.h3}>公告</h3>
          <p className={styles.contentPtxt}>
            一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶,一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理；普通货物仓储服务（不含危险化学品等需许可审批的项目）；装卸搬运；国际船舶……一般项目：航空国际货物运输代理；陆路国际货物运输代理……
          </p>
        </Modal>
      </div>
    );
  }
}

export default Broadside;
