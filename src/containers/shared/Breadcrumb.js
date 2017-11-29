/**
 * 面包屑
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */
import React, {Component} from 'react';
import {Breadcrumb, Menu, Dropdown, Icon} from 'antd';
import {Link} from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import {fetchCampaignList} from '../Campaign/CampaignRedux'
import {fetchEngineList} from '../Engine/EngineRedux'

import "./Breadcrumb.less"

const _home = {
    'title': '首页',
    'href': '#index'
};

const routes = {
    'list': [_home, {'title': '智能推广'}],
    'cases': [_home, {'title': '超级学堂'}, {'title': '操作案例'}],
    'school/video': [_home, {'title': '超级学堂'}, {'title': '课程中心'}],
    'school/article': [_home, {'title': '超级学堂'}, {'title': '云鹤专栏'}],
    'school/help': [_home, {'title': '超级学堂'}, {'title': '帮助中心'}],
    'tool/creativeTest': [_home, {'title': '工具'}, {'title': '创意测试'}],
    'tool/creativeTest/detail': [_home, {'title': '工具'}, {'title': '创意测试', 'href': '#tool/creativeTest'}, {'title': '管理测试创意'}],
    'tool/creativeTest/add': [_home, {'title': '工具'}, {'title': '创意测试', 'href': '#tool/creativeTest'}, {'title': '添加创意测试宝贝'}],
    'tool/repeatWordManage': [_home, {'title': '工具'}, {'title': '重复词管理'}],
    'tool/grabRanks': [_home, {'title': '工具'}, {'title': '抢排名词管理'}],
    'tool/weekList': [_home, {'title': '工具'}, {'title': '托管周报告'}],
    'tool/qualityLie': [_home, {'title': '工具'}, {'title': '质量分分布'}],
    'tool/multiPlan/step1': [_home, {'title': '工具'}, {'title': '多计划推广', 'href': '#tool/multiPlan/step1'}],
    'tool/multiPlan/step2': [_home, {'title': '工具'}, {'title': '多计划推广', 'href': '#tool/multiPlan/step1'}],
    'tool/multiPlan/step3': [_home, {'title': '工具'}, {'title': '多计划推广', 'href': '#tool/multiPlan/step1'}],
    'tool/multiPlan/step4': [_home, {'title': '工具'}, {'title': '多计划推广', 'href': '#tool/multiPlan/step1'}],
    'tool/multiShop': [_home, {'title': '工具'}, {'title': '多店铺切换'}],
    'tool/banWordSelItem': [_home, {'title': '工具'}, {'title': '违禁词检测', 'href': '#tool/banWordCheck'}],
    'tool/banWordCheck': [_home, {'title': '工具'}, {'title': '违禁词检测', 'href': '#tool/banWordCheck'}],
    'tool/banWordReport': [_home, {'title': '工具'}, {'title': '违禁词检测', 'href': '#tool/banWordCheck'}]
}


let menu = (
    <Menu>
        <Menu.Item key="0">
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item key="1">
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" disabled>3rd menu item（disabled）</Menu.Item>
    </Menu>
);

function itemRender(route, params, routes, paths) {
    let last = routes.indexOf(route) === routes.length - 1;
    console.log(route, params, routes, paths)
    return last ? <span>{route.title}</span> : <Link to={paths.join('/')}>{route.title}</Link>
}


@connect(state => ({
    campagin: state.campagin,
}),dispatch => (bindActionCreators({
    fetchCampaignList,
}, dispatch)))
export default class BreadcrumbEX extends React.Component {
    componentDidMount() {
        this.props.fetchCampaignList()
    }
    render() {
        return (
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>首页</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">智能推广</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Dropdown overlay={menu}><a className="ant-dropdown-link" href="#">计划<Icon type="down" /></a></Dropdown>
                </Breadcrumb.Item>
                <Breadcrumb.Item>管理关键词</Breadcrumb.Item>
            </Breadcrumb>
        )
    }
}
