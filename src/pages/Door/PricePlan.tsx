import React, { Component } from 'react';
import H from 'history';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import router from 'umi/router';
import { StateType } from '@/models/door';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import { GetPageQuery } from '@/utils/utils';
import { stringify } from 'qs';

import PageWrapper from '@/components/PageWrapper';
import DoorPriceList from '@/components/DoorPrice/List';
import { GetGlobalToken } from '../../utils/cache';
import { message } from 'antd';

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

  handleLinkToOrder = info => {
    if (!GetGlobalToken()) {
      message.warn('下单需要登录，请先登录');
      router.replace('/login');
      return;
    }
    if (info && info.id) {
      router.push({
        pathname: `/door/place-order/${info.id}`,
        search: stringify({
          cbm: info.cbm,
          kgs: info.kgs,
        }),
      });
    }
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
      <PageWrapper>
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
      </PageWrapper>
    );
  }
}

export default PricePlan;
