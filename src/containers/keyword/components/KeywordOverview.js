import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import PubSub from 'pubsub-js';
import { Layout, Menu, Dropdown, Icon as AntdIcon, Tabs } from 'antd';
import { pick, isEqual, isEmpty } from 'lodash';
import Icon from '@/containers/shared/Icon';
import TweenBar from '@/containers/shared/TweenBar';
import DataRangePicker from '@/containers/shared/DataRangePicker';
import { keywordReports as keyMap } from '@/utils/constants'
import { formatDayReport } from '@/utils/tools'
import Chart from '@/containers/shared/Chart';
import RealTimeChart from '@/containers/shared/RealTimeChart';
import moment from 'moment';
import { hashHistory } from 'react-router';
import { fetchAdgroupsProfiles, fetchAdgroupsRealTime } from './AdgroupRedux';
import { fetchAdgroupsDayReport, fetchAdgroupsDayDeviceReport, fetchAdgroupsRealTimeReport } from './ReportRedux'
import './KeywordOverviewStyle.less'

const { TabPane } = Tabs
const DATA_TYPE = {
    '0': '汇总',
    '1': '只看PC',
    '2': '只看无线'
}
const REPORT_TYPE = {
    0: 'day',
    1: 'pc',
    2: 'mobile'
}
// chart显示的字段 具体名称定义在keyMap
const CHART_KEY = [
    "impressions",
    "click",
    "cost",
    "ctr",
    "cvr",
    "cpc",
    "cpm",
    "directPay",
    "indirectPay",
    "pay",
    "directPayCount",
    "indirectPayCount",
    "payCount",
    "favItemCount",
    "favShopCount",
    "favCount",
    "realRoi",
    // "favRoi", "avgPos", "cartTotal", "directCartTotal", "indirectCartTotal", "sevenDaysPay", "sevenDaysPayCount", "sevenDaysRoi"
]
const TODAY = moment( ).format( 'YYYY-MM-DD' )

@connect(state => ({ location: state.location, query: state.location.query, adgroup: state.keyword.adgroup, report: state.keyword.report }), dispatch => (bindActionCreators( {
    fetchAdgroupsDayReport,
    fetchAdgroupsDayDeviceReport,
    fetchAdgroupsProfiles,
    fetchAdgroupsRealTime,
    fetchAdgroupsRealTimeReport
}, dispatch )))
export default class KeywordOverview extends React.Component {
    state = {
        dataType: 0,
        chartSw: false,
        isRealTime: this.props.query.fromDate == this.props.query.toDate && this.props.query.fromDate == TODAY
    }
    componentWillMount( ) {
        if ( this.state.isRealTime ) {
            this.props.fetchAdgroupsRealTime( this.props.query );
            this.props.fetchAdgroupsRealTimeReport({
                ...this.props.query,
                fromDate: TODAY
            })
        }
    }
    componentWillReceiveProps( nextProps ) {
        // hash更新时检查数据是否存在
        if ( !isEqual( this.props.query, nextProps.query ) && this.state.chartSw ) {
            this.checkAndGetData( nextProps );
        }
        this.setState({
            isRealTime: nextProps.query.fromDate == nextProps.query.toDate && nextProps.query.fromDate == TODAY
        }, ( ) => {
            if ( isEmpty( this.props.adgroup.realTime ) && this.state.isRealTime && !this.props.adgroup.isFetching ) {
                this.props.fetchAdgroupsRealTime( this.props.query );
            }
        })
    }
    checkAndGetData( props = this.props ) {
        const { dataType } = this.state;
        const { report, fetchAdgroupsDayReport, fetchAdgroupsDayDeviceReport, query } = props;
        const { adgroupId, fromDate, toDate } = query;
        const data = report[REPORT_TYPE[dataType]][`${ fromDate }-${ toDate }` ];
        const api = dataType == 0 ? fetchAdgroupsDayReport : fetchAdgroupsDayDeviceReport
        const fetchType = dataType == 0 ? 'day' : 'device';
        if ( !data && report.isFetching != fetchType ) {
            api({
                adgroupId, fromDate, toDate, needSevenDaysData: true // TODO 来源不明
            })
            return false
        }
        return true;
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
        this.state.dataType = key;
        this.checkAndGetData( );
        this.setState({ dataType: key });
    }
    onTabChange = ( key ) => {
        if ( key == 'detail' ) {
            this.setDate({
                fromDate: moment( ).subtract( 7, 'days' ).format( 'YYYY-MM-DD' ),
                toDate: moment( 1, 'days' ).format( 'YYYY-MM-DD' )
            })
        } else {
            this.setDate({ fromDate: TODAY, toDate: TODAY })
        }
    }
    switchChartShow = ( ) => {
        const { chartSw } = this.state;
        !chartSw && this.checkAndGetData( );
        this.setState({
            chartSw: !chartSw
        })
    }
    getChartData = ( ) => {
        const { dataType } = this.state;
        const { report, query } = this.props;
        const { fromDate, toDate } = query;
        const data = report[REPORT_TYPE[dataType]][`${ fromDate }-${ toDate }` ];
        let cfg = {
            type: 'dayReport',
            defaultLegends: [
                "成交额", "总花费"
            ],
            fromDate,
            toDate,
            series: [ ]
        }
        if ( report.isFetching ) {
            return {
                isLoading: true,
                ...cfg
            }
        }
        if (moment( fromDate ).isBefore(moment( report.mandateDate ))) {
            // 当前页面能看到优化日时，显示
            cfg.mandateDate = report.mandateDate
        }
        cfg.series = formatDayReport( data, keyMap, CHART_KEY );
        return cfg
    }
    getRealTimeData = ( ) => {}
    onRealTimeChange = ( state ) => {
        const {
            isSum = false,
            mode = 'day'
        } = state;
        const { query } = this.props;
        this.props.fetchAdgroupsRealTimeReport({
            ...query
        })
    }
    getContent( ) {
        const { chartSw, isRealTime } = this.state
        let { fromDate, toDate } = this.props.query;
        if ( this.props.adgroup.isFetching ) {
            return (
                <Layout className="keyword-overview-content">
                    loading...
                </Layout>
            );
        } else {
            const dataSource = !isRealTime ? this.props.adgroup.report[`${ fromDate }-${ toDate }`] : this.props.adgroup.realTime;
            return (
                <Layout className="keyword-overview-content">
                    <TweenBar dataSource={dataSource} config={keyMap}></TweenBar>
                    {chartSw && !isRealTime && ( <Chart option={this.getChartData( )}/> )}
                    {chartSw && isRealTime && ( <RealTimeChart ref="realTime" onChange={this.onRealTimeChange} data={this.getRealTimeData( )}/> )}
                    <div className="chart-sw" onClick={this.switchChartShow}>
                        <span>{chartSw ? '收起' : '展开'}历史趋势图
                            <Icon type={chartSw ? "xiangshang" : "xiangxia"}/></span>
                    </div>
                </Layout>
            )
        }
    }
    getTabBar( ) {
        const { dataType, isRealTime } = this.state
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
                {!isRealTime && (
                    <Dropdown overlay={menu} trigger={[ 'click' ]}>
                        <a className="ant-dropdown-link" href="#">
                            {DATA_TYPE[dataType]}
                            <Icon type="down"/>
                        </a>
                    </Dropdown>
                )}
                <DataRangePicker {...{fromDate, toDate}}/>
            </div>
        )
    }
    render( ) {
        const { isRealTime } = this.state,
            activeKey = isRealTime ? 'realtime' : 'detail';
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
