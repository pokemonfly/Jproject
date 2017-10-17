import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { Menu, Dropdown, Icon, Button } from 'antd';
import Search from '@/containers/shared/Search'
import More from '@/containers/shared/More'
import { keywordReports } from '@/utils/constants'
import { bindActionCreators } from 'redux';
import { filterKeywordWord, changeReportCols, switchMoreDropdown } from './KeywordViewRedux'
//  KeywordList.less
const DAY_TYPE = {
    '0': '7天',
    '1': '15天',
    '2': '30天'
}
const DATA_TYPE = {
    '0': '汇总',
    '1': '只看PC',
    '2': '只看无线'
}
// pprFavRate  加购收藏率 = （总收藏数 + 总购物车数） / 点击量  (tweenbar报表数据未使用，仅这里使用)
const REPORT_KEY = [
    {
        key: 'click',
        'name': '点击量',
        'unit': ''
    }, {
        key: 'payCount',
        'name': '总成交数',
        'unit': ''
    }, {
        key: 'ctr',
        'name': '点击率',
        'unit': '%'
    }, {
        key: 'cvr',
        'name': '转化率',
        'unit': '%'
    }, {
        key: 'pprFavRate',
        'name': '加购收藏率',
        'unit': '%'
    }
]
@connect(state => ({
    query: state.location.query,
    user: state.user,
    campaign: state.campaign,
    keyword: state.keyword.keywordList,
    head: state.keyword.keywordHead,
    view: state.keyword.keywordView
}), dispatch => (bindActionCreators( {
    filterKeywordWord,
    changeReportCols,
    switchMoreDropdown
}, dispatch )))
export default class KeywordExtraBar extends React.Component {
    state = {
        moreDropdownVisible: false,
        dayStr: DAY_TYPE['0'],
        dataTypeStr: DATA_TYPE['0']
    }
    onClickDayType = ({ key }) => {
        this.setState({dayStr: DAY_TYPE[key]})
    }
    onClickDataType = ({ key }) => {
        this.setState({dataTypeStr: DATA_TYPE[key]})
    }
    handleVisibleChange( flag ) {
        this.setState({ moreDropdownVisible: flag });
    }
    renderReport( ) {
        if ( this.props.head.isFetching ) {
            return (
                <span className='report-item'>Loading</span>
            )
        }
        let { fromDate, toDate } = this.props.query
        const dataSource = this.props.head.report[`${ fromDate }-${ toDate }`]
        return REPORT_KEY.map(( obj, ind ) => {
            let num = dataSource[obj.key],
                unit = obj.unit
            if (!Number.isFinite( + num )) {
                num = '-'
                unit = ''
            }
            return (
                <span className='report-item' key={ind}>
                    <span>{`${ obj.name }：`}</span>
                    <span className="num">{`${ num } ${ unit }`}</span>
                </span>
            )
        })
    }
    render( ) {
        const { view, changeReportCols } = this.props
        const { dataTypeStr, dayStr, moreDropdownVisible } = this.state
        const dayTypeMenu = (
            <Menu onClick={this.onClickDayType}>
                <Menu.Item key="0">{DAY_TYPE['0']}</Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="1">{DAY_TYPE['1']}</Menu.Item>
                <Menu.Item key="2">{DAY_TYPE['2']}</Menu.Item>
            </Menu>
        )
        const dataTypeMenu = (
            <Menu onClick={this.onClickDataType}>
                <Menu.Item key="0">{DATA_TYPE['0']}</Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="1">{DATA_TYPE['1']}</Menu.Item>
                <Menu.Item key="2">{DATA_TYPE['2']}</Menu.Item>
            </Menu>
        )
        return (
            <div className="extra-head">
                <span>宝贝</span>
                <Dropdown overlay={dayTypeMenu} trigger={[ 'click' ]}>
                    <a className="ant-dropdown-link" href="#">
                        {dayStr}
                        <Icon type="down"/>
                    </a>
                </Dropdown>
                <Dropdown overlay={dataTypeMenu} trigger={[ 'click' ]}>
                    <a className="ant-dropdown-link" href="#">
                        {dataTypeStr}
                        <Icon type="down"/>
                    </a>
                </Dropdown>
                {this.renderReport( )}
                <div className="action-panel">
                    <Search placeholder="请输入关键词" id="keywordFilterExtra" className="keyword-search" onSearch={this.props.filterKeywordWord} suffix=''/>
                    <Dropdown
                        visible={moreDropdownVisible}
                        onVisibleChange={this.handleVisibleChange.bind( this )}
                        overlay={( <More
                        map={keywordReports}
                        sort={view.reportSort}
                        onCloseCallback={this.handleVisibleChange.bind( this, false )}
                        onOkCallback={changeReportCols}/> )}
                        trigger={[ 'click' ]}>
                        <Button>
                            更多数据
                            <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
            </div>
        )
    }
}
