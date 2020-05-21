import React, { Component } from 'react';
import { Button, Row, Col, Carousel, message } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import { Link, router } from 'umi';
import { connect } from 'dva';
import { stringify } from 'qs';
import Broadside from '@/components/Broadside';
import styles from './index.scss';
import { StateType } from './model';
import { GetGlobalToken } from '../../utils/cache';

interface IProps {
  dispatch: Dispatch<AnyAction>;
  homeModelState: StateType;
  countryDropList: any[];
}

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

@connect(({ home, loading, global }) => ({
  homeModelState: home,
  countryDropList: global.countryDropList,
}))
class HomePage extends Component<IProps, any> {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getCountryDropList',
    });

    dispatch({
      type: 'home/getBargainPrice',
    });
  }

  handleSubmit = params => {
    router.push({
      pathname: '/door/price-plan',
      search: stringify(params),
    });
  };

  searchPanel = () => {
    const { countryDropList } = this.props;

    return (
      <div className={styles.searchPanel}>
        <p>拼箱门到门</p>
        <SearchCondition
          hideTitle
          submit={this.handleSubmit}
          isMultiRow={searchType.index}
          countryDropList={countryDropList}
        />
      </div>
    );
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

  specialOfferItem = item => {
    return (
      <div className={styles.SpecialOfferItem} key={item.id}>
        <div className={styles.picPort}>
          <p className={styles.ports}>义乌 — {item.endTruck}</p>
        </div>
        <div className={styles.bottomPart}>
          <ul>
            <li>
              <p>KGS</p>
              <p>{item.heavyStandsPrice}</p>
            </li>
            <li>
              <p>CBM</p>
              <p>{item.tossStandsPrice}</p>
            </li>
          </ul>
          <Button type="primary" onClick={() => this.handleLinkToOrder(item)}>
            立即下单
          </Button>
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
    const {
      homeModelState: { priceList },
    } = this.props;
    const bannerList = [1, 2, 3];
    const bannerListPic = bannerList.map(item => require(`../../assets/img/banner${item}.jpg`));

    return (
      <main className={styles.conatiner}>
        <Broadside />
        <div className={styles.banner}>
          <Carousel>
            {bannerListPic.map((item, index) => (
              <div key={index}>
                <div style={{ background: `url(${item}) center` }}>
                  <h3>&nbsp;</h3>
                </div>
              </div>
            ))}
          </Carousel>
          {this.searchPanel()}
        </div>
        <p className={styles.title}>专线特价区</p>
        <div className={`${styles.middleWrap} ${styles.clearfloat}`}>
          {priceList.map((item, index) => this.specialOfferItem(item))}
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
