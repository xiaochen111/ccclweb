import React, { PureComponent } from 'react';
import { Pagination, Icon } from 'antd';
import router from 'umi/router';
import styles from './List.scss';
const arrow = require('../../assets/img/arrow.png');

export interface DoorPriceListProps {
  dataSource: any[];
  total: number;
  sortInstance: string;
  orderBy: string;
  onSort: (params: any) => void;
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

  handleSubmit = params => {
    // this.props.onSearchSubmit(params);
  };

  linkToOrder = () => {
    router.push('/door/place-order');
  };

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
    const { dataSource, total, sortInstance, orderBy } = this.props;

    return (
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
            {dataSource &&
              dataSource.map((item, index) => (
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
            共<strong>{total}</strong>条
          </span>
          <Pagination showQuickJumper showSizeChanger total={total} />
        </div>
      </div>
    );
  }
}

export default DoorPriceListPage;
