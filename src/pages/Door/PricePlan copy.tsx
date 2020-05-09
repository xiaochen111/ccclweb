import React, { PureComponent } from 'react';
import { Table, Button, Icon } from 'antd';
import PageWrapper from '@/components/PageWrapper';
import styles from './PricePlan.scss';

class PricePlanPage extends PureComponent {
  columns = [
    {
      title: '线路',
      dataIndex: 'a',
      key: 'a',
    },
    {
      title: '航程',
      dataIndex: 'b',
      key: 'b',
      render: (text: any) => <span className={styles.voyage}>{text}</span>,
    },
    {
      title: 'CBM',
      dataIndex: 'c',
      key: 'c',
      render: (text: any) => <span className={styles.price}>{text}</span>,
    },
    {
      title: 'KGS',
      dataIndex: 'd',
      key: 'd',
      render: (text: any) => <span className={styles.price}>{text}</span>,
    },
    {
      title: 'TOTAL',
      dataIndex: 'e',
      key: 'e',
      render: (text: any) => <span className={styles.total}>{text}</span>,
    },
    { title: '', dataIndex: 'f', key: 'f', render: () => <Button type={'primary'}>下单</Button> },
  ];

  render() {
    const dataSource = [
      { a: '义务 --> WARSZAWA', b: '40天', c: '$400', d: '$600', e: '$10000' },
      { a: '义务 --> WARSZAWA', b: '40天', c: '$401', d: '$600', e: '$10000' },
      { a: '义务 --> WARSZAWA', b: '40天', c: '$402', d: '$600', e: '$10000' },
      { a: '义务 --> WARSZAWA', b: '40天', c: '$403', d: '$600', e: '$10000' },
    ];
    const renderExpandeContent = () => (
      <div className={styles.expandeContent}>
        <span style={{ marginRight: 50 }}>有效船期 : 2020-04-01 至 2020-04-30</span>
        <span>
          <Icon type="exclamation-circle" theme="filled" /> 费用外部备注备注备注备注备注备注……
        </span>
      </div>
    );
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
            <Table
              rowKey={'c'}
              dataSource={dataSource}
              columns={this.columns}
              expandedRowRender={renderExpandeContent}
              defaultExpandAllRows
              expandIcon={() => <i />}
            />
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default PricePlanPage;
