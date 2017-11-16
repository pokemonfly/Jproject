import React from 'react';
import { Alert, Button, Tabs, Modal } from 'antd'
import { pick, uniq, isEqual } from 'lodash'
import Icon from '@/containers/shared/Icon';
import { Dialog } from '@/containers/shared/Dialog';
import TextEditor from '@/containers/shared/TextEditor'
import TagBox from '@/containers/shared/TagBox'
import { counter, notify } from '@/utils/tools'
import { fetchBlackword, postBlackword, delNeverword } from './KeywordHeadRedux'
import './EditBlacklist.less'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
const Confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

@Dialog({ title: '黑名单列表', width: 800, hasForm: false, hasConnect: true })
@connect(state => ({ query: state.location.query, blacklist: state.keyword.keywordHead.blacklist, neverlist: state.keyword.keywordHead.neverlist }), dispatch => (bindActionCreators( {
    fetchBlackword,
    postBlackword,
    delNeverword
}, dispatch )), null, { withRef: true })
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
    okCallback( closeHandler ) {
        const { tabKey, blacklist, neverlist } = this.state;
        let blackChange = !isEqual( blacklist, this.props.blacklist ),
            neverChange = !isEqual( neverlist, this.props.neverlist ),
            fn = ( ) => {
                let fn = counter(+ blackChange + + neverChange, ( ) => {
                    notify( '设置成功' )
                })
                blackChange && this.commitBlack( fn )
                neverChange && this.commitNever( fn )
                closeHandler( );
            };

        if ( tabKey == '1' && neverChange ) {
            // 当前是黑名单tab
            Confirm({
                title: '不再投放词有改动，是否更新',
                onOk: fn,
                onCancel( ) {
                    neverChange = false;
                    fn( )
                }
            })
        } else if ( tabKey == '2' && blackChange ) {
            Confirm({
                title: '黑名单有改动，是否更新',
                onOk: fn,
                onCancel( ) {
                    blackChange = false;
                    fn( )
                }
            })
        } else {
            fn( )
        }
    }
    commitBlack( fn ) {
        let base = pick(this.props.query, [ 'campaignId', 'adgroupId' ]),
            list = this.state.blacklist,
            commitObj;
        if ( !list.length ) {
            list = [ '' ]
        }
        commitObj = list.map(word => {
            return {
                ...base,
                word
            }
        })
        this.props.postBlackword( commitObj, fn )
        // autoKeyword-update-data
    }
    commitNever( fn ) {
        let commitObj = {
            ...pick(this.props.query, [ 'campaignId', 'adgroupId' ]),
            matchPattern: 0,
            word: this.props.neverlist
        }
        this.props.delNeverword( commitObj, fn )
    }
    onTabChange = ( key ) => {
        this.state.tabKey = key;
    }
    onRemoveItems = ( removedTag ) => {
        const blacklist = this.state.blacklist.filter( tag => tag != removedTag );
        this.setState({ blacklist });
    }
    onRemoveNeverItems = ( removedTag ) => {
        const neverlist = this.state.neverlist.filter( tag => tag != removedTag );
        this.setState({ neverlist });
    }
    removeAllNever = ( ) => {
        Confirm({
            title: '清空不再投放词',
            content: '确定要清空不再投放词吗？',
            onOk: ( ) => {
                this.setState({neverlist: [ ]})
            }
        })
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
        const { blacklist, neverlist } = this.state
        const { isSp } = this.props
        const hint = isSp ? (
            <span>设置为黑名单的关键词与包含该黑名单词的关键词将不再投放，已投放的符合上述条件的关键词也将在下一次优化时被删除。<br/>
                例如添加：“红色”、“雪纺”为黑名单词，那么系统会自动删除包含“红色”、“雪纺”的所有词，<br/>
                如“红色礼服连衣裙”、“结婚红色连衣裙”、“雪纺白色连衣裙”、“中长款雪纺连衣裙”、“雪纺长袖夏款”等</span>
        ) : '手动宝贝设置的黑名单词，只会在您手动加词的时候提示哪些词命中了黑名单，您可以选择保留或者一键删除'
        return (
            <Tabs defaultActiveKey="1" className="edit-blacklist" onChange={this.onTabChange}>
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
