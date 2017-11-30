/**
 * @fileOverview
 * @author crow
 * @time 2017/11/30
 */

import React, {Component} from 'react'
import {Row, Col} from 'antd'

import CampaignInfo from 'containers/Campaign/components/CampaignInfo'
import CampaignTools from 'containers/Campaign/components/CampaignTools'


export default class AdgroupHead extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {campaign} = this.props
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <CampaignInfo info={campaign}/>
                    </Col>
                    <Col span={8} offset={8}>
                        <CampaignTools/>
                    </Col>
                </Row>
            </div>
        )
    }
}