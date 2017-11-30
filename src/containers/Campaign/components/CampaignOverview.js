/**
 * @fileOverview
 * @author crow
 * @time 2017/12/1
 */

import React, {Component} from 'react'
import {Tabs, Layout} from 'antd'

export default class CampaignOverview extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="campaign-overview" type="card">
                <Tabs>
                    <Tabs.TabPane tab="计划概况" key="detail">
                        <Layout className="campaign-overview-content">
                        </Layout>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="实时概况" key="realtime">
                        <Layout className="campaign-overview-content">
                        </Layout>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}
