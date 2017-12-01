import { injectReducer } from '../../redux/reducers';

export default(store ) => ({
    path: 'index',
    getComponent( nextState, cb ) {
        require.ensure( [], ( require ) => {
            const Home = require( './home' ).default
            const reducer = require( './reducer' ).default
            injectReducer(store, {
                key: 'articles',
                reducer
            })
            cb( null, Home )
        }, 'index' );
    }
})
