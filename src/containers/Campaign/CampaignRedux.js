/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

import ajax from 'utils/ajax'
import {findIndex} from 'utils/tools'

const REQ_GET_CAMPAIGN_LIST               = 'REQ_GET_CAMPAIGN_LIST'
const RES_GET_CAMPAIGN_LIST               = 'RES_GET_CAMPAIGN_LIST'
const ADD_CAMPAIGN                        = 'ADD_CAMPAIGN'    // 增加一个计划
const UPDATE_CAMPAIGN_BUDGET              = 'UPDATE_CAMPAIGN_BUDGET' // 修改计划日限额
const UPDATE_CAMPAIGN_OPTIMIZATION_STATUS = 'UPDATE_CAMPAIGN_OPTIMIZATION_STATUS' // 修改计划的优化方式
const CLOSE_CAMPAIGN_OPTIMIZATION         = 'CLOSE_CAMPAIGN_OPTIMIZATION' // 关闭计划的优化方式
const UPDATE_CAMPAIGN_TITLE               = 'UPDATE_CAMPAIGN_TITLE'   // 修改一个计划的计划名

// 手动计划默认状态
const MANDATE_STATUS_DEFAULT = {
    mandateType: -1,
    isMandate: false
}


export default function campaignReducer(state = {data: []}, action) {
    let campaignId = action.data.campaignId, index
    switch (action.type) {
        case REQ_GET_CAMPAIGN_LIST:
            break;
        case RES_GET_CAMPAIGN_LIST:
            return {
                ...state,
                ...action.data
            }
        case UPDATE_CAMPAIGN_BUDGET:
            index = findIndex(state.data, 'campaignId', campaignId)
            Object.assign({}, state.data[index], {
                budget: action.budget
            })
            return Object.assign({}, state)
        case CLOSE_CAMPAIGN_OPTIMIZATION:
            index = findIndex(state.data, 'campaignId', campaignId)
            Object.assign(state.data[index], MANDATE_STATUS_DEFAULT)
            return Object.assign({}, state)
        case UPDATE_CAMPAIGN_TITLE:
            index = findIndex(state.data, 'campaignId', campaignId)
            Object.assign(state.data[index], {
                title: action.title
            })
            return Object.assign({}, state)
        default:
            return state
    }
}

export function reqGetCampaignList() {
    return {
        type: REQ_GET_CAMPAIGN_LIST,
        data: {
            isFetching: true
        }
    }
}

export function resGetCampaignList(data) {
    return {
        type: RES_GET_CAMPAIGN_LIST,
        data: {
            ...data,
            isFetching: false
        }
    }
}


export function fetchCampaignList() {
    return dispatch => {
        dispatch(reqGetCampaignList());
        return ajax({
            api: '/sources/campaign',
            format: json => {
                return json.data.campaigns
            },
            success: data => dispatch(resGetCampaignList(data))
        })
    }
}

/**
 * 修改计划日限额
 * @param campaignId
 * @param budget
 * @returns {{type: string, data: {campaignId: *, budget: *}}}
 */
export function updateCampaignBudget(campaignId, budget) {
    return {
        type: UPDATE_CAMPAIGN_BUDGET,
        data: {
            campaignId: campaignId,
            budget: budget
        }
    }
}

/**
 * 修改计划优化师式
 * @param campaignId
 * @param status
 * @returns {{type: string, data: {campaignId: *, status: *}}}
 */
export function updateCampaignOptimizationStatus(campaignId, status) {
    return {
        type: UPDATE_CAMPAIGN_OPTIMIZATION_STATUS,
        data: {
            campaignId: campaignId,
            status: status
        }
    }
}

/**
 * 取消计划托管
 * @param campaignId
 * @returns {{type: string, data: {campaignId: *}}}
 */
export function closeCampaignOptimization(campaignId) {
    return {
        type: CLOSE_CAMPAIGN_OPTIMIZATION,
        data: {
            campaignId: campaignId,
        }
    }
}

/**
 * 修改计划的计划名
 * @param campaignId
 * @param title
 * @returns {{type: string, data: {campaignId: *, title: *}}}
 */
export function updateCampaignTitle(campaignId, title) {
    return {
        type: UPDATE_CAMPAIGN_TITLE,
        data: {
            campaignId: campaignId,
            title: title
        }
    }
}