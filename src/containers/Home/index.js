import { injectReducer } from '../../redux/reducers';

export default(store ) => ({
    path: '',
    getComponent( nextState, cb ) {
        require.ensure( [], ( require ) => {
            const Home = require( './home' ).default
            const reducer = require( './reducer' ).default
            injectReducer(store, {
                key: 'articles',
                reducer
            })
            cb( null, Home )
        }, 'home' );
    }
})
