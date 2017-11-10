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
        ...this.props,
        hasTitle: true,
        onlyPrice: false,
        hasHmAuth: false,
        hasOff: true,
        isOptimizeChangeMatchScope: this.props.isOptimizeChangeMatchScope == '1',
        adjustPcPrice: this.props.isOptimizeChangePrice == '1',
        adjustMobilePrice: this.props.isOptimizeChangeMobilePrice == '1',
        isAllRound: false
    }
    onSubmit = ( ) => {
        const formObj = this.props.form.getFieldsValue( )
        let commitObj = {
            ...pick(formObj, [ 'optimizationState', 'isOptimizeChangeMatchScope' ]),
            ...pick(this.props, [ 'adgroupId', 'campaignId', 'type' ])
        }
        commitObj['adjustPcPrice'] = formObj['adjustPcPrice' + commitObj.optimizationState]
        commitObj['adjustMobilePrice'] = formObj['adjustMobilePrice' + commitObj.optimizationState]
        for ( const key in commitObj ) {
            if (isBoolean(commitObj[key])) {
                // 转为数字
                commitObj[key] = +commitObj[key]
            }
        }
        if ( commitObj.optimizationState == '9' ) {
            // 按配置优化时， 选项全开
            commitObj = {
                adjustPcPrice: 1,
                adjustMobilePrice: 1,
                isOptimizeChangeMatchScope: 1,
                ...commitObj
            }
        }
        console.log( 'EditOptimization commit data:', commitObj )
        this.props.api( commitObj );
        this.props.onClose( );
    }
    onOptimizeChange = ( e ) => {
        this.setState({ optimizationState: e.target.value });
    }
    onSwitchChange = ( key, checked ) => {
        // 必须保证pc 或 无线选中一个
        if ( !checked ) {
            this.props.form.setFieldsValue({ [ key ]: true })
        }
    }
    renderSwitch( i ) {
        const { getFieldDecorator } = this.props.form;
        const { adjustPcPrice, adjustMobilePrice } = this.state
        return (
            <div className="switch-row ant-form-inline">
                <Form.Item >
                    <span>PC：</span>
                    {getFieldDecorator('adjustPcPrice' + i, {
                        valuePropName: 'checked',
                        initialValue: adjustPcPrice
                    })( <Switch onChange={this.onSwitchChange.bind( this, 'adjustMobilePrice' + i )}/> )}
                </Form.Item>
                <Form.Item>
                    <span>无线：</span>
                    {getFieldDecorator('adjustMobilePrice' + i, {
                        valuePropName: 'checked',
                        initialValue: adjustMobilePrice
                    })( <Switch onChange={this.onSwitchChange.bind( this, 'adjustPcPrice' + i )}/> )}
                </Form.Item>
            </div>
        )
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        const {
            optimizationState,
            onlyPrice,
            hasHmAuth,
            hasTitle,
            hasOff,
            isOptimizeChangeMatchScope
        } = this.state;

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
                                        {optimizationState == 1 && this.renderSwitch( 1 )}
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
                                    {optimizationState == 0 && this.renderSwitch( 0 )}
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
                                initialValue: isOptimizeChangeMatchScope
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
