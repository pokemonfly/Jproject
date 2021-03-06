import React, { Component, PropTypes } from 'react';
import PubSub from 'pubsub-js';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { pick, get, isEqual } from 'lodash'
import {
    Layout,
    Icon,
    Select,
    Button,
    Input,
    Switch,
    Menu,
    Dropdown
} from 'antd';
import { fetchAdgroupsProfiles, postAdgroupsStatus, postAdgroupsOptimization, fetchBlackword } from './AdgroupRedux'
import { notify } from '@/utils/tools'
import KeywordInfo from './KeywordInfo'
import EditWordLimit from './EditWordLimit'
import EditQScoreLimit from './EditQScoreLimit'
import EditBlacklist from './EditBlacklist'
import EditSellwords from './EditSellwords'
import CalcRoi from './CalcRoi'
import OneKeyOptimize from '@/containers/shared/OneKeyOptimize'
import './KeywordHeadStyle.less'
// import Dialog from '@/containers/shared/Dialog1';

@connect( state => ( {
    query: state.location.query,
    user: state.user,
    campaign: state.layout.campaignMap,
    keyword: state.keyword.keywordList,
    adgroup: state.keyword.adgroup,
    view: state.keyword.keywordView
} ), dispatch => ( bindActionCreators( {
    fetchAdgroupsProfiles,
    postAdgroupsStatus,
    postAdgroupsOptimization,
    fetchBlackword
}, dispatch ) ) )
export default class KeywordHead extends React.Component {
    state = {
        ...this.props.query,
        moreDropdownVisible: false
    }
    componentWillMount() {
        this.props.fetchAdgroupsProfiles( this.state );
    }
    componentWillReceiveProps( props ) {
        if ( !isEqual( props.query, this.props.query ) ) {
            this.props.fetchAdgroupsProfiles( props.query );
        }
    }
    onClickMenu = ( e ) => {
        switch ( e.key ) {
            case 'wordLimit':
                EditWordLimit( {
                    wordLimit: this.props.adgroup.daemonSettingMap.add_upper_limit,
                    'adgroupIds': [this.props.adgroup.adgroup.adgroupId],
                    'campaignId': this.props.adgroup.adgroup.campaignId,
                    api: this.props.postAdgroupsOptimization
                } );
                break;
            case 'qScoreLimit':
                EditQScoreLimit( {
                    ...pick( this.props.adgroup.adgroup, [ 'adgroupId', 'campaignId', 'pcQScoreFloor', 'mobileQScoreFloor', 'isOpenQScoreLimit' ] ),
                    api: this.props.postAdgroupsStatus
                } );
                break;
            case 'black':
                this.refs.blacklist.show();
                break;
            case 'sale':
                this.refs.salewords.show();
                break;
        }
        this.handleVisibleChange( false );
    }
    onClickOneKeyOpt = () => {
        this.refs.OneKeyOptimize.show();
    }
    handleVisibleChange( flag ) {
        this.setState( { moreDropdownVisible: flag } );
    }
    renderSettingPanel() {
        return ( <Menu selectedKeys={null} onClick={this.onClickMenu} className="menu float-panel keyword-setting-panel">
            <Menu.Item key='wordLimit'>
                出词数量控制
            </Menu.Item>
            <Menu.Item key='qScoreLimit'>
                质量分下限
            </Menu.Item>
            <Menu.Item key='black'>
                黑名单列表
                <EditBlacklist ref="blacklist"/>
            </Menu.Item>
            <Menu.Item key='sale'>
                卖点词列表
                <EditSellwords ref="salewords"/>
            </Menu.Item>
        </Menu> )
    }
    render() {
        const { moreDropdownVisible } = this.state
        let infoObj = {
            ...pick( this.props.adgroup.adgroup, [
                'adgroupId',
                'campaignId',
                'numIid',
                'title',
                'picUrl',
                'catName',
                'type',
                'price',
                'volume',
                'num',
                'wordMaxPrice',
                'mobileWordMaxPrice',
                'mobileDiscount',
                'onlineStatus',
                'optimizationState',
                'isOptimizeChangeMatchScope',
                'isOptimizeChangePrice',
                'isOptimizeChangeMobilePrice'
            ] ),
            campaignMobileDiscount: get( this.props.adgroup.platform, 'mobileDiscount' ),
            isMobileDiscount: get( this.props.adgroup.platform, 'mobileStatus' )
        }

        console.log( 'keywordInfo:', infoObj )
        return ( <Layout className="keyword-head">
            <div>
                <KeywordInfo {...infoObj} api={this.props.postAdgroupsStatus}></KeywordInfo>
            </div>
            <div className="button-groups">
                <Button type="primary" onClick={this.onClickOneKeyOpt}>一键优化<OneKeyOptimize ref="OneKeyOptimize"/></Button>
                <CalcRoi/>
                <Dropdown
                    overlay={this.renderSettingPanel()}
                    trigger={[ 'click' ]}
                    visible={moreDropdownVisible}
                    onVisibleChange={this.handleVisibleChange.bind( this )}>
                    <Button type="primary">
                        关键词设置
                        <Icon type="down"/>
                    </Button>
                </Dropdown>
            </div>
        </Layout> );
    }
}
