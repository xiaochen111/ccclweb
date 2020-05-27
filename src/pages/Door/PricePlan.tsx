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
  endTruck: string;
  kgs: string;
  cbm: string;
  orderByClause: string;
  sortInstance: string;
  orderBy: string; // 排序方式
  routeType: string;
  pageNo: number;
  pageSize: number;
  currentExplain: string;
}

@connect(({ door, global, loading }) => ({
  lclList: door.lclList,
  totalCount: door.totalCount,
  tableLoading: loading.global,
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
    routeType: this.props.route.type ? this.props.route.type : '',
    pageNo: 1,
    pageSize: 10,
    currentExplain: '',
  };

  private index = 1;

  private columns = [
    {
      title: '线路',
      key: 'a',
      width: '35%',
    },
    {
      title: '时效',
      key: 'days',
      width: '13%',
    },
    {
      title: '立方',
      key: 'TOSS_PRICE_STANDRD',
      width: '13%',
    },
    {
      title: '公斤',
      key: 'HEAVY_PRICE_STANDRDd',
      width: '13%',
    },
    {
      title: '总价',
      key: 'TOTAL',
      width: '13%',
    },
  ];

  componentDidMount() {
    const params = GetPageQuery();

    this.setState(
      {
        endTruck: params.country || '',
        kgs: params.kgs || '',
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
    const { endTruck, kgs, cbm, orderByClause, pageNo, pageSize } = this.state;

    const params = {
      endTruck,
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
    if (!GetGlobalToken(GetGlobalFlag())) {
      message.warn('下单需要登录，请先登录');
      router.push({
        pathname: '/login/index',
        search: stringify({
          cbm: info.cbm,
          kgs: info.kgs,
          id: info.id
        }),
      });
      return;
    }
    if (info && info.id) {
      const { routeType } = this.state;

      router.push({
        pathname: routeType ? `/control/mdoor-order/${info.id}` : `/door/place-order/${info.id}`,
        search: stringify({
          cbm: info.cbm,
          kgs: info.kgs,
        }),
      });
    }
  };

  handleSearchSubmit = params => {
    const { endTruck, kgs, cbm } = params;

    this.setState({
      endTruck,
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
    const { sortInstance, orderBy, endTruck, kgs, cbm, routeType, pageNo, pageSize, currentExplain } = this.state;
    const searchDefaultValue = { endTruck, kgs, cbm };
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
                    <li key={index} className={styles.tableItem} onMouseEnter={() => this.setState({ currentExplain: item.id })}>
                      {
                        item.specialFlag && item.specialFlag === 1 ? <i className={styles.specialFlag}/> : null
                      }
                      <div className={styles.rowInfos}>
                        <div className={`${styles.line} ${styles.columsWidth}`}>
                          <div className={styles.lineMain}>
                            {/* {item.startTruck} */}
                            <div className={styles.startTruck}>
                              义乌&nbsp;
                              <img src={arrow} alt="" />
                              &nbsp;
                            </div>
                            <p className={styles.endTruck}>
                              <Tooltip placement="top" title={item.endTruck}>
                                <span>{item.endTruck}</span>
                              </Tooltip>
                            </p>
                          </div>
                        </div>
                        <div className={`${styles.voyage} ${styles.columsWidth}`}>
                          {item.days}天
                        </div>
                        <div className={`${styles.price} ${styles.columsWidth}`}>
                          {convertCurrency(item.currency)}{item.tossStandsPrice}
                        </div>
                        <div className={`${styles.price} ${styles.columsWidth}`}>
                          {convertCurrency(item.currency)}{item.heavyStandsPrice}
                        </div>
                        <div className={`${styles.total} ${styles.columsWidth}`}>
                          {convertCurrency(item.currency)}{item.totalPrice}
                        </div>
                        <div className={`${styles.columsWidth}`}>
                          <span className={styles.btn} onClick={() => this.handleLinkToOrder(item)}>
                            下单
                          </span>
                        </div>
                      </div>
                      <div className={styles.expandeContent}>
                        <span>{item.supplierName}</span>
                        <span style={{ marginRight: 50 }} className={styles.validityTime}>
                          {`体重比 : ${item.cbm}立方 : ${item.kgs}公斤`}
                        </span>
                        <span style={{ marginRight: 50 }} className={styles.validityTime}>
                          有效船期 : {item.startTime} 至 {item.endTime}
                        </span>
                        <span style={{ color: currentExplain === item.id ? '#2556F2' : '' }}>
                          <Icon type="exclamation-circle" theme="filled"/> 专线说明
                        </span>
                      </div>
                      {
                        currentExplain === item.id ?
                          <div className={styles.explain}>
                            <div className={styles.title}><Icon type="exclamation-circle" theme="filled" /> 专线说明</div>
                            <p>{item.remarkOut}</p>
                          </div> : null
                      }
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
