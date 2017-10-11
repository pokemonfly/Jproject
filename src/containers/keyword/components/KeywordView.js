import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import KeywordList from './KeywordList'
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
import './KeywordView.less'
import Trigger from '@/containers/shared/Trigger';
import EditWordPrice from './EditWordPrice'

const { TabPane } = Tabs
const Option = Select.Option;
@connect(state => ({ user: state.user, view: state.keyword.keywordView }), dispatch => (bindActionCreators( {
    filterKeywordWord,
    changeReportCols,
    switchMoreDropdown
}, dispatch )))
export default class KeywordView extends React.Component {
    state = {
        visible: false
    }
    showModal = ( ) => {
        this.setState({ visible: true });
    }
    handleOk = ( e ) => {
        console.log( e );
        this.setState({ visible: false });
    }
    handleCancel = ( e ) => {
        console.log( e );
        this.setState({ visible: false });
    }

    constructor( props ) {
        super( props )
        this.state = {
            moreDropdownVisible: false
        }
    }
    handleVisibleChange( flag ) {
        this.setState({ moreDropdownVisible: flag });
    }
    render( ) {
        const { view, changeReportCols } = this.props
        const { moreDropdownVisible } = this.state
        const tabBarContent = (
            <div className="keyword-float-panel">
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
                        <More map={keywordReports} sort={view.reportSort} onOkCallback={changeReportCols} hint="123" limit="12"/>
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
