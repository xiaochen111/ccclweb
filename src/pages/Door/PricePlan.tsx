import React, { Component } from 'react';
import styles from './PricePlan.scss';
import { connect } from 'dva';
import H from 'history';
import { Dispatch, AnyAction } from 'redux';
import { StateType } from '@/models/door';
import PageWrapper from '@/components/PageWrapper';
import PricePlanMainPage from './PricePlanMain';

interface PricePlanPageProps extends StateType {
  dispatch: Dispatch<AnyAction>;
  location: H.Location;
}

@connect(({ door }) => ({
  result: door.result,
  totalCount: door.totalCount,
}))
export class PricePlan extends Component<PricePlanPageProps, any> {
  render() {
    const { dispatch, result, totalCount } = this.props;
    return (
      <PageWrapper>
        <div className={styles.container}>
          <PricePlanMainPage dispatch={dispatch} result={result} totalCount={totalCount} />
        </div>
      </PageWrapper>
    );
  }
}

export default PricePlan;
