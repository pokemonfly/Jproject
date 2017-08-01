import React from 'react';
import { connect } from 'react-redux'
import styles from './header.less';
import logoImg from '../../static/images/logo.png';

@connect(state => ({ user: state.user }))
export default class Header extends React.Component {

    render( ) {
        let { user } = this.props
        console.dir( styles );
        return (
            <div className='normal'>
                <img src={logoImg}/>
                <span>
                    当前版本：
                    <span className='versionName'>{user.versionName}</span>
                </span>
                <span>
                    使用期至：{user.expireDate}（{user.toExpireDaysDiff}天）
                </span>
            </div>
        );
    }
}
