import React, { Component } from 'react';
import { Button, Carousel, message } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import SearchCondition, { searchType } from '@/components/SearchCondition';
import { Link, router } from 'umi';
import { connect } from 'dva';
import { stringify } from 'qs';
import Broadside from '@/components/Broadside';
import styles from './index.scss';
import { StateType } from './model';
import { StateType as newsStateType } from '@/models/news';
import { GetGlobalFlag, GetGlobalToken } from '../../utils/cache';

interface IProps extends newsStateType {
  dispatch: Dispatch<AnyAction>;
  homeModelState: StateType;
  countryDropList: any[];
}

// const serviceList = [
//   {
//     img: require('@/assets/img/price.png'),
//     tit: '价格可靠',
//     intro: '直营运价 全口岸全航线覆盖 多',
//   },
//   {
//     img: require('@/assets/img/icon_kuaisu.png'),
//     tit: '快速响应',
//     intro: '客户一对一服务 及时在线问题解',
//   },
//   {
//     img: require('../../assets/img/icon_xinyu.png'),
//     tit: '信誉保证',
//     intro: '对客户 我们以诚相 寻求长期的',
//   },
//   {
//     img: require('../../assets/img/icon_chuangxin.png'),
//     tit: '技术创新',
//     intro: '直营运价 全口岸全航线覆盖 多',
//   },
//   {
//     img: require('../../assets/img/icon_kexue.png'),
//     tit: '科学管理',
//     intro: '直营运价 全口岸全航线覆盖 多',
//   },
//   {
//     img: require('../../assets/img/icon_tuandui.png'),
//     tit: '团队合作',
//     intro: '直营运价 全口岸全航线覆盖 多',
//   },
// ];

const specialPriceImages = [
  require('@/assets/img/special-price-bg1.png'),
  require('@/assets/img/special-price-bg2.png'),
  require('@/assets/img/special-price-bg3.png'),
  require('@/assets/img/special-price-bg4.png'),
];

const newsImg = require('../../assets/img/news.png');

@connect(({ home, news, loading, global }) => ({
  homeModelState: home,
  newsList: news.newsList,
  LimitList: news.LimitList,
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

    dispatch({
      type: 'news/getWebNewsListPage',
      payload: {}
    });

    dispatch({
      type: 'news/getQueryLimit'
    });
  }

  handleSubmit = params => {
    router.push({
      pathname: '/door/price-plan',
      search: stringify(params),
    });
  };

  countryFilterList = value => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getCountryDropList',
      payload: { text: value }
    });
  }


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
          filterList={this.countryFilterList}
        />
      </div>
    );
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
      <div className={styles.specialOfferItem} key={item.id}>
        <div className={styles.picPort}>
          <img src={specialPriceImages[Math.ceil(Math.random() * 3)]} alt="pic"/>
          <p className={styles.ports}>义乌 — {item.endTruck}</p>
        </div>
        <div className={styles.bottomPart}>
          <ul>
            <li>
              <p>立方</p>
              <p>{item.currency === 'USD' ? '$' : '￥'}{item.tossStandsPrice}</p>
            </li>
            <li>
              <p>公斤</p>
              <p>{item.currency === 'USD' ? '$' : '￥'}{item.heavyStandsPrice}</p>
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
        {/* <p className={styles.title} style={{ color: '#fff' }}>
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
        </div> */}
        <div className={styles.serviceContent}/>
      </div>
    );
  };

  toDetail = id => {
    router.push({
      pathname: `/news/newDetail/${id}`
    });
  }

  news = () => {
    const {  newsList, LimitList } = this.props;
    const LimitNews = LimitList.slice(0, 2);
    const LimitNewsList = newsList.slice(0, 5);

    return (
      <div className={styles.middleWrap}>
        <p className={`${styles.title} ${styles.newsTitle}`}></p>
        <div className={styles.videoNews}>
          <div className={styles.vedio} >
            <video controls  width="580" height="400" style={{ objectFit: 'fill' }} >
              <source src="https://eshipping.oss-cn-shanghai.aliyuncs.com/eshipping/vedio/%E7%88%B1%E5%89%AA%E8%BE%91-%E7%8E%AF%E4%B8%96%E7%89%A9%E6%B5%81%E8%AE%B8%E4%B8%AD%E5%8D%8E%2000_00_05-00_04_42.mp4"
                type="video/mp4"/>
            </video>
          </div>

          <div className={styles.newsMain}>
            <ul className={styles.newsPic}>
              {LimitNews && LimitNews.map(item => (
                <li key={item.id} onClick={() => { this.toDetail(item.id); }}>
                  <img src={item.picPath || newsImg} alt="" width="280" height="162" onError={(e) => { e.target['src'] = newsImg; }} />
                </li>
              ))}
            </ul>

            <p className={styles.newTit}>
              <span>新闻公告</span>
              <Link to="/news">更多</Link>
            </p>

            <ul className={styles.newsList}>
              {LimitNewsList && LimitNewsList.map(item => (
                <li key={item.id} onClick={() => { this.toDetail(item.id); }}>
                  <span className={styles.newsTitls}>{item.title}</span>
                  <span>{item.strNewsDate}</span>
                </li>
              ))}
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
    const bannerList = [1, 2, 3, 4];
    const bannerListPic = bannerList.map(item => require(`../../assets/img/banner${item}.jpg`));

    return (
      <main className={styles.conatiner}>
        <Broadside />
        <div className={styles.banner}>
          <Carousel autoplay>
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

        <p className={`${styles.title} ${styles.specalTitle}`}></p>
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
