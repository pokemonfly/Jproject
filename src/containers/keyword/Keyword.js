import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';
import KeywordHead from './components/KeywordHead';
import KeywordOverview from './components/KeywordOverview';
import KeywordView from './components/KeywordView';
import PubSub from 'pubsub-js';
import Breadcrumb from '@/containers/shared/Breadcrumb'
import './KeywordStyle.less';

@connect(state => ({ keyword: state.keyword }))
export default class Keyword extends Component {
    componentDidUpdate( ) {
        PubSub.publish( 'table.resize' )
    }
    render( ) {
        return (
            <div>
                <Breadcrumb/>
                <KeywordHead></KeywordHead>
                <KeywordOverview></KeywordOverview>
                <KeywordView></KeywordView>
            </div>
        );
    }
}
