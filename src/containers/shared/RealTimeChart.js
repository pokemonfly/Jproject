import React, { Component } from 'react';
import { Alert, Select, Icon, Button, Radio } from 'antd'
import { isEqual, find, result } from 'lodash';
import moment from 'moment';
import Chart from './Chart';
import DataRangePicker from './DataRangePicker';
import './RealTimeChart.less';

// signupTime
const Option = Select.Option;
const TIME_F = "YYYY-MM-DD";

export default class RealTimeChart extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            isSum: false,
            mode: 'day',
            limitHour: moment( ).hour( ),
            compareDate: moment( ).subtract( 1, 'd' ).format( TIME_F ), // 默认对比昨天
            selectArr: this._getSelectData( props ),
            fromDate: moment( ).format( TIME_F ),
            toDate: moment( ).subtract( 7, 'd' ).format( TIME_F ),
            chartData: {
                type: 'realTimeReport'
            }
        }
    }
    componentWillMount( ) {
        // 调用父组件获得数据
        this._change( );
    }
    componentWillReceiveProps( nextProps ) {
        if (!isEqual( nextProps.data, this.props.data )) {
            // this.refs.chart && this.refs.chart.hideLoading( )
        }
        this.setData( nextProps.data )
    }
    _getSelectData( props ) {
        const { signupTime } = props;
        let r = [],
            i,
            arr = [],
            time = moment( ),
            lim = 7;
        // 购买时间短的话 ，减少选项
        if ( signupTime ) {
            lim = Math.min(lim, moment( ).endOf( 'day' ).diff( moment( signupTime ), 'd' ));
        }
        for ( let i = 0; i < 7; i++ ) {
            let day = time.subtract( 1, 'd' ).format( TIME_F );
            arr.push( day );
        }
        r.push({name: '昨天', value: arr[0]})
        if ( lim > 6 ) {
            r.push({name: '上周同日', value: arr[6]})
        }
        for ( i = 1; i < Math.min( lim, 6 ); i++ ) {
            r.push({'value': arr[i], 'text': arr[i]});
        }
        return r;
    }
    getStatus( ) {
        return this.state
    }
    setData( data ) {
        if ( data ) {
            const { chartData, isSum, mode, compareDate, selectArr } = this.state;
            let keyName;
            if ( mode == 'day' ) {
                const str = result( find(selectArr, ( o ) => {
                    return o.value == compareDate
                }), 'name' ) || compareDate
                keyName = isSum ? [ '汇总' ] : [ '今日', str ]
            } else {
                keyName = [ 'PC', '无线' ]
            }
            this.setState({
                chartData: {
                    ...chartData,
                    ...data,
                    keyName
                }
            })
        }
    }
    _change = ( ) => {
        const r = this.props.onChange( this.state )
        if ( r ) {
            this.setData( r )
        }
        // this.refs.chart && this.refs.chart.showLoading( )
    }
    onSwitchData = ( isSum ) => {
        this.setState( {
            isSum
        }, this._change )
    }
    onModeChange = ( e ) => {
        this.setState( {
            mode: e.target.value
        }, this._change )
    }
    onSelectChange = ( compareDate ) => {
        this.setState( {
            mcompareDateode
        }, this._change )
    }

    render( ) {
        const {
            keyName,
            valueA,
            valueB,
            limitHour,
            selectArr,
            isSum,
            fromDate,
            toDate,
            mode,
            compareDate,
            chartData
        } = this.state
        return (
            <div className="real-time-chart">
                <div className="control-row">
                    {!isSum && (
                        <div >
                            {mode == 'day' && (
                                <span>
                                    <span>{`今日实时${ keyName } ${ valueA }`}</span>
                                    <span>对比</span>
                                    <Select
                                        value={compareDate}
                                        defaultValue={selectArr[0].value}
                                        style={{
                                        width: 120
                                    }}
                                        onChange={this.onSelectChange}>
                                        {selectArr.map(o => (
                                            <Option value={o.value} key={o.value}>{o.name}</Option>
                                        ))}
                                    </Select>
                                    <span>{`${ keyName }：${ valueB } （截止${ limitHour }点的数据）`}</span>
                                </span>
                            )}
                            {mode == 'device' && (
                                <span>{`PC${ keyName }  无线${ keyName }`}</span>
                            )}
                            <Button onClick={this.onSwitchData.bind( this, true )}>切换成累计数据</Button>
                        </div>
                    )}
                    {isSum && (
                        <div>
                            {mode == 'day' && (
                                <span>
                                    <span>{`汇总：${ valueA }`}</span>
                                    <DataRangePicker {...{fromDate, toDate}}/>
                                </span>
                            )}
                            {mode == 'device' && (
                                <span>{`PC ${ valueA } 无线${ valueB }`}</span>
                            )}
                            <Button onClick={this.onSwitchData.bind( this, false )}>切换成今日数据</Button>
                        </div>
                    )}
                    <Radio.Group onChange={this.onModeChange} value={mode}>
                        <Radio.Button value="day">汇总</Radio.Button>
                        <Radio.Button value="device">PC/无线</Radio.Button>
                    </Radio.Group>
                </div>
                <Alert message=" 1、实时数据因淘宝接口的误差，有可能和直通车后台不一致，属于正常情况。2、超过15天未登录，系统将不再同步实时概况数据" showIcon type="warning"/>
                <Chart option={chartData} ref='chart'/>
            </div>
        )
    }
}
