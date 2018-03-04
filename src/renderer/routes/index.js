/**
 * Created by bingjian on 2017/3/10.
 */
import React from 'react';
import { Router, Route } from 'dva/router';
import Main from '../routes/Main';
import Mall from '../routes/Mall';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/main" component={Main} />
      <Route path="/mall" component={Mall} />
    </Router>
  );
}

export default RouterConfig;
