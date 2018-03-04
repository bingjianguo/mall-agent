/**
 * Created by bingjian on 2017/3/10.
 */
import React from 'react';
import { connect } from 'dva';
import Mall from '../components/Welcome/Welcome';


function MallRouter(props) {
  return userInfo.userId ?
    <Welcome /> :
    <Login />;
}

function mapStateToProps(state) {
  return {
    ...state,
  };
}

export default connect(mapStateToProps)(MallRouter);
