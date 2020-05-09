import React, { PureComponent } from 'react';
import { Form, Card, Upload, Icon, Row, Col, Input, Select, Badge, Checkbox, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PageWrapper from '@/components/PageWrapper';
import styles from './PlaceOrder.scss';

const { TextArea } = Input;

interface RegisterProps extends FormComponentProps {}

class DoorPlaceOrderPage extends PureComponent<RegisterProps, any> {
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

  handlePageScroll = () => {
    const sTop =
      document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

    this.setState({
      isSticky: sTop >= this.ref.offsetTop,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isSticky, fixedRight } = this.state;

    return (
      <PageWrapper>
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
                    <span className={styles.addressText}>WARSZAWA</span>
                  </div>
                </div>
                <div className={styles.subContent}>
                  <Badge status="processing" text="有效船期 : 2020-02-10 至2020-02-20" />
                  <Badge status="processing" text="有效信息 : 有效备注有效备注备注备注备注……" />
                </div>
                <div className={styles.priceInfo}>
                  <h5>单价:</h5>
                  <div className={styles.priceContent}>
                    <div className={styles.info}>
                      <span>
                        CBM <strong>$20.00</strong>
                      </span>
                      <span>
                        TON <strong>$400.00</strong>
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
                  {getFieldDecorator('dragger', {
                    rules: [{ required: true, message: '请上传文件' }],
                    valuePropName: 'fileList',
                  })(
                    <Upload.Dragger name="files" action="/upload.do">
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
                      {getFieldDecorator('name')(
                        <TextArea placeholder="请输入货物品名" rows={4} />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={22}>
                  <Col span={8}>
                    <Form.Item label="包装类型">
                      {getFieldDecorator('name')(<Select placeholder="请输入包装类型" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="货物总件数">
                      {getFieldDecorator('name')(<Input placeholder="请输入货物总件数" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="预计送货日">
                      {getFieldDecorator('name')(<Input placeholder="请输入预计送货日" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={22}>
                  <Col span={8}>
                    <Form.Item label="货物总量（KGS）">
                      {getFieldDecorator('name')(<Select placeholder="请输入货物总量" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="货物总体积（CBM）">
                      {getFieldDecorator('name')(<Input placeholder="请输入货物总体积" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card title="委托人信息" bordered={false} style={{ marginTop: 30 }}>
                <Row gutter={22}>
                  <Col span={8}>
                    <Form.Item label="联系人">
                      {getFieldDecorator('name')(<Input placeholder="请输入联系人姓名" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="手机">
                      {getFieldDecorator('name')(<Input placeholder="请输入手机号" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="邮箱">
                      {getFieldDecorator('name')(<Input placeholder="请输入邮箱" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="发货人地址">
                      {getFieldDecorator('name')(
                        <TextArea placeholder="请输入发货人地址" rows={4} />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card title="备注" bordered={false} style={{ marginTop: 30 }}>
                <Form.Item>
                  {getFieldDecorator('name')(<TextArea placeholder="请输入备注" rows={4} />)}
                </Form.Item>
              </Card>
              <Form.Item className={styles.agreement}>
                {getFieldDecorator('phoneNum', {
                  rules: [{ required: true, message: '请同意会员协议' }],
                })(<Checkbox checked={true} />)}
                <span className={styles.desc}>环球义达委托协议</span>
              </Form.Item>
              <Form.Item>
                <Button type="primary" className={styles.submitBtn}>
                  提交委托
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div
            className={`${styles.instructions} ${isSticky ? styles.sticky : ''}`}
            ref={node => (this.ref = node)}
            style={{ right: isSticky ? fixedRight : 0 }}
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
                  <span>1260.00</span>
                  <span className={styles.symbol}>USD</span>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </PageWrapper>
    );
  }
}

export default Form.create()(DoorPlaceOrderPage);
