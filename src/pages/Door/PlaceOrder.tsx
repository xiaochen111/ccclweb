import React, { PureComponent, Fragment } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Card,
  Upload,
  Icon,
  Input,
  InputNumber,
  message,
  Badge,
  Checkbox,
  Button,
  DatePicker,
  Modal,
  Select,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PageLoading from '@/components/PageLoading';
import StandardTable from '@/components/StandardTable';
import FooterToolbar from '@/components/FooterToolbar';
import { GetPageQuery } from '@/utils/utils';
import { GetAccountInfo } from '@/utils/cache';
import { router } from 'umi';
import REGEX from '@/utils/regex';
import { debounce } from 'lodash';
import styles from './PlaceOrder.scss';

const { TextArea } = Input;
const Option = Select.Option;

interface IProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  match?: any;
  lclOrderInfo: any;
  globalPackageTypeList: any[];
  route: any;
  addressList: any[];
  addressTotal: number;
  submitLoading: boolean;
  lclTotalPrice: number;
}
interface IState {
  id: string;
  routeType: string;
  visible: boolean;
  addressPageNo: number;
  addressPageSize: number;
  addressSearchValue: string;
  selectedRowKeys: any[];
  selectedRows: any[];
  defaultAddress: string;
  protocolVisible: boolean;
  protocolValue: boolean;
}

interface ParamsState {
  startTruck: string; //收货地点(国内门点)
  endTruck: string; //海外城市(交货地)
  totalPrice: number; //参考价
  totalPriceCurrency: string; //币种
  goodsType?: string; //品名
  totalPiece?: number; //货物总件数
  totalKgs?: number; //货物总重量
  totalCbm?: number; //货物总体积
  deliveryDate?: string; //预计送货日期
  file?: string; //附件ID
  packageType?: string; //包装类型
  contactCompanyName: string; //委托人信息-公司名称
  contact?: string; //委托人信息-联系人
  contactTel: string; //委托人信息-联系人电话
  contactEmail?: string; //委托人信息-联系人邮箱
  portEndAddress?: string; //目的港送货地址
  supplierName?: string; //供应商
  remark?: string; //备注
  // createId?: string;
}

@connect(({ loading, door, global, address }) => ({
  addressList: address.addressList,
  addressTotal: address.addressTotal,
  lclOrderInfo: door.lclOrderInfo,
  lclTotalPrice: door.lclTotalPrice,
  globalPackageTypeList: global.globalPackageTypeList,
  submitLoading: loading.models['door/orderSubmit']
}))
class DoorPlaceOrderPage extends PureComponent<IProps, IState> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
    routeType: this.props.route.type ? this.props.route.type : '',
    visible: false,
    addressPageNo: 1,
    addressPageSize: 10,
    addressSearchValue: '',
    selectedRowKeys: [],
    selectedRows: [],
    defaultAddress: '',
    protocolVisible: false,
    protocolValue: false
  };

  protocoText = [
    {
      title: '第一章　订舱',
      subList: [
        '1.1  甲乙双方均持有有效证件（身份证或营业执照），并已在环球义达平台上提供证件作为备案。',
        '1.2  甲方在开船前七天或航班起飞前3-5天通过环球义达在线订舱形式向乙方进行委托订舱，下达订单。甲方下达的订单，以甲方在环球义达上传的委托订单信息为准。甲方信息不全或信息有误的，乙方有权拒绝委托。',
        '1.3  乙方在收到甲方在线委托后即开始订舱，及时确认船期、船名、航次、，以及接送货物的地点、方式、时间、联系人等。'
      ]
    },
    {
      title: '第二章　双方责任',
      subList: [
        '2.1  甲方提供订单委托信息必须包括：托运人、收货人、起运地、目的港、交货地、件数、中英文品名、毛重、体积。',
        '2.2  甲方提供乙方用于清关的报关资料应完整、有效，并必须严格按照中国海关规定,如因报关资料的瑕疵导致无法及时报关，乙方不承担责任，如违反“海关法”及相关法规，乙方可以退还甲方不予报关，由此产生任何法律责任由甲方承担。 ',
        '2.3  甲方在订单操作方面的任何变更修改，必须以书面或邮件形式通知乙方，乙方不接受任何口头通知。',
        '2.4  乙方应按与甲方约定方式完成目的地交货。',
        '2.5  甲方在货物出运后因修改运/提单中有关项目或变更对货物的处置方式，应书面委托乙方，由此产生的费用及责任由甲方负责。',
        '2.6	甲方送乙方仓库的货物，如有破损、受潮、严重变形等，乙方有权不予接受。',
        '2.7	甲方发出委托书后，乙方已订妥舱位，甲方要求撤销委托的，甲方除承担本协议的义务外，亦应赔偿因撤销委托而给乙方造成的经济损失。',
        '2.8  甲方应依约向乙方支付本合同项下的有关费用，如甲方委托乙方的业务发票开给第三方的，则甲方负有连带付款责任。',
        '2.9  乙方应妥善保管甲方提供的清关文件，不错报、不漏报、不遗失，做好每份单证的交接、签收工作，在甲方支付完毕所有费用后，乙方有义务将相关单证退还甲方。反之，如甲方没有支付完毕所有费用，乙方有权利暂扣相关单证，由此造成的损失由甲方承担。',
        '2.10  甲方应按时支付运费,甲方不能以货物运输中，由于船公司的原因出现延迟,货损等理由拒付运费,否则乙方有权留置甲方单证及货物。',
        '2.11  如甲方及发、收货人在出运、转运、收货过程中由于申报与箱内实际货物不符等原因引起的滞留、弃货等纠纷,甲方和发货人承担责任。',
        '2.12  凡实际承运人向乙方收取的有关甲方订舱货物的新有额外费用，乙方将根据实际承运人的费用清单全额向甲方收取。',
        '2.13  甲方保证收、发货人的真实存在,如因收、发货人不实造成甲方损失，或因此原因引起的滞留、弃货等纠纷,甲方和发货人承担责任.',
        '2.14  出口货物未按规定申报,所有后果及法律责任甲方自负。',
        '2.15  甲方订单显示的收货人未能在规定日期内提货并签收，因此在目的地而产生任何费用，甲方有义务承担支付相关费用和责任,乙方有权滞留甲方相关有效单证,直到问题解决。'
      ]
    },
    {
      title: '第三章　费用结算及期限',
      subList: [
        '3.1  运费及相关费用以双方在环球义达平台确认为准。',
        '3.2  甲方同意向乙方支付因海关、三检或非乙方人为操作所发生之查验、冲关、待时等实际费用。',
        '3.3  甲方对于乙方提供的费用确认通知，无异议确认后，乙方将根据确认费用收取。',
        '3.4  甲乙双方根据业务需求，自行协商付款期限，甲方通过平台的支付通道，将运费支付乙方。',
        '3.5  如果超过付款期，乙方有权收取违约金，具体标准以甲乙双方事先约定执行。对甲方逾期未付款项，乙方有权就已发生业务的累积欠款及违约金一并向甲方主张权利。且乙方有权拒绝代理甲方委托出运货物或书面通知甲方解除本协议。',
        '3.6  甲方同意，如甲方未能按照本协议规定支付本协议项下款项，乙方有权选择扣留有关的运输单据或报关单据或货物直至甲方付清所欠款项，并且不影响乙方采取其他的救济方法。'
      ]
    },
    {
      title: '第四章　索赔',
      subList: [
        '4.1  因货物运输而引起的任何索赔，对于海运货物运输代理，甲方应根据《中华人民共和国海商法》的规定（对于空运货物运输代理，甲方应根据《中华人民共和国民用航空法》的规定），在给予乙方合理宽限期的基础上，在法定时效内向乙方送达书面索赔函（说明索赔依据、金额等）。',
        '4.2  因甲方原因而使乙方提出索赔要求时间超出法定时效的，乙方不承担任何法律责任。',
        '4.3  甲方对乙方的索赔不得自行以其他票业务作抵扣、偿债，甲方不得采取拒付、拖欠或暂扣其他票的业务的运费及其他杂费等措施。',
        '4.4  对货物延期交付的索赔，应以该部分货物所涉运输费用为限。延期交付而产生的间接损失，乙方不承担法律责任。',
        '4.5  对货物损失的索赔，索赔方应提供相关法定证据，甲乙双方协商解决。',
      ]
    },
    {
      title: '第五章　不可抗力与情势变更',
      subList: [
        '5.1  由于地震、台风、水灾、战争、罢工以及其他不能预见并且对其发生和后果不能防止或避免的不可抗力事件，致使影响本合同的履行或者不能按约定的条件履行时，遇有上述不可抗事件的一方，应立即将事件情况通知另一方。按事件对履行合同影响的程度，由双方协商决定是否解除合同，或者免除或部分免除履行合同的责任，或者延期履行合同。',
        '5.2  本协议签订后，客观情况因不可归责于双方的原因发生异常变化，致使本协议的基础动摇或丧失，若继续履行协议将对协议一方没有意义或造成重大损失，该方可以要求就协议的内容重新协商；协商不成的，可以请求法律变更或解除协议。'
      ]
    },
    {
      title: '第六章　争议解决',
      subList: [
        '6.1  甲、乙双方的任何争议应通过协商解决，双方经协商未能达成一致的，交由乙方所在地有管辖权的法院管辖。'
      ]
    },
    {
      title: '第七章　其  他',
      subList: [
        '7.1  本协议符合相关的中华人民共和国法律、法规及中国参加的国际公约、条约、惯例等。',
        '7.2  任何一方要求对本协议条款进行修改或补充时，可随时通知另一方。对本协议的任何修改或补充应得到另一方的书面确认（如签订书面补充协议或电子邮件确认等）。在修改或补充未获得双方书面确认之前，仍按本协议原条款执行。',
        '7.3  在执行本协议过程中，如任何一方欲提前终止业务往来，需在终止之日前三十天书面正式通知对方，不得以突然终止业务方式阻碍操作、收费、退单等工作。',
        '7.4  本协议到期后，双方仍应承担本协议项下双方应履行而尚未履行完毕的一切义务。',
        '7.5  本协议自甲方在环球义达平台第一次下达订单指令（点击提交订单委托），乙方接受订单（点击接受订舱按钮）之日起生效,有效期一年。到期如协议各方未提出终止本协议的书面通知，则本协议将自动顺延一年。',
        '7.6  本协议未尽事宜，双方以书面协议的形式予以补充，补充协议作为本协议的附件，与本协议具有同等法律效力。'
      ]
    }
  ]

  private ref: any;

  private columns = [
    {
      title: '送货地址',
      dataIndex: 'portEndAddress',
      key: 'portEndAddress',
      render: (text, record) => (
        <div className={styles.addressContainer}>
          {record.contactDefault === 1 ? <span className={styles.default}>默认</span> : ''}
          {record.portEndAddress}
        </div>
      ),
    },
  ];

  componentDidMount() {
    const { id } = this.state;
    const { dispatch } = this.props;
    const params = GetPageQuery();

    const data  = {
      freightLclId: id,
      kgs: params.kgs,
      cbm: params.cbm,
    };

    dispatch({
      type: 'door/getLclDetail',
      payload: data,
    });
    dispatch({
      type: 'door/getTotalPrice',
      payload: data,
    });
    this.handleGetDefaultAddress();
    this.getAddressList();
    this.handlePackageTypeSearch('');
  }

  handleGetTotalPrice = debounce((type, value) => {
    const { id } = this.state;
    const { dispatch, form: { getFieldsValue } } = this.props;
    const { totalCbm, totalKgs } = getFieldsValue(['totalCbm', 'totalKgs']);

    dispatch({
      type: 'door/getTotalPrice',
      payload: {
        freightLclId: id,
        cbm: type === 'cbm' ? value : totalCbm,
        kgs: type === 'kgs' ? value : totalKgs
      }
    });
  }, 500)

  handleGetDefaultAddress = async() => {
    const { dispatch } = this.props;

    let result = await dispatch({
      type: 'address/getDefaultAddress',
    });

    this.setState({
      defaultAddress: result && result['defaultContact'] && result['defaultContact'].portEndAddress
    });
  }

  getAddressList = () => {
    const { dispatch } = this.props;
    const { addressPageNo, addressPageSize, addressSearchValue } = this.state;

    const params = {
      pageNo: addressPageNo,
      pageSize: addressPageSize,
    };

    if (addressSearchValue) {
      params['portEndAddress'] = addressSearchValue;
    }

    dispatch({
      type: 'address/getContactAddress',
      payload: params,
    });
  };

  handlePackageTypeSearch = debounce(value => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getGlobalPackageTypeList',
      payload: { name: value },
    });
  }, 500);

  handleTabelChange = pagination => {
    this.setState({
      addressPageNo: pagination.current,
    }, this.getAddressList,
    );
  };

  handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  handleModalOk = () => {
    const { form } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows && selectedRows.length) {
      form.setFieldsValue({
        portEndAddress: selectedRows[0].portEndAddress,
      });
    }
    this.handleModalCancel();
  };

  handleModalCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleBeforeUpload = file => {
    const { form } = this.props;
    const { size } = file;
    const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
    const fileList = form.getFieldValue('file');

    return new Promise<any>((resolve, reject) => {
      if (fileList && fileList.length >= 10) {
        message.warning('上传的图片数量大于10张');
        return reject(false);
      }
      if (size >= MAX_UPLOAD_SIZE) {
        message.warning('上传的图片大于10M');
        return reject(false);
      }

      return resolve(true);
    });
  }

  handleSubmit = () => {
    const { id, protocolValue } = this.state;

    const {
      dispatch,
      lclOrderInfo,
      lclTotalPrice,
      form: { validateFields },
    } = this.props;

    validateFields(async(err, values) => {
      if (!err) {
        const { startTruck, endTruck, currency } = lclOrderInfo;
        const {
          file,
          deliveryDate,
        } = values;

        if (!protocolValue) {
          message.error('请勾选委托协议');
          return;
        }

        let params: ParamsState = {
          startTruck,
          endTruck,
          totalPrice: lclTotalPrice,
          totalPriceCurrency: currency,
          contactCompanyName: values.contactCompanyName,
          contactTel: values.contactTel,
        };

        for (let i in values) {
          if (values[i] !== undefined &&  values[i] !== null) {
            params[i] = values[i];
          }
        }

        if (file && file.length) {
          params['file'] = file
            .filter(o => o.response && o.response.code === '1')
            .map(item => item.response.resMap.resMap.sysFileId)
            .join(',');
        } else {
          delete params['file'];
        }

        if (deliveryDate) {
          params['deliveryDate'] = deliveryDate.format('YYYY-MM-DD');
        }

        let result =  await dispatch({
          type: 'door/orderSubmit',
          payload: {
            ...params,
            freightLclId: id,
          },
        });

        if (result) {
          Modal.success({
            title: '委托成功',
            okText: '知道了',
            onOk: () => {
              router.push('/control/order/my');
            }
          });
        }
      }
    });
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const {
      routeType,
      visible,
      addressPageNo,
      addressPageSize,
      addressSearchValue,
      selectedRowKeys,
      defaultAddress,
      protocolVisible,
      protocolValue
    } = this.state;

    const {
      lclOrderInfo,
      globalPackageTypeList,
      form: { getFieldDecorator },
      addressList,
      addressTotal,
      submitLoading,
      lclTotalPrice
    } = this.props;

    const params = GetPageQuery();

    if (!lclOrderInfo) return <PageLoading />;

    const pagination = {
      total: addressTotal,
      current: addressPageNo,
      pageSize: addressPageSize,
    };

    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.handleRowSelectionChange,
    };

    const accepts = ['.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx'].join(',');

    return (
      <div style={
        routeType
          ? { width: '100%', padding: '0 20px' }
          : { width: 1200, margin: '0 auto', padding: 20 }
      }>
        <Form layout="vertical" hideRequiredMark className={styles.container}>
          <div className={styles.mainContent}>
            <h2 style={{ margin: 0 }}>重要信息区（建议填写）</h2>
            <Card title="委托人信息" bordered={false} style={{ marginTop: 18 }}>
              <Row gutter={22}>
                <Col span={24}>
                  <Form.Item label="公司名称（必填）">
                    {getFieldDecorator('contactCompanyName', {
                      initialValue: GetAccountInfo().companyName,
                      rules: [
                        { required: true, message: '请输入公司名称' },
                        { max: 30, message: '不能超过30字' }
                      ],
                    })(<Input placeholder="请输入公司名称" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="联系人">
                    {getFieldDecorator('contact', {
                      initialValue: GetAccountInfo().name || GetAccountInfo().userName,
                      rules: [
                        { max: 30, message: '不能超过30字' }
                      ],
                    })(<Input placeholder="请输入联系人姓名" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="手机（必填）">
                    {getFieldDecorator('contactTel', {
                      initialValue: GetAccountInfo().phone,
                      rules: [
                        { required: true, message: '请输入手机号' },
                        { pattern: REGEX.MOBILE, message: '手机号格式不正确' },
                      ],
                    })(<Input placeholder="请输入手机号" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="邮箱">
                    {getFieldDecorator('contactEmail', {
                      initialValue: GetAccountInfo().email,
                      rules: [
                        { max: 120, message: '不能超过120字' }
                      ],
                    })(<Input placeholder="请输入邮箱" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={
                      <span>
                          目的地送货地址
                        <Icon
                          type="diff"
                          style={{ marginLeft: 5 }}
                          onClick={() => {
                            this.setState({ visible: true });
                          }}
                        />
                      </span>
                    }
                  >
                    {getFieldDecorator('portEndAddress', {
                      initialValue: defaultAddress,
                      rules: [{ max: 200, message: '不能超过200字' }]
                    })(
                      <TextArea placeholder="请输入目的地送货地址" rows={4} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <h2>货物委托信息（非必填）</h2>
            <Card title="货物信息委托区" bordered={false} style={{ marginTop: 20 }}>
              <Row>
                <Col span={24}>
                  <Form.Item label="货物品名（可填写多条）">
                    {getFieldDecorator('goodsType', {
                      rules: [{ max: 600, message: '不能超过600字' }]
                    })(
                      <TextArea placeholder="请输入货物品名" rows={4} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={22}>
                <Col span={8}>
                  <Form.Item label="包装类型">
                    {getFieldDecorator('packageType')(
                      <Select
                        showSearch
                        placeholder="请选择包装类型"
                        onSearch={this.handlePackageTypeSearch}
                      >
                        {globalPackageTypeList.map(d => (
                          <Option key={d.id} value={d.nameCn}>
                            {d.nameCn}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="货物总件数">
                    {getFieldDecorator('totalPiece')(<InputNumber min={1} max={999999} precision={0} placeholder="请输入货物总件数" style={{ width: '100%' }}/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="预计送货日">
                    {getFieldDecorator('deliveryDate')(
                      <DatePicker placeholder="请输入预计送货日" />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={22}>
                <Col span={8}>
                  <Form.Item label="货物总体积（立方）">
                    {getFieldDecorator('totalCbm', {
                      initialValue: params.cbm
                    })(
                      <InputNumber
                        placeholder="请输入货物总体积"
                        min={0.01}
                        max={999999}
                        precision={2}
                        style={{ width: '100%' }}
                        onChange={(value) => this.handleGetTotalPrice('cbm', value)}
                      />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="货物总量（公斤）">
                    {getFieldDecorator('totalKgs', {
                      initialValue: params.kgs
                    })(
                      <InputNumber
                        placeholder="请输入货物总量"
                        min={0.01}
                        max={999999}
                        precision={2}
                        style={{ width: '100%' }}
                        onChange={(value) => this.handleGetTotalPrice('kgs', value)}
                      />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="附件上传" bordered={false} style={{ marginTop: 20 }}>
              <Form.Item extra="建议上传货物委托书、货物清单或其他货物描述文件（excel,word类型）">
                {getFieldDecorator('file', {
                  // rules: [{ required: true, message: '请上传文件' }],
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                })(
                  <Upload.Dragger
                    action="/yapi/web/lcl/upload.do"
                    beforeUpload={this.handleBeforeUpload}
                    accept={`image/*, ${accepts}`}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="cloud-download" />
                    </p>
                    <p className="ant-upload-text">将文件拖到此处或点击上传</p>
                  </Upload.Dragger>,
                )}
              </Form.Item>
            </Card>
            <Card title="备注" bordered={false} style={{ marginTop: 20 }}>
              <Form.Item>
                {getFieldDecorator('remark', {
                  rules: [{ max: 200, message: '不能超过200字' }]
                })(<TextArea placeholder="请输入备注" rows={4} />)}
              </Form.Item>
            </Card>
          </div>
          <Card title="航运信息" bordered={false} className={styles.subContent}>
            <div className={styles.shippingInformation}>
              <div className={styles.routes}>
                <div className={styles.left}>
                  <span className={styles.addressTitle}>收货地</span>
                  <span className={styles.addressText}>YIWU/义乌</span>
                </div>
                <span className={styles.middle}>
                  <span>
                    <Icon type="clock-circle" style={{ marginRight: 5 }} />
                    {lclOrderInfo.effectiveDays}天
                  </span>
                  <i className="iconfont iconicon-dao" style={{ fontSize: 6, color: '#D8D8D8FF' }}/>
                </span>
                <div className={styles.right}>
                  <span className={styles.addressTitle}>交货地</span>
                  <span className={styles.addressText}>{lclOrderInfo.endTruck}</span>
                </div>
              </div>
              <div className={styles.panelInfo}>
                <ul className={styles.infoList}>
                  <li>
                    <span>供应商:</span>
                    <span>{lclOrderInfo.supplierName}</span>
                  </li>
                  <li>
                    <span>有效船期: </span>
                    <span>{` ${lclOrderInfo.startTime} 至${lclOrderInfo.endTime}`}</span>
                  </li>
                  <li>
                    <span>体重比:</span>
                    <span>{lclOrderInfo.cbm}立方 : {lclOrderInfo.kgs}公斤</span>
                  </li>
                </ul>
                <div className={styles.priceInfo}>
                  <span className={styles.label}>单价</span>
                  <div className={styles.value}>
                    <div>立方<strong>{lclOrderInfo.currency === 'USD' ? '$' : '¥'}{lclOrderInfo.tossPriceStandrd}</strong></div>
                    <div>公斤<strong>{lclOrderInfo.currency === 'USD' ? '$' : '¥'}{lclOrderInfo.heavyPriceStandrd}</strong></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.lineExp}>
              <h6>专线说明</h6>
              <p>{lclOrderInfo.remarkOut}</p>
            </div>
            <div className={styles.totalPrice}>
              <h5>总价</h5>
              <span className={styles.num}>
                <span>{lclTotalPrice}</span>
                <span className={styles.symbol}>{lclOrderInfo.currency}</span>
              </span>
            </div>
          </Card>
          <FooterToolbar
            extra={<Button onClick={() => { router.goBack(); }}>返回</Button>}
          >
            <div className={styles.footWrapper}>
              <div className={styles.agreement}>
                <Checkbox checked={protocolValue} onChange={e => this.setState({ protocolValue: e.target.checked })}/>
                <span className={styles.desc} onClick={() => this.setState({ protocolVisible: true })}>《环球义达委托协议》</span>
              </div>
              <Button type="primary" size="large" className={styles.submitBtn} loading={submitLoading} onClick={this.handleSubmit}>
                提交委托
              </Button>
            </div>
          </FooterToolbar>
        </Form>

        <Modal
          title="目的地送货地址"
          visible={visible}
          width={800}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <div className={styles.modalSearch}>
            <Row gutter={20}>
              <Col span={20}>
                <TextArea
                  allowClear
                  rows={2}
                  value={addressSearchValue}
                  onChange={(e) => this.setState({ addressSearchValue: e.target.value })}
                />
              </Col>
              <Col span={2}>
                <div style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.getAddressList}>搜索</Button>
                </div>
              </Col>
            </Row>
          </div>

          <StandardTable
            rowKey={'createTime'}
            size={'middle'}
            columns={this.columns}
            dataSource={addressList}
            // loading={tableLoading}
            pagination={pagination}
            rowSelection={rowSelection}
            onChange={this.handleTabelChange}
            scroll={{ y: 450 }}
          />
        </Modal>

        <Modal
          title="委托协议"
          visible={protocolVisible}
          maskClosable={false}
          onCancel={() => this.setState({ protocolVisible: false })}
          width={890}
          footer={null}
        >
          <div className={styles.protocolWrapper}>
            <h3 className={styles.title}>国际货物运输代理委托（在线版）</h3>
            <p><strong>甲方：</strong>委托方</p>
            <p><strong>乙方：</strong>物流服务供应商</p>
            <p style={{ textIndent: '2em' }}>甲乙双方经友好协商,根据《中华人民共和国合同法》、《中华人民共和国海商法》、《中华人民共和国民用航空法》等法规的有关规定, 就甲方在环球义达（<a href="www.ccc-l.com">www.ccc-l.com</a>）平台（后简称“环球义达”或“平台”）委托乙方代理出口货运业务事宜,达成协议如下：</p>
            {
              this.protocoText.map(item => (
                <Fragment key={item.title}>
                  <h4>{item.title}</h4>
                  {
                    item.subList.map((t, index) => (
                      <p key={index}>{t}</p>
                    ))
                  }
                </Fragment>
              ))
            }

          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DoorPlaceOrderPage);
