import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import PageWrapper from '@/components/PageWrapper';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import router from 'umi/router';
import { StateType } from '@/models/door';
import styles from './DoorIndex.scss';

interface IProps extends StateType {
  dispatch: Dispatch<AnyAction>;
  countryDropList: any[];
}

@connect(({ door, global }) => ({
  lclList: door.lclList,
  totalCount: door.totalCount,
  countryDropList: global.countryDropList,
}))
export class doorIndex extends PureComponent<IProps, any> {
  handleSubmit = () => {
    router.push('/door/price-plan');
  };
  render() {
    const { countryDropList } = this.props;
    return (
      <PageWrapper>
        <div className={styles.container}>
          <div className={styles.mainContainer}>
            <p className={styles.title}>拼箱门到门</p>
            <SearchCondition
              submit={this.handleSubmit}
              hideTitle
              isMultiRow={searchType.doorIndex}
              countryDropList={countryDropList}
            />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default doorIndex;
