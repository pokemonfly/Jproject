import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux';

import {default as location} from './location'
import {default as user} from './userBase'
import {default as layout} from 'layouts/components/LayoutsRedux'

import {default as engine} from 'containers/Engine/EngineRedux'
import {default as campaign} from 'containers/Campaign/CampaignRedux'
import {default as menu} from 'layouts/components/MenuRedux'

export const makeRootReducer = (asyncReducers) => {
    return combineReducers({
        location,
        routing,
        user,
        layout,
        engine,
        campaign,
        menu,
        ...asyncReducers
    })
}

export const injectReducer = (store, {key, reducer}) => {
    store.asyncReducers[key] = reducer
    store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
