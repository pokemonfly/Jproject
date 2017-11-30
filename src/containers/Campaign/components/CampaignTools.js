/**
 * @fileOverview
 * @author crow
 * @time 2017/12/1
 */

import React, {Component} from 'react'
import {Button} from 'antd'

export default class CampaignTools extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Button type="primary">设置投放时间</Button>
                <Button type="primary">设置投放地域</Button>
                <Button type="primary">设置投放平台</Button>
                <Button>优化开关</Button>
            </div>
        )
    }
}