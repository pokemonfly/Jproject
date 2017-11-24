import { injectReducer } from '../../redux/reducers';

export default( store ) => ( {
    path: 'keyword',
    /* https://react-guide.github.io/react-router-cn/docs/API.html
        getComponent(location, callback)   callback(err, component) */
    getComponent( nextState, cb ) {
        require.ensure( [], ( require ) => {
            const Keyword = require( './Keyword' ).default
            const reducer = require( './KeywordRedux' ).default
            injectReducer( store, {
                key: 'keyword',
                reducer
            } )
            cb( null, Keyword )
        }, 'keyword' );
    }
} )
