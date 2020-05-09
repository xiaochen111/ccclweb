import React, { Component } from 'react';
import { Button, Row, Col, Carousel, Input, AutoComplete } from 'antd';
import styles from './index.scss';
import { Link } from 'umi';

const { Option } = AutoComplete;

const dataSource = ['12345', '23456', '34567'];

const startPartIcon = require('../../assets/img/start_part.png');

interface IProps {}

const serviceList = [
  {
    img: require('../../assets/img/price.png'),
    tit: '价格可靠',
    intro: '直营运价 全口岸全航线覆盖 多',
  },
  {
    img: require('../../assets/img/icon_kuaisu.png'),
    tit: '快速响应',
    intro: '客户一对一服务 及时在线问题解',
  },
  {
    img: require('../../assets/img/icon_xinyu.png'),
    tit: '信誉保证',
    intro: '对客户 我们以诚相 寻求长期的',
  },
  {
    img: require('../../assets/img/icon_chuangxin.png'),
    tit: '技术创新',
    intro: '直营运价 全口岸全航线覆盖 多',
  },
  {
    img: require('../../assets/img/icon_kexue.png'),
    tit: '科学管理',
    intro: '直营运价 全口岸全航线覆盖 多',
  },
  {
    img: require('../../assets/img/icon_tuandui.png'),
    tit: '团队合作',
    intro: '直营运价 全口岸全航线覆盖 多',
  },
];
class HomePage extends Component {
  searchPanel = (dataSource: Array<any>) => {
    const options = dataSource.map((item, index) => <Option key={index}>{item}</Option>);
    return (
      <div className={styles.searchPanel}>
        <p>拼箱门到门</p>
        <Row gutter={16}>
          <Col span={9}>
            <div className="certain-category-search-wrapper">
              <AutoComplete
                className="certain-category-search"
                dropdownClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 300 }}
                size="large"
                style={{ width: '100%' }}
                dataSource={options}
                defaultValue="sss"
                optionLabelProp="value"
              >
                <Input
                  prefix={
                    <>
                      <img src={startPartIcon} />{' '}
                      <span style={{ fontSize: '14px' }}>&nbsp;义乌 —</span>
                    </>
                  }
                />
              </AutoComplete>
            </div>
          </Col>
          <Col span={5}>
            <Input placeholder="重量" size="large" suffix={<span>KGS</span>} />
          </Col>
          <Col span={5}>
            <Input placeholder="体积" size="large" suffix={<span>CBM</span>} />
          </Col>
          <Col span={5}>
            <Button type="primary" size="large" block icon="search">
              搜索
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  specialOfferItem = (index: number) => {
    return (
      <div className={styles.SpecialOfferItem} key={index}>
        <div className={styles.picPort}>
          <p className={styles.ports}>义乌 — 俄罗斯</p>
        </div>
        <div className={styles.bottomPart}>
          <ul>
            <li>
              <p>CBM</p>
              <p>$400</p>
            </li>
            <li>
              <p>CBM</p>
              <p>$400</p>
            </li>
          </ul>
          <Button type="primary">立即抢购</Button>
        </div>
      </div>
    );
  };

  serviceAdvantages = () => {
    return (
      <div className={styles.serviceMain}>
        <p className={styles.title} style={{ color: '#fff' }}>
          服务优势
        </p>
        <div className={styles.middleWrap}>
          <Row>
            {serviceList.map((item, index) => (
              <Col span={4} key={index}>
                <div className={styles.serviceItem}>
                  <img src={item.img} alt="" />
                  <div className={styles.text}>
                    <p>{item.tit}</p>
                    <p>{item.intro}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  };

  news = () => {
    const newsImg = require('../../assets/img/news.png');
    return (
      <div className={styles.middleWrap}>
        <p className={styles.title}>新闻资讯</p>
        <div className={styles.videoNews}>
          <div className={styles.vedio} />
          <div className={styles.newsMain}>
            <ul className={styles.newsPic}>
              <li>
                <img src={newsImg} alt="" />
              </li>
              <li>
                <img src={newsImg} alt="" />
              </li>
            </ul>

            <p className={styles.newTit}>
              <span>新闻公告</span>
              <Link to="/">更多</Link>
            </p>

            <ul className={styles.newsList}>
              <li>
                <span>箱管部停止南通码头现场业务受理公告</span>
                <span>06-07</span>
              </li>
              <li>
                <span>箱管部停止南通码头现场业务受理公告</span>
                <span>06-07</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const arrList = [1, 1, 1, 1, 1, 1, 1, 1];
    return (
      <main className={styles.conatiner}>
        <div className={styles.banner}>
          <Carousel>
            <div>
              <h3>1</h3>
            </div>
            <div>
              <h3>2</h3>
            </div>
          </Carousel>
          {this.searchPanel(dataSource)}
        </div>
        <p className={styles.title}>专线特价区</p>
        <div className={`${styles.middleWrap} ${styles.clearfloat}`}>
          {arrList.map((item, index) => this.specialOfferItem(index))}
        </div>
        {/* 服务优势 */}
        {this.serviceAdvantages()}
        {/* 新闻资讯 */}
        {this.news()}
      </main>
    );
  }
}

export default HomePage;
