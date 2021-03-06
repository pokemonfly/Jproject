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
export default class EditMatch extends React.Component {
    static defaultProps = {
        getMenu: function () {
            if ( this.isMandate ) {
                return [
                    {
                        key: 1,
                        name: '修改匹配方式'
                    }, {
                        key: 2,
                        name: '修改匹配优化方式'
                    }
                ]
            } else {
                return [
                    {
                        key: 1,
                        name: '修改匹配方式'
                    }
                ]
            }
        },
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

        return ( <Layout className="float-panel edit-match">
            {
                activeKey == 1 && ( <Form>
                    <p className="header">匹配方式修改为：</p>
                    <Form.Item className="sep-line">
                        {
                            getFieldDecorator( 'matchScope', { initialValue: 4 } )( <Radio.Group>
                                <Radio value={4}>广泛匹配</Radio>
                                <br/>
                                <Radio value={1}>精确匹配</Radio>
                            </Radio.Group> )
                        }
                    </Form.Item>
                </Form> )
            }
            {
                activeKey == 2 && ( <Form>
                    <p className="header">匹配方式优化修改为：</p>
                    <Form.Item className="sep-line">
                        {
                            getFieldDecorator( 'matchScopeOp', { initialValue: 1 } )( <Radio.Group>
                                <Radio value={1}>优化</Radio>
                                <br/>
                                <Radio value={0}>不优化</Radio>
                            </Radio.Group> )
                        }
                    </Form.Item>
                </Form> )
            }
            <div className="footer">
                <Button type="primary" onClick={this.onSubmit}>确定</Button>
                <a onClick={this.props.onClose} className="cancel-btn">取消</a>
            </div>
        </Layout> )
    }
}
