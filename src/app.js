import ReactDOM from 'react-dom';
import React from 'react';
import configureStore from './redux/configureStore';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory, browserHistory  } from 'react-router';
import routes from './routes/createRoute';
import DevTools from './redux/DevTools';
import { Router } from 'react-router';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory , store);

ReactDOM.render((
  <Provider store={store}>
    <div>
        <Router history={history} children={routes(store)} />
        <DevTools />
    </div>
  </Provider>
), document.getElementById('root'));
