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
import REGEX from '@/utils/regex';
import { debounce, cloneDeep } from 'lodash';
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
  selectedRowKeys: any[];
  selectedRows: any[];
  defaultAddress: string;
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
    selectedRowKeys: [],
    selectedRows: [],
    defaultAddress: ''
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
  }

  componentWillUnmount() {
    this.ref = null;
    window.removeEventListener('scroll', this.handlePageScroll);
  }

  handleGetTotalPrice = (type, value) => {
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
  }

  handleGetDefaultAddress = async() => {
    const { dispatch } = this.props;

    let result = await dispatch({
      type: 'address/getDefaultAddress',
    });

    this.setState({
      defaultAddress: result['defaultContact'].portEndAddress
    });
  }

  getAddressList = () => {
    const { dispatch } = this.props;
    const { addressPageNo, addressPageSize } = this.state;

    const params = {
      pageNo: addressPageNo,
      pageSize: addressPageSize,
    };

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
    const { name, size } = file;
    const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
    const fileList = form.getFieldValue('file');

    if (fileList && fileList.length >= 10) {
      message.warning('上传的图片数量大于10张');
      return false;
    }

    // if (!REGEX.PHOTO_TYPES.test(name)) {
    //   message.warning('上传的图片格式不正确');
    //   return false;
    // }
    if (size >= MAX_UPLOAD_SIZE) {
      message.warning('上传的图片大于10M');
      return false;
    }

    return true;
  }

  handleSubmit = () => {
    const { id } = this.state;

    const {
      dispatch,
      lclOrderInfo,
      form: { validateFields },
    } = this.props;

    validateFields((err, values) => {
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

        dispatch({
          type: 'door/orderSubmit',
          payload: {
            ...params,
            freightLclId: id,
          },
        });
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
      selectedRowKeys,
      defaultAddress,
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

    const accepts = ['.pdf', '.txt', '.doc', '.xls', '.xlsx'].join(',');

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
                        立方 <strong>{lclOrderInfo.currency === 'USD' ? '$' : '¥'}{lclOrderInfo.cbm}</strong>
                      </span>
                      <span>
                        公斤 <strong>{lclOrderInfo.currency === 'USD' ? '$' : '¥'}{lclOrderInfo.kgs}</strong>
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
                          {  max: 200, message: '不能超过200字' }
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
                        rules: [{ max: 250, message: '不能超过250字' }]
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
                <Form.Item extra="建议上传excel,word类型">
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
                    rules: [{ max: 500, message: '不能超过500字' }]
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
                  rules: [{ required: true, message: '请同意会员协议' }],
                })(<Checkbox />)}
                <span className={styles.desc}>环球义达委托协议</span>
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
                <TextArea rows={2} />
              </Col>

              <Col span={2}>
                <div style={{ textAlign: 'right' }}>
                  <Button type="primary">搜索</Button>
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
      </div>
    );
  }
}

export default Form.create()(DoorPlaceOrderPage);
