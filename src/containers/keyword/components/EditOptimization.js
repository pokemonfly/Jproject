import React from 'react';
import {
    Layout,
    Form,
    Radio,
    Button,
    Tooltip,
    Switch
} from 'antd';
import { pick, isBoolean } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { deleteKeyword } from './KeywordListRedux'
import './EditOptimization.less'

@connect(null, dispatch => (bindActionCreators( {
    deleteKeyword
}, dispatch )))
@Form.create( )
export default class EditOptimization extends React.Component {
    state = {
        optimizationState: 1, // Fix me
        hasTitle: true,
        onlyPrice: false,
        hasHmAuth: false,
        hasOff: true,
        adjustPcPrice: false,
        adjustMobilePrice: true,
        isAllRound: false,
        ...this.props
    }
    onSubmit = ( ) => {
        const formObj = this.props.form.getFieldsValue( )
        let commitObj = {
            ...pick(formObj, [ 'optimizationState', 'adjustMobilePrice', 'adjustPcPrice', 'isOptimizeChangeMatchScope' ]),
            ...pick(this.props, [ 'adgroupId', 'campaignId', 'type' ])
        }
        for ( const key in commitObj ) {
            if ( isBoolean ) {
                // 转为数字
                commitObj[key] = +commitObj[key]
            }
        }
        console.log( 'EditOptimization commit data:', commitObj )
        this.props.api( commitObj );
        this.props.onClose( );
    }
    onOptimizeChange = ( e ) => {
        this.setState({ optimizationState: e.target.value });
    }
    onSwitchChange = ( e ) => {
        // this.props.form.setFieldsValue({ adjustPcPrice: true, adjustMobilePrice: true })
    }
    renderSwitch( ) {
        const { getFieldDecorator } = this.props.form;
        const { adjustPcPrice, adjustMobilePrice } = this.state
        return (
            <div className="switch-row">
                <span>
                    <span>PC：</span>
                    {getFieldDecorator('adjustPcPrice', {
                        valuePropName: 'checked',
                        initialValue: !!adjustPcPrice
                    })( <Switch onChange={this.onSwitchChange}/> )}
                </span>
                <span>
                    <span>无线：</span>
                    {getFieldDecorator('adjustMobilePrice', {
                        valuePropName: 'checked',
                        initialValue: !!adjustMobilePrice
                    })( <Switch onChange={this.onSwitchChange}/> )}
                </span>
            </div>
        )
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        const { optimizationState, onlyPrice, hasHmAuth, hasTitle, hasOff } = this.state;

        return (
            <Layout className="float-panel edit-optimization">
                <Form>
                    {hasTitle && (
                        <p className="header">修改优化方式：</p>
                    )}
                    <Form.Item className="sep-line">
                        {getFieldDecorator('optimizationState', { initialValue: optimizationState })(
                            <Radio.Group onChange={this.onOptimizeChange}>
                                {!onlyPrice ? (
                                    <div>
                                        <Radio value={1}>
                                            <span>全自动优化</span>
                                        </Radio>
                                        {optimizationState == 1 && this.renderSwitch( )}
                                    </div>
                                ) : (
                                    <Tooltip title="宝贝的优化方式为只优化价格/只优化出词，此选项不可用" placement="topLeft">
                                        <Radio value={1} disabled>全自动优化</Radio>
                                    </Tooltip>
                                )}
                                <div>
                                    <Radio value={0}>
                                        <span>只优化价格</span>
                                    </Radio>
                                    {optimizationState == 0 && this.renderSwitch( )}
                                </div>
                                {hasHmAuth && (
                                    <Radio className="row" value={9}>按配置优化</Radio>
                                )}
                                {hasOff && (
                                    <Radio value={-1}>不自动优化</Radio>
                                )}
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {optimizationState != 9 && optimizationState != -1 && (
                        <Form.Item className="sep-line">
                            <span>匹配方式：</span>
                            {getFieldDecorator('isOptimizeChangeMatchScope', {
                                valuePropName: 'checked',
                                initialValue: true
                            })( <Switch/> )}
                        </Form.Item>
                    )}
                    <div className="footer">
                        <Button type="primary" onClick={this.onSubmit}>确定</Button>
                        <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                    </div>
                </Form>
            </Layout>
        )
    }
}
