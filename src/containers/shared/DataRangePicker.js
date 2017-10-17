import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import 'moment/locale/zh-cn';
import { DatePicker } from 'antd';
import { hashHistory } from 'react-router';
import './DataRangePicker.less'

moment.locale( 'zh-cn' );
const { RangePicker } = DatePicker;

const defaultRanges = {
    'default': {
        '今天': [
            moment( ), moment( )
        ],
        '昨天': [
            moment( ).subtract( 1, 'days' ),
            moment( ).subtract( 1, 'days' )
        ],
        '最近7天': [
            moment( ).subtract( 7, 'days' ),
            moment( ).subtract( 1, 'days' )
        ],
        '最近14天': [
            moment( ).subtract( 14, 'days' ),
            moment( ).subtract( 1, 'days' )
        ],
        '最近21天': [
            moment( ).subtract( 21, 'days' ),
            moment( ).subtract( 1, 'days' )
        ],
        '最近30天': [
            moment( ).subtract( 30, 'days' ),
            moment( ).subtract( 1, 'days' )
        ]
    }
}
@connect(state => ({ location: state.location }))
export default class DataRangePicker extends React.Component {
    state = {
        fromDate: moment( ).subtract( 7, 'days' ),
        toDate: moment( 1, 'days' )
    }
    componentWillReceiveProps( nextProps ) {
        const { fromDate, toDate } = nextProps
        this.setState({fromDate: moment( fromDate ), toDate: moment( toDate )})
    }
    onChange = ( date, dateString ) => {
        this.state.fromString = dateString[0]
        this.state.toString = dateString[1]

    }
    onOk = ( ) => {
        const { location } = this.props
        const { fromString, toString } = this.state
        if ( fromString && toString ) {
            hashHistory.push({
                ...location,
                query: {
                    ...location.query,
                    fromDate: fromString,
                    toDate: toString
                }
            });
        }
    }
    renderExtraFooter( ) {
        return (
            <div>(留空)扩展的额外内容</div>
        )
    }
    render( ) {
        const { fromDate, toDate } = this.state
        return ( <RangePicker
            allowClear={false}
            className="data-range-picker"
            pickerClass='asdf'
            format="YYYY-MM-DD"
            defaultValue={[ fromDate, toDate ]}
            renderExtraFooter={this.renderExtraFooter}
            ranges={defaultRanges.default}
            showTime
            onChange={this.onChange}
            onOk={this.onOk}/> )
    }
}
