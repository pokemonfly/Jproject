/**
 * @fileOverview
 * @author crow
 * @time 2017/11/27
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import Breadcrumb from '@/containers/shared/Breadcrumb'

@connect(state => ({adgroup: state.adgroup}))
export default class Keyword extends Component {
    render() {
        return (
            <div>
                <Breadcrumb/>
            </div>
        );
    }
}
