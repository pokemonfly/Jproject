import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {
    Layout,
    Checkbox,
    Select,
    Tooltip,
    InputNumber,
    Button,
    Alert,
    Form
} from 'antd'
import { pick, uniq, isEqual } from 'lodash'
import Icon from '@/containers/shared/Icon';
import { Dialog } from '@/containers/shared/Dialog';
import { postOneKeyOptimizations } from './OneKeyRedux'
import './OneKeyOptimize.less'

@Dialog({ title: '一键优化', width: 800, hasForm: true, hasConnect: true })
@connect(state => ({ query: state.location.query }), dispatch => (bindActionCreators( {
    postOneKeyOptimizations
}, dispatch )), null, { withRef: true })
@Form.create({ withRef: true })
export default class OneKeyOptimize extends React.Component {
    componentWillMount( ) {}
    okCallback( closeHandler ) {
        closeHandler( );
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="one-key-optimize ">
                <Form.Item>ε=(´ο｀*)))唉</Form.Item>
            </Form>
        )
    }
}
