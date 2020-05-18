import React, { Component } from 'react';
import { connect } from 'dva';
import H from 'history';
import { Dispatch, AnyAction } from 'redux';
import { StateType } from '@/models/door';
import PricePlanMainPage from '@/pages/Door/PricePlanMain';

import styles from './index.scss';

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
export class Mdoor extends Component<PricePlanPageProps, any> {
  render() {
    const { dispatch, result, totalCount, submitLoading } = this.props;
    const paramProps = {
      dispatch,
      result,
      totalCount,
      submitLoading,
    };
    return (
      <div className={styles.doorIndex}>
        <PricePlanMainPage {...paramProps} />
      </div>
    );
  }
}

export default Mdoor;
