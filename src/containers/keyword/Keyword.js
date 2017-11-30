import './KeywordStyle.less';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PubSub from 'pubsub-js';

import {fetchCampaignList} from 'containers/Campaign/CampaignRedux'
import KeywordHead from './components/KeywordHead';
import KeywordOverview from './components/KeywordOverview';
import KeywordView from './components/KeywordView';
import Breadcrumb from 'containers/shared/Breadcrumb'
import ROUTER from 'utils/config/Router'

const PATHNAME = '/keyword'

@connect(state => ({
    keyword: state.keyword,
    campaign: state.campaign.data,
    location: state.location
}), dispatch => (bindActionCreators({
    fetchCampaignList
}, dispatch)))
export default class Keyword extends Component {
    componentDidUpdate() {
        PubSub.publish('table.resize')
    }
    componentWillMount() {
        this.props.fetchCampaignList()
    }
    render() {
        let {campaign, location} = this.props
        return (
            <div>
                <Breadcrumb list={ROUTER[PATHNAME]}
                            campaign={{list: campaign, index: 2, campaignIdActive: location.query.campaignId}}/>
                <KeywordHead></KeywordHead>
                <KeywordOverview></KeywordOverview>
                <KeywordView></KeywordView>
            </div>
        );
    }
}
