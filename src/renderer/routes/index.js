/**
 * Created by bingjian on 2017/3/10.
 */
import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import Main from '../routes/Main';
import Mall from '../routes/Mall';
import { LocaleProvider } from 'antd';

function RouterConfig({ history }) {
  return (
    <LocaleProvider>
      <Router history={history}>
        <Switch>
          <Route path="/main" component={Main} />
          <Route path="/mall" component={Mall} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
