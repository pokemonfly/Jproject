import React from 'react';
import { Form, Checkbox, Layout, Button } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { deleteKeyword } from './KeywordListRedux'
const FormItem = Form.Item;

@connect( null, dispatch => ( bindActionCreators( {
    deleteKeyword
}, dispatch ) ) )
@Form.create()
export default class DelKeyword extends React.Component {
    constructor( props ) {
        super( props );
        this.state = this.getStateFromProps( props )
    }
    getStateFromProps( props ) {
        const { selectedRowKeys, keywordMap } = props;
        let word,
            optimizeStatus
        if ( selectedRowKeys.length ) {
            // word = selectedRowKeys.map(i => {     return keywordMap[i].word }).join( ' ' )
            word = keywordMap[ selectedRowKeys[ 0 ] ].word
            optimizeStatus = selectedRowKeys.map( i => keywordMap[ i ].optimizeStatus )[ 0 ]
        }
        return { word, optimizeStatus }
    }
    componentWillReceiveProps( nextProps ) {
        this.setState( this.getStateFromProps( nextProps ) )
    }
    /*
    onVisibleChange = ( visible ) => {
        const { selectedRowKeys } = this.props;
        if ( !visible || selectedRowKeys.length ) {
            this.setState({ visible: visible });
        } else {
            notification['error']({ message: '批量操作', description: '请您至少勾选一个关键词进行操作' });
        }
    }*/
    onSubmit = () => {
        const obj = this.props.form.getFieldsValue()
        const { selectedRowKeys, keywordMap } = this.props;
        const result = selectedRowKeys.map( i => ( {
            keywordId: i,
            ...obj,
            campaignId: keywordMap[ i ].campaignId,
            adgroupId: keywordMap[ i ].adgroupId
        } ) )
        this.props.deleteKeyword( result, selectedRowKeys )
        this.props.afterCb();
    }
    onClose = () => {
        this.props.onClose()
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            never = true,
            selectedRowKeys
        } = this.props;
        const { optimizeStatus, word } = this.state
        const len = selectedRowKeys.length
        return ( <Layout className="float-panel">
            <Form>
                <Form.Item >
                    {len == 1 && ( <span className="header">删除关键词：{word}</span> )}
                </Form.Item>
                {len > 1 && ( <span className="header">{`确定要删除${ len }个词吗？一旦删除，所有数据将无法恢复！`}</span> )}
                {
                    never && ( optimizeStatus == 1 || optimizeStatus == 2 ) && ( <FormItem>
                        {getFieldDecorator( 'isInBlackList' )( <Checkbox >不再投放此关键词</Checkbox> )}
                    </FormItem> )
                }
                {!never && ( <p>删除后所有数据将无法恢复！ 确定要删除该关键词吗？</p> )}
            </Form>
            <div className="footer">
                <Button type="primary" onClick={this.onSubmit}>确定</Button>
                <a onClick={this.onClose} className="cancel-btn">取消</a>
            </div>
        </Layout> )
    }
}
