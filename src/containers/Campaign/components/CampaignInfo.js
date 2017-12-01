/**
 * @fileOverview
 * @author crow
 * @time 2017/11/30
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'

export default class CampaignInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {info} = this.props
        return (
            <div>
                {info.title}
                日限额：{info.budget}
                pc限价：{info.wordPriceLimit}
                无线限价：{info.mobileWordPriceLimit}
            </div>
        )
    }
}