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
  submitLoading: boolean;
}

@connect(({ door, loading }) => ({
  result: door.result,
  totalCount: door.totalCount,
  submitLoading: loading.effects['door/getLclList'],
}))
export class PricePlan extends Component<PricePlanPageProps, any> {
  render() {
    const { dispatch, result, totalCount, submitLoading } = this.props;
    const paramProps = {
      dispatch,
      result,
      totalCount,
      submitLoading,
    };
    return (
      <PageWrapper>
        <div className={styles.container}>
          <PricePlanMainPage {...paramProps} />
        </div>
      </PageWrapper>
    );
  }
}

export default PricePlan;
