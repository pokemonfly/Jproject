import './MenuStyle.less'

import React from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Menu, Button} from 'antd';
import classNames from 'classnames'
import {Link} from 'react-router'

import Icon from 'containers/shared/Icon'
import MENU_CONFIG from 'utils/config/Menu'
import {fetchEngineList, addAutoEngine} from 'containers/Engine/EngineRedux'
import {fetchCampaignList} from 'containers/Campaign/CampaignRedux'
import {updateCurrent, updateCurrentByIndex} from "./MenuRedux"

const {Item, SubMenu} = Menu

const OPEN_KEYS_DEFAULT = []

/**
 * mode :  vertical   horizontal
 */
@connect(state => ({
    location: state.location,
    user: state.user,
    menu: state.menu,
    sider: state.layout.sider,
    engine: state.engine.data,
    campaign: state.campaign.data
}), dispatch => (bindActionCreators({
    fetchEngineList,
    fetchCampaignList,
    addAutoEngine,
    updateCurrent,
    updateCurrentByIndex
}, dispatch)))
export default class MenuEX extends React.Component {
    state = {
        openKeys: Object.assign([], OPEN_KEYS_DEFAULT)
    };

    componentWillMount() {
        this.props.fetchEngineList()
        this.props.fetchCampaignList()
    }

    handleClick  = (e) => {
        this.props.updateCurrent(e.keyPath)
        if (e.keyPath.length === 1) {
            this.props.updateCurrentByIndex(undefined, 1)
        }
    }
    onOpenChange = (openKeys) => {
        this.props.updateCurrentByIndex(openKeys[1], 1)
    }

    render() {
        let {user, menu, engine, campaign} = this.props;

        let mode     = this.props.sider.collapsed ? 'vertical' : "inline";
        let menuClz  = classNames({menu: true, collapsed: this.props.sider.collapsed})
        let menuList = getItems(engine, campaign)
        // TODO openKeys 只是针对总共有2级目录的处理
        return (
            <Menu onClick={this.handleClick}
                  openKeys={[menu.current[1]]}
                  onOpenChange={this.onOpenChange}
                  selectedKeys={menu.current} mode={mode}
                  className={menuClz}>
                {menuList}
            </Menu>
        )
    }
}

/**
 * 获得主类目列表
 * @returns {Array}
 */
function getItems(engine, campaign) {
    return MENU_CONFIG.map(elem => {
        // 引擎列表
        if (elem.type === 'auto') {
            let subItems = getEngineItems(engine)
            return (
                <SubMenu key={elem.type} title={< span> <Icon type={elem.iconName}/> < span
                    className='menu-title'>{elem.name}</span></span>}>
                    {subItems.length > 0 ? subItems : null}
                </SubMenu>
            )
        }

        // 手动计划列表
        if (elem.type === 'manual') {
            let subItems = getCampaignItems(campaign)
            return (
                <SubMenu key={elem.type} title={< span> <Icon type={elem.iconName}/> < span
                    className='menu-title'>{elem.name}</span></span>}>
                    {subItems.length > 0 ? subItems : null}
                </SubMenu>
            )
        }

        // 主目录为跳转链接列表
        if (elem.href) {
            if (elem.blank) {
                return (
                    <Item key={elem.type}>
                        <a href={elem.href} target="_black">
                            <Icon type={elem.iconName}/>
                            <span className='menu-title'>{elem.name}</span>
                        </a>
                    </Item>
                )
            } else {
                return (
                    <Item key={elem.type}>
                        <Link to={elem.href}>
                            <Icon type={elem.iconName}/>
                            <span className='menu-title'>{elem.name}</span>
                        </Link>
                    </Item>
                )
            }
        }

        // 具有子类目列表
        if (elem.sub) {
            let subItems = getSubItems(elem.sub)
            return (
                <SubMenu key={elem.type} title={< span> <Icon type={elem.iconName}/> < span
                    className='menu-title'>{elem.name}</span></span>}>
                    {subItems}
                </SubMenu>
            )
        }

        // 默认
        return (
            <Item key={elem.type}>
                <Icon type={elem.iconName}/>
                <span className='menu-title'>{elem.name}</span>
            </Item>
        )
    })
}

/**
 * 获得子目录列表
 * @param list
 * @returns {Array}
 */
function getSubItems(list) {
    return list.map(elem => {
        return (
            <Item key={elem.type}><Link to={elem.href}>{elem.name}</Link></Item>
        )
    })
}

/**
 * 获得引擎目录列表
 * @param engine
 * @returns {Array}
 */
function getEngineItems(engine) {
    return engine.map((value) => {
        if (value.campaignId) {
            return (
                <Item key={value.engineNo}>
                    <Link to={{
                        pathname: '/list',
                        query: {campaignId: value.campaignId}
                    }}>
                        {value.engineNo}号引擎：{value.typeName}策略
                    </Link>
                </Item>
            )
        } else {
            return (
                <Item key={value.engineNo}>
                    {value.engineNo}号引擎：<Button size="small">{value.typeName}</Button>
                </Item>
            )
        }
    })
}

/**
 * 获得手动推广的目录列表
 * @param campaign
 * @returns {Array}
 */
function getCampaignItems(campaign) {
    return campaign.map(elem => {
        if (!elem.isMandate) {
            return (
                <Item key={elem.campaignId}>
                    <Link to={{pathname: '/list', query: {campaignId: elem.campaignId}}}>
                        {elem.title}
                    </Link>
                </Item>
            )
        }
    })
}