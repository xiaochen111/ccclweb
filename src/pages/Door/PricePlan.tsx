import React, { PureComponent } from 'react';
import { Pagination, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import H from 'history';
import { Dispatch, AnyAction } from 'redux';
import PageWrapper from '@/components/PageWrapper';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import styles from './PricePlan.scss';
import { StateType } from './model';
import { GetPageQuery } from '@/utils/utils';

interface PricePlanPageProps extends StateType {
  dispatch: Dispatch<AnyAction>;
  location: H.Location;
}

const arrow = require('../../assets/img/arrow.png');

interface PricePlanPageState {
  orderByClause: string;
  endTruck: string;
  kgs: string;
  cbm: string;

  sortInstance: string;
  orderBy: string;
}

@connect(({ door }) => ({
  result: door.result,
  totalCount: door.totalCount,
}))
class PricePlanPage extends PureComponent<PricePlanPageProps, PricePlanPageState> {
  state = {
    endTruck: '',
    kgs: '',
    cbm: '',
    orderByClause: '',

    sortInstance: '',
    orderBy: '',
  };

  private index = 1;

  columns = [
    {
      title: '线路',
      key: 'a',
      width: '35%',
    },
    {
      title: '航程',
      key: 'days',
      width: '13%',
    },
    {
      title: 'CBM',
      key: 'TOSS_PRICE_STANDRD',
      width: '13%',
    },
    {
      title: 'KGS',
      key: 'HEAVY_PRICE_STANDRDd',
      width: '13%',
    },
    {
      title: 'TOTAL',
      key: 'TOTAL',
      width: '13%',
    },
  ];

  componentDidMount() {
    const params = GetPageQuery();
    this.setState(
      {
        endTruck: params.endTruck || '',
        kgs: params.kgs || '',
        cbm: params.cbm || '',
      },
      () => {
        const { endTruck, kgs, cbm, orderByClause } = params;
        this.getLclList({ endTruck, kgs, cbm, orderByClause });
      },
    );
  }

  getLclList = async (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'door/getLclList',
      payload: params,
    });
  };

  handleSubmit = params => {
    const { endTruck, kgs, cbm } = params;
    const { orderByClause } = this.state;
    this.getLclList({ endTruck, kgs, cbm, orderByClause });
  };

  linkToOrder = () => {
    router.push('/door/place-order');
  };

  changeSort = key => {
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
      () => {
        const { endTruck, kgs, cbm, orderByClause } = this.state;
        this.getLclList({ endTruck, kgs, cbm, orderByClause });
      },
    );
  };

  render() {
    const { totalCount, result } = this.props;
    const { sortInstance, orderBy, endTruck, kgs, cbm } = this.state;
    let defaultValue = { endTruck, kgs, cbm };
    return (
      <PageWrapper>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>
              <span className={styles.text}>拼箱门到门</span>
              <span className={styles.desc}>注 : 费用按照1:400（KGS数值/</span>
            </div>
            <div className={styles.searchCondition}>
              <SearchCondition
                submit={this.handleSubmit}
                isMultiRow={searchType.pricePlan}
                defaultValue={defaultValue}
              />
            </div>
          </div>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              {this.columns.map((item, index) => (
                <span key={item.key}>
                  {item.title}&nbsp;
                  {index > 0 ? (
                    <span style={{ cursor: 'pointer' }} onClick={() => this.changeSort(item.key)}>
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
                </span>
              ))}
            </div>
            <ul className={styles.tableBody}>
              {result &&
                result.map((item, index) => (
                  <li key={index} className={styles.tableItem}>
                    <div className={styles.rowInfos}>
                      <span className={styles.line}>
                        <div className={styles.lineMain}>
                          {item.startTruck}
                          &nbsp;
                          <img src={arrow} alt="" />
                          &nbsp;
                          {item.endTruck}
                        </div>
                      </span>
                      <span className={styles.voyage}>{item.days}天</span>
                      <span className={styles.price}>${item.cbm}</span>
                      <span className={styles.price}>${item.kgs}</span>
                      <span className={styles.total}>10000</span>
                      <span>
                        <span className={styles.btn} onClick={this.linkToOrder}>
                          下单
                        </span>
                      </span>
                    </div>
                    <div className={styles.expandeContent}>
                      <span style={{ marginRight: 50 }} className={styles.validityTime}>
                        有效船期 : {item.startTime} 至 {item.endTime}
                      </span>
                      <span>
                        <Icon type="exclamation-circle" theme="filled" /> {item.remarkOut}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className={styles.paginationContainer}>
            <span className={styles.total}>
              共<strong>{totalCount}</strong>条
            </span>
            <Pagination showQuickJumper showSizeChanger total={totalCount} />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default PricePlanPage;
