// import ajax from '../../../utils/ajax'
import ajax from '@/utils/ajax'
import { normalize, schema } from 'normalizr'
import { omit } from 'lodash'
const { Entity } = schema;

export const REQ_KEYWORD_LIST = 'REQ_KEYWORD_LIST'
export const RES_KEYWORD_LIST = 'RES_KEYWORD_LIST'
export const KEYWORD_TABLE_CHANGE = 'KEYWORD_TABLE_CHANGE'
export const REQ_DEL_KEYWORD = 'REQ_DEL_KEYWORD'
export const RES_DEL_KEYWORD = 'RES_DEL_KEYWORD'
export const reqKeywordList = ( ) => {
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
            ...omit(data.result, [ 'mobileAutoGrabStatusMap', 'mobileStatusMap', 'pcAutoGrabStatusMap', 'pcStatusMap', 'strategy' ]),
            keywordMap: data.entities.keyword,
            isFetching: false
        }
    }
}
export const keywordTableChange = ( pagination, filters, sorter ) => ({
    type: KEYWORD_TABLE_CHANGE,
    data: {
        pagination,
        filters,
        sorter
    }
})

const keyword = new Entity('keyword', {}, {
    idAttribute: 'keywordId',
    processStrategy: ( obj, parent ) => {
        // 宝贝级别关闭 优先
        if ( parent.adgroup.daemonOptimizeSetting.isOptimizeChangePrice == 0 ) {
            obj.daemonOptimizeSetting.isOptimizeChangePrice = 0
        }
        if ( parent.adgroup.daemonOptimizeSetting.isOptimizeChangeMobilePrice == 0 ) {
            obj.daemonOptimizeSetting.isOptimizeChangeMobilePrice = 0
        }
        const keywordOptimizeStatus = _getOptimizeStatus( obj.daemonOptimizeSetting )
        const optimizeStatus = _mixinStatus( parent.adgroup.optimizeStatus, keywordOptimizeStatus )
        return {
            ...obj.keyword,
            key: obj.keywordId,
            wordURI: encodeURI( obj.keyword.word ),
            report: {
                ...obj.report,
                ...obj.wordBase
            },
            optimizeStatus: optimizeStatus,
            wordBase: obj.wordBase || {
                dayPrice: 0,
                dayCtr: 0,
                dayCompetition: 0,
                dayClick: 0,
                dayPv: 0
            },
            wordscorelist: obj.wordscorelist,
            grab: {
                mobileAuto: parent.mobileAutoGrabStatusMap[obj.keywordId],
                mobile: parent.mobileStatusMap[obj.keywordId],
                pcAuto: parent.pcAutoGrabStatusMap[obj.keywordId],
                pc: parent.pcStatusMap[obj.keywordId]
            }
        }
    }
});

function _getOptimizeStatus( setting, isMandate ) {
    const { isOptimizeByConfig, isOptimizeChangePrice, isOptimizeChangeMobilePrice, isOptimizeGenerateWord } = setting
    const changePrice = isOptimizeChangePrice == 1 || isOptimizeChangeMobilePrice == 1
    if ( isOptimizeByConfig == 1 ) {
        // 按配置改价
        return 9
    }
    if ( changePrice && isOptimizeGenerateWord == 1 ) {
        //全自动优化
        return 1
    }
    if ( changePrice && isOptimizeGenerateWord != 1 ) {
        // 只优化价格
        return 0
    }
    if ( !changePrice && isOptimizeGenerateWord == 1 ) {
        // 只优化出词
        return 2
    }
    if ( !changePrice && isOptimizeGenerateWord != 1 ) {
        if ( isMandate ) {
            //不优化[出词&出价]
            return 3
        } else {
            //不自动优化
            return -1
        }
    }
}
function _mixinStatus( adgroup, keyword ) {
    switch ( adgroup ) {
        case - 1:
            //不自动优化
            return adgroup;
        case 0:
            // 宝贝级别为：只优化出价 除了不自动优化状态/只优化出价/按配置优化，全自动优化 ==> 只优化价格，其他全是不自动优化
            if ( keyword === -1 || keyword === 0 || keyword === 9 ) {
                return keyword
            } else if ( keyword == 1 ) {
                return adgroup
            } else {
                return -1
            }
        case 1:
            // 宝贝级别：全自动优化
            return keyword
        case 2:
            // 宝贝级别：只优化出词 除了不自动优化状态/只优化出词/按配置优化，其他全是不自动优化
            if ( keyword === -1 || keyword === 2 || keyword === 9 ) {
                return keyword
            } else {
                return -1;
            }
        case 3:
            // 宝贝级别：不优化[出词&出价] 全是为：不自动优化
            return -1
        case 9:
            // 宝贝级别：按配置优化 除了不自动优化，其他全是按配置优化
            return keyword
        default:
            return 999
    }
}
export function fetchKeywordList( params ) {
    return dispatch => {
        dispatch(reqKeywordList( ))
        return ajax({
            api: '/sources/keywords.mock',
            body: params,
            format: json => {
                let obj;
                // 宝贝的优化状态
                const { adgroup } = json.data
                adgroup.optimizeStatus = _getOptimizeStatus( adgroup.daemonOptimizeSetting, adgroup.isMandate )
                obj = normalize(json.data, {keywords: [ keyword ]});
                return obj;
            },
            success: data => dispatch(resKeywordList( data )),
            error: err => console.error( err )
        })
    }
}

export const reqDelKeyword = ( ) => {
    return {
        type: REQ_DEL_KEYWORD,
        data: {
            isFetching: true
        }
    }
}
export const resDelKeyword = ( data ) => {
    return {
        type: RES_DEL_KEYWORD,
        data: {
            isFetching: false
        }
    }
}
export function deleteKeyword( params ) {
    return dispatch => {
        dispatch(reqDelKeyword( ))
        return ajax({
            api: '/sources/keywords.mock',
            method: 'delete',
            body: params,
            format: json => {
                return json
            },
            success: data => dispatch(resDelKeyword( data )),
            error: err => console.error( err )
        })
    }
}
const defaultState = {
    pagination: {},
    filters: {},
    sorter: {},
    adgroup: {}
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

            // return {     ...state,
            //
            // }
        default:
            return state
    }
}
