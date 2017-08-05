import ajax from '../../utils/ajax'
import { normalize, schema } from 'normalizr'

const { Entity } = schema;

export const SIDER_TOGGLE = 'SIDER_TOGGLE'
export const REQ_CAMPAIGN_INFO = 'REQ_CAMPAIGN_INFO'
export const RES_CAMPAIGN_INFO = 'RES_CAMPAIGN_INFO'

export function toggleSider() {
    return { type: SIDER_TOGGLE }
}
export const reqCampaignInfo = () => {
    return {
        type: REQ_CAMPAIGN_INFO,
        data: {
            isFetching: true
        }
    }
}
export const resCampaignInfo = ( data ) => {
    return {
        type: RES_CAMPAIGN_INFO,
        data: {
            ...data.result,
            campaignMap: data.entities.campaign,
            isFetching: fasle
        }
    }
}
const campaign = new Entity( 'keyword', {}, {
    idAttribute: 'campaignId'
} );
export function fetchCampaignInfo() {
    return dispatch => {
        dispatch( reqCampaignInfo() )
        return ajax( {
            api: '/sources/campaign.mock',
            format: json => {
                let obj;
                obj = normalize( json.data, {
                    campaigns: [ campaign ],
                } );
                return obj;
            },
            success: data => dispatch( resCampaignInfo( data ) ),
            error: err => console.error( err )
        } )
    }
}

const defaultState = {
    sider: {
        collapsed: false
    },
    menu: {
        current: 'home'
    },
    engines: {}
}
export default function layoutReducer( state = defaultState, action ) {
    switch ( action.type ) {
        case SIDER_TOGGLE:
            return {
                ...state,
                sider: {
                    collapsed: !state.sider.collapsed
                }
            }
        default:
            return state
    }
}
