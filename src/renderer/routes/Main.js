/**
 * Created by bingjian on 2017/3/10.
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Select, Card, Row, Col, Tooltip }  from 'antd';
import { remote } from 'electron';

import TitleBar from '../components/TitleBar';
import FooterToolbar from '../components/FooterToolbar';

import Styles from './Main.less';
const { windowManager } = remote.getGlobal('services');
const { Item: FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 3 },
};


@connect((state) => {
  const { environments } = state.mall;
  return {
    environments
  };
})
@Form.create({
  mapPropsToFields(props) {

    return {
      url: Form.createFormField({
        value: 'http://www.whoer.net',
      }),
      envIndex: Form.createFormField({
        value: '',
      }),
    
    }
  }
})

export default class MainRouter extends PureComponent {

  state = {
    currentEnv: {}
  }
  /**
   * 
   */
  onRefreshCookie = () => {
    if (this.currentWindow) {
      const { session } = this.currentWindow.webContents;
      const { setFieldsValue, getFieldValue } = this.props.form;
      const url = getFieldValue('url');
      session.cookies.get({ url }, (error, cookies) => {
        if (error) {
          return
        }

        setFieldsValue({
          cookie: JSON.stringify(cookies)
        })
        
      })
    }
  }
  /**
   * 
   */
  onSaveEnv = () => {
    const { dispatch, environments } = this.props;
    const { setFieldsValue } = this.props.form;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      
      const { 
        proxy, 
        port, 
        userAgent, 
        acceptLanguage, 
        size, 
        screen, 
        envIndex, 
        url,
        cookie,
        timezone
      } =values;
      const env = environments[envIndex];
      env.proxy = proxy;
      env.userAgent = userAgent;
      env.port = port;
      env.proxy = proxy;
      env.acceptLanguage = acceptLanguage;
      env.size = size;
      env.screen = screen;
      env.cookie = cookie;
      env.timezone = timezone;
      dispatch({
        type: 'mall/save',
        payload: {
          environments: [...environments]
        }
      });
    });
  }

  onCreateWindow = () => {
    const { environments } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { envIndex, url } =values;
      const env = environments[envIndex];
      this.currentWindow = windowManager.newMallEnviromentWindow(url, env);
    });
    
  }

  onEnvironmentChanged = (index, e) => {
    const { environments } = this.props;
    const { setFieldsValue } = this.props.form;
    const env = environments[index];
    const { name, proxy, port, userAgent, acceptLanguage, size, screen, cookie, timezone } = env;
    setFieldsValue({
      name, proxy, port, userAgent, acceptLanguage, size, screen, envIndex: index, cookie, timezone
    });
    this.setState({
      currentEnv: env
    });
  }

  componentWillReceiveProps() {
    
  }

  render() {
    const { environments } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const name = getFieldValue('name');
    return (
      <Fragment>
        <TitleBar>模拟工具</TitleBar>
        <div className={Styles.main}>
          <Card title="模拟环境切换" className={Styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <FormItem
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
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem
                    label="名称"
                  >
                    {getFieldDecorator('envIndex', {
                      rules: [{
                        required: true,
                        message: '请选择模拟环境',
                      }],
                    })(
                      <Select
                        onChange={this.onEnvironmentChanged}
                      >
                        {
                          environments.map(({id, name}, index) => {
                            return (
                              <Option value={index}>{name}</Option>
                            )
                          })
                        }
                      </Select>
                    )}
                    
                  </FormItem>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <FormItem
                    label="操作栏"
                  >

                   <Tooltip 
                    placement="top" 
                    title={
                      <div>模拟环境的参数如果发生改变,需要点击保存后才能生效</div> }
                  >
                    <Button 
                        type="primary" 
                        onClick={this.onCreateWindow}
                      >
                        打开模拟环境
                      </Button>
                    </Tooltip>
                    
                  </FormItem>
                  
                </Col>
              </Row>
            </Form>
          </Card>  
          <Card 
            title="模拟环境详情" 
            className={Styles.card} 
            bordered={false}
          >
            <Form>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <FormItem
                    label="名称/(时区)"
                  >
                    {name}<br />
                    {getFieldDecorator('timezone', {
                      rules: [{
                        required: false,
                        message: '请设置时区简称',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem
                    label="代理"
                  >
                   {getFieldDecorator('proxy', {
                      rules: [{
                        required: false,
                        message: '请设置代理地址',
                      }],
                    })(
                      <Input />
                    )}
                    {getFieldDecorator('port', {
                      rules: [{
                        required: false,
                        message: '请设置代理端口',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <FormItem
                    label="User Agent"
                  >
                    {getFieldDecorator('userAgent', {
                      rules: [{
                        required: true,
                        message: '请设置User Agent',
                      }],
                    })(
                      <TextArea rows={4} />
                    )}
                  </FormItem>
                  
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <FormItem
                    label="Accept-Language"
                  >
                    {getFieldDecorator('acceptLanguage', {
                      rules: [{
                        required: true,
                        message: '设置可接受语言',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem
                    label="显示器分辨率"
                  >
                    {getFieldDecorator('screen.width', {
                      rules: [{
                        required: true,
                        message: '设置屏幕宽度',
                      }],
                    })(
                      <Input />
                    )}
                    {getFieldDecorator('screen.height', {
                      rules: [{
                        required: true,
                        message: '设置屏幕高度',
                      }],
                    })(
                      <Input />
                    )}
                    
                  </FormItem>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <FormItem
                    label="浏览器分辨率"
                  >
                   {getFieldDecorator('size.width', {
                      rules: [{
                        required: true,
                        message: '设置浏览器宽度',
                      }],
                    })(
                      <Input />
                    )}
                    {getFieldDecorator('size.height', {
                      rules: [{
                        required: true,
                        message: '设置浏览器高度',
                      }],
                    })(
                      <Input />
                    )}
                    
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <FormItem
                    label={(
                      <Fragment>
                        <span style={{marginRight: '10px'}}>窗口Cookie值</span>
                        <Button
                          size="small"
                          onClick={this.onRefreshCookie}
                        >
                          导出当前值
                        </Button>
                      </Fragment>
                    )}
                  >
                    {getFieldDecorator('cookie', {
                      rules: [{
                        required: false,
                        message: '请输入需要替换的cookie值',
                      }],
                    })(
                      <TextArea row={4}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>

          <FooterToolbar>
       
            <Button 
              type="primary"
              onClick={this.onSaveEnv}
            >
              保存
            </Button>
          </FooterToolbar>
        </div>
      </Fragment>
    )
  }
}

