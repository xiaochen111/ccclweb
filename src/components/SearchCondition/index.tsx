import React, { Component } from 'react';
import { Button, Form, Input, AutoComplete } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './index.scss';

const { Option } = AutoComplete;
const startPartIcon = require('../../assets/img/start_part.png');
const endPartIcon = require('../../assets/img/end_part.png');

export enum searchType {
  index,
  pricePlan,
  doorIndex,
}
interface IProps extends FormComponentProps {
  isMultiRow: searchType;
  submit: (params) => void;
  defaultValue?: any;
  countryDropList: any[];
  hideTitle?: boolean;
}

interface item {
  value: string;
  id: string;
}

export class SearchCondition extends Component<IProps, any> {
  handleSubmit = () => {
    const { form, submit } = this.props;
    const values = form.getFieldsValue();

    submit(values);
  };

  render() {
    const { countryDropList, hideTitle = false } = this.props;

    const options = countryDropList.map((item: item, index) => (
      <Option key={index} value={`${item.id}`}>
        {`${item.value}`}
      </Option>
    ));
    const { isMultiRow, form, defaultValue = {} } = this.props;
    const { getFieldDecorator } = form;

    const formStyle = `searchMainStyle${Number(isMultiRow)}`;

    return (
      <Form className={styles.container}>
        <div className={styles.title} style={{ display: hideTitle ? 'none' : 'block' }}>
          <span className={styles.text}>拼箱门到门</span>
          <span className={styles.desc}>注 : 费用按照1:400（KGS数值/</span>
        </div>
        <div className={`${styles[formStyle]} ${styles.fromMain}`}>
          {searchType.index === isMultiRow ? (
            <div className={styles.formItemOne}>
              <Form.Item>
                {getFieldDecorator('endTruck', {
                  initialValue: defaultValue.endTruck,
                })(
                  <AutoComplete
                    className="certain-category-search"
                    dropdownClassName="certain-category-search-dropdown"
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 300 }}
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={options}
                    optionLabelProp="value"
                    placeholder="国家"
                    defaultActiveFirstOption={false}
                  >
                    <Input
                      prefix={
                        <>
                          <img src={startPartIcon} />{' '}
                          <span style={{ fontSize: '14px' }}>&nbsp;义乌 —</span>
                        </>
                      }
                    />
                  </AutoComplete>,
                )}
              </Form.Item>
            </div>
          ) : (
            <>
              <div className={styles.formItemOne}>
                <Form.Item>
                  {getFieldDecorator('start', {
                    initialValue: '义乌',
                  })(<Input size="large" prefix={<img src={startPartIcon} />} />)}
                </Form.Item>
              </div>
              <div className={styles.formItemTwo}>
                <Form.Item>
                  {getFieldDecorator('endTruck', {
                    initialValue: defaultValue.endTruck,
                  })(
                    <AutoComplete
                      className="certain-category-search"
                      dropdownClassName="certain-category-search-dropdown"
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{ width: 300 }}
                      size="large"
                      placeholder="国家"
                      style={{ width: '100%' }}
                      dataSource={options}
                      optionLabelProp="value"
                      defaultActiveFirstOption={false}
                    >
                      <Input prefix={<img src={endPartIcon} />} />
                    </AutoComplete>,
                  )}
                </Form.Item>
              </div>
            </>
          )}

          <div className={styles.formItemThree}>
            <Form.Item>
              {getFieldDecorator('kgs', {
                initialValue: defaultValue.kgs,
              })(<Input placeholder="重量" size="large" suffix={<span>KGS</span>} />)}
            </Form.Item>
          </div>
          <div className={styles.formItemFour}>
            <Form.Item>
              {getFieldDecorator('cbm', {
                initialValue: defaultValue.cbm,
              })(<Input placeholder="体积" size="large" suffix={<span>CBM</span>} />)}
            </Form.Item>
          </div>
          <div className={styles.formItemBtn}>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                icon={searchType.index === isMultiRow ? 'search' : ''}
                className={styles.submitBtn}
                onClick={this.handleSubmit}
              >
                搜索
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create<IProps>()(SearchCondition);
