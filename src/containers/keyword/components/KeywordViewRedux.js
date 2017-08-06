import { omit } from 'lodash'
export const FILTER_KEYWORD_WORD = 'FILTER_KEYWORD_WORD'
export const REMOVE_FILTER_KEYWORD_WORD = 'REMOVE_FILTER_KEYWORD_WORD'

export const filterKeywordWord = ( searchText ) => {
    if ( searchText.length ) {
        return {
            type: FILTER_KEYWORD_WORD,
            filter: {
                type: 'word',
                key: searchText,
                fn: ( type, searchText, keywordObj ) => {
                    return keywordObj[ type ].indexOf( searchText ) > -1
                }
            }
        }
    } else {
        return {
            type: REMOVE_FILTER_KEYWORD_WORD,
            filter: {
                type: 'word'
            }
        }
    }
}


const defaultState = {
    filters: {}
}
export default function keywordReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case FILTER_KEYWORD_WORD:
            return {
                ...state,
                filters: {
                    ...state.filter,
                    [ action.filter.type ]: action.filter
                }
            }
        case REMOVE_FILTER_KEYWORD_WORD:
            return {
                ...state,
                filters: {
                    ...omit( state.filter, [ action.filter.type ] ),
                }
            }
        default:
            return state
    }
}
