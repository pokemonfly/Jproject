import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Alert, Button, Modal, Checkbox } from 'antd'
import { pick, uniq, isEqual } from 'lodash'
import Icon from '@/containers/shared/Icon';
import { Dialog } from '@/containers/shared/Dialog';
import TextEditor from '@/containers/shared/TextEditor'
import TagBox from '@/containers/shared/TagBox'
import './EditSellwords.less'
import { fetchSellwords, putSellwords } from './KeywordHeadRedux'

@Dialog({ title: '卖点词列表', width: 800, hasForm: false, hasConnect: true })
@connect(state => ({ query: state.location.query, sellwordsList: state.keyword.keywordHead.sellwordsList, onlyGenerate: state.keyword.keywordHead.onlyGenerate }), dispatch => (bindActionCreators( {
    fetchSellwords,
    putSellwords
}, dispatch )), null, { withRef: true })
export default class EditSellwords extends React.Component {
    state = {
        ...this.props.query,
        onlyGenerate: this.props.onlyGenerate,
        sellwordsList: this.props.sellwordsList
    }
    componentWillMount( ) {
        this.props.fetchSellwords( this.state );
    }
    componentWillReceiveProps( nextProps ) {
        const { sellwordsList, onlyGenerate } = nextProps;
        this.setState({ sellwordsList, onlyGenerate })
    }
    okCallback( closeHandler ) {
        let { sellwordsList, onlyGenerate } = this.state;
        let commitObj = {
            campaignId: this.props.query.campaignId,
            adgroupId: [this.props.query.adgroupId],
            isOverWrite: true,
            scope: 2,
            word: sellwordsList,
            onlyGenerateExtend: onlyGenerate
        };
        this.props.putSellwords( commitObj )
    }
    onChange = ( e ) => {
        this.setState({ onlyGenerate: e.target.checked })
    }
    onRemoveItems = ( removedTag ) => {
        const sellwordsList = this.state.sellwordsList.filter( tag => tag != removedTag );
        this.setState({ sellwordsList });
    }
    addWord = ( ) => {
        const editor = this.refs.editor;
        let arr = editor.getTextArr( ),
            sellwordsList = this.state.sellwordsList;
        sellwordsList = uniq(sellwordsList.concat( arr ));
        this.setState({ sellwordsList });
        editor.clear( )
    }
    render( ) {
        const { sellwordsList, onlyGenerate } = this.state
        const { isSp } = this.props;
        const hint = (
            <span>
                系统会根据您设置的关键词进行扩展，为宝贝投放更多相关的关键词。建议您添加3-5个卖点词。<br/>
                如：为宝贝“墨兰普斯 5859新款短靴真皮情侣雪地靴 秋冬保暖女雪地靴子女鞋包邮”添加卖点词“超强保暖”，那么 与该宝贝相关的包含“超强保暖”的关键词，<br/>
                如“超强保暖雪地靴”、“超强保暖情侣靴”等将会被投放。<br/>
                注:具体以实际投放为准。
                <a href="http://bangpai.taobao.com/group/thread/15370204-288703262.htm?spm=0.0.0.0.hrq4EH" target="_blank">更详细了解请点击</a>
            </span>
        );
        return (
            <div className="edit-sellwords">
                <Alert message={hint} showIcon type="warning"/>
                <div className="chk-row">
                    <Checkbox checked={onlyGenerate} onChange={this.onChange}>仅添加完全包含卖点词的词</Checkbox>
                    <span className="str">
                        ※ 在以后的日常优化中仅会加入完全包含卖点词的词
                    </span>
                </div>
                <div className="content">
                    <TextEditor placeholder="每行输入一个词，Enter(回车)键换行" ref="editor" className="editor"/>
                    <Button onClick={this.addWord} className="add-btn">
                        <Icon type="xiangyoujiantou"/>
                    </Button>
                    <TagBox hint ={i => `已添加${ i }个词`} close={this.onRemoveItems} items={sellwordsList} className="tag-list"/>
                </div>
            </div>
        )
    }
}
