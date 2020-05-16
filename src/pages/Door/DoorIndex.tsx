import React, { PureComponent } from 'react';

import PageWrapper from '@/components/PageWrapper';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import router from 'umi/router';
import styles from './DoorIndex.scss';

export class doorIndex extends PureComponent {
  handleSubmit = () => {
    // console.log('111111111');
    router.push('/door/price-plan');
  };
  render() {
    // console.log(this.props);
    // const { location } = this.props;
    // const { search } = location;
    // console.log(search);
    return (
      <PageWrapper>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <p className={styles.title}>拼箱门到门</p>
            <SearchCondition submit={this.handleSubmit} isMultiRow={searchType.doorIndex} />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default doorIndex;
