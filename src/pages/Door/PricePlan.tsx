import React, { PureComponent } from 'react';
import { Table, Pagination, Icon } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import styles from './PricePlan.scss';

class PricePlanPage extends PureComponent {
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

  render() {
    const dataSource = [
      { a: '义务 --> WARSZAWA', b: '40天', c: '$400', d: '$600', e: '$10000' },
      { a: '义务 --> WARSZAWA', b: '40天', c: '$401', d: '$600', e: '$10000' },
      { a: '义务 --> WARSZAWA', b: '40天', c: '$402', d: '$600', e: '$10000' },
      { a: '义务 --> WARSZAWA', b: '40天', c: '$403', d: '$600', e: '$10000' },
    ];

    return (
      <PageWrapper>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>
              <span className={styles.text}>拼箱门到门</span>
              <span className={styles.desc}>注 : 费用按照1:400（KGS数值/</span>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              {this.columns.map(item => (
                <span key={item.dataIndex}>{item.title}</span>
              ))}
            </div>
            <ul className={styles.tableBody}>
              {dataSource.map(item => (
                <li key={item.c} className={styles.tableItem}>
                  <div className={styles.rowInfos}>
                    <span className={styles.line}>{item.a}</span>
                    <span className={styles.voyage}>{item.b}</span>
                    <span className={styles.price}>{item.c}</span>
                    <span className={styles.price}>{item.d}</span>
                    <span className={styles.total}>{item.e}</span>
                    <span>
                      <span className={styles.btn}>下单</span>
                    </span>
                  </div>
                  <div className={styles.expandeContent}>
                    <span style={{ marginRight: 50 }} className={styles.validityTime}>
                      有效船期 : 2020-04-01 至 2020-04-30
                    </span>
                    <span>
                      <Icon type="exclamation-circle" theme="filled" />{' '}
                      费用外部备注备注备注备注备注备注……
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.paginationContainer}>
            <span className={styles.total}>
              共<strong>1000</strong>条
            </span>
            <Pagination showQuickJumper showSizeChanger total={500} />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default PricePlanPage;
