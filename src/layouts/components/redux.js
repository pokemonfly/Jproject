export const SIDER_TOGGLE = 'SIDER_TOGGLE'

export function toggleSider( ) {
    return { type: SIDER_TOGGLE }
}

const defaultState = {
    sider: {
        collapsed: false
    },
    menu: {
        current: 'home'
    }
}
export default function layoutReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case SIDER_TOGGLE:
            return {
                ...state,
                sider: {
                    collapsed: !state.sider.collapsed
                }
            }
        default:
            return state
    }
}
