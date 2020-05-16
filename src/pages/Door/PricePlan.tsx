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

interface PricePlanPageProps {
  dispatch: Dispatch<AnyAction>;
  PricePlanPageState: StateType;
  location: H.Location;
}

@connect(({ door }) => ({
  PricePlanPageState: door,
}))
class PricePlanPage extends PureComponent<PricePlanPageProps, any> {
  columns = [
    {
      title: '线路',
      dataIndex: 'a',
      key: 'a',
      width: '35%',
    },
    {
      title: '航程',
      dataIndex: 'b',
      key: 'b',
      width: '13%',
    },
    {
      title: 'CBM',
      dataIndex: 'c',
      key: 'c',
      width: '13%',
    },
    {
      title: 'KGS',
      dataIndex: 'd',
      key: 'd',
      width: '13%',
    },
    {
      title: 'TOTAL',
      dataIndex: 'e',
      key: 'e',
      width: '13%',
    },
  ];

  componentDidMount() {
    this.getLclList();
    const { location } = this.props;
    const { search } = location;
    console.log(search);
  }

  getLclList = async (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'door/getLclList',
      payload: params,
    });
  };

  handleSubmit = params => {
    console.log(params);
    const { endTruck, kgs, cbm } = params;
    this.getLclList({ endTruck, kgs, cbm });
  };

  linkToOrder = () => {
    router.push('/door/place-order');
  };

  render() {
    const { lclPage } = this.props.PricePlanPageState;
    console.log(lclPage);
    const { result } = lclPage;
    console.log(result);
    let defaultValue = {
      endPort: '美国1',
    };
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
              {this.columns.map(item => (
                <span key={item.dataIndex}>{item.title}</span>
              ))}
            </div>
            <ul className={styles.tableBody}>
              {result.map((item, index) => (
                <li key={index} className={styles.tableItem}>
                  <div className={styles.rowInfos}>
                    <span className={styles.line}>{item.a}</span>
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
              共<strong>{lclPage.totalCount}</strong>条
            </span>
            <Pagination showQuickJumper showSizeChanger total={lclPage.totalCount} />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default PricePlanPage;
