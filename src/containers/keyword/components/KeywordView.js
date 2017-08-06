import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import KeywordList from './KeywordList'
import { Tabs, Button, Input, Dropdown, Icon } from 'antd';
import { connect } from 'react-redux'
import { filterKeywordWord } from './KeywordViewRedux'
import Search from '../../shared/Search'
import './KeywordView.less'
const { TabPane } = Tabs

@connect( state => ( { user: state.user, keyword: state.keyword.keywordView } ), dispatch => ( bindActionCreators( {
    filterKeywordWord
}, dispatch ) ) )
export default class KeywordView extends React.Component {
    render() {
        const tabBarContent = (
            <div className="keyword-float-panel">
                <Search
                    placeholder="请输入关键词"
                    id="keywordFilter"
                    className="keyword-search"
                    onSearch={this.props.filterKeywordWord}
                    suffix=''/>
                <Dropdown overlay={< div > 更多数据的下拉框组件 < /div>} trigger={[ 'click' ]}>
                    <Button>
                        更多数据
                        <Icon type="down"/>
                    </Button>
                </Dropdown>
                <Button >
                    导出关键词
                </Button>
            </div>
        );
        return (
            <div className="keyword-view">
                <Tabs tabBarExtraContent={tabBarContent} defaultActiveKey="keywordList" type="card">
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
                        <span>开发中</span>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
