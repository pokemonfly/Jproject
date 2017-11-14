import ajax from '@/utils/ajax'
import { formatReport, notify } from '@/utils/tools'
import { pick, get as getFromObj, isArray, mapKeys } from 'lodash'

// 关键词列表
export const REQ_ADGROUPS_PROFILES = 'REQ_ADGROUPS_PROFILES'
export const RES_ADGROUPS_PROFILES = 'RES_ADGROUPS_PROFILES'
// 修改宝贝状态
export const REQ_POST_ADGROUPS = "REQ_POST_ADGROUPS"
export const RES_POST_ADGROUPS = "RES_POST_ADGROUPS"
// 修改宝贝优化状态
export const REQ_POST_ADGROUPS_OPTIMIZATION = "REQ_POST_ADGROUPS_OPTIMIZATION"
export const RES_POST_ADGROUPS_OPTIMIZATION = "RES_POST_ADGROUPS_OPTIMIZATION"
// 黑名单
export const REQ_BLACKWORD = 'REQ_BLACKWORD'
export const RES_BLACKWORD = 'RES_BLACKWORD'

export const reqAdgroupsProfiles = ( ) => {
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
        dispatch(reqAdgroupsProfiles( ))
        const time = params.fromDate + '-' + params.toDate;
        return ajax({
            api: `/sources/adgroups/${ params.adgroupId }/profiles`,
            body: pick(params, [ 'campaignId', 'adgroupId', 'fromDate', 'toDate' ]),
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
            success: data => dispatch(resAdgroupsProfiles( data ))
        })
    }
}

// 修改宝贝状态
export const reqPostAdgroups = ( ) => {
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
        adgroup: {
            ...data
        },
        data: {
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
        dispatch(reqPostAdgroups( ));
        return ajax({
            api: `/sources/ddgroups`,
            method: 'post',
            body: body,
            format: json => {
                // 先按照只会修改一条处理   返回的结构可能不一致  容错
                if (getFromObj(json, [ 'data', 'result', params.adgroupId ]) === true || ( !json.data && json.success )) {
                    let c = {}
                    mapKeys(transMap, ( val, key ) => {
                        if ( key in params ) {
                            c[val] = +params[key]
                        }
                    })
                    return {
                        ...params,
                        ...c
                    }
                } else {
                    return null
                }
            },
            success: data => dispatch(resPostAdgroups( data ))
        })
    }
}

export const reqPostAdgroupsOptimization = ( ) => {
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
        ...data,
        data: {
            isPosting: false
        }
    }
}

export function postAdgroupsOptimization( params ) {
    return dispatch => {
        dispatch(reqPostAdgroupsOptimization( ));
        return ajax({
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
            success: data => dispatch(resPostAdgroupsOptimization( data ))
        })
    }
}

export const reqBlackword = ( ) => {
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
        dispatch(reqBlackword( ));
        return ajax({
            api: `/sources/blackKeywords`,
            body: pick(params, [ 'campaignId', 'adgroupId', 'matchPattern' ]),
            format: json => {
                const words = json.data.blackKeywords,
                    isNever = 'matchPattern' in params;
                if ( words ) {
                    return {
                        [isNever ? 'neverlist' : 'blacklist']: words.map( obj => obj.word )
                    }
                } else {
                    return [ ]
                }
            },
            success: data => dispatch(resBlackword( data ))
        })
    }
}

const defaultState = {
    adgroup: {},
    daemonSettingMap: {},
    report: {},
    blacklist: [],
    neverlist: [ ]
}
export default function keywordHeadReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case REQ_ADGROUPS_PROFILES:
        case RES_ADGROUPS_PROFILES:
            return {
                ...state,
                ...action.data
            }
        case REQ_POST_ADGROUPS:
        case RES_POST_ADGROUPS:
            return {
                ...state,
                adgroup: {
                    ...state.adgroup,
                    ...action.adgroup
                },
                ...action.data
            }
        case REQ_POST_ADGROUPS_OPTIMIZATION:
        case RES_POST_ADGROUPS_OPTIMIZATION:
            return {
                ...state,
                daemonSettingMap: {
                    ...state.daemonSettingMap,
                    ...action.daemonSettingMap
                },
                ...action.data
            }
        case REQ_BLACKWORD:
        case RES_BLACKWORD:
            return {
                ...state,
                ...action.data
            }
        default:
            return state
    }
}
