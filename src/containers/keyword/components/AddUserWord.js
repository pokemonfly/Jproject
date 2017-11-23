import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { putKeyword } from './KeywordListRedux'
import { Layout, Button } from 'antd';
import { uniq, pick } from 'lodash';
import TextEditor from '@/containers/shared/TextEditor'
import './AddUserWord.less'

@connect(state => ({ query: state.location.query }), dispatch => (bindActionCreators( {
    putKeyword
}, dispatch )))
export default class AddUserWord extends React.Component {
    state = {
        limit: this.props.limit || 200,
        isMandate: this.props.isMandate || true
    }
    onSubmit = ( ) => {
        let words = this.refs.editor.getTextArr( );
        if ( !words.length ) {
            this.props.onClose( );
            return;
        }
        let base = pick(this.props.query, [ 'campaignId', 'adgroupId' ])
        if ( !this.state.isMandate ) {
            // 手动宝贝
            base.mobileIsDefaultPrice = 0
        }
        let commitObj = words.map(word => {
            return {
                ...base,
                word
            }
        })
        this.props.putKeyword( commitObj, words );
        this.props.onClose( );
    }
    onTextChange = ( i ) => {
        let n = this.state.limit - i;
        if (n < 0 || isNaN( n )) {
            n = 0;
        }
        return `剩余${ n }个词`
    }
    render( ) {
        const { limit } = this.state;
        return (
            <Layout className="float-panel add-user-word">
                <TextEditor placeholder="每行输入一个词，Enter(回车)键换行" limit={limit} ref="editor" className="editor" hint={this.onTextChange}/>
                <div className="footer">
                    <Button type="primary" onClick={this.onSubmit}>确定</Button>
                    <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                </div>
            </Layout>
        )
    }
}
