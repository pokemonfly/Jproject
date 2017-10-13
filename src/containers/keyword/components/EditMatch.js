import React from 'react';
import { Layout, Form, Radio, Button } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { deleteKeyword } from './KeywordListRedux'
import './EditMatch.less'

@connect(null, dispatch => (bindActionCreators( {
    deleteKeyword
}, dispatch )))
@Form.create( )
export default class EditMatch extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            matchScope: 4
        }
    }
    onSubmit = ( ) => {
        const obj = this.props.form.getFieldsValue( )

        // this.props.afterCb( );
        this.props.onClose( );
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        const { type } = this.props
        const { matchScope } = this.state

        return (
            <Layout className="float-panel edit-match">
                {type == 'scope' ? (
                    <Form>
                        <p className="header">匹配方式修改为：</p>
                        <Form.Item className="sep-line">
                            {getFieldDecorator('matchScope', { initialValue: matchScope })(
                                <Radio.Group>
                                    <Radio value={4}>广泛匹配</Radio>
                                    <br/>
                                    <Radio value={1}>精确匹配</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Form>
                ) : (
                    <Form>
                        <p className="header">匹配方式优化修改为：</p>
                        <Form.Item className="sep-line">
                            {getFieldDecorator('matchScopeOp', { initialValue: matchScope })(
                                <Radio.Group>
                                    <Radio value={1}>优化</Radio>
                                    <br/>
                                    <Radio value={0}>不优化</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Form>
                )}
                <div className="footer">
                    <Button type="primary" onClick={this.onSubmit}>确定</Button>
                    <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                </div>
            </Layout>
        )
    }
}
