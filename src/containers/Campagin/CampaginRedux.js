/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

import ajax from '@/utils/ajax'

export const REQ_GET_CAMPAGIN_LIST = 'REQ_GET_CAMPAGIN_LIST'
export const RES_GET_CAMPAGIN_LIST = 'RES_GET_CAMPAGIN_LIST'

export const request = () => {
    return {
        type: REQ_GET_CAMPAGIN_LIST,
        data: {
            isFetching: true
        }
    }
}
export const response = (data) => {
    return {
        type: RES_GET_CAMPAGIN_LIST,
        data: {
            ...data,
            isFetching: false
        }
    }
}

function fetchCampaignList(params) {
    return dispatch => {
        dispatch(request());
        return ajax({
            api: `/sources/campaign/${params.campaignId}`,
            method: 'post',
            body: params,
            format: json => {
                return json
            },
            success: data => dispatch(response(data))
        })
    }
}

export default function campaignReducer(state = {}, action) {
    switch (action.type) {
        case REQ_GET_CAMPAGIN_LIST:
            fetchCampaignList()
            break;
        case RES_GET_CAMPAGIN_LIST:
            return {
                ...state,
                ...action.data
            }
        default:
            return state
    }
}