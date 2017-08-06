import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import {
    Radio,
    Tabs,
    Button,
    Table,
    Tooltip,
    Dropdown,
    Layout
} from 'antd';
import { connect } from 'react-redux'
import KeywordFilter from './KeywordFilter'
import Icon from '../../shared/Icon'
import { fetchKeywordList, keywordTableChange } from './KeywordListRedux'
import { formatNum } from '@/utils/tools'
import { grabRankStatusMap } from '@/utils/constants'
import './KeywordList.less'

const { Column, ColumnGroup } = Table;
const rowSelection = {
    onChange: ( selectedRowKeys, selectedRows ) => {
        console.log( `selectedRowKeys: ${ selectedRowKeys }`, 'selectedRows: ', selectedRows );
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User'
    })
};

@connect(state => ({ user: state.user, campaign: state.campaign, keyword: state.keyword.keywordList, view: state.keyword.keywordView }), dispatch => (bindActionCreators( {
    keywordTableChange,
    fetchKeywordList
}, dispatch )))
export default class KeywordList extends React.Component {
    componentWillMount( ) {
        this.props.fetchKeywordList( );
    }
    // 关键词后面的下拉按钮组
    getExtraBtnGroup({ optimizeStatus, isFocusKeyword }) {
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
        const { mobileDiscount } = this.props.keyword.adgroup
        let cols = [
            {
                title: '关键词',
                dataIndex: 'word',
                width: 300,
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
                render: price => {
                    const obj = formatNum(price, { mode: 'price' })
                    return (
                        <span>
                            {obj.text}
                            <span>元</span>
                            <span className="table-edit-icon">
                                <Icon type="xiugaibi" className="show-on-row-hover"/>
                            </span>
                        </span>
                    )
                }
            }, {
                title: '移动出价',
                dataIndex: 'maxMobilePrice',
                width: 110,
                render: ( price, record ) => {
                    if ( record.mobileIsDefaultPrice ) {
                        price = record.maxPrice * mobileDiscount / 100
                    }
                    const obj = formatNum(price, { mode: 'price' });
                    return (
                        <span>
                            {obj.text}
                            元
                            <span className="table-edit-icon">
                                <Icon type="xiugaibi" className="show-on-row-hover"/>
                            </span>
                        </span>
                    )
                }
            }, {
                title: '抢排名',
                dataIndex: '',
                render: ( text, record ) => {
                    let { pc, pcAuto } = record.grab
                    if ( pcAuto == -1 ) {
                        pc = -1
                    }
                    if ( pcAuto == 0 && pc != 9 ) {
                        pc = 11
                    }
                    const status = grabRankStatusMap[pc];
                    return (
                        <span>
                            {pcAuto != -1 && (
                                <Tooltip title="抢排名词管理" arrowPointAtCenter>
                                    <Icon type="qiangpaiming"/>
                                </Tooltip>
                            )}
                            {status.type == 'btn' && (
                                <Button size="small">{status.title}</Button>
                            )}
                            {status.type == 'link' && (
                                <a href="#">{status.title}</a>
                            )}
                        </span>
                    )
                }
            }, {
                title: '实时排名',
                dataIndex: '',
                sorter: ( a, b ) => a.age - b.age,
                sortOrder: sorter.columnKey === 'age' && sorter.order
            }, {
                title: 'PC质量分',
                dataIndex: '',
                sorter: ( a, b ) => a.age - b.age,
                sortOrder: sorter.columnKey === 'age' && sorter.order
            }, {
                title: '移动质量分',
                dataIndex: '',
                sorter: ( a, b ) => a.age - b.age,
                sortOrder: sorter.columnKey === 'age' && sorter.order
            }
        ];
        cols.push({
            title: '优化方式',
            render: val => {}
        });
        return cols;
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
        return (
            <div className="keyword-list">
                <div>
                    <Radio.Group className="keyword-list-type">
                        <Radio.Button value="a">
                            <Icon type="biaogefenlie"/>
                        </Radio.Button>
                        <Radio.Button value="c">
                            <Icon type="biaogeshouqi"/>
                        </Radio.Button>
                    </Radio.Group>
                    <Button>智能淘词</Button>
                    <Button >
                        指定加词
                    </Button>
                    <Button>细分数据</Button>
                    <KeywordFilter onSetFilter/>
                </div>
                <Table
                    size="middle"
                    className="table-row-hover"
                    dataSource={this.getTableData( )}
                    rowSelection={rowSelection}
                    columns={this.getTableCols( )}
                    pagination={false}
                    onChange={this.props.keywordTableChange}></Table>
            </div>
        )
    }
}
