// import项参考 https://github.com/ecomfe/echarts/blob/master/index.js
import React from 'react'
import { max } from 'lodash'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legendScroll'
import moment from 'moment';

const baseOption = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '20px',
        top: '20px',
        right: '20px',
        bottom: '40px',
        containLabel: true
    },
    colors: [
        "#1B58B8",
        "#001E4E",
        "#15992A",
        "#FF2E12",
        "#1FAEFF",
        "#691BB8",
        "#FCAF17",
        "#569CE3",
        "#B81B6C",
        "#E56C19",
        "#2673EC",
        "#FF7D23",
        "#91D100",
        "#B01E00",
        "#199900",
        "#7200AC",
        "#f08300",
        "#006AC1",
        "#ff6b00",
        "#ff984e",
        "#b6ef65"
    ]
}
const realTimeBaseOption = {
    colors: [ "#94b854", "#24b0de" ]
}
const opt = {
    title: {
        text: '一天用电量分布',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        boundaryGap: false
    },
    yAxis: {
        min: 0
    },
    series: [
        {
            name: '今日',
            type: 'line',
            data: [
                4,
                0,
                3,
                0,
                1,
                0,
                7,
                5,
                2,
                24,
                19,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ]
        }, {
            name: "昨天",
            type: 'line',
            data: [
                0,
                1,
                0,
                0,
                3,
                3,
                4,
                39,
                61,
                74,
                10,
                10,
                4,
                10,
                17,
                31,
                5,
                1,
                3,
                1,
                1,
                1,
                3,
                7
            ]
        }
    ]
}

export default class Chart extends React.Component {
    componentDidMount( ) {
        this.draw( )
        window.addEventListener( "resize", this.onResize, false );
    }
    componentDidUpdate( ) {
        this.draw( )
    }
    onResize = ( ) => {
        this.echart && this.echart.resize( )
    }
    draw = ( ) => {
        const option = this.getOption( );
        this.echart = echarts.init( this.chart )
        this.echart.setOption( option );
    }
    componentWillUnmount( ) {
        echarts.dispose( this.chart )
        window.removeEventListener( "resize", this.onResize, false );
    }
    getOption( ) {
        const { option } = this.props
        switch ( option.type ) {
            case 'dayReport':
                return this.getDayReport( option );
        }
    }
    // 按天显示的报表数据
    getDayReport( opt ) {
        const { fromDate, toDate } = opt;
        let timeArr = [],
            yAxis = [ ];
        for ( let fromTime = moment( fromDate ), toTime = moment( toDate ); fromTime.isSameOrBefore( toTime ); ) {
            timeArr.push(+ fromTime.format( 'x' ));
            fromTime.add( 1, 'd' )
        }
        opt.series.forEach(( s, ind ) => {
            yAxis.push({
                // min: 0, max: max( s.data ), interval: 7,
                position: ind % 2 == 0 ? 'left' : 'right',
                axisLabel: {
                    formatter: s.unit ? '{value}' + s.unit : '{value}'
                }
            })
        })
        let r = {
            ...baseOption,
            legend: {
                data: opt.series.map( i => i.name ),
                bottom: '10px'
            },
            xAxis: {
                type: 'time',
                minInterval: 1,
                maxInterval: 8.64e7, // 按天分段
                boundaryGap: false,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: ( value, index ) => moment( value ).format( 'MM-DD' )
                }
            },
            yAxis,
            series: opt.series.map(( i, ind ) => ({
                type: 'line',
                smooth: true,
                yAxisIndex: ind,
                label: {
                    normal: {
                        formatter: '{c} %'
                    }
                },
                name: i.name,
                data: i.data.map(( val, ind ) => [ timeArr[ind], val ])
            }))
        }
        console.log( r )
        return r;
    }
    render( ) {
        const {
            width = "100%",
            height = "300px"
        } = this.props
        return (
            <div ref={chart => this.chart = chart} style={{
                width,
                height
            }}></div>
        )
    }
}
