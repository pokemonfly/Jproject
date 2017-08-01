import React from 'react';
import { connect } from 'react-redux'
import MHeader from './components/header';
import { fetchUserInfo } from '../redux/userBase'
import { Layout } from 'antd';
import Sider from './components/Sider'
import Menu from './components/Menu'
import './FrameStyle.less'

const { Header, Content } = Layout;
Sider.__ANT_LAYOUT_SIDER = true;

@connect( )
export default class Frame extends React.Component {
    constructor( props ) {
        super( props )
    }
    componentWillMount( ) {
        this.props.dispatch(fetchUserInfo( ));
    }
    render( ) {
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

/* <div className="frame">
    <div className="header">

    </div>
    <Sider/>
    <div className="container">
        {this.props.children}
    </div>
</div> */
/*    <Layout>
          <Header>Header</Header>
              <Layout>
                <Sider>Sider</Sider>
                <Content>Content</Content>
              </Layout>
          <Footer>Footer</Footer>
    </Layout>
    */
