import React, { Component } from 'react';
import H from 'history';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import router from 'umi/router';
import { StateType } from '@/models/door';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import { GetPageQuery } from '@/utils/utils';
import DoorPriceList from '@/components/DoorPrice/List';

import styles from './index.scss';

interface IProps extends StateType {
  dispatch: Dispatch<AnyAction>;
  location: H.Location;
  countryDropList: any[];
  lclList: any[];
}

interface IState {
  endTruck: string;
  kgs: string;
  cbm: string;
  orderByClause: string;
  sortInstance: string;
  orderBy: string; // 排序方式
}

@connect(({ door, global }) => ({
  lclList: door.lclList,
  totalCount: door.totalCount,
  countryDropList: global.countryDropList,
}))
export class PricePlan extends Component<IProps, IState> {
  state = {
    endTruck: '',
    kgs: '',
    cbm: '',
    orderByClause: '',

    sortInstance: '',
    orderBy: '',
  };

  componentDidMount() {
    const params = GetPageQuery();
    this.setState(
      {
        endTruck: params.endTruck || '',
        kgs: params.kgs || '',
        cbm: params.cbm || '',
      },
      this.handleGetLclList,
    );

    this.handleGetCountryDropList();
  }

  handleGetCountryDropList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getCountryDropList',
    });
  };

  handleGetLclList = () => {
    const { dispatch } = this.props;
    const { endTruck, kgs, cbm, orderByClause } = this.state;

    const params = {
      endTruck,
      kgs,
      cbm,
      orderByClause,
    };

    dispatch({
      type: 'door/getLclList',
      payload: params,
    });
  };

  handleSearchSubmit = params => {
    const { endTruck, kgs, cbm } = params;

    this.setState(
      {
        endTruck,
        kgs,
        cbm,
      },
      this.handleGetLclList,
    );
  };

  handleLinkToOrder = info => {
    router.push(`/control/mdoor-order/${info.id}`);
  };

  handleListSort = values => {
    const { sortInstance, orderBy, orderByClause } = values;

    this.setState(
      {
        sortInstance,
        orderBy,
        orderByClause,
      },
      this.handleGetLclList,
    );
  };

  render() {
    const { lclList, totalCount, countryDropList } = this.props;
    const { sortInstance, orderBy, endTruck, kgs, cbm } = this.state;
    const searchDefaultValue = { endTruck, kgs, cbm };

    return (
      <div className={styles.wrapper}>
        <SearchCondition
          countryDropList={countryDropList}
          submit={this.handleSearchSubmit}
          isMultiRow={searchType.pricePlan}
          defaultValue={searchDefaultValue}
        />
        <DoorPriceList
          sortInstance={sortInstance}
          orderBy={orderBy}
          dataSource={lclList}
          total={totalCount}
          onSort={this.handleListSort}
          onClickOrder={this.handleLinkToOrder}
        />
      </div>
    );
  }
}

export default PricePlan;
