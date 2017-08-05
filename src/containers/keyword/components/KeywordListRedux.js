import ajax from '../../../utils/ajax'
import { normalize, schema } from 'normalizr'
import { omit } from 'lodash'
const { Entity } = schema;

export const REQ_KEYWORD_LIST = 'REQ_KEYWORD_LIST'
export const RES_KEYWORD_LIST = 'RES_KEYWORD_LIST'
export const KEYWORD_TABLE_CHANGE = 'KEYWORD_TABLE_CHANGE'
export const reqKeywordList = () => {
    return {
        type: REQ_KEYWORD_LIST,
        data: {
            isFetching: true
        }
    }
}
export const resKeywordList = ( data ) => {
    return {
        type: RES_KEYWORD_LIST,
        data: {
            ...omit( data.result, [ 'mobileAutoGrabStatusMap', 'mobileStatusMap', 'pcAutoGrabStatusMap', 'pcStatusMap', 'strategy' ] ),
            keywordMap: data.entities.keyword,
            isFetching: false
        }
    }
}
export const keywordTableChange = ( pagination, filters, sorter ) => ( {
    type: KEYWORD_TABLE_CHANGE,
    data: {
        pagination,
        filters,
        sorter
    }
} )

const keyword = new Entity( 'keyword', {}, {
    idAttribute: 'keywordId',
    processStrategy: ( obj, parent ) => {
        return {
            ...obj.daemonOptimizeSetting,
            ...obj.keyword,
            key: obj.keywordId,
            report: obj.report,
            wordBase: obj.wordBase,
            wordscorelist: obj.wordscorelist,
            grab: {
                mobileAuto: parent.mobileAutoGrabStatusMap[ obj.keywordId ],
                mobile: parent.mobileStatusMap[ obj.keywordId ],
                pcAuto: parent.pcAutoGrabStatusMap[ obj.keywordId ],
                pc: parent.pcStatusMap[ obj.keywordId ],
            }
        }
    }
} );

export function fetchKeywordList() {
    return dispatch => {
        dispatch( reqKeywordList() )
        return ajax( {
            api: '/sources/keywords.mock',
            format: json => {
                let obj;
                obj = normalize( json.data, {
                    keywords: [ keyword ],
                } );
                return obj;
            },
            success: data => dispatch( resKeywordList( data ) ),
            error: err => console.error( err )
        } )
    }
}
const defaultState = {
    pagination: {},
    filters: {},
    sorter: {}
}
export default function keywordReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case REQ_KEYWORD_LIST:
        case RES_KEYWORD_LIST:
        case KEYWORD_TABLE_CHANGE:
            return {
                ...state,
                ...action.data
            }

            // return {
            //     ...state,
            //
            // }
        default:
            return state
    }
}
