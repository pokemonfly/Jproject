import Frame from '../layouts/frame';
import Home from '../containers/Home/index';
import Todo from '../containers/Todo/index';
import Root from '../containers/Root/index';

// const searchContainer = (location, callback) => {
//     require.ensure([], require => {
//         callback(null, require('../containers/Root/Root').default)
//     },'Root')
// }

// <IndexRoute component={Home}/>
// <Route path="todo" component={Todo}/>
// <Route path="root" getComponent={searchContainer}/>

export const createRoutes = ( store ) => ( {
    path: '/',
    component: Frame,
    indexRoute: Home( store ),
    childRoutes: [
         Todo( store ),
         Root( store ),
        //   ZenRoute(store),
        //   ElapseRoute(store),
        //   RouteRoute(store),
        //   PageNotFound(),
        //   Redirect
    ]
} )

export default createRoutes
