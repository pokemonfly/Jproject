export const FILTER_KEYWORD_NAME = 'FILTER_KEYWORD_NAME'

export const filterKeywordName = ( searchText ) => {
    return {
        type: FILTER_KEYWORD_NAME,
        filter: {
            type: 'name',
            key: searchText,
            fn: ( keywordObj, searchText ) => {
                return keywordObj.indexOf( searchText ) > -1
            }
        }
    }
}


const defaultState = {
    filters: {}
}
export default function keywordReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case FILTER_KEYWORD_NAME:
            return {
                ...state,
                filters: {
                    ...state.filter,
                    [ action.filter.type ]: action.filter
                }
            }
        default:
            return state
    }
}
