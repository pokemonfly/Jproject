import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import PubSub from 'pubsub-js';
import { Layout, Menu, Dropdown, Icon as AntdIcon, Tabs } from 'antd';
import Icon from '@/containers/shared/Icon';
import TweenBar from '@/containers/shared/TweenBar';
import DataRangePicker from '@/containers/shared/DataRangePicker';
import { keywordReports } from '@/utils/constants'
import './KeywordOverviewStyle.less'

const { TabPane } = Tabs
const DATATYPE = {
    '0': '汇总',
    '1': '只看PC',
    '2': '只看无线'
}
@connect(state => ({ user: state.user, campaign: state.campaign, keyword: state.keyword.keywordList, head: state.keyword.keywordHead, view: state.keyword.keywordView }), dispatch => (bindActionCreators( {}, dispatch )))
export default class KeywordOverview extends React.Component {
    state = {
        dataTypeStr: DATATYPE['0'],
        chartSw: false
    }
    onClickDataType = ({ key }) => {
        this.setState({dataTypeStr: DATATYPE[key]})
    }
    getContent( isRealTime ) {
        const { chartSw } = this.state
        if ( this.props.head.isFetching ) {
            return (
                <div>Loading</div>
            )
        }
        const dataSource = this.props.head.report['2017-09-25-2017-10-09']

        return (
            <Layout className="keyword-overview-content">
                <TweenBar dataSource={dataSource} config={keywordReports}></TweenBar>
                {!chartSw && (
                    <div className="chart-sw">
                        <span>展开历史趋势图</span>
                        <Icon type="xiangxia"/>
                    </div>
                )}
            </Layout>
        )
    }
    getTabBar( ) {
        const { dataTypeStr } = this.state
        const menu = (
            <Menu onClick={this.onClickDataType}>
                <Menu.Item key="0">{DATATYPE['0']}</Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="1">{DATATYPE['1']}</Menu.Item>
                <Menu.Item key="2">{DATATYPE['2']}</Menu.Item>
            </Menu>
        )
        return (
            <div className="keyword-float-panel">
                <Dropdown overlay={menu} trigger={[ 'click' ]}>
                    <a className="ant-dropdown-link" href="#">
                        {dataTypeStr}
                        <Icon type="down"/>
                    </a>
                </Dropdown>
                <DataRangePicker fromDate="2017-9-1" toDate="2017-9-12"/>
            </div>
        )
    }
    render( ) {
        return (
            <div className="keyword-overview">
                <Tabs tabBarExtraContent={this.getTabBar( )} defaultActiveKey="detail" type="card">
                    <TabPane tab="宝贝概况" key="detail">
                        {this.getContent( 0 )}
                    </TabPane>
                    <TabPane tab="实时概况" key="realtimeDetail">
                        {this.getContent( 1 )}
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
