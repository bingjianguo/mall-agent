/**
 * Created by bingjian on 2017/3/10.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Select }  from 'antd';
import { remote } from 'electron';

import TitleBar from '../components/TitleBar';

const { windowManager } = remote.getGlobal('services');
const { Item: FormItem } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 3 },
};

@connect((state) => {
  return {
    ...state,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return {
      url: {
        value: 'http://www.weibo.com',
      },
      partition: {
        value: 'role1',
      }
    }
  }
})
export default class MainRouter extends PureComponent {


  onCreateWindow = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { partition, url } =values;
      windowManager.newMallSessionWindow(url, partition);
    });
    
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <TitleBar />
        <Form>
          <FormItem
            {...formItemLayout} 
            label="访问地址"
          >
            {getFieldDecorator('url', {
              rules: [{
                required: true,
                message: '请输入需要访问的地址',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout} 
            label="角色"
          >
            {getFieldDecorator('partition', {
              rules: [{
                required: true,
                message: '请选择角色',
              }],
            })(
              <Select>
                <Option value="role1">角色1</Option>
                <Option value="role2">角色2</Option>
                <Option value="role3">角色3</Option>
                <Option value="role4">角色4</Option>
                <Option value="role5">角色5</Option>
                <Option value="role6">角色6</Option>
              </Select>
            )}
            
          </FormItem>
        </Form>
        <FormItem 
          {...formTailLayout}
        >
          <Button 
            onClick={this.onCreateWindow}
          >
            创建窗口
          </Button>
        </FormItem>
        
      </div>
    )
  }
}

