import ajax from '@/utils/ajax'

// 关键词列表
export const REQ_ADGROUPS_PROFILES = 'REQ_ADGROUPS_PROFILES'
export const RES_ADGROUPS_PROFILES = 'RES_ADGROUPS_PROFILES'

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
            api: `/sources/adgroups/${ params.adgroupId }/profiles.mock`,
            body: params,
            format: json => {
                const { adgroupProfiles, platform } = json.data;
                return {
                    adgroup: {
                        ...adgroupProfiles.adgroupItem.adgroup,
                        ...adgroupProfiles.adgroupItem.item,
                        ...adgroupProfiles.daemonOptimizeSettingVO
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
const defaultState = {}
export default function keywordHeadReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case REQ_ADGROUPS_PROFILES:
        case RES_ADGROUPS_PROFILES:
            return {
                ...state,
                ...action.data
            }
        default:
            return state
    }
}
