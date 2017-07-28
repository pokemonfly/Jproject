import { injectReducer } from '../../redux/reducers';

export default ( store ) => ( {
    path: 'root',
    getComponent( nextState, cb ) {
        require.ensure( [], ( require ) => {
            const Home = require( './Root' )
                .default
            const reducer = require( './rootReducer' )
                .default
            injectReducer( store, {
                key: 'root',
                reducer
            } )
            cb( null, Home )
        }, 'root' );
    }
} )
