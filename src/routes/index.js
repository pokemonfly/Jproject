import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import routes from './createRoute.js';

const routes = browserHistory => (
    <Router history={browserHistory}>
        <Router path='/' component={Frame} />
    </Router>
);

export default routes;
