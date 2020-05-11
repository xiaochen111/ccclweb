import React, { Component } from 'react';
import { Button, Form, Input, AutoComplete } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './index.scss';

const { Option } = AutoComplete;
const startPartIcon = require('../../assets/img/start_part.png');

export enum searchType {
  index,
  pricePlan,
  doorIndex,
}
interface SearchConditionProps extends FormComponentProps {
  isMultiRow: searchType;
  submit: () => void;
}

const dataSource = ['12345', '23456', '34567'];

export class SearchCondition extends Component<SearchConditionProps, any> {
  render() {
    const options = dataSource.map((item, index) => <Option key={index}>{item}</Option>);
    const { isMultiRow, form, submit } = this.props;
    const { getFieldDecorator } = form;

    const formStyle = `searchMainStyle${Number(isMultiRow)}`;

    return (
      <Form>
        <div className={styles[formStyle]}>
          {searchType.index === isMultiRow ? (
            <div className={styles.formItemOne}>
              <Form.Item>
                <AutoComplete
                  className="certain-category-search"
                  dropdownClassName="certain-category-search-dropdown"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 300 }}
                  size="large"
                  style={{ width: '100%' }}
                  dataSource={options}
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
              </Form.Item>
            </div>
          ) : (
            <>
              <div className={styles.formItemOne}>
                <Form.Item>
                  {getFieldDecorator('a')(
                    <Input size="large" prefix={<img src={startPartIcon} />} />,
                  )}
                </Form.Item>
              </div>
              <div className={styles.formItemTwo}>
                <Form.Item>
                  {getFieldDecorator('b')(
                    <AutoComplete
                      className="certain-category-search"
                      dropdownClassName="certain-category-search-dropdown"
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{ width: 300 }}
                      size="large"
                      placeholder="收货地"
                      style={{ width: '100%' }}
                      dataSource={options}
                      optionLabelProp="value"
                    >
                      <Input prefix={<img src={startPartIcon} />} />
                    </AutoComplete>,
                  )}
                </Form.Item>
              </div>
            </>
          )}

          <div className={styles.formItemThree}>
            <Form.Item>
              {getFieldDecorator('a')(
                <Input placeholder="重量" size="large" suffix={<span>KGS</span>} />,
              )}
            </Form.Item>
          </div>
          <div className={styles.formItemFour}>
            <Form.Item>
              {getFieldDecorator('a')(
                <Input placeholder="重量" size="large" suffix={<span>KGS</span>} />,
              )}
            </Form.Item>
          </div>
          <div className={styles.formItemBtn}>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                icon="search"
                className={styles.submitBtn}
                onClick={submit}
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

export default Form.create<SearchConditionProps>()(SearchCondition);
