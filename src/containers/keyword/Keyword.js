import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Breadcrumb } from 'antd';
import KeywordHead from './components/KeywordHead';
import KeywordOverview from './components/KeywordOverview';
import KeywordView from './components/KeywordView';

import st from './KeywordStyle.less';

@connect(state => ({ keyword: state.keyword }))
export default class Keyword extends Component {
    render( ) {
        return (
            <Layout>
                <Breadcrumb>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">智能推广</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">计划名</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>管理关键词</Breadcrumb.Item>
                </Breadcrumb>
                <KeywordHead></KeywordHead>
                <KeywordOverview></KeywordOverview>
                <KeywordView></KeywordView>
            </Layout>
        );
    }
}
