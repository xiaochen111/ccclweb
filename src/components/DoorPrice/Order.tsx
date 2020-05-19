import React, { PureComponent } from 'react';
import {
  Form,
  Card,
  Upload,
  Icon,
  Row,
  Col,
  Input,
  Select,
  Badge,
  Checkbox,
  Button,
  DatePicker,
} from 'antd';
import PageLoading from '@/components/PageLoading';
import { FormComponentProps } from 'antd/lib/form';
import REGEX from '@/utils/regex';
import styles from './Order.scss';

const { TextArea } = Input;

export interface RegisterProps extends FormComponentProps {
  pageLoading?: boolean;
  defaultInfo: any;
  onSubmit: (params: any) => void;
}

interface ParamsState {
  startTruck: string; //收货地点(国内门点)
  endTruck: string; //海外城市(交货地)
  totalPrice: number; //参考价
  goodsType?: string; //品名
  totalPiece?: number; //货物总件数
  totalKgs?: number; //货物总重量
  totalCbm?: number; //货物总体积
  deliveryDate?: string; //预计送货日期
  file: string; //附件ID
  packageType?: string; //包装类型
  // contactCompanyName?: string; //委托人信息-公司名称
  contact?: string; //委托人信息-联系人
  contactTel: string; //委托人信息-联系人电话
  contactEmail?: string; //委托人信息-联系人邮箱
  portEndAddress?: string; //目的港送货地址
  supplierName?: string; //供应商
  remark?: string; //备注
  // createId?: string;
}

class DoorPlaceOrder extends PureComponent<RegisterProps, any> {
  ref: any;

  state = {
    isSticky: false,
    fixedRight: (document.body.clientWidth - 1200) / 2,
  };

  componentDidMount() {
    if (this.ref) {
      window.addEventListener('scroll', this.handlePageScroll);
    }
  }

  componentWillUnmount() {
    this.ref = null;
    window.removeEventListener('scroll', this.handlePageScroll);
  }

  handlePageScroll = () => {
    const sTop =
      document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    const { top } = this.ref.getBoundingClientRect();

    this.setState({
      isSticky: sTop >= top,
    });
  };

  handleSubmit = () => {
    const {
      defaultInfo,
      form: { validateFields },
      onSubmit,
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        const { startTruck, endTruck, totalPrice } = defaultInfo;

        const {
          fileList,
          goodsType,
          packageType,
          deliveryDate,
          totalKgs,
          totalCbm,
          contact,
          contactTel,
          contactEmail,
          portEndAddress,
          remark,
        } = values;

        let file = fileList
          .filter(o => o.response && o.response.code === '1')
          .map(item => item.response.resMap.fileId)
          .join(',');

        const params: ParamsState = {
          startTruck,
          endTruck,
          totalPrice,
          file,
          contactTel,
        };

        if (goodsType) {
          params['goodsType'] = goodsType;
        }
        if (packageType) {
          params['packageType'] = packageType;
        }
        if (deliveryDate) {
          params['deliveryDate'] = deliveryDate;
        }
        if (totalKgs) {
          params['totalKgs'] = totalKgs;
        }
        if (totalCbm) {
          params['totalCbm'] = totalCbm;
        }
        if (contact) {
          params['contact'] = contact;
        }
        if (totalCbm) {
          params['totalCbm'] = totalCbm;
        }
        if (contactEmail) {
          params['contactEmail'] = contactEmail;
        }
        if (portEndAddress) {
          params['portEndAddress'] = portEndAddress;
        }
        if (remark) {
          params['remark'] = remark;
        }
        console.log(params, '1');
        onSubmit(params);
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
      form: { getFieldDecorator },
      pageLoading,
      defaultInfo = {},
    } = this.props;
    if (!defaultInfo) return <PageLoading />;
    const { isSticky, fixedRight } = this.state;

    return (
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
                  <Icon type="clock-circle" />
                  40天
                </span>
                <div className={styles.right}>
                  <span className={styles.addressTitle}>收货地</span>
                  <span className={styles.addressText}>{defaultInfo.endTruck}</span>
                </div>
              </div>
              <div className={styles.subContent}>
                <Badge
                  status="processing"
                  text={`有效船期 : ${defaultInfo.startTime} 至${defaultInfo.endTime}`}
                />
                <Badge status="processing" text={`有效信息 :${defaultInfo.remarkOut}`} />
              </div>
              <div className={styles.priceInfo}>
                <h5>单价:</h5>
                <div className={styles.priceContent}>
                  <div className={styles.info}>
                    <span>
                      CBM <strong>{defaultInfo.cbm}</strong>
                    </span>
                    <span>
                      KGS <strong>{defaultInfo.kgs}</strong>
                    </span>
                  </div>
                  <p>注：费用按照1:40（KGS数值/400和体积取最大值计费）</p>
                </div>
              </div>
            </div>
          </Card>
          <Form layout="vertical">
            <Card title="附件上传" bordered={false} style={{ marginTop: 30 }}>
              <Form.Item>
                {getFieldDecorator('fileList', {
                  rules: [{ required: true, message: '请上传文件' }],
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                })(
                  <Upload.Dragger action="/api/web/lcl/upload.do">
                    <p className="ant-upload-drag-icon">
                      <Icon type="cloud-download" />
                    </p>
                    <p className="ant-upload-text">将文件拖到此处或点击上传</p>
                  </Upload.Dragger>,
                )}
              </Form.Item>
            </Card>
            <Card title="货物信息委托区" bordered={false} style={{ marginTop: 30 }}>
              <Row>
                <Col span={24}>
                  <Form.Item label="货物品名（可填写多条）">
                    {getFieldDecorator('goodsType')(
                      <TextArea placeholder="请输入货物品名" rows={4} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={22}>
                <Col span={8}>
                  <Form.Item label="包装类型">
                    {getFieldDecorator('packageType')(<Select placeholder="请输入包装类型" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="货物总件数">
                    {getFieldDecorator('totalPiece')(<Input placeholder="请输入货物总件数" />)}
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
                  <Form.Item label="货物总量（KGS）">
                    {getFieldDecorator('totalKgs')(<Input placeholder="请输入货物总量" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="货物总体积（CBM）">
                    {getFieldDecorator('totalCbm')(<Input placeholder="请输入货物总体积" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="委托人信息" bordered={false} style={{ marginTop: 30 }}>
              <Row gutter={22}>
                <Col span={8}>
                  <Form.Item label="联系人">
                    {getFieldDecorator('contact')(<Input placeholder="请输入联系人姓名" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="手机">
                    {getFieldDecorator('contactTel', {
                      rules: [
                        { required: true, message: '请输入手机号' },
                        { pattern: REGEX.MOBILE, message: '手机号格式不正确' },
                      ],
                    })(<Input placeholder="请输入手机号" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="邮箱">
                    {getFieldDecorator('contactEmail')(<Input placeholder="请输入邮箱" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="发货人地址">
                    {getFieldDecorator('portEndAddress')(
                      <TextArea placeholder="请输入发货人地址" rows={4} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="备注" bordered={false} style={{ marginTop: 30 }}>
              <Form.Item>
                {getFieldDecorator('remark')(<TextArea placeholder="请输入备注" rows={4} />)}
              </Form.Item>
            </Card>
          </Form>
        </div>
        <div
          className={`${styles.instructions} ${isSticky ? styles.sticky : ''}`}
          ref={node => (this.ref = node)}
          // style={{ right: isSticky ? 40 : 40 }}
        >
          <Card title="费用说明" bordered={false}>
            <p>
              1、MIN
              2CBM起计费，价格适用于普货，最长边不超过63cm，单箱不超过22.5kg，不接受任何木制品包装。
            </p>
            <p>
              2、需用卖家自有bond清关，需加收每票285USD的额外费用，包含AMS/ISF/DOC/单独清关费用。{' '}
            </p>
            <div className={styles.price}>
              <span className={styles.text}>总价</span>
              <span className={styles.num}>
                <span>{defaultInfo.totalPrice}</span>
                <span className={styles.symbol}>{defaultInfo.currency}</span>
              </span>
            </div>
          </Card>
          <Form>
            <Form.Item className={styles.agreement}>
              {getFieldDecorator('phoneNum', {
                valuePropName: 'checked',
                rules: [{ required: true, message: '请同意会员协议' }],
              })(<Checkbox />)}
              <span className={styles.desc}>环球义达委托协议</span>
            </Form.Item>
          </Form>
          <Button type="primary" className={styles.submitBtn} onClick={this.handleSubmit}>
            提交委托
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create<RegisterProps>()(DoorPlaceOrder);
