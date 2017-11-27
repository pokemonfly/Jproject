/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

import {injectReducer} from '../../redux/reducers';

export default (store) => ( {
    path: 'adgroup',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const Adgroup = require('./Adgroup').default
            const reducer = require('./AdgroupRedux').default
            injectReducer(store, {
                key: 'adgroup',
                reducer
            })
            cb(null, Adgroup)
        }, 'adgroup');
    }
} )
