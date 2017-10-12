import React, { Component, PropTypes } from 'react';
import PubSub from 'pubsub-js';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { pick } from 'lodash'
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
import { fetchAdgroupsProfiles } from './KeywordHeadRedux'
const FormItem = Form.Item;

@Form.create( )
@connect(state => ({ user: state.user, campaign: state.campaign, keyword: state.keyword.keywordList, head: state.keyword.keywordHead, view: state.keyword.keywordView }), dispatch => (bindActionCreators( {
    fetchAdgroupsProfiles
}, dispatch )))
export default class KeywordHead extends React.Component {
    state = {
        moreDropdownVisible: false
    }
    componentWillMount( ) {
        this.props.fetchAdgroupsProfiles({ campaignId: '17922607', adgroupId: '661397773', fromDate: '2017-09-25', toDate: '2017-10-09' });
    }
    onChangeCommit( ) {}
    onClickMenu( ) {}
    handleVisibleChange( flag ) {
        this.setState({ moreDropdownVisible: flag });
    }
    renderSettingPanel( ) {
        const { getFieldDecorator } = this.props.form;
        // qScoreLimitOpenStatus
        const { pcQScoreFloor, mobileQScoreFloor, wordLimit } = this.props;
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
                    {getFieldDecorator('QScoreLimitSwitch', { valuePropName: 'checked' })( <Switch onChange={this.onChangeCommit} className="pull-right"/> )}
                </FormItem>
                <FormItem>
                    <span className="score-type">PC：</span>
                    {getFieldDecorator('pcQScoreFloor', { initialValue: pcQScoreFloor })( <Input onChange={this.onChangeCommit}/> )}
                </FormItem>
                <FormItem>
                    <span className="score-type">无线：</span>
                    {getFieldDecorator('mobileQScoreFloor', { initialValue: mobileQScoreFloor })( <Input onChange={this.onChangeCommit}/> )}
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
        const infoObj = pick(this.props.head.adgroup, [
            'numIid',
            'title',
            'picUrl',
            'catName',
            'price',
            'volume',
            'num',
            'wordMaxPrice',
            'mobileWordMaxPrice',
            'mobileDiscount'
        ])
        return (
            <Layout className="keyword-head">
                <div>
                    <KeywordInfo {...infoObj} optimizationState={0}></KeywordInfo>
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
