import React, { PropTypes } from 'react';
import Trigger from '@/containers/shared/Trigger';
import Table from '@/containers/shared/Table'
import { bindActionCreators } from 'redux';
import {
    Radio,
    Tabs,
    Button,
    Tooltip,
    Dropdown,
    Layout,
    Icon as IconAntd,
    Affix,
    notification
} from 'antd';
import { connect } from 'react-redux'
import KeywordFilter from './KeywordFilter'
import Icon from '../../shared/Icon'
import { fetchKeywordList, keywordTableChange } from './KeywordListRedux'
import { formatNum } from '@/utils/tools'
import { grabRankStatusPcMap, grabRankStatusMobileMap, keywordReports } from '@/utils/constants'
import EditWordPrice from './EditWordPrice'
import ClipboardButton from 'react-clipboard.js';
import DelKeyword from './DelKeyword'
import EditMultiWordPrice from './EditMultiWordPrice'
import './KeywordList.less'

const { Column, ColumnGroup } = Table;

@connect(state => ({ user: state.user, campaign: state.campaign, keyword: state.keyword.keywordList, view: state.keyword.keywordView }), dispatch => (bindActionCreators( {
    keywordTableChange,
    fetchKeywordList
}, dispatch )))
export default class KeywordList extends React.Component {
    state = {
        selectedRowKeys: [ ]
    }
    componentWillMount( ) {
        this.props.fetchKeywordList( );
    }
    onCheckboxChange = ( selectedRowKeys, rows ) => {
        this.setState({ selectedRowKeys })
    }
    getWordForCopy = ( ) => {
        const { selectedRowKeys } = this.state;
        const { keywordMap } = this.props.keyword;
        if ( selectedRowKeys.length ) {
            return selectedRowKeys.map( id => keywordMap[id].word ).join( '\n' )
        } else {
            notification['error']({ message: '请选择要复制的关键词' });
            return null;
        }
    }
    onCopySuccess = ( ) => {
        notification['success']({ message: '复制成功' });
    }

    // 关键词后面的下拉按钮组
    getExtraBtnGroup({ optimizeStatus, isFocusKeyword }) {
        return (
            <span></span>
        )
        return (
            <span className="keyword-extra-btn-dropdown show-on-row-hover">
                <Dropdown.Button
                    size="small"
                    onClick={null}
                    overlay={(
                    <Layout className="keyword-extra-btn-group">
                        <Tooltip title="修改匹配方式" arrowPointAtCenter>
                            <Icon type="jingzhundingwei"/>
                        </Tooltip>
                        <Tooltip
                            title={optimizeStatus
                            ? '黑名单'
                            : '该词优化方式为只优化价格，黑名单功能不可用'}
                            arrowPointAtCenter>
                            <Icon type="shanchuheimingdan"/>
                        </Tooltip>
                        <Tooltip title="删除关键词" arrowPointAtCenter>
                            <Icon type="shanchu"/>
                        </Tooltip>
                        <Tooltip title="历史趋势" arrowPointAtCenter>
                            <Icon type="qushi"/>
                        </Tooltip>
                        <Tooltip title="重点关注" arrowPointAtCenter>
                            <Icon type={isFocusKeyword
                                ? "nofocus"
                                : 'guanzhu'}/>
                        </Tooltip>
                    </Layout>
                )}>
                    <Icon type="shujutongji" size="small"/>
                </Dropdown.Button>
            </span>
        )
    }
    getTableCols( ) {
        const { sorter } = this.props.keyword
        const { reportSort } = this.props.view;
        const { mobileDiscount } = this.props.keyword.adgroup
        let cols = [
            {
                title: '关键词',
                dataIndex: 'word',
                width: 300,
                fixed: 'left',
                render: ( text, record ) => {
                    if ( record.matchScope == 1 ) {
                        text = '[ ' + text + ' ]'
                    }
                    return <span>
                        <a href="#">
                            {record.wordscorelist && record.wordscorelist.wirelessQscore >= 6 && ( <Icon type="wuxian"/> )}
                            {record.wordscorelist && record.wordscorelist.wirelessQscore >= 6 && (
                                <Tooltip title="有机会在淘宝网电脑版搜索结果首页左侧推广位置展示（每天定时更新）" arrowPointAtCenter>
                                    <Icon type="zuo01"/>
                                </Tooltip>
                            )}
                            {record.isFocusKeyword && ( <Icon type="star"/> )}
                            <span>{text}</span>
                        </a>
                        {this.getExtraBtnGroup( record )}
                    </span>
                }
            }, {
                title: 'PC出价',
                dataIndex: 'maxPrice',
                width: 110,
                fixed: 'left',
                render: price => {
                    const obj = formatNum(price, { mode: 'price' })
                    return (
                        <span>
                            {obj.text}
                            <span>元</span>
                            <Trigger popup={( <EditWordPrice mode='pc'/> )}>
                                <span className="table-edit-icon">
                                    <Icon type="xiugaibi" className="show-on-row-hover"/>
                                </span>
                            </Trigger>
                        </span>
                    )
                }
            }, {
                title: '移动出价',
                dataIndex: 'maxMobilePrice',
                width: 110,
                fixed: 'left',
                render: ( price, record ) => {
                    if ( record.mobileIsDefaultPrice ) {
                        price = record.maxPrice * mobileDiscount / 100
                    }
                    const obj = formatNum(price, { mode: 'price' });
                    return (
                        <span>
                            {obj.text}
                            元
                            <Trigger popup={( <EditWordPrice mode='mobile'/> )}>
                                <span className="table-edit-icon">
                                    <Icon type="xiugaibi" className="show-on-row-hover"/>
                                </span>
                            </Trigger>
                        </span>
                    )
                }
            }, {
                title: '实时排名',
                dataIndex: 'rank',
                width: 90,
                fixed: 'left',
                render: ( text ) => {
                    if ( text ) {
                        return (
                            <span>{text}</span>
                        )
                    } else {
                        return (
                            <a href="#">查排名</a>
                        )
                    }
                }
            }, {
                title: '抢排名',
                dataIndex: 'grabPc',
                colSpan: 2,
                width: 60,
                render: ( text, record ) => {
                    let { pc, pcAuto } = record.grab
                    if ( pcAuto == -1 ) {
                        pc = -1
                    }
                    if ( pcAuto == 0 && pc != 9 ) {
                        pc = 11
                    }
                    const pcStatus = grabRankStatusPcMap[pc];
                    return (
                        <span>
                            {pcAuto != -1 && (
                                <Tooltip title="抢排名词管理" arrowPointAtCenter>
                                    <Icon type="qiangpaiming"/>
                                </Tooltip>
                            )}
                            <a href="#">{pcStatus.title}</a>
                        </span>
                    )
                }
            }, {
                title: '抢排名',
                dataIndex: 'grabMobile',
                colSpan: 0,
                width: 60,
                render: ( text, record ) => {
                    let { mobile, mobileAuto } = record.grab
                    if ( mobileAuto == -1 ) {
                        mobile = -1
                    }
                    if ( mobileAuto == 0 && mobile != 9 ) {
                        mobile = 11
                    }
                    const mobileStatus = grabRankStatusMobileMap[mobile];
                    return (
                        <span>
                            {mobileAuto != -1 && (
                                <Tooltip title="抢排名词管理" arrowPointAtCenter>
                                    <Icon type="qiangpaiming"/>
                                </Tooltip>
                            )}
                            <a href="#">{mobileStatus.title}</a>
                        </span>
                    )
                }

            }, {
                title: 'PC质量分',
                dataIndex: 'wordscorelist.qscore',
                width: 90,
                sorter: ( a, b ) => ( a.wordscorelist.qscore - b.wordscorelist.qscore ),
                sortOrder: sorter.columnKey == 'wordscorelist.qscore' && sorter.order,
                render: ( text ) => {
                    return this.formatQscore( text )
                }
            }, {
                title: '移动质量分',
                dataIndex: 'wordscorelist.wirelessQscore',
                width: 90,
                sorter: ( a, b ) => ( a.wordscorelist.wirelessQscore - b.wordscorelist.wirelessQscore ),
                sortOrder: sorter.columnKey === 'wordscorelist.wirelessQscore' && sorter.order
            }
        ];
        reportSort.forEach(key => {
            cols.push({
                title: keywordReports[key].name,
                dataIndex: 'report.' + key,
                width: 80
            })
        })

        cols.push({
            title: '优化方式',
            key: 'opType',
            width: 110,
            fixed: 'right',
            render: val => {}
        });
        return cols;
    }
    formatQscore( score ) {
        if ( score > 0 ) {
            return (
                <span>{score}</span>
            )
        } else if ( score < 0 && score > -4 ) {
            return (
                <span>未投放</span>
            )
        } else if ( score == 0 ) {
            return (
                <span>-</span>
            )
        } else {
            return (
                <span>
                    <span>?</span>
                    <Tooltip title="淘宝接口异常，请稍候重试" arrowPointAtCenter>
                        <Icon type="warning"/>
                    </Tooltip>
                </span>
            )
        }
    }
    getTableData( ) {
        const { keywords, keywordMap } = this.props.keyword;
        const { filters } = this.props.view;
        let arr = [ ]
        if ( keywords ) {
            arr = keywords.map(id => keywordMap[id])
            if ( filters ) {
                for ( let f in filters ) {
                    let o = filters[f];
                    arr = arr.filter(o.fn.bind( null, o.type, o.key ))
                }
            }
        }
        return arr
    }
    render( ) {
        const { selectedRowKeys } = this.state
        const modeSw = (
            <Radio.Group className="keyword-list-type">
                <Radio.Button value="a" className="btn">
                    <Icon type="biaogefenlie"/>
                </Radio.Button>
                <Radio.Button value="c" className="btn">
                    <Icon type="biaogeshouqi"/>
                </Radio.Button>
            </Radio.Group>
        )
        const rowSelection = {
            onChange: this.onCheckboxChange
        };
        return (
            <div className="keyword-list">
                {selectedRowKeys.length == 0
                    ? (
                        <div className="control-row">
                            {modeSw}
                            <Button type="primary">智能淘词</Button>
                            <Button type="primary">指定加词</Button>
                            <Button>细分数据</Button>
                            <KeywordFilter onSetFilter/>
                        </div>
                    )
                    : (
                        <div className="control-row">
                            {modeSw}
                            <EditMultiWordPrice selectedRowKeys={selectedRowKeys} keywordMap={this.props.keyword.keywordMap}></EditMultiWordPrice>
                            <DelKeyword selectedRowKeys={selectedRowKeys} keywordMap={this.props.keyword.keywordMap}>
                                <Button type="primary">删除关键词</Button>
                            </DelKeyword>
                            <Button type="primary">修改匹配方式</Button>
                            <Button type="primary">抢排名</Button>
                            <Button type="primary">查排名</Button>
                            <ClipboardButton option-text={this.getWordForCopy} className="ant-btn" onSuccess={this.onCopySuccess}>复制关键词</ClipboardButton>
                            <Button>重点关注词</Button>
                            <Button>修改优化方式</Button>
                            <Button>切换细分数据</Button>
                            <div className="filter-sw">
                                <Button type="primary">
                                    关键词筛选
                                    <IconAntd type="down"/>
                                </Button>
                            </div>
                        </div>
                    )}
                <Table
                    dataSource={this.getTableData( )}
                    columns={this.getTableCols( )}
                    extraHeadHeight={50}
                    extraHead={(
                    <div
                        style={{
                        height: 50,
                        marginTop: -50,
                        background: 'gray'
                    }}>~~~~</div>
                )}/>
            </div>
        )
    }
}

/*

<Table
    size="middle"
    className="table-row-hover"
    dataSource={this.getTableData( )}
    rowSelection={rowSelection}
    columns={this.getTableCols( )}
    pagination={false}
    onChange={this.props.keywordTableChange}></Table>

*/
