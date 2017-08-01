import React from 'react';
import { connect } from 'react-redux'
import { Menu } from 'antd';
import classNames from 'classnames'
import Icon from '../../containers/shared/Icon';
import './MenuStyle.less'
const { Item, SubMenu, ItemGroup } = Menu;

/*
mode :  vertical   horizontal
*/
@connect(state => ({ user: state.user, campaign: state.campaign, menu: state.layout.menu, sider: state.layout.sider }))
export default class MenuEX extends React.Component {

    render( ) {
        const { user, menu } = this.props;
        const mode = this.props.sider.collapsed
            ? 'vertical'
            : "inline";
        const menuClz = classNames({ menu: true, collapsed: this.props.sider.collapsed })
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
                    title={< span > <Icon type="zhinengtuiguang"/> < span className = 'menu-title' > 智能推广 < /span> </span >}></SubMenu>
                <SubMenu
                    key="manual"
                    title={< span > <Icon type="shoudongtuiguang"/> < span className = 'menu-title' > 手动推广 < /span></span >}></SubMenu>
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
