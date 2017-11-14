import React from 'react';
import { Alert, Button, Tabs } from 'antd'
import { pick, uniq } from 'lodash'
import Icon from '@/containers/shared/Icon';
import { Dialog } from '@/containers/shared/Dialog';
import TextEditor from '@/containers/shared/TextEditor'
import TagBox from '@/containers/shared/TagBox'
import { fetchBlackword } from './KeywordHeadRedux'
import './EditBlacklist.less'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

const TabPane = Tabs.TabPane;

@Dialog({ title: '黑名单列表', width: 800, hasForm: false, sid: "EditBlacklist" })
@connect(state => ({ query: state.location.query, blacklist: state.keyword.keywordHead.blacklist, neverlist: state.keyword.keywordHead.neverlist }), dispatch => (bindActionCreators( {
    fetchBlackword
}, dispatch )))
export default class EditBlacklist extends React.Component {
    state = {
        ...this.props.query,
        blacklist: this.props.blacklist,
        neverlist: this.props.neverlist
    }
    componentWillMount( ) {
        this.props.fetchBlackword( this.state );
        // 不再投放词
        this.props.fetchBlackword({
            ...this.state,
            matchPattern: 0
        });
    }
    componentWillReceiveProps( nextProps ) {
        const { blacklist, neverlist } = nextProps;
        this.setState({ blacklist, neverlist })
    }
    okCallback( closeHandler ) {}
    onChangeCommit = ( ) => {}
    onRemoveItems = ( removedTag ) => {
        const blacklist = this.state.blacklist.filter( tag => tag != removedTag );
        this.setState({ blacklist });
    }
    onRemoveNeverItems = ( removedTag ) => {
        const neverlist = this.state.neverlist.filter( tag => tag != removedTag );
        this.setState({ neverlist });
    }
    removeAllNever = ( ) => {
        this.setState({neverlist: [ ]})
    }
    addWord = ( ) => {
        const editor = this.refs.editor;
        let arr = editor.getTextArr( ),
            blacklist = this.state.blacklist;
        blacklist = uniq(blacklist.concat( arr ));
        this.setState({ blacklist });
        editor.clear( )
    }
    render( ) {
        const { visible, blacklist, neverlist } = this.state
        const { wordLimit, isSp } = this.props
        const hint = isSp ? (
            <span>设置为黑名单的关键词与包含该黑名单词的关键词将不再投放，已投放的符合上述条件的关键词也将在下一次优化时被删除。<br/>
                例如添加：“红色”、“雪纺”为黑名单词，那么系统会自动删除包含“红色”、“雪纺”的所有词，<br/>
                如“红色礼服连衣裙”、“结婚红色连衣裙”、“雪纺白色连衣裙”、“中长款雪纺连衣裙”、“雪纺长袖夏款”等</span>
        ) : '手动宝贝设置的黑名单词，只会在您手动加词的时候提示哪些词命中了黑名单，您可以选择保留或者一键删除'
        return (
            <Tabs defaultActiveKey="1" className="edit-blacklist">
                <TabPane tab="黑名单" key="1">
                    <Alert message={hint} showIcon type="warning"/>
                    <div className="content-1">
                        <TextEditor placeholder="每行输入一个词，Enter(回车)键换行" ref="editor" className="editor"/>
                        <Button onClick={this.addWord} className="add-btn">
                            <Icon type="xiangyoujiantou"/>
                        </Button>
                        <TagBox hint ={i => `已添加${ i }个词`} close={this.onRemoveItems} items={blacklist} className="tag-list"/>
                    </div>
                </TabPane>
                <TabPane tab="不再投放词" key="2">
                    <Alert message="不再投放词表示该关键词将不会在以后的优化中再被加入" showIcon type="warning"/>
                    <div className="content-2">
                        <Button onClick={this.removeAllNever} className="clear-btn">清空不再投放词</Button>
                        <TagBox hint ={i => `已添加${ i }个词`} close={this.onRemoveNeverItems} items={neverlist} className="tag-list"/>
                    </div>
                </TabPane>
            </Tabs>
        )
    }
}
