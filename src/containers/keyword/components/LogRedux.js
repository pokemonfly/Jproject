import ajax from '@/utils/ajax'
import { formatReport, notify } from '@/utils/tools'
import { omit, capitalize, pick, difference, isArray } from 'lodash'
import { normalize, schema } from 'normalizr'
const { Entity } = schema;

// 宝贝日志
export const REQ_KEYWORD_LOG = 'REQ_KEYWORD_LOG'
export const RES_KEYWORD_LOG = 'RES_KEYWORD_LOG'
// 宝贝详细日志
export const REQ_KEYWORD_DETAIL_LOG = 'REQ_KEYWORD_DETAIL_LOG'
export const RES_KEYWORD_DETAIL_LOG = 'RES_KEYWORD_DETAIL_LOG'

export const reqKeywordLog = () => {
    return {
        type: REQ_KEYWORD_LOG,
        data: {
            isFetching: true
        }
    }
}
export const resKeywordLog = ( data ) => {
    return {
        type: RES_KEYWORD_LOG,
        data: {
            ...omit( data.result, [ 'adgroupLogs' ] ),
            logs: data.result.adgroupLogs,
            logMap: data.entities.logItem,
            isFetching: false
        }
    }
}
const logTypeMap = {
    1: '系统优化',
    2: '用户操作',
    3: '人机优化'
}
const logItem = new Entity( 'logItem', {}, {
    processStrategy: ( obj, parent ) => {
        let logTypeStr = logTypeMap[ obj.logType ] || '未知操作'
        return {
            ...obj,
            logTypeStr,
            key: obj.id
        }
    }
} );
export function fetchKeywordLog( params ) {
    return dispatch => {
        dispatch( reqKeywordLog() )
        return ajax( {
            api: `/sources/logs/ddgroups/${ params.campaignId}/${ params.adgroupId }`,
            body: pick( params, [
                'logType',
                'logDateType',
                'operationType',
                'operator',
                'pageNo',
                'displayGrabRankLog',
                'mode'
            ] ),
            method: 'post',
            format: json => {
                if ( json.success ) {
                    return normalize( json.data, { adgroupLogs: [ logItem ] } )
                } else {
                    return {}
                }
            },
            success: data => dispatch( resKeywordLog( data ) )
        } )
    }
}

export const reqKeywordDetailLog = () => {
    return {
        type: REQ_KEYWORD_DETAIL_LOG,
        data: {
            isFetching: true
        }
    }
}
export const resKeywordDetailLog = ( data ) => {
    return {
        type: RES_KEYWORD_DETAIL_LOG,
        data: {
            logDetail: data,
            isFetching: false
        }
    }
}

export function fetchKeywordDetailLog( params ) {
    return dispatch => {
        dispatch( reqKeywordDetailLog() )
        return ajax( {
            api: `/sources/logs/ddgroups/${ params.adgroupId}/details/${ params.taskId }`,
            body: pick( params, [ 'campaignId', 'operation' ] ),
            format: json => {
                if ( json.success ) {
                    let detailLogs = json.data.detailLogs
                    detailLogs.forEach( ( i, ind ) => {
                        i.key = ind
                    } )
                    return detailLogs
                } else {
                    return []
                }
            },
            success: data => dispatch( resKeywordDetailLog( data ) )
        } )
    }
}

const defaultState = {
    logDetail: []
}
export default function keywordReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case REQ_KEYWORD_LOG:
        case RES_KEYWORD_LOG:
        case REQ_KEYWORD_DETAIL_LOG:
        case RES_KEYWORD_DETAIL_LOG:
            return {
                ...state,
                ...action.data
            }
        default:
            return state
    }
}
