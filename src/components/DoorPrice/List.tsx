import React, { PureComponent } from 'react';
import { Pagination, Icon, Empty, Spin, Tooltip } from 'antd';
import router from 'umi/router';
import styles from './List.scss';
const arrow = require('../../assets/img/arrow.png');

export interface DoorPriceListProps {
  dataSource: any[];
  total: number;
  sortInstance: string;
  orderBy: string;
  onSort: (params: any) => void;
  onClickOrder: () => void;
  tableLoading?: boolean;
}

class DoorPriceListPage extends PureComponent<DoorPriceListProps, any> {
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

  changeSort = key => {
    const sortColums = ['sort', 'asc', 'desc'];
    const { sortInstance } = this.props;
    this.index = sortInstance !== key ? 1 : this.index >= 2 ? 0 : ++this.index;
    let orderType = sortInstance !== key ? sortColums[1] : sortColums[this.index];

    this.props.onSort({
      sortInstance: key,
      orderBy: orderType,
      orderByClause: orderType === 'sort' ? '' : `${key} ${orderType}`,
    });
  };

  render() {
    const {
      dataSource,
      total,
      sortInstance,
      orderBy,
      tableLoading = false,
      onClickOrder,
    } = this.props;

    return (
      <Spin spinning={tableLoading}>
        <div className={styles.container}>
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
              {dataSource && dataSource.length ? (
                dataSource.map((item, index) => (
                  <li key={index} className={styles.tableItem}>
                    <div className={styles.rowInfos}>
                      <span className={styles.line}>
                        <div className={styles.lineMain}>
                          {/* {item.startTruck} */}
                          <p className={styles.startTruck}>
                            义乌&nbsp;
                            <img src={arrow} alt="" />
                            &nbsp;
                          </p>
                          <p className={styles.endTruck}>
                            <Tooltip placement="top" title={item.endTruck}>
                              <p>{item.endTruck}</p>
                            </Tooltip>
                          </p>
                        </div>
                      </span>
                      <span className={styles.voyage}>{item.days}天</span>
                      <span className={styles.price}>${item.cbm}</span>
                      <span className={styles.price}>${item.kgs}</span>
                      <span className={styles.total}>10000</span>
                      <span>
                        <span className={styles.btn} onClick={onClickOrder}>
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
                ))
              ) : (
                <Empty style={{ padding: 40 }} description="暂无数据" />
              )}
            </ul>
          </div>
          <div className={styles.paginationContainer}>
            <span className={styles.total}>
              共<strong>{total}</strong>条
            </span>
            <Pagination showQuickJumper showSizeChanger total={total} />
          </div>
        </div>
      </Spin>
    );
  }
}

export default DoorPriceListPage;
