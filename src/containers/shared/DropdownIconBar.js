import React from 'react';
import clzName from 'classnames'
import { TriggerFix as Trigger } from './Trigger';
import { Dropdown, Tooltip, Menu } from 'antd';
import Icon from './Icon'
import './DropdownIconBar.less'
const MenuItem = Menu.Item
export default class DropdownIconBar extends React.Component {
    state = {
        visible: false,
        popup: ( <span></span> )
    }
    onClosePopup = () => {
        this.setState( { visible: false } )
    }
    onPopupVisibleChange = ( visible ) => {
        this.setState( { visible } )
    }
    onIconClick = ( idx ) => {
        const { config, className, popProps } = this.props;
        const cfg = config[ idx ];
        if ( cfg.popup ) {
            const fixedPopup = React.cloneElement( cfg.popup, {
                ...popProps,
                onClose: this.onClosePopup
            } );
            this.setState( { popup: fixedPopup, visible: true } )
        }
        if ( cfg.cb ) {
            cfg.cb()
        }
    }
    render() {
        const { config, className } = this.props
        const { popup, visible } = this.state
        const defaultCfg = config[ 0 ];
        const iconCfg = config.slice( 1 );
        const triggerCfg = {
            popupAlign: {
                points: [
                    'tl', 'bl'
                ],
                offset: [ 0, 4 ]
            },
            destroyPopupOnHide: true,
            popupStyle: {
                display: 'inline-block'
            },
            hideAction: ['click'],
            onPopupVisibleChange: this.onPopupVisibleChange
        }
        const cn = clzName( className, { "force-show": visible } )
        return ( <Trigger {...triggerCfg} popupVisible={visible} popup={popup}>
            <span className={cn}>
                <Dropdown.Button
                    className="dropdown-icon-bar"
                    size="small"
                    onClick={this.onIconClick.bind( this, 0 )}
                    overlay={( <Menu className="dropdown-icon-group" onIconClick={this.onIconClick}>
                        {
                            iconCfg.map( ( o, ind ) => ( <MenuItem key={ind}>
                                <Tooltip title={o.tooltip} arrowPointAtCenter="arrowPointAtCenter">
                                    <Icon type={o.icon} onClick={this.onIconClick.bind( this, ind + 1 )}/>
                                </Tooltip>
                            </MenuItem> ) )
                        }
                    </Menu> )}>
                    <Icon type={defaultCfg.icon} size="small"/>
                </Dropdown.Button>
            </span>
        </Trigger> )
    }
}
