// import项参考 https://github.com/ecomfe/echarts/blob/master/index.js
import React from 'react'
import { max, includes, isEmpty, forIn } from 'lodash'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/markLine'
import moment from 'moment';
import { encodeHTML } from '@/utils/tools'

const baseOption = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: 20,
        top: '20px',
        right: 20,
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
const realTimeColors = [ "#94b854", "#24b0de" ];

const opt = {
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
    state = {}
    componentDidMount( ) {
        this.draw( )
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
        this.state.option = option
        if (!isEmpty( option )) {
            this.echart.setOption( option );
        }
        if ( this.props.option.isLoading ) {
            this.showLoading( )
        } else {
            this.hideLoading( )
        }
        this.bindEvent( );
    }
    showLoading( ) {
        this.echart.showLoading( )
    }
    hideLoading( ) {
        this.echart.hideLoading( )
    }
    bindEvent( ) {
        this.echart.on('legendselectchanged', ( e ) => {
            let option = this.fixYAxis( this.state.option, e.selected )
            console.log( option )
            this.echart.setOption( option );
        })
        if ( !this._bindResize ) {
            window.addEventListener( "resize", this.onResize, false );
            this._bindResize = true
        }
    }
    // 修正y轴位置
    fixYAxis(config, selLegend = {}) {
        let idx = [],
            isLeft = true,
            offset = 0;
        config.legend.selected = selLegend;
        config.series.forEach(( o, i ) => {
            if (selLegend[o.name]) {
                idx.push( i )
            }
        })
        config.yAxis.forEach(( o, i ) => {
            if ( idx.indexOf( i ) > -1 ) {
                o.show = true;
                o.position = isLeft ? 'left' : 'right';
                o.offset = 20 * ~~ ( offset / 2 );
                o.axisLine = {
                    show: offset < 2
                }
                o.axisTick = {
                    show: offset < 2
                }
                isLeft = !isLeft;
                offset++;
            } else {
                o.offset = 0
            }
        })
        return config;
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
            case 'realTimeReport':
                return this.getRealTimeReport( option );
        }
    }
    // 按天显示的报表数据
    getDayReport( opt ) {
        const { fromDate, toDate, mandateDate } = opt;
        let timeArr = [],
            yAxis = [ ];
        // 给series data标记时间 用
        for ( let fromTime = moment( fromDate ), toTime = moment( toDate ); fromTime.isSameOrBefore( toTime ); ) {
            timeArr.push(+ fromTime.format( 'x' ));
            fromTime.add( 1, 'd' )
        }
        opt.series.forEach(( s, ind ) => {
            let obj = {
                show: false,
                splitNumber: 7,
                axisLabel: {
                    formatter: s.unit ? '{value}' + s.unit : '{value}'
                }
            }
            yAxis.push( obj )
        })
        let series = opt.series.map(( i, ind ) => ({
            type: 'line',
            smooth: true,
            yAxisIndex: ind,
            label: {
                normal: {
                    formatter: '{c}'
                }
            },
            name: i.name,
            data: i.data.map(( val, ind ) => [ timeArr[ind], val ])
        }));
        let selectedLegend = {}

        // 竖虚线
        if ( mandateDate ) {
            series.push({
                type: 'line',
                markLine: {
                    symbol: 'circle',
                    label: {
                        normal: {
                            position: 'middle',
                            formatter: '{b}'
                        }
                    },
                    data: [
                        [
                            {
                                name: '加入自动优化',
                                xAxis: mandateDate,
                                y: '20px'
                            }, {
                                xAxis: mandateDate,
                                yAxis: 0
                            }
                        ]
                    ]
                }
            })
        }

        let r = {
            ...baseOption,
            legend: {
                data: opt.series.map(i => {
                    selectedLegend[i.name] = opt.defaultLegends ? includes( opt.defaultLegends, i.name ) : true;
                    return i.name
                }),
                selected: selectedLegend,
                bottom: '10px'
            },
            xAxis: {
                type: 'time',
                minInterval: 1,
                maxInterval: 8.64e7, // 按天分段 ms
                boundaryGap: false,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: ( value, index ) => moment( value ).format( 'MM-DD' )
                }
            },
            yAxis,
            series
        }
        r = this.fixYAxis( r, selectedLegend )
        console.log( r )
        return r;
    }
    // 实时报表
    getRealTimeReport( opt ) {
        if ( !opt.dataMap ) {
            return { };
        }
        const hours = opt.isLowVer ? 8 : 24;
        let selectedLegend = {}
        let series = [ ];
        forIn(opt.dataMap, ( v, k ) => {
            series = series.concat(v.map(( i, ind ) => ({
                type: 'line',
                // yAxisIndex: ind,
                name: k,
                lineStyle: {
                    normal: {
                        color: realTimeColors[ind]
                    }
                },
                encode: {
                    tooltip: 1
                },
                label: {
                    normal: {
                        formatter: '{c}'
                    }
                },
                data: i
            })))
        })

        let r = {
            ...baseOption,
            legend: {
                data: opt.legend.map(( i, ind ) => {
                    // 默认选中第一个
                    selectedLegend[i.name] = !ind;
                    return i.name
                }),
                selected: selectedLegend,
                bottom: '10px'
            },
            xAxis: {
                data: Array( hours ).fill( 0 ).map( ( i, d ) => d ),
                boundaryGap: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                show: false
            },
            series
        }
        r.tooltip.formatter = ( arr ) => {
            let h = [ ];
            h.push( arr[0].value[0] + '时  ' + arr[0].seriesName );
            arr.forEach(( i, ind ) => {
                h.push(this.getTooltipMarker(realTimeColors[ind]) + opt.keyName[ind] + ' : ' + i.value[1] + opt.legendUnitMap[i.seriesName])
            })
            return h.join( '<br/>' );
        }
        console.log( r )
        return r;
    }
    // https://github.com/ecomfe/echarts/blob/8d44355b53833ae0b9a42f3872e6bac699190a9e/src/util/format.js
    getTooltipMarker( color, extraCssText ) {
        return color ? '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + encodeHTML( color ) + ';' + ( extraCssText || '' ) + '"></span>' : '';
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
