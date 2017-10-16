import ajax from '@/utils/ajax'
import { pick, get as getFromObj, isArray } from 'lodash'

// 关键词列表
export const REQ_ADGROUPS_PROFILES = 'REQ_ADGROUPS_PROFILES'
export const RES_ADGROUPS_PROFILES = 'RES_ADGROUPS_PROFILES'
// 修改宝贝状态
export const REQ_POST_ADGROUPS = "REQ_POST_ADGROUPS"
export const RES_POST_ADGROUPS = "RES_POST_ADGROUPS"

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

export function postAdgroupsStatus( params ) {
    let body = isArray( params ) ? params : [ params ]
    return dispatch => {
        dispatch(reqPostAdgroups( ));
        return ajax({
            api: `/sources/ddgroups`,
            method: 'post',
            body: body,
            format: json => {
                // 先按照只会修改一条处理
                if ( getFromObj(json, [ 'data', 'result', params.adgroupId ]) === true ) {
                    return {
                        ...params
                    }
                } else {
                    return null
                }
            },
            success: data => dispatch(resPostAdgroups( data ))
        })
    }
}

const defaultState = {}
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
        default:
            return state
    }
}
