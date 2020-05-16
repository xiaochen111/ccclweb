import React, { Component } from 'react';
import { Button, Form, Input, AutoComplete } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import styles from './index.scss';
import { StateType } from './model';
import { countryDrop } from '@/services/drop';

const { Option } = AutoComplete;
const startPartIcon = require('../../assets/img/start_part.png');

export enum searchType {
  index,
  pricePlan,
  doorIndex,
}
interface SearchConditionProps extends FormComponentProps {
  // a: StateType;
  isMultiRow: searchType;
  submit: (params: ParamsType) => void;
}

export interface ParamsType {
  start?: string;
  endPort?: string;
  weight?: string;
  size?: string;
}

const dataSource = [
  {
    title: '酱鹰',
    count: 60100,
  },
  {
    title: '毛子',
    count: 60100,
  },
  {
    title: '兔子',
    count: 60100,
  },
];

interface dropObj {
  id: string;
  value: string;
}

interface searchState {
  dataSource: Array<dropObj>;
}

export class SearchCondition extends Component<SearchConditionProps, searchState> {
  state = {
    dataSource: [],
  };

  componentDidMount() {
    countryDrop().then(res => {
      if (res.code === '1') {
        this.setState({
          dataSource: res.resMap.countryList,
        });
      }
    });
  }

  handleSubmit = () => {
    const { form, submit } = this.props;
    console.log(this.props);
    const values = form.getFieldsValue();
    submit(values);
  };

  render() {
    // let { dataSource } = this.state;
    const options = dataSource.map((item, index) => (
      <Option key={index} value={item.title}>
        {item.title}
      </Option>
    ));
    const { isMultiRow, form } = this.props;
    const { getFieldDecorator } = form;

    const formStyle = `searchMainStyle${Number(isMultiRow)}`;

    return (
      <Form>
        <div className={`${styles[formStyle]} ${styles.fromMain}`}>
          {searchType.index === isMultiRow ? (
            <div className={styles.formItemOne}>
              <Form.Item>
                {getFieldDecorator('endPort')(
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
                  {getFieldDecorator('endPort')(
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
              {getFieldDecorator('weight')(
                <Input placeholder="重量" size="large" suffix={<span>KGS</span>} />,
              )}
            </Form.Item>
          </div>
          <div className={styles.formItemFour}>
            <Form.Item>
              {getFieldDecorator('size')(
                <Input placeholder="重量" size="large" suffix={<span>KGS</span>} />,
              )}
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

export default Form.create<SearchConditionProps>()(SearchCondition);
