import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import PubSub from 'pubsub-js';
import { Layout, Menu, Dropdown, Icon as AntdIcon, Tabs } from 'antd';
import Icon from '@/containers/shared/Icon';
import TweenBar from '@/containers/shared/TweenBar';
import DataRangePicker from '@/containers/shared/DataRangePicker';
import { keywordReports } from '@/utils/constants'
import Chart from '@/containers/shared/Chart';
import moment from 'moment';
import { hashHistory } from 'react-router';
import './KeywordOverviewStyle.less'

const { TabPane } = Tabs
const DATA_TYPE = {
    '0': '汇总',
    '1': '只看PC',
    '2': '只看无线'
}
const today = moment( ).format( 'YYYY-MM-DD' )

@connect(state => ({ location: state.location, query: state.location.query, head: state.keyword.keywordHead }))
export default class KeywordOverview extends React.Component {
    state = {
        dataTypeStr: DATA_TYPE['0'],
        chartSw: false
    }
    setDate({ fromDate, toDate }) {
        const { location } = this.props
        hashHistory.push({
            ...location,
            query: {
                ...location.query,
                fromDate,
                toDate
            }
        });
    }
    onClickDataType = ({ key }) => {
        this.setState({dataTypeStr: DATA_TYPE[key]})
    }
    onTabChange = ( key ) => {
        if ( key == 'detail' ) {
            this.setDate({
                fromDate: moment( ).subtract( 7, 'days' ).format( 'YYYY-MM-DD' ),
                toDate: moment( 1, 'days' ).format( 'YYYY-MM-DD' )
            })
        } else {
            this.setDate({ fromDate: today, toDate: today })
        }
    }
    switchChartShow = ( ) => {
        const { chartSw } = this.state
        this.setState({
            chartSw: !chartSw
        })
    }
    getChartData = ( ) => {
        return {
            type: 'dayReport',
            defaultLegends: ['总收藏率'],
            mandateDate: 1510273658000,
            fromDate: "2017-11-09",
            toDate: "2017-11-15",
            series: [
                {
                    name: '总收藏率',
                    data: [
                        1,
                        21,
                        3,
                        41,
                        15,
                        6,
                        17
                    ]
                }, {
                    name: '藏率',
                    data: [
                        1e5,
                        2e5,
                        3e5,
                        4e5,
                        ,
                        6e5,
                        7e5
                    ]
                }
            ]
        }
    }
    getContent( ) {
        const { chartSw } = this.state
        let { fromDate, toDate } = this.props.query
        const dataSource = this.props.head.report[`${ fromDate }-${ toDate }`]
        if ( this.props.head.isFetching ) {
            return (
                <div>Loading...</div>
            );
        } else {
            return (
                <Layout className="keyword-overview-content">
                    <TweenBar dataSource={dataSource} config={keywordReports}></TweenBar>
                    {chartSw && ( <Chart option={this.getChartData( )}/> )}
                    <div className="chart-sw">
                        <span onClick={this.switchChartShow}>{chartSw ? '收起' : '展开'}历史趋势图
                            <Icon type={chartSw ? "xiangshang" : "xiangxia"}/></span>
                    </div>
                </Layout>
            )
        }
    }
    getTabBar( ) {
        const { dataTypeStr } = this.state
        const { fromDate, toDate } = this.props.query
        const menu = (
            <Menu onClick={this.onClickDataType}>
                <Menu.Item key="0">{DATA_TYPE['0']}</Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="1">{DATA_TYPE['1']}</Menu.Item>
                <Menu.Item key="2">{DATA_TYPE['2']}</Menu.Item>
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
                <DataRangePicker {...{fromDate, toDate}}/>
            </div>
        )
    }
    render( ) {
        const { fromDate, toDate } = this.props.query
        const activeKey = ( fromDate == today && toDate == today ) ? 'realtime' : 'detail'
        return (
            <div className="keyword-overview">
                <Tabs tabBarExtraContent={this.getTabBar( )} activeKey={activeKey} type="card" onChange={this.onTabChange}>
                    <TabPane tab="宝贝概况" key="detail">
                        {this.getContent( )}
                    </TabPane>
                    <TabPane tab="实时概况" key="realtime">
                        {this.getContent( )}
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
