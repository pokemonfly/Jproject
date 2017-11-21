import ajax from '@/utils/ajax'
import { formatReport, notify } from '@/utils/tools'
import { omit, capitalize, pick, difference, isArray } from 'lodash'
// 分日报表
export const REQ_ADGROUPS_DAY_REPORT = 'REQ_ADGROUPS_DAY_REPORT'
export const RES_ADGROUPS_DAY_REPORT = 'RES_ADGROUPS_DAY_REPORT'
// 分日 & 设备报表
export const REQ_ADGROUPS_DAY_DEVICE_REPORT = 'REQ_ADGROUPS_DAY_DEVICE_REPORT'
export const RES_ADGROUPS_DAY_DEVICE_REPORT = 'RES_ADGROUPS_DAY_DEVICE_REPORT'
// 分时报表
export const REQ_ADGROUPS_REALTIME_REPORT = 'REQ_ADGROUPS_REALTIME_REPORT'
export const RES_ADGROUPS_REALTIME_REPORT = 'RES_ADGROUPS_REALTIME_REPORT'
// 分时 & 设备报表
export const REQ_ADGROUPS_REALTIME_DEVICE_REPORT = 'REQ_ADGROUPS_REALTIME_DEVICE_REPORT'
export const RES_ADGROUPS_REALTIME_DEVICE_REPORT = 'RES_ADGROUPS_REALTIME_DEVICE_REPORT'

export const reqAdgroupsDayReport = ( ) => {
    return {
        type: REQ_ADGROUPS_DAY_REPORT,
        data: {
            isFetching: 'day'
        }
    }
}
export const resAdgroupsDayReport = ( data ) => {
    let {
        mandateDate,
        ...rest
    } = data
    return {
        type: RES_ADGROUPS_DAY_REPORT,
        data: {
            mandateDate,
            isFetching: false
        },
        report: {
            ...rest
        }
    }
}
export function fetchAdgroupsDayReport( params ) {
    return dispatch => {
        dispatch(reqAdgroupsDayReport( ))
        return ajax({
            api: `/sources/ddgroups/${ params.adgroupId }/reports/separations`,
            body: params,
            format: json => {
                const key = params.fromDate + '-' + params.toDate
                if ( json.success ) {
                    return { mandateDate: json.data.mandateDate, [ key ]: json.data.reports }
                } else {
                    return {[ key ]: [ ]};
                }
            },
            success: data => dispatch(resAdgroupsDayReport( data ))
        })
    }
}

export const reqAdgroupsDayDeviceReport = ( ) => {
    return {
        type: REQ_ADGROUPS_DAY_DEVICE_REPORT,
        data: {
            isFetching: 'device'
        }
    }
}
export const resAdgroupsDayDeviceReport = ( data ) => {
    let { mandateDate, pcReport, mobileReport } = data
    return {
        type: RES_ADGROUPS_DAY_DEVICE_REPORT,
        data: {
            mandateDate,
            isFetching: false
        },
        pcReport,
        mobileReport
    }
}
export function fetchAdgroupsDayDeviceReport( params ) {
    return dispatch => {
        dispatch(reqAdgroupsDayDeviceReport( ))
        return ajax({
            api: `/sources/ddgroups/${ params.adgroupId }/reports/separations/device`,
            body: params,
            format: json => {
                const key = params.fromDate + '-' + params.toDate
                if ( json.success ) {
                    return {
                        mandateDate: json.data.mandateDate,
                        pcReport: {
                            [ key ]: json.data.pcReports
                        },
                        mobileReport: {
                            [ key ]: json.data.mobileReports
                        }
                    }
                } else {
                    return {
                        pcReport: {
                            [ key ]: [ ]
                        },
                        mobileReport: {
                            [ key ]: [ ]
                        }
                    };
                }
            },
            success: data => dispatch(resAdgroupsDayDeviceReport( data ))
        })
    }
}

export const reqAdgroupsRealTimeReport = ( ) => {
    return {
        type: REQ_ADGROUPS_REALTIME_REPORT,
        data: {
            isFetching: 'realtime'
        }
    }
}
export const resAdgroupsRealTimeReport = ( data ) => {
    return {
        type: RES_ADGROUPS_REALTIME_REPORT,
        data: {
            isFetching: false
        },
        realTime: {
            ...data
        }
    }
}
export function fetchAdgroupsRealTimeReport( params ) {
    return dispatch => {
        dispatch(reqAdgroupsRealTimeReport( ))
        return ajax({
            api: `/sources/reports/ddgroup/realTime/summary`,
            body: pick(params, [ 'adgroupId', 'campaignId', 'fromDate', 'toDate' ]),
            format: json => {
                const key = params.fromDate == params.toDate ? params.fromDate : `${ params.fromDate }-${ params.toDate }`;
                if ( json.success ) {
                    return { [ key ]: json.data.reports }
                } else {
                    return null;
                }
            },
            success: data => dispatch(resAdgroupsRealTimeReport( data ))
        })
    }
}

export const reqAdgroupsRealTimeDeviceReport = ( ) => {
    return {
        type: REQ_ADGROUPS_REALTIME_DEVICE_REPORT,
        data: {
            isFetching: 'device'
        }
    }
}
export const resAdgroupsRealTimeDeviceReport = ( data ) => {
    let { pcReport, mobileReport } = data
    return {
        type: RES_ADGROUPS_REALTIME_DEVICE_REPORT,
        data: {
            isFetching: false
        },
        pcReport,
        mobileReport
    }
}
export function fetchAdgroupsRealTimeDeviceReport( params ) {
    return dispatch => {
        dispatch(reqAdgroupsRealTimeDeviceReport( ))
        return ajax({
            api: `/sources/reports/ddgroup/realTime/device/summary`,
            body: pick(params, [ 'adgroupId', 'campaignId', 'fromDate', 'toDate' ]),
            format: json => {
                const key = params.fromDate == params.toDate ? params.fromDate : `${ params.fromDate }-${ params.toDate }`;
                if ( json.success ) {
                    return {
                        pcReport: {
                            [ key ]: json.data.pcReports
                        },
                        mobileReport: {
                            [ key ]: json.data.mobileReports
                        }
                    }
                } else {
                    return {
                        pcReport: {
                            [ key ]: [ ]
                        },
                        mobileReport: {
                            [ key ]: [ ]
                        }
                    };
                }
            },
            success: data => dispatch(resAdgroupsRealTimeDeviceReport( data ))
        })
    }
}

const defaultState = {
    day: {},
    pc: {},
    mobile: {},
    realTime: {},
    realTimePc: {},
    realTimeMobile: {}
}
export default function keywordReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case REQ_ADGROUPS_DAY_REPORT:
        case RES_ADGROUPS_DAY_REPORT:
            return {
                ...state,
                day: {
                    ...state.day,
                    ...action.report
                },
                ...action.data
            }
        case REQ_ADGROUPS_DAY_DEVICE_REPORT:
        case RES_ADGROUPS_DAY_DEVICE_REPORT:
            return {
                ...state,
                pc: {
                    ...state.pc,
                    ...action.pcReport
                },
                mobile: {
                    ...state.mobile,
                    ...action.mobileReport
                },
                ...action.data
            }
        case REQ_ADGROUPS_REALTIME_REPORT:
        case RES_ADGROUPS_REALTIME_REPORT:
            return {
                ...state,
                realTime: {
                    ...state.realTime,
                    ...action.realTime
                },
                ...action.data
            }
        case REQ_ADGROUPS_REALTIME_DEVICE_REPORT:
        case RES_ADGROUPS_REALTIME_DEVICE_REPORT:
            return {
                ...state,
                realTimePc: {
                    ...state.pc,
                    ...action.pcReport
                },
                realTimeMobile: {
                    ...state.mobile,
                    ...action.mobileReport
                },
                ...action.data
            }
        default:
            return state
    }
}
