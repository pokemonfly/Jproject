import ajax from '@/utils/ajax'
import { notify } from '@/utils/tools'
import { pick } from 'lodash'

//  一键优化
export const REQ_POST_ONEKEYOPTIMIZATIONS = 'REQ_POST_ONEKEYOPTIMIZATIONS'
export const RES_POST_ONEKEYOPTIMIZATIONS = 'RES_POST_ONEKEYOPTIMIZATIONS'

export const reqPostOneKeyOptimizations = () => {
    return {
        type: REQ_POST_ONEKEYOPTIMIZATIONS,
        data: {
            isFetching: true
        }
    }
}
export const resPostOneKeyOptimizations = ( data ) => {
    notify( '一键优化提交成功' );
    return {
        type: RES_POST_ONEKEYOPTIMIZATIONS,
        data: {
            ...data,
            isFetching: false
        }
    }
}
/*
    params :
    'campaignId', 'adgroupIds',
    'addWordType', 'addWordCount', 'specificWord',
    'delWordType', 'enforceDelWordHours', 'enforceDelContainsWord',
    'del7NoImpression', 'del14NoClick', 'changePriceType',
    'specificPrice', 'specificAddPrice',
    'matchMode', 'delSpecificQscoreType', 'delPcSpecificQscoreMin',
    'delPcSpecificQscoreMax', 'delMobileSpecificQscoreMin', 'delMobileSpecificQscoreMax', 'fakeCid',
    'changeMobilePriceType', 'specificMobilePrice', 'specificAddMobilePrice', 'wnaPercentage', 'isChangeTag',
    'searchCrowdType'
*/
export function postOneKeyOptimizations( params ) {
    return dispatch => {
        dispatch( reqPostOneKeyOptimizations() );
        return ajax( {
            api: `/sources/cusService/oneKeyOptimizations`,
            method: 'post',
            body: params,
            format: json => {
                return json
            },
            success: data => dispatch( resPostOneKeyOptimizations( data ) )
        } )
    }
}

export default function OneKeyReducer( state = {}, action ) {
    switch ( action.type ) {
        case REQ_POST_ONEKEYOPTIMIZATIONS:
        case RES_POST_ONEKEYOPTIMIZATIONS:
            return {
                ...state,
                ...action.data
            }
        default:
            return state
    }
}
