import React, { Component } from 'react';
import H from 'history';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import router from 'umi/router';
import { Pagination, Icon, Empty, Spin, Tooltip } from 'antd';
import { StateType } from '@/models/door';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import { GetPageQuery } from '@/utils/utils';
import { stringify } from 'qs';

import { GetGlobalFlag, GetGlobalToken } from '@/utils/cache';
import { message } from 'antd';

import styles from './PricePlan.scss';

const arrow = require('../../assets/img/arrow.png');

interface IProps extends StateType {
  dispatch: Dispatch<AnyAction>;
  location: H.Location;
  countryDropList: any[];
  lclList: any[];
  tableLoading?: boolean;
  route: any;
}

interface IState {
  country: string;
  kgs: string;
  cbm: string;
  orderByClause: string;
  sortInstance: string;
  orderBy: string; // 排序方式
  routeType: string;
  pageNo: number;
  pageSize: number;
}

@connect(({ door, global, loading }) => ({
  lclList: door.lclList,
  totalCount: door.totalCount,
  tableLoading: loading.global,
  countryDropList: global.countryDropList,
}))
export class PricePlan extends Component<IProps, IState> {
  state = {
    country: '',
    kgs: '',
    cbm: '',
    orderByClause: '',

    sortInstance: '',
    orderBy: '',
    routeType: this.props.route.type ? this.props.route.type : '',
    pageNo: 1,
    pageSize: 10,
  };

  private index = 1;

  private columns = [
    {
      title: '供应商',
      key: 'logo',
    },
    {
      title: '运输专线',
      key: 'line',
    },
    {
      title: '时效',
      key: 'days',
    },
    {
      title: '体重比',
      key: 'KGS',
    },
    {
      title: '每立方',
      key: 'TOSS_PRICE_STANDRD',
    },
    {
      title: '每公斤',
      key: 'HEAVY_PRICE_STANDRD',
    },
    {
      title: '总价',
      key: 'TOTAL_PRICE',
    },
  ];

  componentDidMount() {
    const params = GetPageQuery();

    this.setState(
      {
        country: params.country || '',
        kgs: params.kgs || '1',
        cbm: params.cbm || '1',
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
    const { country, kgs, cbm, orderByClause, pageNo, pageSize } = this.state;

    const params = {
      startTruck: '义乌',
      country,
      kgs,
      cbm,
      orderByClause,
      pageNo,
      pageSize,
    };

    dispatch({
      type: 'door/getLclList',
      payload: params,
    });
  };

  handleLinkToOrder = info => {
    const { cbm, kgs } = this.state;

    if (!GetGlobalToken(GetGlobalFlag())) {
      message.warn('下单需要登录，请先登录');
      router.push({
        pathname: '/login/index',
        search: stringify({
          cbm,
          kgs,
          id: info.id
        }),
      });
      return;
    }
    if (info && info.id) {
      const { routeType } = this.state;

      router.push({
        pathname: routeType ? `/control/mdoor/order/${info.id}` : `/door/place-order/${info.id}`,
        search: stringify({
          cbm,
          kgs,
        }),
      });
    }
  };

  handleSearchSubmit = params => {
    const { country, kgs, cbm } = params;

    this.setState({
      country,
      kgs,
      cbm,
    }, this.handleGetLclList);
  };

  handleListSort = key => {
    const sortColums = ['sort', 'asc', 'desc'];
    const { sortInstance } = this.state;

    this.index = sortInstance !== key ? 1 : this.index >= 2 ? 0 : ++this.index;
    let orderType = sortInstance !== key ? sortColums[1] : sortColums[this.index];

    this.setState(
      {
        sortInstance: key,
        orderBy: orderType,
        orderByClause: orderType === 'sort' ? '' : `${key} ${orderType}`,
      },
      this.handleGetLclList,
    );
  };

  handleTabelChange = current => {
    this.setState({
      pageNo: current,
    }, this.handleGetLclList);
  };

  handleTableSizeChange = (current, pageSize) => {
    this.setState({
      pageNo: 1,
      pageSize: pageSize,
    }, this.handleGetLclList);
  };

  countryFilterList = value => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getCountryDropList',
      payload: { text: value }
    });
  }

  render() {
    const { lclList, totalCount, countryDropList, tableLoading } = this.props;
    const { sortInstance, orderBy, country, kgs, cbm, routeType, pageNo, pageSize } = this.state;
    const searchDefaultValue = { country, kgs, cbm };
    const pagination = {
      total: totalCount,
      current: pageNo,
      pageSize,
    };

    const convertCurrency = currency => currency === 'USD' ? '$' : '¥';

    return (
      <div
        style={
          routeType
            ? { width: '100%', padding: '20px' }
            : { width: 1200, margin: '0 auto', padding: '40px 20px 20px 20px' }
        }
      >
        <SearchCondition
          countryDropList={countryDropList}
          submit={this.handleSearchSubmit}
          filterList={this.countryFilterList}
          isMultiRow={searchType.pricePlan}
          defaultValue={searchDefaultValue}
        />
        <Spin spinning={tableLoading}>
          <div className={styles.container}>
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                {this.columns.map((item, index) => (
                  <div className={styles.columsWidth} key={item.key}>
                    {item.title}&nbsp;
                    {index > 0 ? (
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.handleListSort(item.key)}
                      >
                        <img
                          src={
                            item.key === sortInstance
                              ? require(`../../assets/img/${orderBy}.png`)
                              : require('../../assets/img/sort.png')
                          }
                          alt=""
                        />
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                ))}
              </div>
              <ul className={styles.tableBody}>
                {lclList && lclList.length ? (
                  lclList.map((item, index) => (
                    <li key={index} className={styles.tableItem}>
                      <div className={styles.rowInfos}>
                        <div className={`${styles.supplier} ${styles.columsWidth}`}>
                          <div className={styles.logo}>
                            <img src={item.logo ? item.logo : require('../../assets/img/default-logo.svg')} alt=""/>
                          </div>
                          {
                            item.specialFlag && item.specialFlag === 1 ? <i className={styles.specialFlag}/> : null
                          }
                        </div>
                        <div className={`${styles.line} ${styles.columsWidth}`}>
                          <span className={styles.address}>{item.startTruck}&nbsp;</span>
                          <img src={arrow} alt="" />
                              &nbsp;
                          <Tooltip placement="top" title={item.endTruck}>
                            <span className={styles.address}>{item.endTruck}</span>
                          </Tooltip>
                        </div>
                        <div className={`${styles.voyage} ${styles.columsWidth}`}>
                          {item.days}天
                        </div>
                        <div className={`${styles.weight} ${styles.columsWidth}`}>
                          {item.cbm} : {item.kgs}
                        </div>
                        <div className={styles.columsWidth}>
                          {convertCurrency(item.currency)}{item.tossStandsPrice}
                        </div>
                        <div className={styles.columsWidth}>
                          {convertCurrency(item.currency)}{item.heavyStandsPrice}
                        </div>
                        <div className={styles.columsWidth}>
                          <div className={styles.total}>
                            <div className={styles.num}>
                              {convertCurrency(item.currency)}{item.totalPrice}
                            </div>
                            <span className={styles.desc}>{convertCurrency(item.currency)}{item.totalPrice}={item.kgsCbm} X {convertCurrency(item.currency)}{item.priceStandrd}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.subInfos}>
                        <span><i>供应商：</i>{item.supplierName}</span>
                        <span><i>体重比说明：</i>每立方超过{item.kgs}公斤按公斤费用进行计算</span>
                        <div className={styles.btn} onClick={() => this.handleLinkToOrder(item)}>下单</div>
                      </div>
                      <div className={styles.explain}>
                        <div className={styles.title}>专线说明</div>
                        <p>{item.remarkOut}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <Empty style={{ padding: 40 }} description="暂无数据" />
                )}
              </ul>
            </div>
            <div className={styles.paginationContainer}>
              <span className={styles.total}>
                共<strong>{totalCount}</strong>条
              </span>
              <Pagination showQuickJumper showSizeChanger {...pagination} onChange={this.handleTabelChange} onShowSizeChange={this.handleTableSizeChange}/>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default PricePlan;
