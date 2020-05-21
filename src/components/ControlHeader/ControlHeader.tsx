import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import debounce from 'lodash/debounce';
import styles from './index.scss';
import RightContent, { GlobalHeaderRightProps } from './RightContent';
import { router } from 'umi';
import { RemoveAllStorage } from '@/utils/cache';

export interface GlobalControlHeaderProps extends GlobalHeaderRightProps {
  collapsed: boolean;
  onCollapse: (type: boolean) => void;
}

export default class GlobalControlHeader extends PureComponent<GlobalControlHeaderProps, any> {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  triggerResizeEvent = debounce(() => {
    const event = document.createEvent('HTMLEvents');

    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }, 500);

  toggle = () => {
    const { collapsed, onCollapse } = this.props;

    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  onMenuClick =(type) => {
    const { key } = type;

    if (key === 'mdify'){
      router.push('/control/system/modify');
    }
    if (key === 'logout'){
      RemoveAllStorage();
      router.push('/');
    }
  }

  render() {
    const { collapsed } = this.props;

    return (
      <div className={styles.header}>
        <span className={styles.trigger} onClick={this.toggle}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </span>
        <RightContent {...this.props} onMenuClick={this.onMenuClick}/>
      </div>
    );
  }
}
