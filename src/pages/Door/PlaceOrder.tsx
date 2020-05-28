import React, { PureComponent } from 'react';
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
  isSticky: boolean;
  routeType: string;
  visible: boolean;
  addressPageNo: number;
  addressPageSize: number;
  addressSearchValue: string;
  selectedRowKeys: any[];
  selectedRows: any[];
  defaultAddress: string;
  protocolVisible: boolean;
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
    isSticky: false,
    fixedRight: (document.body.clientWidth - 1200) / 2,
    routeType: this.props.route.type ? this.props.route.type : '',
    visible: false,
    addressPageNo: 1,
    addressPageSize: 10,
    addressSearchValue: '',
    selectedRowKeys: [],
    selectedRows: [],
    defaultAddress: '',
    protocolVisible: false,
  };

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

    if (this.ref) {
      window.addEventListener('scroll', this.handlePageScroll);
    }

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

  componentWillUnmount() {
    this.ref = null;
    window.removeEventListener('scroll', this.handlePageScroll);
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

  handlePageScroll = () => {
    const sTop =
      document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    const { top } = this.ref.getBoundingClientRect();

    this.setState({
      isSticky: sTop >= top,
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
    const { id } = this.state;

    const {
      dispatch,
      lclOrderInfo,
      form: { validateFields },
    } = this.props;

    validateFields(async(err, values) => {
      if (!err) {
        const { startTruck, endTruck, totalPrice, currency } = lclOrderInfo;
        const {
          file,
          deliveryDate,
        } = values;

        let params: ParamsState = {
          startTruck,
          endTruck,
          totalPrice,
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
      isSticky,
      routeType,
      fixedRight,
      visible,
      addressPageNo,
      addressPageSize,
      addressSearchValue,
      selectedRowKeys,
      defaultAddress,
      protocolVisible,
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
      }
      >
        <div className={styles.container} onScroll={this.handlePageScroll}>
          <div className={styles.mainContent}>
            <Card title="航运信息" bordered={false} style={{ height: 358 }}>
              <div className={styles.shippingInformation}>
                <div className={styles.routes}>
                  <div className={styles.left}>
                    <span className={styles.addressTitle}>发货地</span>
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
                    <span className={styles.addressTitle}>收货地</span>
                    <span className={styles.addressText}>{lclOrderInfo.endTruck}</span>
                  </div>
                </div>
                <div className={styles.subContent}>
                  <Badge status="processing" text={lclOrderInfo.supplierName} />
                  <Badge
                    status="processing"
                    text={`有效船期 : ${lclOrderInfo.startTime} 至${lclOrderInfo.endTime}`}
                  />
                </div>
                <div className={styles.priceInfo}>
                  <div className={styles.leftContent}>
                    <h5>单价:</h5>
                    <div className={styles.desc}>体重比 : {lclOrderInfo.cbm}立方 : {lclOrderInfo.kgs}公斤</div>
                  </div>
                  <div className={styles.priceContent}>
                    <div className={styles.info}>
                      <span>
                        立方 <strong>{lclOrderInfo.currency === 'USD' ? '$' : '¥'}{lclOrderInfo.tossPriceStandrd}</strong>
                      </span>
                      <span>
                        公斤 <strong>{lclOrderInfo.currency === 'USD' ? '$' : '¥'}{lclOrderInfo.heavyPriceStandrd}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Form layout="vertical" hideRequiredMark>
              <Card title="委托人信息" bordered={false} style={{ marginTop: 30 }}>
                <Row gutter={22}>
                  <Col span={24}>
                    <Form.Item label="公司名称（必填）">
                      {getFieldDecorator('contactCompanyName', {
                        initialValue: GetAccountInfo().companyName,
                        rules: [
                          { required: true, message: '请输入公司名称' },
                          { max: 200, message: '不能超过200字' }
                        ],
                      })(<Input placeholder="请输入公司名称" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="联系人">
                      {getFieldDecorator('contact', {
                        initialValue: GetAccountInfo().name || GetAccountInfo().userName,
                        rules: [
                          { max: 120, message: '不能超过120字' }
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
              <Card title="货物信息委托区" bordered={false} style={{ marginTop: 30 }}>
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
                          min={1}
                          max={999999}
                          precision={0}
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
                          min={1}
                          max={999999}
                          precision={0}
                          style={{ width: '100%' }}
                          onChange={(value) => this.handleGetTotalPrice('kgs', value)}
                        />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card title="附件上传" bordered={false} style={{ marginTop: 30 }}>
                <Form.Item extra="建议上传货物委托书、货物清单或其他货物描述文件（excel,word类型）">
                  {getFieldDecorator('file', {
                    // rules: [{ required: true, message: '请上传文件' }],
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                  })(
                    <Upload.Dragger
                      action="/api/web/lcl/upload.do"
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
              <Card title="备注" bordered={false} style={{ marginTop: 30 }}>
                <Form.Item>
                  {getFieldDecorator('remark', {
                    rules: [{ max: 200, message: '不能超过200字' }]
                  })(<TextArea placeholder="请输入备注" rows={4} />)}
                </Form.Item>
              </Card>
            </Form>
          </div>
          <div
            className={`${styles.instructions} ${isSticky ? styles.sticky : ''}`}
            ref={node => (this.ref = node)}
            style={{ right: routeType ? 40 : fixedRight }}
          >
            <Card title="专线说明" bordered={false}>
              <p style={{ maxHeight: 400, overflow: 'auto' }}>
                {lclOrderInfo.remarkOut}
              </p>
              <div className={styles.price}>
                <span className={styles.text}>总价</span>
                <span className={styles.num}>
                  <span>{lclTotalPrice}</span>
                  <span className={styles.symbol}>{lclOrderInfo.currency}</span>
                </span>
              </div>
            </Card>
            <Form>
              <Form.Item className={styles.agreement}>
                {getFieldDecorator('checked', {
                  valuePropName: 'checked',
                  rules: [
                    {
                      required: true,
                      validator: (_, value, callback) => {
                        if (value) {
                          callback();
                        } else {
                          callback('请勾选委托协议');
                        }
                      }

                    }
                  ],
                })(<Checkbox />)}
                <span className={styles.desc} onClick={() => this.setState({ protocolVisible: true })}>《环球义达委托协议》</span>
              </Form.Item>
            </Form>
            <Button type="primary" className={styles.submitBtn} loading={submitLoading} onClick={this.handleSubmit}>
              提交委托
            </Button>
          </div>
        </div>

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
            <h3 className={styles.title}>海运综合服务协议</h3>
            <h5>在接受本协议之前，请用户务必仔细阅读本协议的全部内容（特别是以粗体标注的内容）。如果用户对本协议的任何条款有疑问，请在后续操作之前向物流商进行询问，物流商将向用户解释条款内容。</h5>
            <h5>第一条 签约主体及定义</h5>
            <p>
              1. <strong>
              本协议由在环球义达物流信息平台成功入驻的物流服务商（下称“物流商”）与登录环球义达平台 （http://cccl.ngroo.cn下称“环球义达网站”或“网站”）签署协议、下单并使用海运综合服务（下称“服务”）的用户（下称“用户”）共同订立。</strong><br/>
              2. 本协议所称“承运人”，是指物流商按照本协议约定代理用户选定、并委托其运输货物的第三方，包括但不限于依据提单及其他运输单据承担运输责任的人。<br/>
              3. 本协议所称“物流辅助服务方”，是指物流商按照本协议约定代理用户选定、并委托其提供物流辅助服务的第三方，包括但不限于提供货物仓储、拖车运输、报关服务、快递服务的人。<br/>
              4. 本协议所称“环球义达”，指<a href="http://www.ccc-l.com" target="_blank" rel="noopener noreferrer">http://www.ccc-l.com</a>的网站运营方及\或技术支持方，具体以用户签订的相关协议为准。
            </p>
            <h5>第二条 协议签署及服务前提</h5>
            <p>
              1. <strong>本协议内容包括协议正文、附件及所有已经发布的或将来可能发布并采取合理途径通知的服务规则、物流价目表等文件。这些文件是本协议不可分割的一部分，与协议具有相同法律效力。</strong><br/>
              2. <strong>双方阅读并同意并签署服务协议时，本协议即开始生效，在之后的服务使用过程中用户均应遵守环球义达平台规则及本协议的约定，与服务相关的争议、纠纷、投诉、诉讼均受本协议约束。</strong><br/>
              3. <strong>平台有权根据业务需要变更本协议及相关规则的内容，并以书面或网站公布的形式进行更新，调整后的内容将于公布之日或公布另行指定的日期开始生效。如不同意相关修订，请届时立即停止使用本平台服务，否则将视为已接受经修订的内容。</strong><br/>
              4. 物流商依据本协议向用户提供服务，包括但不限于：代理用户选定适合的船务公司及航线，代理用户委托第三方完成货物运输、仓库装箱、代理报关、海运出口代订舱、海运提单转交、代付海运费用及其他物流增值或附加服务费用。<br/>
              5. <strong>用户须为注册地在中国大陆地区，依法成立、存续的企业或个人。用户资质不符合本款约定的，物流商可随时解除本协议、停止向其提供本服务，若因此给物流商或任何第三方造成损失的，由用户承担全部赔偿责任</strong>。<br/>
              6. <strong>用户签订本协议，即委托物流商有权依据货物运输的需求、或为达成本协议目的而代理用户操作，此操作包括但不限于以物流商自己的名义或以用户的名义、委托承运人或物流辅助服务方提供运输服务或其他有关服务。</strong><br/>
              7. <strong>用户确认，用户在网站上注册时登记的电子邮箱或结算联系人邮箱或本单联系人邮箱为用户的指定邮箱，用户通过上述邮箱接受或发出的一切事项，代表用户的意愿，由用户承担责任。</strong><br/>
            </p>
            <h5>第三条 订单及结算：</h5>
            <h6>1. 物流服务订单：</h6>
            <p>
              1.1用户应保证其在创建物流服务订单（下称“订单”）、委托订舱过程中所填写的货物信息、收发货人信息、报关信息、申报信息等真实且准确。有特殊服务要求的，用户必须在订单备注中列明或以书面/邮件形式向物流商提出，并须获得物流商同意。<strong>用户理解并同意，因服务相关内容填写不准确或不实所造成的一切责任或损失（包括但不限于货物订舱不成功、无法清关、海关罚款、收货人无法按时提货等等），应由用户承担。</strong><br/>
              1.2 <strong>用户如需对订单进行更改，货物已交付物流商的，须物流商的书面同意；未交付的，可直接取消订单、重新下订单。用户理解并同意，由于订单更改所产生的一切费用、责任均由用户承担。</strong> <br/>
              1.3用户应清楚、明确地选订增值服务、提货服务、报关服务等，并根据所选择的服务提供相关信息，以方便服务商安排提供相关服务。<br/>
              1.4用户应在指定的时间内如实提供各国海关在船开前需要的各类申报信息，申报信息必须真实、准确。<br/>
              1.5用户应在指定的时间内提供订单补料信息，如收货人信息等，物流商将根据用户填写的订单信息出具提单或提货证明。船开后要求更改提单或者提货证明的，用户必须在得到物流商的认可后前往更改；用户理解并同意，由此产生的一切风险、责任和费用均应由用户承担。<br/>
              1.6 <strong>用户确认，用户将通过指定邮箱发出相关书面指示（包括但不限于订单补料、寄单委托书等），该等书面指示为用户的最终及全部意思表示，效力与原件等同，对用户具有完全的约束力。</strong><br/>
            </p>
            <h6>2. 费用结算：</h6>
            <p>
              2.1 物流商在网站上公布的报价为不含税报价或含税报价，特别说明的除外。用户在货物上船后可收到所需支付的费用款项清单，并完成对账。如对所需支付款项有疑问，可直接联系服务商进行确认。<br/>
              2.2 <strong>用户应在账单发出后按约定支付账单项下的所有费用，物流商将在收到所有应付费用后，将提单或提货证明放给用户。如未支付完毕，物流商有权扣留用户任一订单下的单证资料及货物。</strong><br/>
              2.3 用户通过物流商发送的费用确认通知中的支付宝/微信账户进行支付，如果所需支付中有美元费用项，须按照物流商在对账单中显示的美元兑人民币汇率，用人民币进行结算。<br/>
              2.4 <strong>如用户未按约定支付所有费用，物流商有权单方扣押运输单证和货物、直至用户付清全部费用；同时，物流商也有权单方面解除本协议，由此产生的一切风险、责任、费用及对物流商造成的损失，全部由用户承担。</strong><br/>
            </p>
            <h6>3. 放货配送：</h6>
            <p>
              3.1 物流商将货送达目的地后，需通知用户，并按约定方式送货上门或者配送网点自提。
            </p>
            <h5>第四条 双方义务：</h5>
            <h6>1．物流商义务：</h6>
            <p>
              1.1 物流商应及时更新相关服务规则（如有）、服务价目表、运费价目表、航线和航程等与服务有关的信息，并公布到网站，以便用户随时查阅。<br/>
              1.2 物流商应按约定谨慎代理用户选定承运人及/或物流辅助服务方，并依据本协议承担相应代理责任。<br/>
              1.3 物流商按约定订舱并及时反馈订舱信息、运输相关信息、报关情况等服务相关信息。<br/>
              1.4 物流商应按约定和相关服务规则（如有）规定，及时、谨慎、合理地提供各项代理服务及附加服务。<br/>
              1.5 物流商收到用户的更正通知后，应按约定及时变更信息及提供后续服务。<br/>
              1.6 <strong>在服务过程中产生非正常费用的，物流商应事先通知用户费用发生原因及费用类别及预估金额（物流商无法预估的除外），实际产生的金额以在网站上公布的费用对账清单为准；用户理解并同意，因用户、行政监管、法律法规变化、及/或货物自身等原因造成的非正常费用和损失及责任（包括但不限于弃货费用、滞港费用、目的港费用、共同海损等）均应由用户全部承担，用户应按物流商要求及时向物流商支付上述非正常费用，若未及时支付，承运人、物流服务辅助方或物流商有权直接向用户追索。</strong><br/>
              1.7 因为承运人、物流辅助服务商或任何第三方的原因导致的货物损坏、丢失或毁灭的，物流商将参照法律法规、提单条款、及/或国际惯例、行业惯例等，协助用户向承运人、物流辅助服务商或相关责任方进行索赔。<strong>用户理解并同意，在任何情况下，物流商过失导致的赔付金额，须按双方约定进行赔付。</strong><br/>
            </p>
            <h6>2．用户义务</h6>
            <p>
              2.1 <strong>按约定及时向物流商提供详细、准确、真实、完整的货物托运相关资料和信息，包括但不限于货物运输要求、费用结算要求、贸易合同或信用证中和运输及运输单证密切相关的各类信息。</strong><br/>
              2.2 <strong>用户应保证所提供的身份资料、货物信息、运输相关信息、报关信息、申报信息等一切信息的真实性、完整性和准确性；此类信息有误的，应承担由此产生的一切损失，包括但不限于运输或单证传递延误或丢失、货物损坏和灭失、各类罚款、对物流商、任何第三方造成的一切损失等。</strong><br/>
              2.3 <strong>用户如需对任何服务相关信息进行更改，应提前以书面或邮件形式通知物流商；用户理解并同意，由于信息更改不及时、不准确、不被接受、不符合操作实际、不符合监管要求、不符合服务规则（如有）要求等所产生的一切损失和责任均应由用户承担。</strong><br/>
              2.4 <strong>用户应按约定及时安排货物装箱、单据和信息提交等操作。用户理解并同意，因用户未按约定操作而造成的一切责任和损失应由用户承担。</strong><br/>
              2.5 <strong>货物到达目的地后收货人未及时前往提货的，用户应尽快确认对该批货物的处理意见，否则物流商可依据相关法律法规的规定对货物进行相应的处理，由此产生的货物损失、弃货费用、滞港费用等一切损失、费用及责任均应由用户承担，用户应按承运人要求及时向承运人支付上述相关费用。</strong><br/>
              2.6 <strong>用户应对易碎易损或高价值货物自行投保货运相关保险，否则由此造成损失的，对损失中超出物流商赔偿限额的部分，应由用户自行承担。</strong><br/>
            </p>

            <h5>第五条 保密和免责：</h5>
            <p>
              1. 双方应对在服务过程中获得的各种商业秘密信息（包括但不限于议定价格、货物技术秘密等）予以保密，由于信息提供方原因已经公开的信息、或因法律法规、行政规章、政府要求、为实现本协议目的等原因需披露的信息除外。<br/>
              2. <strong>双方应保证其合法拥有履行本协议的一切必要权利（包括但不限于针对货物、信息和技术的相关知识产权、所有权、使用权、收益权等），且不侵犯对方及任何第三方的合法权利或权益；任何一方都应对其所有或经授权使用的权利之瑕疵导致的一切后果和损失独立承担全部责任。</strong><br/>
              3. <strong>用户理解并同意，物流商仅在本协议约定范围内承担义务，对于运输流程中各承运人、物流辅助服务商、或其他第三方的服务瑕疵或损害，不承担任何明示或默示担保责任。</strong><br/>
              4. 任何一方因为政府禁令，罢工，现行生效的适用法律或法规的变更，洪水，火灾，爆炸，雷电，地震，风暴，停电，通讯线路中断，他人蓄意破坏，黑客攻击，计算机病毒入侵或发作，电信部门技术、政策，政府管制等及其他不可预见、不可避免、不可克服和不可控制的不可抗力和事件影响网络正常运营，从而全部或部分不能履行本协议或迟延履行本协议的，各方互不承担责任；但遭受不可抗力影响的一方应及时将事件情况以书面形式通知对方，并向对方提交导致其全部或部分不能履行或迟延履行的证明。遭受不可抗力的一方应采取一切必要措施减少损失，并在事件消除后协商恢复本协议约定义务的履行，除非此等履行已不可能或者不必要。<br/>
            </p>
            <h5>第六条 转让禁止：</h5>
            <p>
              用户不得将本协议项下的利益转让给与本协议无关的任何第三方，否则物流商有权随时解除本协议或拒绝提供服务；协议终止的，用户仍应支付已经履行部分的费用，费用不足以弥补物流商损失的，物流商有权向用户进一步追偿。
            </p>
            <h5>第七条 其他约定：</h5>
            <p>
              <strong>用户不得向物流商及其关联企业之员工、顾问提供任何形式的不正当利益（包括但不限于提供财物、消费、款待或商业机会等）。一旦上述情形发生，双方一致同意，物流商有权立即解除本协议，并保有对用户不正当利益输送的追究权；同时,物流商还有权通知环球义达根据平台规则及或相关服务协议对用户进行关闭账号等处罚。</strong>
            </p>
            <h5>第八条 违约责任：</h5>
            <p>
              1. 因物流商原因导致无法全部或部分履行服务的，物流商应及时通知用户并适当补偿。<br/>
              2. <strong>因用户自身原因或货物本身等原因造成物流商或任何第三方损失的，包括但不限于货物滞港、发生共同海损等，用户应自行承担一切损失和责任；因此导致服务无法履行的，物流商有权中止或终止服务或解除本协议，因此产生的一切费用都应由用户承担。</strong><br/>
              3. <strong>用户违反保证义务或有其他不诚信行为的，物流商有权解除本协议并向用户索赔。</strong><br/>
              4. <strong>因用户违反本协议、环球义达平台规则及其他规则、协议导致用户无法正常登录或无法使用网站全部或部分功能/服务的，用户应自行承担由此导致的一切损失；用户理解并同意，物流商在此情况下有权自行决定是否继续履行本协议；由此给物流商或承运人或任何第三方造成损失的，用户应承担一切赔偿责任。</strong><br/>
              5. <strong>用户存在违法或涉嫌违法情况的，物流商有权单方解除本协议，并不承担任何责任。</strong><br/>
              6. 本协议有其他约定的，从其约定。<br/>
            </p>
            <h5>第九条 法律适用及争议解决：</h5>
            <p>
              1. <strong>本协议适用中华人民共和国法律，排除冲突法的适用。</strong><br/>
              2. <strong>如果因本协议产生任何争议的，物流商和用户应当首先友好协商解决，协商不成时，均应依照中华人民共和国法律予以处理。</strong><br/>
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DoorPlaceOrderPage);
