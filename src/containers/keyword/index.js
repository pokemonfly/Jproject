import { injectReducer } from '../../redux/reducers';

export default ( store ) => ( {
    path: 'keyword',
    getComponent( nextState, cb ) {
        require.ensure( [], ( require ) => {
            const Keyword = require( './Keyword' )
                .default
            const reducer = require( './KeywordRedux' )
                .default
            injectReducer( store, {
                key: 'keyword',
                reducer
            } )
            cb( null, Keyword )
        }, 'keyword' );
    }
} )
