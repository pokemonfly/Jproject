import './FrameStyle.less'

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {Layout} from 'antd';

import MHeader from './components/header';
import {fetchUserInfo} from '../redux/userBase'
import Sider from './components/Sider'
import Menu from './components/Menu'

const {Header, Content}  = Layout;
Sider.__ANT_LAYOUT_SIDER = true;

@connect(null, dispatch => ( bindActionCreators({
    fetchUserInfo
}, dispatch) ))
export default class Frame extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.props.fetchUserInfo();
    }

    render() {
        return (
            <Layout>
                <Header>
                    <MHeader/>
                </Header>
                <Layout>
                    <Sider>
                        <Menu/>
                    </Sider>
                    <Content className="frame-content">
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
