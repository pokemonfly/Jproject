import React, { Component, PropTypes } from 'react';
import { Tabs, Button } from 'antd';
import KeywordFilter from './KeywordFilter'
import './KeywordList.less'

export default class KeywordList extends React.Component {
    render( ) {
        return (
            <div className="keyword-list">
                <div>
                    <KeywordFilter/>
                </div>
            </div>
        );
    }
}
