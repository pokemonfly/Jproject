import ajax from '../../utils/ajax'
import { normalize, schema } from 'normalizr'
export const REQ_KEYWORD_LIST = 'REQ_KEYWORD_LIST'
export const RES_KEYWORD_LIST = 'RES_KEYWORD_LIST'
const { Entity } = schema;
export const reqKeywordList = ( ) => {
    return {
        type: REQ_KEYWORD_LIST,
        data: {
            isFetching: true
        }
    }
}
export const resKeywordList = ( data ) => {
    return { type: RES_KEYWORD_LIST, data }
}

const keyword = new Entity('keyword', {}, { idAttribute: 'keywordId' });

export function fetchKeywordList( ) {
    return dispatch => {
        dispatch(reqKeywordList( ))
        return ajax({
            api: '/sources/keywords.mock',
            format: json => {
                let obj;
                obj = normalize(json.data, {keywords: [ keyword ]});
                console.dir( obj )
                return obj;
            },
            success: data => dispatch(resKeywordList( data )),
            error: err => console.error( err )
        })
    }
}

export default function keywordReducer( state = {}, action ) {
    switch ( action.type ) {
        case REQ_KEYWORD_LIST:
        case RES_KEYWORD_LIST:
            return {
                ...state,
                ...action.data
            }
        default:
            return state
    }
}
