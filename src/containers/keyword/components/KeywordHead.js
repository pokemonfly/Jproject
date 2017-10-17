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
    Form,
    Input,
    Switch,
    Menu,
    Dropdown
} from 'antd';
import './KeywordHeadStyle.less'
import KeywordInfo from './KeywordInfo'
import EditableText from '@/containers/shared/EditableText'
import { fetchAdgroupsProfiles, postAdgroupsStatus } from './KeywordHeadRedux'
const FormItem = Form.Item;

@Form.create( )
@connect(state => ({
    query: state.location.query,
    user: state.user,
    campaign: state.layout.campaignMap,
    keyword: state.keyword.keywordList,
    head: state.keyword.keywordHead,
    view: state.keyword.keywordView
}), dispatch => (bindActionCreators( {
    fetchAdgroupsProfiles,
    postAdgroupsStatus
}, dispatch )))
export default class KeywordHead extends React.Component {
    state = {
        ...this.props.query,
        moreDropdownVisible: false
    }
    componentWillMount( ) {
        // { campaignId: '17922607', adgroupId: '661397773', fromDate: '2017-09-25', toDate: '2017-10-09' }
        this.props.fetchAdgroupsProfiles( this.state );
    }
    componentWillReceiveProps( props ) {
        if (!isEqual( props.query, this.props.query )) {
            this.props.fetchAdgroupsProfiles( props.query );
        }
    }
    onChangeCommit( ) {}
    onChangeQsScore = ( ) => {
        const formObj = this.props.form.getFieldsValue( )
        let commitObj = {
            ...pick(this.props.head.adgroup, [ 'adgroupId', 'campaignId' ]),
            ...pick(formObj, [ 'qScoreLimitOpenStatus', 'pcQScoreFloor', 'mobileQScoreFloor' ])
        }
        console.log( 'EditOptimization commit data:', commitObj );
        this.props.postAdgroupsStatus( commitObj )
    }
    onClickMenu( ) {}
    handleVisibleChange( flag ) {
        this.setState({ moreDropdownVisible: flag });
    }
    renderSettingPanel( ) {
        const { getFieldDecorator } = this.props.form;
        // qScoreLimitOpenStatus
        const { pcQScoreFloor, mobileQScoreFloor, isOpenQScoreLimit } = this.props.head.adgroup
        const wordLimit = this.props.head.daemonSettingMap.add_upper_limit
        return (
            <Form className="keyword-setting-panel">
                <FormItem>
                    <span>出词数量控制</span>
                    {getFieldDecorator('wordLimitSwitch', { valuePropName: 'checked' })( <Switch onChange={this.onChangeCommit} className="pull-right"/> )}
                </FormItem>
                <FormItem>
                    <span>
                        词数超过 {getFieldDecorator('add_upper_limit', { initialValue: wordLimit })( <Input onChange={this.onChangeCommit}/> )}
                        不加词
                    </span>
                </FormItem>
                <hr className="line"/>
                <FormItem>
                    <span>质量分下限</span>
                    {getFieldDecorator('qScoreLimitOpenStatus', {
                        valuePropName: 'checked',
                        initialValue: isOpenQScoreLimit == '1'
                    })( <Switch onChange={this.onChangeQsScore} className="pull-right"/> )}
                </FormItem>
                <FormItem>
                    <span className="score-type">PC：</span>
                    {getFieldDecorator('pcQScoreFloor', {
                        initialValue: pcQScoreFloor > -1 ? pcQScoreFloor : ''
                    })( <Input onChange={this.onChangeQsScore}/> )}
                </FormItem>
                <FormItem>
                    <span className="score-type">无线：</span>
                    {getFieldDecorator('mobileQScoreFloor', {
                        initialValue: mobileQScoreFloor > -1 ? pcQScoreFloor : ''
                    })( <Input onChange={this.onChangeQsScore}/> )}
                </FormItem>
                <Menu selectedKeys={null} onClick={this.onClickMenu} mode="inline" className="menu">
                    <Menu.Item key='black'>
                        黑名单列表
                    </Menu.Item>
                    <Menu.Item key='sale'>
                        卖点词列表
                    </Menu.Item>
                </Menu>
            </Form>
        )
    }
    render( ) {
        const { moreDropdownVisible } = this.state
        let infoObj = {
            ...pick(this.props.head.adgroup, [
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
                'optimizationState'
            ]),
            campaignMobileDiscount: get( this.props.head.platform, 'mobileDiscount' ),
            isMobileDiscount: get( this.props.head.platform, 'mobileStatus' )
        }

        console.log( 'keywordInfo:', infoObj )
        return (
            <Layout className="keyword-head">
                <div>
                    <KeywordInfo {...infoObj} api={this.props.postAdgroupsStatus}></KeywordInfo>
                </div>
                <div className="button-groups">
                    <Button type="primary">一键优化</Button>
                    <Button type="primary">计算ROI盈亏点</Button>
                    <Dropdown
                        overlay={this.renderSettingPanel( )}
                        trigger={[ 'click' ]}
                        visible={moreDropdownVisible}
                        onVisibleChange={this.handleVisibleChange.bind( this )}>
                        <Button type="primary">
                            关键词设置
                            <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
            </Layout>
        );
    }
}
