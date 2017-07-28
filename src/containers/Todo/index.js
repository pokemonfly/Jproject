import { injectReducer } from '../../redux/reducers';

export default ( store ) => ( {
    path: 'todo',
    getComponent( nextState, cb ) {
        require.ensure( [], ( require ) => {
            const Todo = require( './Todo' )
                .default
            const reducer = require( './TodoReducer' )
                .default
            injectReducer( store, {
                key: 'todo',
                reducer
            } )
            cb( null, Todo )
        }, 'todo' );
    }
} )
