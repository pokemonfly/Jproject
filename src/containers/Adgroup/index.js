/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

export default (store) => ( {
    path: 'list',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            let Adgroup = require('./Adgroup').default
            cb(null, Adgroup)
        }, 'list');
    }
} )
