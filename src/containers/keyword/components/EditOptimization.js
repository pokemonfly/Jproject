import React from 'react';
import { Layout, Form, Radio, Button, Tooltip } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { deleteKeyword } from './KeywordListRedux'
import './EditOptimization.less'

@connect(null, dispatch => (bindActionCreators( {
    deleteKeyword
}, dispatch )))
@Form.create( )
export default class EditOptimization extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            optimize: 1,
            onlyPrice: true
        }
    }
    onSubmit = ( ) => {
        const obj = this.props.form.getFieldsValue( )

        // this.props.afterCb( );
        this.props.onClose( );
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        const { optimize, onlyPrice } = this.state;

        return (
            <Layout className="float-panel edit-optimization">
                <Form>
                    <p className="header">修改优化方式：</p>
                    <Form.Item className="sep-line">
                        {getFieldDecorator('optimize', { initialValue: optimize })(
                            <Radio.Group>
                                {!onlyPrice ? (
                                    <Radio value={1}>全自动优化</Radio>
                                ) : (
                                    <Tooltip title="宝贝的优化方式为只优化价格/只优化出词，此选项不可用" placement="topLeft">
                                        <Radio value={1} disabled>全自动优化</Radio>
                                    </Tooltip>
                                )}
                                <br/>
                                <Radio value={0}>只优化价格</Radio>
                                <br/>
                                <Radio value={9}>按配置优化</Radio>
                                <br/>
                                <Radio value={-1}>不自动优化</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <div className="footer">
                        <Button type="primary" onClick={this.onSubmit}>确定</Button>
                        <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                    </div>
                </Form>
            </Layout>
        )
    }
}
