import React from 'react';
import className from 'classnames'
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
    onDefaultIconClick = () => {
        const {
            config,
            defaultCfg,
            className,
            ...other
        } = this.props;
        if ( defaultCfg.popup ) {
            const fixedPopup = React.cloneElement( defaultCfg.popup, {
                ...other,
                onClose: this.onClosePopup
            } );
            this.setState( { popup: fixedPopup, visible: true } )
        }
    }
    onClosePopup = () => {
        this.setState( { visible: false } )
    }
    onIconClick = () => {}
    getPopup() {}
    render() {
        const { config, defaultCfg, className } = this.props
        const { popup, visible } = this.state
        return ( <div className={className}>
            <Dropdown.Button
                trigger={[ 'click' ]}
                className="dropdown-icon-bar"
                size="small"
                onClick={this.onDefaultIconClick}
                overlay={( <Menu className="dropdown-icon-group" onIconClick={this.onIconClick}>
                    {
                        config.map( o => ( <MenuItem key={o.key}>
                            <Tooltip title={o.tooltip} arrowPointAtCenter="arrowPointAtCenter">
                                <Icon type={o.icon}/>
                            </Tooltip>
                        </MenuItem> ) )
                    }
                </Menu> )}>
                <Icon type={defaultCfg.icon} size="small"/>
            </Dropdown.Button>
            <Trigger popup={popup} popupVisible={visible} popupStyle={{
                    display: 'inline-block'
                }}>
                <span></span>
            </Trigger>
        </div> )
    }
}
