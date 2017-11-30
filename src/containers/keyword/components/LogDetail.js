import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Button, Table, Pagination } from 'antd'
import ClipboardButton from 'react-clipboard.js';
import Search from '@/containers/shared/Search'
import { Dialog } from '@/containers/shared/Dialog';
import { notify } from '@/utils/tools'
import { isEqual, pick } from 'lodash';
import { fetchKeywordDetailLog } from './LogRedux';
import LogTextDialog from '@/containers/shared/LogDialog';
import './LogDetail.less'

@Dialog( { title: '详细日志', width: 800, hasForm: false, hasConnect: true, noFooter: true } )
@connect( state => ( { query: state.location.query, log: state.keyword.log } ), dispatch => ( bindActionCreators( {
    fetchKeywordDetailLog
}, dispatch ) ), null, { withRef: true } )
export default class LogDetail extends React.Component {
    state = {
        query: {},
        search: null,
        isCsMode: false,
        scroll: {
            y: 240
        },
        pagination: {
            pageSize: 20
        }
    }
    componentDidMount() {
        this.query( this.props );
    }
    componentWillReceiveProps( nextProps ) {
        if ( nextProps.log.isFetching ) {
            return;
        }
        this.query( nextProps );
    }
    query( nextProps ) {
        const newQuery = {
            ...pick( nextProps.query, [ 'campaignId', 'adgroupId' ] ),
            ...pick( nextProps, [ 'operation', 'taskId' ] )
        }
        if ( !isEqual( newQuery, this.state.query ) ) {
            this.state.query = newQuery;
            this.state.search = null;
            this.refs.search && this.refs.search.clear();
            this.props.fetchKeywordDetailLog( this.state.query );
        }
    }
    onSearch = ( text ) => {
        this.setState( {
            search: text || null
        } )
    }
    columns = [
        {
            title: '关键词',
            dataIndex: 'keyword',
            width: 100
        }, {
            title: '操作内容',
            dataIndex: 'operationType',
            width: 130
        }, {
            title: '明细',
            dataIndex: 'reason',
            render: ( text, record, index ) => {
                return ( <span>
                    <span dangerouslySetInnerHTML={{
                            __html: text
                        }}></span>
                    {record.reasonDetails && this.state.isCsMode && ( <a href="javascript:void(0)" onClick={this.showPop.bind( this, record.reasonDetails )} className="reason-more">更多</a> )}
                </span> )
            }
        }
    ];
    showPop( content ) {
        LogTextDialog( { content } )
    }
    onCopySuccess = () => {
        notify( '复制成功' );
    }
    getWordForCopy = () => {
        return this.props.log.logDetail.map( i => i.keyword ).join( '\n' )
    }
    getData() {
        const { log } = this.props;
        const { search } = this.state;
        if ( log.isFetching ) {
            return []
        } else {
            if ( search ) {
                return log.logDetail.filter( obj => {
                    return obj.keyword.includes( search )
                } )
            }
            return log.logDetail;
        }
    }
    render() {
        const data = this.getData();
        const { logTypeStr, operationDate, operationType, operator } = this.props
        return ( <div className="log-detail">
            <div className="row">
                <span>日志类型：</span>
                <span>{logTypeStr}</span>
                <span className="mgl">操作日期：</span>
                <span>{operationDate}</span>
                <span className="mgl">操作类型：</span>
                <span>{operationType}</span>
                <span className="mgl">操作者：</span>
                <span>{operator}</span>
            </div>
            <div className="row">
                <Search placeholder="搜索关键词" onSearch={this.onSearch} ref="search"/>
                <ClipboardButton option-text={this.getWordForCopy} className="ant-btn" onSuccess={this.onCopySuccess}>复制关键词</ClipboardButton>
            </div>
            <Table columns={this.columns} dataSource={data} scroll={this.state.scroll} pagination={this.state.pagination}/>
        </div> )
    }
}
