/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import ROUTER from 'utils/config/Router'
import {fetchCampaignList} from 'containers/Campaign/CampaignRedux'
import Breadcrumb from 'containers/shared/Breadcrumb'
import {updateCurrent} from 'layouts/components/MenuRedux'

const PATHNAME = '/list'

@connect(state => ({
    campaign: state.campaign.data,
    location: state.location
}), dispatch => (bindActionCreators({
    fetchCampaignList,
    updateCurrent
}, dispatch)))
export default class Adgroup extends Component {
    componentWillMount() {
        this.props.fetchCampaignList()
    }
    dropDownClick = (item) => {
        console.log(item)
        this.props.updateCurrent(item.key.split('_'))
    }
    render() {
        let {campaign, location} = this.props
        return (
            <div>
                <Breadcrumb
                    list={ROUTER[PATHNAME]}
                    campaign={{list: campaign, index: 2, campaignIdActive: location.query.campaignId}}
                    dropDownClick={this.dropDownClick}
                />
            </div>
        );
    }
}
