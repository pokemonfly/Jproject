import React from 'react';
import { connect } from 'react-redux'
import { Dropdown, Button } from 'antd'
import styles from './header.less';
import logoImg from '@/static/images/logo.png';
import Icon from '@/containers/shared/Icon'
import CustomerService from './CustomerService'
@connect(state => ({ user: state.user }))
export default class Header extends React.Component {
    state = {
        csDropdownVisible: false
    }
    handleVisibleChange( key, flag ) {
        this.setState({ [ key ]: flag });
    }
    render( ) {
        let { user } = this.props
        const { csDropdownVisible } = this.state
        return (
            <div className='page-header'>
                <img src={logoImg}/>
                <div className="pull-right">
                    <span>
                        当前版本：
                        <span className='versionName'>{user.versionName}</span>
                    </span>
                    <span>
                        使用期至：{user.expireDate}（{user.toExpireDaysDiff}天）
                    </span>
                    <span className="short-cut">
                        <Dropdown
                            visible={csDropdownVisible}
                            onVisibleChange={this.handleVisibleChange.bind( this, 'csDropdownVisible' )}
                            overlay={( <CustomerService/> )}
                            trigger={[ 'click' ]}>
                            <div className="short-cut-btn">
                                <Icon type="wangwang"/>
                            </div>
                        </Dropdown>
                        <div className="short-cut-btn">
                            <Icon type="iconset0336"/>
                        </div>
                        <div className="short-cut-btn">
                            <Icon type="menu-shouqi"/>
                        </div>
                        <div className="short-cut-btn">
                            <Icon type="zuan"/>
                        </div>
                    </span>
                </div>
            </div>
        );
    }
}
