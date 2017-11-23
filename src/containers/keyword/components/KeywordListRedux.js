import ajax from '@/utils/ajax'
import { formatReport, notify } from '@/utils/tools'
import { normalize, schema } from 'normalizr'
import { omit, capitalize, pick, difference, isArray } from 'lodash'
import PubSub from 'pubsub-js';

const { Entity } = schema;
// 关键词列表
export const REQ_KEYWORD_LIST = 'REQ_KEYWORD_LIST'
export const RES_KEYWORD_LIST = 'RES_KEYWORD_LIST'
// 细分数据
export const REQ_KEYWORD_SEPARATE = 'REQ_KEYWORD_SEPARATE'
export const RES_KEYWORD_SEPARATE = 'RES_KEYWORD_SEPARATE'
// Todo del this?
export const KEYWORD_TABLE_CHANGE = 'KEYWORD_TABLE_CHANGE'
//修改设置
export const REQ_POST_KEYWORD = 'REQ_POST_KEYWORD'
export const RES_POST_KEYWORD = 'RES_POST_KEYWORD'
//删词
export const REQ_DEL_KEYWORD = 'REQ_DEL_KEYWORD'
export const RES_DEL_KEYWORD = 'RES_DEL_KEYWORD'
// 加词
export const REQ_PUT_KEYWORD = 'REQ_PUT_KEYWORD'
export const RES_PUT_KEYWORD = 'RES_PUT_KEYWORD'

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
// TODO ?
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
            ...obj.report,
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
            api: '/sources/keywords',
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
export const reqKeywordSeparate = ( ) => {
    return {
        type: REQ_KEYWORD_SEPARATE,
        data: {
            isFetching: true
        }
    }
}
export const resKeywordSeparate = ( data ) => {
    return {
        type: RES_KEYWORD_SEPARATE,
        data: {
            keywordDetailMap: data.entities.keywordDetail,
            isFetching: false
        }
    }
}
function _mergeReport(wordsVo = {}, reportVo = {}) {
    let obj = {}
    reportVo.cpc = reportVo.price
    reportVo.coverage = reportVo.cvr
    for (let key in pick(reportVo, [
        'cpc',
        'ctr',
        'pv',
        'click',
        'competition',
        'coverage',
        'payCount'
    ])) {
        obj['day' + capitalize( key )] = reportVo[key]
    }

    return {
        ...wordsVo,
        ...obj
    }
}
function multi( a = 0, b = 0 ) {
    return a * b
}
function dev( a = 0, b = 0 ) {
    if ( b === 0 ) {
        return 0
    } else {
        return a / b
    }
}
function _sumReport( a, b ) {
    let result = {
            ...a
        },
        avgPosSum = 0;
    for ( let key in b ) {
        if (result.hasOwnProperty( key )) {
            result[key] += b[key]
        } else {
            result[key] = b[key]
        }
    }
    result.ctr = dev( result.click, result.impressions ) * 100
    result.cvr = dev( result.payCount, result.click ) * 100
    result.cpc = dev( result.cost, result.click )
    result.realRoi = dev( result.pay, result.cost )
    // 平均展现排名
    avgPosSum = multi( a.avgPos, a.impressions ) + multi( b.avgPos, b.impressions )
    result.avgPos = Math.ceil(dev( avgPosSum, result.impressions ));
    result.dayCtr = dev( result.dayClick, result.dayPv ) * 100
    // 全网转化率 = 全网成交数/全网点击指数
    result.dayCvr = dev( result.dayPayCount, result.dayClick ) * 100

    return result
}

const keywordDetail = new Entity('keywordDetail', {}, {
    processStrategy: ( obj, parent ) => {
        const wordsVo = obj.detailWordsDataVO,
            reportVo = obj.detailReportVO,
            pcInside = _mergeReport( reportVo.pcInside, wordsVo.pcInside ),
            pcOutside = _mergeReport( reportVo.pcOutside, wordsVo.pcOutside ),
            mobileInside = _mergeReport( reportVo.mobileInside, wordsVo.mobileInside ),
            mobileOutside = _mergeReport( reportVo.mobileOutside, wordsVo.mobileOutside );
        let result = {
            pcInside,
            pcOutside,
            mobileInside,
            mobileOutside,
            pc: _sumReport( pcInside, pcOutside ),
            mobile: _sumReport( mobileInside, mobileOutside ),
            inside: _sumReport( pcInside, mobileInside ),
            outside: _sumReport( pcOutside, pcOutside )
        }
        for ( let i in result ) {
            formatReport(result[i])
        }
        return result
    }
})
export function fetchKeywordSeparate( params ) {
    return dispatch => {
        dispatch(reqKeywordSeparate( ))
        return ajax({
            api: '/sources/keywords/detailData',
            body: params,
            format: json => {
                let obj;
                // 宝贝的优化状态
                const { adgroup } = json.data
                obj = normalize(json.data, {keywordDetailInfos: [ keywordDetail ]});
                return obj;
            },
            success: data => dispatch(resKeywordSeparate( data ))
        })
    }
}

export const reqPostKeyword = ( ) => {
    return {
        type: REQ_POST_KEYWORD,
        data: {
            isFetching: true
        }
    }
}
export const resPostKeyword = ( data ) => {
    notify( '设置成功' )
    return {
        type: RES_POST_KEYWORD,
        data: {
            isFetching: false
        },
        mergeItems: data
    }
}
export function postKeyword( params, keys ) {
    let body = isArray( params ) ? params : [ params ]
    return dispatch => {
        dispatch(reqPostKeyword( ))
        return ajax({
            api: '/sources/keywords',
            method: 'post',
            body: body,
            success: ( ) => dispatch(resPostKeyword( body ))
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
    notify( '删除成功' )
    return {
        type: RES_DEL_KEYWORD,
        data: {
            isFetching: false
        },
        deletedItems: data
    }
}
export function deleteKeyword( params, keys ) {
    return dispatch => {
        dispatch(reqDelKeyword( ))
        return ajax({
            api: '/sources/keywords',
            method: 'delete',
            body: params,
            success: ( ) => dispatch(resDelKeyword( keys ))
        })
    }
}

export const reqPutKeyword = ( ) => {
    return {
        type: REQ_PUT_KEYWORD,
        data: {
            isFetching: true
        }
    }
}
export const resPutKeyword = ({ needFresh, msg }) => {
    if ( needFresh ) {
        PubSub.publish( 'keyword.list.fresh' )
        // TODO 少一个刷新后按时间排序  addAutoKeyword.js:120
    }
    if ( msg ) {
        notify({ type: 'error', message: '加词出错', description: msg, duration: 10 })
    } else {
        notify( '加词成功' )
    }
    return {
        type: RES_PUT_KEYWORD,
        data: {
            isFetching: false
        }
    }
}
export function putKeyword( params, keys ) {
    /* params : [ 'campaignId' 'adgroupId' 'mobileIsDefaultPrice' 'word' 'maxPrice' 'matchScope' ]*/
    return dispatch => {
        dispatch(reqPutKeyword( ))
        return ajax({
            api: '/sources/keywords',
            method: 'put',
            body: params,
            format: json => {
                let needFresh = true,
                    msg = '';
                if ( json.success ) {
                    const { failedKeywords, repeatKeywords, subMsg, apiResp } = json.data
                    if ( failedKeywords ) {
                        msg = subMsg || '添加失败，请换个时间重试'
                        if ( apiResp && apiResp.subMsg ) {
                            msg += '(' + apiResp.subMsg + ')'
                        }
                        msg += ': [' + failedKeywords.join( '、 ' ) + ']';
                        needFresh = failedKeywords.length != keys.length
                    }
                    if ( repeatKeywords ) {
                        msg += '[' + repeatKeywords.map( e => e.word ).join( '、 ' ) + ']';
                        needFresh = repeatKeywords.length != keys.length
                    }
                    return { needFresh, msg }
                }
            },
            success: ( data ) => dispatch(resPutKeyword( data ))
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
        case RES_KEYWORD_SEPARATE:
        case KEYWORD_TABLE_CHANGE:
        case REQ_POST_KEYWORD:
        case REQ_DEL_KEYWORD:
        case RES_DEL_KEYWORD:
        case REQ_PUT_KEYWORD:
        case RES_PUT_KEYWORD:
            return {
                ...state,
                ...action.data
            }
        case RES_DEL_KEYWORD:
            return {
                ...state,
                ...action.data,
                keywords: difference( state.keywords, action.deletedItems )
            }
        case RES_POST_KEYWORD:
            let keywordMap = state.keywordMap;
            action.mergeItems.forEach(o => {
                Object.assign( keywordMap[o.keywordId], o )
            });
            return {
                ...state,
                ...action.data,
                keywordMap
            }
        default:
            return state
    }
}
