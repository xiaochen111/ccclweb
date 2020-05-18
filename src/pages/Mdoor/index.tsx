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
}

@connect(({ door }) => ({
  result: door.result,
  totalCount: door.totalCount,
}))
export class Mdoor extends Component<PricePlanPageProps, any> {
  render() {
    const { dispatch, result, totalCount } = this.props;
    return (
      <div className={styles.doorIndex}>
        <PricePlanMainPage dispatch={dispatch} result={result} totalCount={totalCount} />
      </div>
    );
  }
}

export default Mdoor;
