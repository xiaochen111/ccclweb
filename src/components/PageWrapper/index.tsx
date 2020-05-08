import React, { Component } from 'react';
import styles from './index.scss';

export interface PageWrapperProps {
  wrapperClassName?: string;
}

class PageWrapper extends Component<PageWrapperProps, any> {
  render() {
    const { wrapperClassName, children } = this.props;

    return (
      <div className={`${styles.container} ${wrapperClassName}`}>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
}

export default PageWrapper;
