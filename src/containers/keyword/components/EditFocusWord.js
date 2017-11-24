import React from 'react';
import { Layout, Form, Radio, Button } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { postKeyword, postKeywordMatchScope } from './KeywordListRedux'
import DropdownButton from '@/containers/shared/DropdownButton'

@connect( null, dispatch => ( bindActionCreators( {
    postKeyword,
    postKeywordMatchScope
}, dispatch ) ) )
@Form.create()
@DropdownButton
export default class EditFocusWord extends React.Component {
    static defaultProps = {
        menu: [
            {
                key: 1,
                name: '添加重点关注词'
            }, {
                key: 2,
                name: '取消重点关注词'
            }
        ],
        width: "260px"
    }

    constructor( props ) {
        super( props );
    }
    onSubmit = () => {
        const obj = this.props.form.getFieldsValue()
        const { activeKey, selectedRowKeys, keywordMap } = this.props;
        let result = selectedRowKeys.map( i => ( { keywordId: i, campaignId: keywordMap[ i ].campaignId, adgroupId: keywordMap[ i ].adgroupId } ) )
        switch ( activeKey ) {
            case 1:
                result.forEach( i => {
                    i.matchScope = obj.matchScope
                } );
                this.props.postKeyword( result );
                break;
            case 2:
                result.forEach( i => {
                    i.isOptimizeChangeMatchScope = obj.matchScopeOp
                } );
                this.props.postKeywordMatchScope( result );
                break;
        }
        this.props.onClose();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { activeKey } = this.props
        const { changOpt, never } = this.state
        return ( <Layout className="float-panel edit-match">
            {
                activeKey == 1 && ( <Form>
                    <p className="header">匹配方式修改为：</p>
                    <span>{`确定将${ len }个词加入重点关注词吗`}？</span>
                    {
                        changOpt > 0 && never && ( <Form.Item className="sep-line">
                            <span>加入重点关注词，该批词设为</span>
                            {
                                getFieldDecorator( 'matchScope', {
                                    initialValue: false,
                                    valuePropName: 'checked'
                                } )( <Checkbox>不自动优化（{changOpt}）</Checkbox> )
                            }
                        </Form.Item> )
                    }
                </Form> )
            }
            {
                activeKey == 2 && ( <Form>
                    <p className="header">{`确定取消被选中的${ len }个重点关注词吗？`}</p>
                </Form> )
            }
            <div className="footer">
                <Button type="primary" onClick={this.onSubmit}>确定</Button>
                <a onClick={this.props.onClose} className="cancel-btn">取消</a>
            </div>
        </Layout> )
    }
}
