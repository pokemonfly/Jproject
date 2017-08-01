import React from 'react';
import { connect } from 'react-redux'
import { Layout } from 'antd';
import Icon from '../../containers/shared/Icon';

export default class MenuSider extends React.Component {
    render( ) {
        return (
            <Layout.Sider collapsible={true} width="160" collapsedWidth="40" trigger={null}>
                <div>
                    <span>网站导航</span>
                    <Icon type="shouqi1"/>
                </div>
                {this.props.children}
            </Layout.Sider>
        )
    }
}
