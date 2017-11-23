import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import PubSub from 'pubsub-js';
import { Layout, Menu, Dropdown, Icon as AntdIcon, Tabs } from 'antd';
import { pick, isEqual, isEmpty } from 'lodash';
import Icon from '@/containers/shared/Icon';
import TweenBar from '@/containers/shared/TweenBar';
import DateRangePicker from '@/containers/shared/DateRangePicker';
import { keywordReports as keyMap } from '@/utils/constants'
import { formatDayReport, formatRealTimeReport } from '@/utils/tools'
import Chart from '@/containers/shared/Chart';
import RealTimeChart from '@/containers/shared/RealTimeChart';
import moment from 'moment';
import { hashHistory } from 'react-router';
import { fetchAdgroupsProfiles, fetchAdgroupsRealTime } from './AdgroupRedux';
import { fetchAdgroupsDayReport, fetchAdgroupsDayDeviceReport, fetchAdgroupsRealTimeReport, fetchAdgroupsRealTimeDeviceReport } from './ReportRedux'
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
const REAL_TIME_CHART_KEY = [
    "click",
    "cost",
    "pay",
    "impressions",
    "ctr",
    "cpc",
    "payCount",
    "realRoi",
    "cvr",
    "favCount",
    "cartTotal"
];
const TODAY = moment( ).format( 'YYYY-MM-DD' )

@connect(state => ({ location: state.location, query: state.location.query, adgroup: state.keyword.adgroup, report: state.keyword.report }), dispatch => (bindActionCreators( {
    fetchAdgroupsDayReport,
    fetchAdgroupsDayDeviceReport,
    fetchAdgroupsProfiles,
    fetchAdgroupsRealTime,
    fetchAdgroupsRealTimeReport,
    fetchAdgroupsRealTimeDeviceReport
}, dispatch )))
export default class KeywordOverview extends React.Component {
    state = {
        dataType: 0,
        chartSw: false,
        isRealTime: this.props.query.fromDate == this.props.query.toDate && this.props.query.fromDate == TODAY,
        isLowVer: true
    }
    componentWillMount( ) {
        if ( this.state.isRealTime ) {
            this.props.fetchAdgroupsRealTime( this.props.query );
            this.props.fetchAdgroupsRealTimeReport({
                ...this.props.query,
                fromDate: TODAY,
                toDate: TODAY
            })
            this._loadRealTime = true;
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
            // 切换到实时页面时
            if ( isEmpty( this.props.adgroup.realTime ) && this.state.isRealTime && !this._loadRealTime ) {
                this.props.fetchAdgroupsRealTime( this.props.query );
                this._loadRealTime = true;
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
                toDate: moment( ).subtract( 1, 'days' ).format( 'YYYY-MM-DD' )
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
    onRealTimeChange = ( sta, justGet ) => {
        const { report, query } = this.props;
        const isFetching = justGet || report.isFetching;
        // if (!sta ) {     sta = this.refs.char }
        const {
            isSum = false,
            mode = 'day',
            compareDate = moment( ).subtract( 1, 'd' ).format( "YYYY-MM-DD" ),
            fromDate,
            toDate
        } = sta;
        const range = `${ fromDate }-${ toDate }`
        if ( mode == 'day' && !isSum ) {
            // 日期对比 今天和指定日
            if ( TODAY in report.realTime && compareDate in report.realTime ) {
                return formatRealTimeReport( [
                    report.realTime[TODAY], report.realTime[compareDate]
                ], keyMap, REAL_TIME_CHART_KEY )
            } else {
                this.props.fetchAdgroupsRealTimeReport({
                    ...query,
                    fromDate: compareDate,
                    toDate: compareDate
                })
            }
        }
        if ( mode == 'day' && isSum ) {
            // 数天 分时累加
            if ( range in report.realTime ) {
                return formatRealTimeReport( [report.realTime[range]], keyMap, REAL_TIME_CHART_KEY )
            } else {
                this.props.fetchAdgroupsRealTimeReport({
                    ...query,
                    fromDate,
                    toDate,
                    isSummaryByHour: true
                })
            }
        }
        if ( mode == 'device' && !isSum ) {
            // 设备对比
            if ( TODAY in report.realTimePc && TODAY in report.realTimeMobile ) {
                return formatRealTimeReport( [
                    report.realTimePc[TODAY], report.realTimeMobile[TODAY]
                ], keyMap, REAL_TIME_CHART_KEY )
            } else {
                this.props.fetchAdgroupsRealTimeDeviceReport({
                    ...query,
                    fromDate: TODAY,
                    toDate: TODAY
                })
            }
        }
        if ( mode == 'device' && isSum ) {
            //数天 设备累积对比
            if ( range in report.realTimePc && range in report.realTimeMobile ) {
                return formatRealTimeReport( [
                    report.realTimePc[range], report.realTimeMobile[range]
                ], keyMap, REAL_TIME_CHART_KEY )
            } else {
                this.props.fetchAdgroupsRealTimeDeviceReport({
                    ...query,
                    fromDate,
                    toDate,
                    isSummaryByHour: true
                })
            }
        }
        return null
    }
    getRealTimeData = ( state ) => {
        const { report, query } = this.props;
        if ( this.refs.realTime ) {
            const isFetching = report.isFetching;
            const sta = state || this.refs.realTime.getStatus( );
            const {
                isSum = false,
                mode = 'day',
                compareDate = moment( ).subtract( 1, 'd' ).format( "YYYY-MM-DD" ),
                fromDate,
                toDate
            } = sta;
            const range = `${ fromDate }-${ toDate }`
            if ( mode == 'day' && !isSum ) {
                // 日期对比 今天和指定日
                if ( TODAY in report.realTime && compareDate in report.realTime ) {
                    return formatRealTimeReport( [
                        report.realTime[TODAY], report.realTime[compareDate]
                    ], keyMap, REAL_TIME_CHART_KEY )
                }
            }
            if ( mode == 'day' && isSum ) {
                // 数天 分时累加
                if ( range in report.realTime ) {
                    return formatRealTimeReport( [report.realTime[range]], keyMap, REAL_TIME_CHART_KEY )
                }
            }
            if ( mode == 'device' && !isSum ) {
                // 设备对比
                if ( TODAY in report.realTimePc && TODAY in report.realTimeMobile ) {
                    return formatRealTimeReport( [
                        report.realTimePc[TODAY], report.realTimeMobile[TODAY]
                    ], keyMap, REAL_TIME_CHART_KEY )
                }
            }
            if ( mode == 'device' && isSum ) {
                //数天 设备累积对比
                if ( range in report.realTimePc && range in report.realTimeMobile ) {
                    return formatRealTimeReport( [
                        report.realTimePc[range], report.realTimeMobile[range]
                    ], keyMap, REAL_TIME_CHART_KEY )
                }
            }
        }
        return null
    }
    getContent( ) {
        const { chartSw, isRealTime, isLowVer } = this.state
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
                    {chartSw && isRealTime && ( <RealTimeChart isLowVer={isLowVer} ref="realTime" onChange={this.onRealTimeChange} data={this.getRealTimeData( )}/> )}
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
                <DateRangePicker {...{fromDate, toDate}}/>
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
