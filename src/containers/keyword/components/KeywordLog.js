import React, { PropTypes } from 'react';
import {
    Checkbox,
    Button,
    Layout,
    Select,
    Icon as IconAntd,
    Pagination
} from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { pick, omitBy } from 'lodash'
import Icon from '../../shared/Icon'
import { fetchKeywordLog, fetchKeywordLogDetail } from './LogRedux'
import Table from '@/containers/shared/Table'
import LogTextDialog from '@/containers/shared/LogDialog';
import LogDetail from './LogDetail';
import './KeywordLog.less'

const { Option } = Select;
// TODO csMode.change
@connect(state => ({ query: state.location.query, log: state.keyword.log, user: state.user }), dispatch => (bindActionCreators( {
    fetchKeywordLog,
    fetchKeywordLogDetail
}, dispatch )))
export default class KeywordLog extends React.Component {
    state = {
        isCsMode: false,
        isHuman: false,
        pageNo: 1,
        logType: -1,
        logDateType: 1,
        operationType: -1,
        displayGrabRankLog: false
    }
    componentWillMount( ) {
        this.query( )
    }
    onPageChange = ( pageNo ) => {
        this.state.pageNo = pageNo;
        this.query( )
    }
    getTableCols( ) {
        const { user } = this.props
        return [
            {
                title: (
                    <Select defaultValue="-1" onChange={this.setFilter.bind( this, 'logType' )}>
                        <Option value='-1'>日志类型</Option>
                        <Option value='1'>系统优化</Option>
                        <Option value='2'>用户操作</Option>
                    </Select>
                ),
                width: 110,
                dataIndex: 'logTypeStr'
            }, {
                title: (
                    <Select defaultValue="1" onChange={this.setFilter.bind( this, 'logDateType' )}>
                        <Option value='0'>最近7天</Option>
                        <Option value='1'>最近30天</Option>
                        {this.state.isCsMode && (
                            <Option value='2'>最近90天</Option>
                        )}
                    </Select>
                ),
                width: 165,
                dataIndex: 'operationDate'
            }, {
                title: (
                    <Select defaultValue="-1" onChange={this.setFilter.bind( this, 'operationType' )} className="select">
                        <Option value='-1'>操作类型</Option>
                        <Option value='0'>加词</Option>
                        <Option value='1'>删词</Option>
                        <Option value='2'>PC降价</Option>
                        <Option value='3'>PC加价</Option>
                        <Option value='4'>无线降价</Option>
                        <Option value='5'>无线加价</Option>
                        <Option value='6'>修改匹配方式</Option>
                        <Option value='7'>推广设置</Option>
                        <Option value='8'>托管设置</Option>
                        <Option value='9'>人工干预</Option>
                        <Option value='10'>搜索人群优化</Option>
                    </Select>
                ),
                width: 120,
                dataIndex: 'operationType'
            }, {
                title: (
                    <span>
                        <span className="mgr">操作日志</span>
                        <Checkbox onChange={this.setFilter.bind( this, 'displayGrabRankLog' )}>
                            显示抢排名日志
                        </Checkbox>
                    </span>
                ),
                grow: true,
                dataIndex: 'content',
                render: ( text, record ) => {
                    return <span onClick={this.onClickContent} dangerouslySetInnerHTML={{
                        __html: text
                    }}></span>
                }
            }, {
                title: (
                    <Select defaultValue="-1" onChange={this.setFilter.bind( this, 'operator' )} className="select">
                        <Option value='-1'>操作人</Option>
                        <Option value={user.userNick}>{user.userNick || '-'}</Option>
                        <Option value='系统'>{this.state.isHuman ? '快车人机' : '系统'}</Option>
                    </Select>
                ),
                width: 135,
                dataIndex: 'operator'
            }
        ]
    }
    onClickContent = ( e ) => {
        const node = e.target;
        if ( node.getAttribute( 'data-tableedit' ) == 'detailLogs' ) {
            const content = node.getAttribute( 'content' );
            if ( content ) {
                // 只有一句HTML的弹窗
                LogTextDialog({ content })
                return;
            }
            const logid = node.getAttribute( 'logid' );
            // 兼容旧版的Dom
            const { taskId, operationType, logTypeStr, operationDate, operator } = this.props.log.logMap[logid] || {};
            this.refs.logDetail.setStatus({
                taskId,
                operation: operationType,
                logTypeStr,
                operationDate,
                operationType,
                operator
            }).show( );
        }
    }
    setFilter( key, e ) {
        let value = e.target ? e.target.checked : e
        this.setState({
            [ key ]: value,
            pageNo: 1
        }, ( ) => {
            this.query( )
        })
    }
    getTableData( ) {
        const { logs, logMap } = this.props.log;
        if ( logs ) {
            return logs.map(id => logMap[id]);
        }
        return [ ];
    }
    query( ) {
        let obj = omitBy(this.state, v => {
            return v == -1
        });
        this.props.fetchKeywordLog({
            ...this.props.query,
            ...obj,
            mode: + this.state.isCsMode // cs-mode  :1
        });
    }
    render( ) {
        const { recordCount, pageNo, pageSize } = this.props.log;
        const data = this.getTableData( );
        return (
            <Layout className="keyword-log">
                <Table
                    ref={( table ) => {
                    this.table = table;
                }}
                    dataSource={data}
                    columns={this.getTableCols( )}
                    ignoreProps={[ 'columns' ]}></Table>
                {!!data.length && (
                    <div className="page-container">
                        <Pagination defaultCurrent={pageNo} total={recordCount} onChange={this.onPageChange} defaultPageSize={pageSize}/>
                    </div>
                )}
                <LogDetail ref='logDetail'/>
            </Layout>
        )
    }
}
