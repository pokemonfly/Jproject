import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {
    Layout,
    Alert,
    Radio,
    Select,
    InputNumber,
    Tooltip,
    Switch,
    Button
} from 'antd'
import moment from 'moment'
import { SimpleDialog } from '@/containers/shared/Dialog';
import { pick } from 'lodash'
import { fetchAdgroupsProfiles, fetchAdgroupsProfit, postAdgroupsProfit } from './AdgroupRedux'
import { add, divide } from '@/utils/math';
import './EditQScoreLimit.less'

@SimpleDialog({ title: 'ROI盈亏点', width: 580, hasForm: false, sid: "CalcRoi", footer: null })
export class CalcRoiDialog extends React.Component {
    render( ) {
        const { roi } = this.props
        return (
            <div>ε=(´ο｀*)))唉</div>
        )
    }
}

@connect(state => ({ query: state.location.query, adgroup: state.keyword.adgroup }), dispatch => (bindActionCreators( {
    fetchAdgroupsProfiles,
    fetchAdgroupsProfit,
    postAdgroupsProfit
}, dispatch )))
export default class CalcRoi extends React.Component {
    state = {
        fromDate: moment( ).subtract( 15, 'days' ).format( 'YYYY-MM-DD' ),
        toDate: moment( ).subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
        roi: null
    }
    componentWillMount( ) {
        // 需要最近15天的ROI
        this.props.fetchAdgroupsProfiles({
            ...this.props.query,
            ...this.state
        });
        this.props.fetchAdgroupsProfit( this.props.query );
    }
    componentWillReceiveProps( nextProps ) {
        if ( nextProps.adgroup.isFetching ) {
            return;
        }
        const { fromDate, toDate } = this.state;
        const { report, itemPrice, itemProfit, adgroup } = nextProps.adgroup
        const price = itemPrice || + adgroup.price;
        const str = `${ fromDate }-${ toDate }`;
        const roi = report[str] ? report[str].realRoi : null
        this.setState({ roi, price, profit: itemProfit })
    }
    onClickCalcRoi = ( ) => {
        CalcRoiDialog( this.state )
    }
    render( ) {
        const { roi, price, profit } = this.state
        let btnStr = '计算ROI盈亏点'
        if ( profit && roi != null ) {
            let r = divide( price, profit );
            btnStr = r > roi ? 'ROI盈亏：不赚钱款' : 'ROI盈亏：赚钱款'
        }
        return (
            <Button type="primary" onClick={this.onClickCalcRoi}>{btnStr}</Button>
        )
    }
}
