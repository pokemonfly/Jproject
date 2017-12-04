import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import KeywordList from './KeywordList'
import KeywordLog from './KeywordLog'
import {
    Layout,
    Tabs,
    Button,
    Input,
    Dropdown,
    Icon,
    Modal,
    Select
} from 'antd';
import { connect } from 'react-redux'
import { filterKeywordWord, changeReportCols, switchMoreDropdown } from './KeywordViewRedux'
import Search from '@/containers/shared/Search'
import More from '@/containers/shared/More'
import { keywordReports } from '@/utils/constants'
import PubSub from 'pubsub-js';
import './KeywordView.less'

const { TabPane } = Tabs
const Option = Select.Option;
@connect( state => ( { user: state.user, view: state.keyword.keywordView } ), dispatch => ( bindActionCreators( {
    filterKeywordWord,
    changeReportCols,
    switchMoreDropdown
}, dispatch ) ) )
export default class KeywordView extends React.Component {
    state = {
        moreDropdownVisible: false,
        activeKey: 'keywordList'
    }

    onTabChange = ( activeKey ) => {
        this.setState( {
            activeKey
        }, () => {
            PubSub.publish( 'table.resize' )
        } );
    }

    handleVisibleChange( flag ) {
        this.setState( { moreDropdownVisible: flag } );
    }
    getTabBarContent() {
        const { view, changeReportCols } = this.props
        const { moreDropdownVisible, activeKey } = this.state
        if ( activeKey != 'keywordList' ) {
            return null
        }
        return ( <div className="keyword-float-panel">
            <Search placeholder="请输入关键词" id="keywordFilter" className="keyword-search" onSearch={this.props.filterKeywordWord} suffix=''/>
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
            <Button >
                导出关键词
            </Button>
        </div> );
    }
    render() {

        const { activeKey } = this.state
        return ( <div className="keyword-view">
            <Tabs tabBarExtraContent={this.getTabBarContent()} activeKey={activeKey} type="card" onChange={this.onTabChange}>
                <TabPane tab="管理关键词" key="keywordList">
                    <KeywordList/>
                </TabPane>
                <TabPane tab="搜索人群" key="searchCrowd">
                    <span>开发中</span>
                </TabPane>
                <TabPane tab="管理创意" key="creativeManage">
                    <span>开发中</span>
                </TabPane>
                <TabPane tab="宝贝日志" key="log">
                    <KeywordLog/>
                </TabPane>
            </Tabs>
        </div> );
    }
}
