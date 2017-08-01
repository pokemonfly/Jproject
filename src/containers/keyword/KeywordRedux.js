import ajax from '../../utils/ajax'

export const REQ_KEYWORD_LIST = 'REQ_KEYWORD_LIST'
export const RES_KEYWORD_LIST = 'RES_KEYWORD_LIST'

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
export function fetchKeywordList( ) {
    return dispatch => {
        dispatch(reqKeywordList( ))
        return ajax({
            api: '/sources/keywords.mock',
            format: json => {
                let obj = json.data.users
                obj.versionName = versionNameMap[obj.versionNum] || '未知'
                obj.expireDate = moment( obj.expireDate ).format( 'YYYY-MM-DD' );
                return obj;
            },
            success: data => dispatch(resKeywordList( data )),
            error: err => console.error( err )
        })
    }
}

export default function userBaseReducer( state = {}, action ) {
    switch ( action.type ) {

        default:
            return state
    }
}
