import React, { Component, PropTypes } from 'react';
import classNames from 'classnames'
import Icon from './Icon'
import { Button, Input } from 'antd';

const { Search } = Input
export default class SearchEX extends Search {
    constructor( props ) {
        super( props )
    }
    render( ) {
        const {
            className,
            prefixCls,
            ...others
        } = this.props;
        delete others.onSearch;
        const addonAfter = ( < span onClick = {
            this.onSearch
        } > < Icon type = "search" />< span > 搜索 < /span></span > )
        return (
            <span>
                <Input
                    onPressEnter={this.onSearch}
                    {...others}
                    className={classNames( prefixCls, className )}
                    addonAfter={addonAfter}
                    ref={node => this.input = node}/>
            </span>
        );
    }
}