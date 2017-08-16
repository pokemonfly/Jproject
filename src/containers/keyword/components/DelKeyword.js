import React from 'react';
import { Popconfirm, Form, Checkbox } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { deleteKeyword } from './KeywordListRedux'
const FormItem = Form.Item;

@connect(null, dispatch => (bindActionCreators( {
    deleteKeyword
}, dispatch )))
@Form.create( )
export default class DelKeyword extends React.Component {
    constructor( props ) {
        super( props );
        const { selectedRowKeys, keywordMap } = props
            let word,
                optimizeStatus
            if ( selectedRowKeys.length ) {
                word = selectedRowKeys.map(i => {
                    return keywordMap[i].word
                }).join( ' ' )
                optimizeStatus = selectedRowKeys.map( i => keywordMap[i].optimizeStatus )[ 0 ]
            }
            this.state = {
                visible: false,
                word,
                optimizeStatus
            }
        }
        onVisibleChange = ( visible ) => {
            const { selectedRowKeys } = this.props;
            if ( !visible || selectedRowKeys.length ) {
                this.setState({ visible: visible });
            } else {
                notification['error']({ message: '批量操作', description: '请您至少勾选一个关键词进行操作' });
            }
        }
        onConfirm = ( ) => {
            const obj = this.props.form.getFieldsValue( )
            const { selectedRowKeys, keywordMap } = this.props;
            const result = selectedRowKeys.map(i => ({
                keywordId: i,
                ...obj,
                campaignId: keywordMap[i].campaignId,
                adgroupId: keywordMap[i].adgroupId
            }))
            this.props.deleteKeyword( result, selectedRowKeys )
            this.props.afterCb( );
        }
        render( ) {
            const { getFieldDecorator } = this.props.form;
            const {
                never = true
            } = this.props;
            const { optimizeStatus, word } = this.state
            const content = (
                <Form>
                    <span>删除关键词：{word}</span>
                    {never && ( optimizeStatus == 1 || optimizeStatus == 2 ) && (
                        <FormItem style={{
                            margin: 0
                        }}>
                            {getFieldDecorator( 'isInBlackList' )(
                                <Checkbox >不再投放此关键词</Checkbox>
                            )}
                        </FormItem>
                    )}
                    {!never && (
                        <p>删除后所有数据将无法恢复！ 确定要删除该关键词吗？</p>
                    )}
                </Form>
            )
            return (
                <Popconfirm
                    placement="bottomLeft"
                    title={content}
                    visible={this.state.visible}
                    onVisibleChange={this.onVisibleChange}
                    onConfirm={this.onConfirm}>
                    {this.props.children}
                </Popconfirm>
            )
        }
    }
