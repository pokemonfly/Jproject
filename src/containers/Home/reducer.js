import { combineReducers } from 'redux';

// 引入 reducer 及 actionCreator
import table from './components/TableRedux';
import modal from './components/ModalRedux';

export default combineReducers({ table, modal });
