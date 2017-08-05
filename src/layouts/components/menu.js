import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Menu, Button } from 'antd';
import classNames from 'classnames'
import Icon from '../../containers/shared/Icon';
import { fetchCampaignInfo, fetchEnginesInfo } from './LayoutsRedux'
import './MenuStyle.less'
const { Item, SubMenu, ItemGroup } = Menu;

/*
mode :  vertical   horizontal
*/
@connect( state => ( {
    user: state.user,
    engines: state.layout.engines,
    manual: state.layout.manual,
    campaignMap: state.layout.campaignMap,
    menu: state.layout.menu,
    sider: state.layout.sider
} ), dispatch => ( bindActionCreators( {
    fetchCampaignInfo,
    fetchEnginesInfo
}, dispatch ) ) )
export default class MenuEX extends React.Component {
    componentWillMount() {
        this.props.fetchEnginesInfo();
        this.props.fetchCampaignInfo();
    }
    render() {
        const { user, menu, engines, manual, campaignMap } = this.props;
        const mode = this.props.sider.collapsed ?
            'vertical' :
            "inline";
        const menuClz = classNames( { menu: true, collapsed: this.props.sider.collapsed } )
        const enginesChild = engines.map( ( id, ind ) => {
            const index = ind + 1
            if ( id ) {
                return (
                    <Item key={"engine_" + index}>
                        <a href="">
                            {index}号引擎：{campaignMap[id].typeName}策略
                        </a>
                    </Item>
                )
            } else {
                return (
                    <Item key={"engine_" + index}>
                        <a href="">
                                {index}号引擎：<Button size="small">未启动</Button>
                        </a>
                    </Item>
                )
            }
        } )
        const manualChild = manual.map( ( id, ind ) => {
            return (
                <Item key={"manual_" + id}>
                    <a href="">
                        {campaignMap[id].title}
                    </a>
                </Item>
            )
        } )
        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[ menu.current ]}
                mode={mode}
                className={menuClz}>
                <Item key="home">
                    <a href="">
                        <Icon type="shouye"/>
                        <span className='menu-title'>首页</span>
                    </a>
                </Item>
                <SubMenu
                    key="auto"
                    title={< span > <Icon type="zhinengtuiguang"/> < span className = 'menu-title' > 智能推广 < /span> </span >}>
                    {enginesChild}
                    </SubMenu>
                <SubMenu
                    key="manual"
                    title={< span > <Icon type="shoudongtuiguang"/> < span className = 'menu-title' > 手动推广 < /span></span >}>
                        {manualChild}
                    </SubMenu>
                <Item key="smart">
                    <Icon type="jinnang"/>
                    <span className='menu-title'>锦囊服务</span>
                </Item>
                <Item key="fast">
                    <Icon type="kuaichewang"/>
                    <span className='menu-title'>快车网</span>
                </Item>
                <SubMenu
                    key="tool"
                    title={< span > <Icon type="gongju"/> < span className = 'menu-title' > 工具 < /span></span >}>
                    <Item key="keyWords">
                        <a href="">
                            关键词管理
                        </a>
                    </Item>
                    <Item key="creative">
                        <a href="">
                            创意图管理
                        </a>
                    </Item>
                    <Item key="report">
                        <a href="">
                            报告管理
                        </a>
                    </Item>
                    <Item key="multiPlan">
                        <a href="">
                            宝贝多计划推广
                        </a>
                    </Item>
                    <Item key="multiShop">
                        <a href="">
                            多店铺切换
                        </a>
                    </Item>
                    <Item key="sms">
                        <a href="">
                            余额/日限额短信提醒
                        </a>
                    </Item>
                    <Item key="midYearReport">
                        <a href="">
                            年中策略报告
                        </a>
                    </Item>
                    <Item key="qualityLie">
                        <a href="">
                            质量分分布
                        </a>
                    </Item>
                    <Item key="banWordCheck">
                        <a href="">
                            违禁词检测
                        </a>
                    </Item>
                </SubMenu>
                <Item key="school">
                    <Icon type="kuaichexuetang"/>
                    <span className='menu-title'>快车学堂</span>
                </Item>
            </Menu>
        )
    }
}
