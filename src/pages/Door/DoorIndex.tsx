import React, { PureComponent } from 'react';
import PageWrapper from '@/components/PageWrapper';
import SearchCondition from '@/components/SearchCondition';
import styles from './DoorIndex.scss';

export class doorIndex extends PureComponent {
  handleSubmit = () => {
    console.log('111111111');
  };
  render() {
    return (
      <PageWrapper>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <p className={styles.title}>拼箱门到门</p>
            <SearchCondition submit={this.handleSubmit} />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default doorIndex;
