/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

import {forEach} from 'lodash'

import ajax from 'utils/ajax'
import {getEngineType} from 'utils/constants'
import {findIndex} from "utils/tools";

const ENGINE_DEFAULT = {
    typeName: '未启动'
}

const AUTO_ENGINE_ING = {
    typeName: '托管中'
}

const REQ_ENGINE_LIST = 'REQ_ENGINE_LIST'
const RES_ENGINE_LIST = 'RES_ENGINE_LIST'
const DELETE_ENGINE = 'DELETE_ENGINE'   // 取消一个引擎
const ADD_AUTO_ENGINE = 'ADD_AUTO_ENGINE'   // 添加一个引擎

export default function engineReducer(state = {data: []}, action) {
    let engineNo, index
    switch (action.type) {
        case REQ_ENGINE_LIST:
            return state
        case RES_ENGINE_LIST:
            return {
                ...state,
                ...action.data
            }
        case DELETE_ENGINE:
            engineNo = action.data.engineNo
            index = findIndex(state.data, 'engineNo', engineNo)
            Object.assign(state.data[index], ENGINE_DEFAULT)
            return Object.assign({}, state)
        case ADD_AUTO_ENGINE:
            engineNo = action.data.engineNo
            index = findIndex(state.data, 'engineNo', engineNo)
            state.data[index] = Object.assign({}, AUTO_ENGINE_ING, {engineNo: engineNo})
            return Object.assign({}, state)
        default:
            return state
    }
}


export function reqEngineList() {
    return {
        type: REQ_ENGINE_LIST,
        data: {
            isFetching: true
        }
    }
}

export function resEngineList(data) {
    return {
        type: RES_ENGINE_LIST,
        data: {
            ...data,
            isFetching: false
        }
    }
}

/**
 * 取消一个计划的托管
 * @param engineNo
 * @returns {{type: string, data: {engineNo: *}}}
 */
export function deleteEngine(engineNo) {
    return {
        type: DELETE_ENGINE,
        data: {
            engineNo
        }
    }
}

/**
 * 正在托管一个计划
 * @param engineNo
 * @returns {{type: string, data: {engineNo: *}}}
 */
export function addAutoEngine(engineNo) {
    return {
        type: ADD_AUTO_ENGINE,
        data: {
            engineNo
        }
    }
}

export function fetchEngineList() {
    return dispatch => {
        dispatch(reqEngineList())
        return ajax({
            api: '/sources/users/engines',
            format: json => {
                forEach(json.data.engines, (value, key) => {
                    if (value) {
                        value.typeName = getEngineType(value.type)
                        value.engineNo = key
                    } else {
                        json.data.engines[key] = Object.assign({}, ENGINE_DEFAULT)
                        json.data.engines[key].engineNo = key
                    }
                })
                return {data: Object.values(json.data.engines)}
            },
            success: data => dispatch(resEngineList(data)),
            error: err => console.error(err)
        })
    }
}