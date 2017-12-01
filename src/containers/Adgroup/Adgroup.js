/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import ROUTER from 'utils/config/Router'
import {findIndex} from "utils/tools";
import {fetchCampaignList} from 'containers/Campaign/CampaignRedux'
import Breadcrumb from 'containers/shared/Breadcrumb'
import CampaignOverview from 'containers/Campaign/components/CampaignOverview'
import AdgroupHead from 'containers/Adgroup/components/AdgroupHead'
import AdgroupView from 'containers/Adgroup/components/AdgroupView'

const PATHNAME = '/list'

@connect(state => ({
    campaign: state.campaign.data,
    location: state.location
}), dispatch => (bindActionCreators({
    fetchCampaignList
}, dispatch)))
export default class Adgroup extends Component {
    componentWillMount() {
        this.props.fetchCampaignList()
    }
    render() {
        let {campaign, location} = this.props
        let campaignCurrent = getCampaign(campaign, location.query.campaignId)
        return (
            <div>
                <Breadcrumb
                    list={ROUTER[PATHNAME]}
                    campaign={{list: campaign, index: 2, campaignIdActive: location.query.campaignId}}
                />
                <AdgroupHead campaign={campaignCurrent}/>
                <CampaignOverview/>
                <AdgroupView/>
            </div>
        );
    }
}

function getCampaign(campaign, id) {
    var index = findIndex(campaign, 'campaignId', id)
    if (index === -1) {
        return {}
    }

    return campaign[index]
}