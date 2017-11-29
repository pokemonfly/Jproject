import ajax from '@/utils/ajax'
import { formatReport, notify } from '@/utils/tools'
import { pick, get as getFromObj, isArray, mapKeys, merge } from 'lodash'

// 关键词列表
export const REQ_ADGROUPS_PROFILES = 'REQ_ADGROUPS_PROFILES'
export const RES_ADGROUPS_PROFILES = 'RES_ADGROUPS_PROFILES'
// 修改宝贝状态
export const REQ_POST_ADGROUPS = "REQ_POST_ADGROUPS"
export const RES_POST_ADGROUPS = "RES_POST_ADGROUPS"
// 修改宝贝优化状态
export const REQ_POST_ADGROUPS_OPTIMIZATION = "REQ_POST_ADGROUPS_OPTIMIZATION"
export const RES_POST_ADGROUPS_OPTIMIZATION = "RES_POST_ADGROUPS_OPTIMIZATION"
// 黑名单 & 不再投放词
export const REQ_BLACKWORD = 'REQ_BLACKWORD'
export const RES_BLACKWORD = 'RES_BLACKWORD'
// 修改黑名单
export const REQ_POST_BLACKWORD = 'REQ_POST_BLACKWORD'
export const RES_POST_BLACKWORD = 'RES_POST_BLACKWORD'
// 清空 不再投放词
export const REQ_DEL_NEVERWORD = 'REQ_DEL_NEVERWORD'
export const RES_DEL_NEVERWORD = 'RES_DEL_NEVERWORD'
// 卖点词
export const REQ_SELLWORDS = 'REQ_SELLWORDS'
export const RES_SELLWORDS = 'RES_SELLWORDS'
// 修改卖点词
export const REQ_PUT_SELLWORDS = 'REQ_PUT_SELLWORDS'
export const RES_PUT_SELLWORDS = 'RES_PUT_SELLWORDS'
// 获得当天数据汇总
export const REQ_ADGROUPS_REALTIME = 'REQ_ADGROUPS_REALTIME'
export const RES_ADGROUPS_REALTIME = 'RES_ADGROUPS_REALTIME'
//  获得用户设置的商品利润
export const REQ_ADGROUPS_PROFIT = 'REQ_ADGROUPS_PROFIT'
export const RES_ADGROUPS_PROFIT = 'RES_ADGROUPS_PROFIT'
// 设置商品利润
export const REQ_POST_ADGROUPS_PROFIT = 'REQ_POST_ADGROUPS_PROFIT'
export const RES_POST_ADGROUPS_PROFIT = 'RES_POST_ADGROUPS_PROFIT'

export const reqAdgroupsProfiles = () => {
    return {
        type: REQ_ADGROUPS_PROFILES,
        data: {
            isFetching: true
        }
    }
}
export const resAdgroupsProfiles = ( data ) => {
    return {
        type: RES_ADGROUPS_PROFILES,
        data: {
            ...data,
            isFetching: false
        }
    }
}
export function fetchAdgroupsProfiles( params ) {
    return dispatch => {
        dispatch( reqAdgroupsProfiles() )
        const time = params.fromDate + '-' + params.toDate;
        return ajax( {
            api: `/sources/ddgroups/${ params.adgroupId }/profiles`,
            body: pick( params, [ 'campaignId', 'adgroupId', 'fromDate', 'toDate' ] ),
            format: json => {
                const { adgroupProfiles, platform } = json.data;
                const { adgroup, item } = adgroupProfiles.adgroupItem
                let vo = adgroupProfiles.daemonOptimizeSettingVO || {};
                let optimizeStatus;
                // 手动宝贝 数据修正
                if ( adgroup.isMandate === false ) {
                    vo.isOptimizeChangePrice = '0';
                    vo.isOptimizeChangeMobilePrice = '0';
                    vo.isOptimizeGenerateWord = '0';
                    vo.isOptimizeChangeMatchScope = '0';
                }

                if ( vo.isOptimizeByConfig == '1' ) {
                    optimizeStatus = 9;
                } else if ( ( vo.isOptimizeChangePrice === '1' || vo.isOptimizeChangeMobilePrice === '1' ) && vo.isOptimizeGenerateWord === '1' ) {
                    // 宝贝全自动优化
                    optimizeStatus = 1;
                } else if ( ( vo.isOptimizeChangePrice === '1' || vo.isOptimizeChangeMobilePrice === '1' ) && vo.isOptimizeGenerateWord === '0' ) {
                    // 宝贝只优化价格
                    optimizeStatus = 0;
                } else if ( ( vo.isOptimizeChangePrice === '0' && vo.isOptimizeChangeMobilePrice === '0' ) && vo.isOptimizeGenerateWord === '0' ) {
                    if ( adgroup.isMandate ) {
                        // 宝贝不优化[出词&出价]
                        optimizeStatus = 3;
                    } else {
                        // 宝贝不自动优化
                        optimizeStatus = -1;
                    }
                } else {
                    // 宝贝只优化出词
                    optimizeStatus = 2;
                }
                formatReport( adgroupProfiles.report );
                return {
                    adgroup: {
                        ...adgroup,
                        ...item,
                        ...vo,
                        optimizationState: optimizeStatus
                    },
                    platform,
                    daemonSettingMap: adgroupProfiles.daemonSettingMap,
                    report: {
                        [ time ]: adgroupProfiles.report
                    }
                }
            },
            success: data => {
                dispatch( resAdgroupsProfiles( data ) )
            }
        } )
    }
}

// 修改宝贝状态
export const reqPostAdgroups = () => {
    return {
        type: REQ_POST_ADGROUPS,
        data: {
            isPosting: true
        }
    }
}
export const resPostAdgroups = ( data ) => {
    notify( '设置成功' )
    return {
        type: RES_POST_ADGROUPS,
        data: {
            ...data,
            isPosting: false
        }
    }
}
// 转换接口字段与显示字段
const transMap = {
    qScoreLimitOpenStatus: 'isOpenQScoreLimit',
    adjustPcPrice: 'isOptimizeChangePrice',
    adjustMobilePrice: 'isOptimizeChangeMobilePrice'
}
export function postAdgroupsStatus( params ) {
    let body = isArray( params ) ? params : [ params ]
    return dispatch => {
        dispatch( reqPostAdgroups() );
        return ajax( {
            api: `/sources/ddgroups`,
            method: 'post',
            body: body,
            format: json => {
                // 先按照只会修改一条处理   返回的结构可能不一致  容错
                if ( getFromObj( json, [ 'data', 'result', params.adgroupId ] ) === true || ( !json.data && json.success ) ) {
                    let c = {}
                    mapKeys( transMap, ( val, key ) => {
                        if ( key in params ) {
                            c[ val ] = +params[ key ]
                        }
                    } )
                    return {
                        ...params,
                        ...c
                    }
                } else {
                    return null
                }
            },
            success: data => dispatch( resPostAdgroups( data ) )
        } )
    }
}

export const reqPostAdgroupsOptimization = () => {
    return {
        type: REQ_POST_ADGROUPS_OPTIMIZATION,
        data: {
            isPosting: true
        }
    }
}
export const resPostAdgroupsOptimization = ( data ) => {
    notify( '设置成功' )
    return {
        type: RES_POST_ADGROUPS_OPTIMIZATION,
        data: {
            ...data,
            isPosting: false
        }
    }
}
export function postAdgroupsOptimization( params ) {
    return dispatch => {
        dispatch( reqPostAdgroupsOptimization() );
        return ajax( {
            api: `/sources/optimizationSettings/ddgroup/submit`,
            method: 'post',
            body: params,
            format: json => {
                if ( json.success ) {
                    return { daemonSettingMap: params.optimizationSettingMap }
                } else {
                    return null
                }
            },
            success: data => dispatch( resPostAdgroupsOptimization( data ) )
        } )
    }
}

export const reqBlackword = () => {
    return {
        type: REQ_BLACKWORD,
        data: {
            isFetching: true
        }
    }
}
export const resBlackword = ( data ) => {
    return {
        type: RES_BLACKWORD,
        data: {
            ...data,
            isFetching: false
        }
    }
}
// matchPattern = 0 为 不再投放词  （默认不传
export function fetchBlackword( params ) {
    return dispatch => {
        dispatch( reqBlackword() );
        return ajax( {
            api: `/sources/blackKeywords`,
            body: pick( params, [ 'campaignId', 'adgroupId', 'matchPattern' ] ),
            format: json => {
                const words = json.data.blackKeywords,
                    isNever = 'matchPattern' in params;
                if ( words ) {
                    return {
                        [isNever ? 'neverlist' : 'blacklist']: words.map( obj => obj.word )
                    }
                } else {
                    return []
                }
            },
            success: data => dispatch( resBlackword( data ) )
        } )
    }
}

export const reqPostBlackword = () => {
    return {
        type: REQ_POST_BLACKWORD,
        data: {
            isFetching: true
        }
    }
}
export const resPostBlackword = ( data ) => {
    return {
        type: RES_POST_BLACKWORD,
        data: {
            ...data,
            isFetching: false
        }
    }
}
export function postBlackword( params, cb ) {
    return dispatch => {
        dispatch( reqPostBlackword() );
        return ajax( {
            api: `/sources/blackKeywords`,
            method: 'post',
            body: params,
            format: json => {
                if ( json.success ) {
                    return { blacklist: params.word }
                } else {
                    return null
                }
            },
            success: data => {
                dispatch( resPostBlackword( data ) )
                cb && cb()
            }
        } )
    }
}

export const reqDelNeverword = () => {
    return {
        type: REQ_DEL_NEVERWORD,
        data: {
            isFetching: true
        }
    }
}
export const resDelNeverword = ( data ) => {
    return {
        type: RES_DEL_NEVERWORD,
        data: {
            ...data,
            isFetching: false
        }
    }
}
export function delNeverword( params, cb ) {
    return dispatch => {
        dispatch( reqDelNeverword() );
        return ajax( {
            api: `/sources/blackKeywords/neverPutKeywords`,
            method: 'delete',
            body: params,
            format: json => {
                if ( json.success ) {
                    return { neverlist: [] }
                } else {
                    return {}
                }
            },
            success: data => {
                dispatch( resDelNeverword( data ) )
                cb && cb()
            }
        } )
    }
}

export const reqSellwords = () => {
    return {
        type: REQ_SELLWORDS,
        data: {
            isFetching: true
        }
    }
}
export const resSellwords = ( data ) => {
    return {
        type: RES_SELLWORDS,
        data: {
            ...data,
            isFetching: false
        }
    }
}
export function fetchSellwords( params ) {
    return dispatch => {
        dispatch( reqSellwords() );
        return ajax( {
            api: `/sources/extensionKeywords`,
            body: pick( params, [ 'campaignId', 'adgroupId' ] ),
            format: json => {
                const obj = json.data.extensionKeywords
                if ( obj ) {
                    return {
                        sellwordsList: obj.map( o => o.word ),
                        onlyGenerate: json.data.isOptimizeExtensionword
                    }
                } else {
                    return {}
                }
            },
            success: data => dispatch( resSellwords( data ) )
        } )
    }
}

export const reqPutSellwords = () => {
    return {
        type: REQ_PUT_SELLWORDS,
        data: {
            isFetching: true
        }
    }
}
export const resPutSellwords = ( data ) => {
    notify( '设置成功' )
    return {
        type: RES_PUT_SELLWORDS,
        data: {
            ...data,
            isFetching: false
        }
    }
}
export function putSellwords( params ) {
    //  scope /单个（广告组级别）：传2 / 批量（计划级别）：传1
    return dispatch => {
        dispatch( reqPutSellwords() );
        return ajax( {
            api: `/sources/extensionKeywords/new`,
            method: 'put',
            body: pick( params, [
                'campaignId',
                'adgroupId',
                'word',
                'isOverWrite',
                'onlyGenerateExtend',
                'scope'
            ] ),
            format: json => {
                if ( json.success ) {
                    return { sellwordsList: params.word, onlyGenerate: params.onlyGenerateExtend }
                } else {
                    return {}
                }
            },
            success: data => dispatch( resPutSellwords( data ) )
        } )
    }
}

export const reqAdgroupsRealTime = () => {
    return {
        type: REQ_ADGROUPS_REALTIME,
        data: {
            isFetching: 'realtime'
        }
    }
}
export const resAdgroupsRealTime = ( data ) => {
    return {
        type: RES_ADGROUPS_REALTIME,
        data: {
            report: {
                ...data
            },
            isFetching: false
        }
    }
}
export function fetchAdgroupsRealTime( params ) {
    return dispatch => {
        dispatch( reqAdgroupsRealTime() )
        return ajax( {
            api: `/sources/reports/ddgroup/realTime/api/single`,
            body: pick( params, [ 'adgroupId', 'campaignId' ] ),
            format: json => {
                const key = params.fromDate + '-' + params.toDate
                if ( json.success ) {
                    return { [ key ]: json.data.reports }
                } else {
                    return {};
                }
            },
            success: data => dispatch( resAdgroupsRealTime( data ) )
        } )
    }
}

export const reqAdgroupsProfit = () => {
    return {
        type: REQ_ADGROUPS_PROFIT,
        data: {
            isFetching: true
        }
    }
}
export const resAdgroupsProfit = ( data ) => {
    return {
        type: RES_ADGROUPS_PROFIT,
        data: {
            ...data,
            isFetching: false
        }
    }
}
export function fetchAdgroupsProfit( params ) {
    return dispatch => {
        dispatch( reqAdgroupsProfit() );
        return ajax( {
            api: `/sources/adgroups/${ params.adgroupId }/realRoi`,
            format: json => {
                const { realRoi } = json.data
                return {
                    itemProfit: realRoi ? realRoi.itemProfit: null,
                    itemPrice: realRoi ? realRoi.itemPrice: null
                }
            },
            success: data => dispatch( resAdgroupsProfit( data ) )
        } )
    }
}
export const reqPostAdgroupsProfit = () => {
    return {
        type: REQ_POST_ADGROUPS_PROFIT,
        data: {
            isFetching: true
        }
    }
}
export const resPostAdgroupsProfit = ( itemProfit ) => {
    return {
        type: RES_POST_ADGROUPS_PROFIT,
        data: {
            ...itemProfit,
            isFetching: false
        }
    }
}
export function postAdgroupsProfit( params ) {
    return dispatch => {
        dispatch( reqPostAdgroupsProfit() );
        return ajax( {
            api: `/sources/adgroups/realRoi`,
            method: 'post',
            body: pick( params, [ 'campaignId', 'adgroupId', 'itemId', 'itemPrice', 'itemProfit' ] ),
            format: json => {
                return pick( params, [ 'itemPrice', 'itemProfit' ] )
            },
            success: data => dispatch( resPostAdgroupsProfit( data ) )
        } )
    }
}

const defaultState = {
    adgroup: {},
    daemonSettingMap: {},
    report: {},
    blacklist: [],
    neverlist: [],
    sellwordsList: []
}
export default function AdgroupReducer( state = defaultState, action ) {
    if ( action.data ) {
        return merge( {}, state, action.data )
    } else {
        return state
    }
}
