import request from '../utils/request';
import { FAKE_DATA_ARRAY } from '../../shared/constants';

export default {
  namespace: 'mall',
  state: {
    environments: FAKE_DATA_ARRAY
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    *requestClientList({ payload, onSuccess }, { call, put }) {
      
    },
   
  },
};
