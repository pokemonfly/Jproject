/**
 * @fileOverview
 * @author crow
 * @time 2017/12/1
 */

import React, {Component} from 'react'
import {Tabs} from 'antd'

export default class AdgroupView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="adgroup-view">
                <Tabs type="card">
                    <Tabs.TabPane tab="宝贝列表" key="adgroupList">
                        开发中
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="计划日志" key="campaignLog">
                        <span>开发中</span>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}