import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';
import KeywordHead from './components/KeywordHead';
import KeywordOverview from './components/KeywordOverview';

import st from './KeywordStyle.less';

@connect( state => ( { keyword: state.keyword } ) )

export default class Keyword extends Component {
    render() {
        return (
            <Layout>
                <KeywordHead></KeywordHead>
                <KeywordOverview></KeywordOverview>
            </Layout>
        );
    }
}
