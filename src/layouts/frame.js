import React from 'react';
import { connect } from 'react-redux'
// import Sider from './sider';
import MHeader from './components/header';
import { fetchUserInfo } from '../redux/userBase'
import { Layout, Checkbox } from 'antd';
const { Header, Sider, Content } = Layout;
@connect()
export default class Frame extends React.Component {
    constructor( props ) {
        super( props )
    }
    componentWillMount() {
        this.props.dispatch( fetchUserInfo() );
    }
    render() {
        return (
            <Layout>
                      <Header>
                          <MHeader/>
                      </Header>
                          <Layout>
                            <Sider>Sider</Sider>
                            <Content>    {this.props.children}</Content>
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
