import Frame from '../layouts/Frame';
import Home from '../containers/Home/index';
import Todo from '../containers/Todo/index';
import Root from '../containers/Root/index';
import Keyword from '../containers/Keyword/index';

export const createRoutes = ( store ) => ( {
    path: '/',
    component: Frame,
    indexRoute: Home( store ),
    childRoutes: [
         Todo( store ),
         Root( store ),
         Keyword( store ),
        //   PageNotFound(),
        //   Redirect
    ]
} )

export default createRoutes
