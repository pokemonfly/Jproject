import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux';

import {default as location} from './location'
import {default as user} from './userBase'
import {default as layout} from 'layouts/components/LayoutsRedux'

import {default as engine} from 'containers/Engine/EngineRedux'

export const makeRootReducer = (asyncReducers) => {
    return combineReducers({
        location,
        routing,
        user,
        layout,
        engine,
        ...asyncReducers
    })
}

export const injectReducer = (store, {key, reducer}) => {
    store.asyncReducers[key] = reducer
    store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
