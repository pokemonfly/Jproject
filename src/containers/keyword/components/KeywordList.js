import React, { PropTypes } from 'react';
import Trigger from '@/containers/shared/Trigger';
import Table from '@/containers/shared/Table'
import { bindActionCreators } from 'redux';
import PubSub from 'pubsub-js';
import {
    Radio,
    Menu,
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
import { pick } from 'lodash'
import KeywordFilter from './KeywordFilter'
import Icon from '../../shared/Icon'
import { fetchKeywordList, keywordTableChange, fetchKeywordSeparate, postKeyword } from './KeywordListRedux'
import { formatNum } from '@/utils/tools'
import { grabRankStatusPcMap, grabRankStatusMobileMap, keywordReports } from '@/utils/constants'
import DropdownIconBar from '@/containers/shared/DropdownIconBar'
import EditWordPrice from './EditWordPrice'
import ClipboardButton from 'react-clipboard.js';
import DelKeyword from './DelKeyword'
import EditMatch from './EditMatch'
import EditOptimization from './EditOptimization'
import EditMultiWordPrice from './EditMultiWordPrice'
import KeywordExtraBar from './KeywordExtraBar'
import AddUserWord from './AddUserWord'
import './KeywordList.less'

const { Column, ColumnGroup } = Table;

@connect( state => ( {
    query: state.location.query,
    user: state.user,
    campaign: state.campaign,
    adgroup: state.keyword.adgroup.adgroup,
    keyword: state.keyword.keywordList,
    view: state.keyword.keywordView
} ), dispatch => ( bindActionCreators( {
    fetchKeywordList,
    keywordTableChange,
    fetchKeywordSeparate,
    postKeyword
}, dispatch ) ) )
export default class KeywordList extends React.Component {
    state = {
        isMandate: false,
        isLoading: false,
        detailVisiable: {
            type: 1,
            'c1': 1
        },
        isGroup: true,
        selectedRowKeys: [],
        keywordStatus: {}
    }
    tableConfig = {
        hasCheckbox: true,
        selectionEvent: {
            onChange: ( { selectedRowKeys } ) => {
                this.setState( { selectedRowKeys } )
            },
            onSelect: () => {},
            onSelectAll: () => {}
        },
        groupSetting: [
            {
                title: '有成交',
                filter: function ( e ) {
                    return e.report.payCount > 0;
                }
            }, {
                title: '有收藏或有购物车数据，无成交',
                filter: function ( e ) {
                    return e.report.payCount == 0 && ( e.report.favCount > 0 || e.report.cartTotal > 0 )
                }
            }, {
                title: '有点击，无收藏且无购物车数据',
                filter: function ( e ) {
                    return e.report.click > 0 && e.report.favCount == 0 && e.report.cartTotal == 0 && e.report.payCount == 0
                }
            }, {
                title: '无点击',
                filter: function ( e ) {
                    return e.report.click == 0 && e.report.favCount == 0 && e.report.cartTotal == 0 && e.report.payCount == 0
                }
            }
        ],
        checkDetailVisiable: ( obj, detailStatus ) => {
            const {
                pc,
                mobile,
                inside,
                outside,
                pcInside,
                pcOutside,
                mobileInside,
                mobileOutside
            } = obj
            switch ( detailStatus ) {
                case '1':
                    return [ pc, mobile ]
                case '2':
                    return [ inside, outside ]
                case '3':
                    return [ pcInside, mobileInside, pcOutside, mobileOutside ]
                default:
                    return []
            }
        },
        detailRowRender: ( { columnIndex, dataKey, rowData, rowHeight, width } ) => {
            const _status = rowData.get( '_status' ),
                _row = rowData.get( '_row' ),
                _key = rowData.get( '_key' ),
                rowspan = _status == '3' ? 4 : 2;
            if ( columnIndex == 0 && _row == 0 ) {
                return ( <span
                    className='table-special-panel'
                    style={{
                        height: rowHeight * rowspan - 1,
                        width
                    }}>
                    <Radio.Group onChange={this.onDetailRadioChange.bind( null, _key )} value={_status} className="radio-group">
                        <Radio value="1">PC/无线数据</Radio><br/>
                        <Radio value="2">站内/站外数据</Radio><br/>
                        <Radio value="3">PC/无线/站内/站外数据</Radio>
                    </Radio.Group>
                    {
                        _status == '1' && ( <div className="fake-title">
                            ＰＣ数据
                            <br/>无线数据
                        </div> )
                    }
                    {
                        _status == '2' && ( <div className="fake-title">
                            站内数据<br/>
                            站外数据
                        </div> )
                    }
                    {
                        _status == '3' && ( <div className="fake-title">
                            ＰＣ站内<br/>
                            无线站内<br/>
                            ＰＣ站外<br/>
                            无线站外
                        </div> )
                    }
                </span> )
            } else {
                return null;
            }
        },
        extraHeadHeight: 60,
        extraHead: ( <KeywordExtraBar/> )
    }

    componentWillMount() {
        this.getKeywordData()
        PubSub.subscribe( 'keyword.list.fresh', this.getKeywordData )
    }
    componentWillUnmount() {
        PubSub.unsubscribe( 'keyword.list.fresh' );
    }
    getKeywordData = () => {
        const { query } = this.props
        this.props.fetchKeywordList( query );
        this.props.fetchKeywordSeparate( query );
    }
    componentWillReceiveProps( nextProps ) {
        this.setState( { isLoading: nextProps.keyword.isFetching, isMandate: nextProps.adgroup.isMandate } )
    }
    setTableRef = ( table ) => {
        this.table = table;
    }
    clear = () => {
        this.table.clearCheckbox()
    }
    onDetailRadioChange = ( key, e ) => {
        const { keywordStatus } = this.state;
        keywordStatus[ key ] = {
            ...keywordStatus[key],
            detailStatus: e.target.value
        }
        this.setState( { keywordStatus } )
    }
    getWordForCopy = () => {
        const { selectedRowKeys } = this.state;
        const { keywordMap } = this.props.keyword;
        if ( selectedRowKeys.length ) {
            return selectedRowKeys.map( id => keywordMap[ id ].word ).join( '\n' )
        } else {
            notification[ 'error' ]( { message: '请选择要复制的关键词' } );
            return null;
        }
    }
    onSeparateClick = ( e ) => {
        const { selectedRowKeys, keywordStatus } = this.state
        selectedRowKeys.forEach( i => {
            keywordStatus[ i ] = {
                ...keywordStatus[i],
                detailStatus: e.key
            }
        } )
        this.setState( { keywordStatus } )
    }
    onCopySuccess = () => {
        notification[ 'success' ]( { message: '复制成功' } );
    }
    onChangeGroupMode = ( e ) => {
        this.setState( {
            isGroup: e.target.value == '1'
        } )
    }
    onRowSeparateClick( key ) {
        let { keywordStatus } = this.state
        let obj = keywordStatus[ key ] || {}
        obj = {
            ...obj,
            detailStatus: obj.detailStatus == '3' ? '0': '3'
        }
        keywordStatus[ key ] = obj
        this.setState( { keywordStatus } )
    }
    onRowDeleteClick( key ) {}
    // 关键词后面的下拉按钮组
    getExtraBtnGroup( record ) {
        const optimizeStatus = record.get( 'optimizeStatus' ),
            isFocusKeyword = record.get( 'isFocusKeyword' ),
            key = record.get( 'key' );
        const btnProps = {
            selectedRowKeys: [key],
            keywordMap: this.props.keyword.keywordMap
        }
        return ( <DropdownIconBar
            className="keyword-extra-btn-dropdown show-on-row-hover"
            popProps={btnProps}
            selectedRowKeys={[ '1' ]}
            config={[
                {
                    icon: 'shujutongji',
                    cb: this.onRowSeparateClick.bind( this, key )
                }, {
                    icon: "jingzhundingwei",
                    tooltip: '修改匹配方式'
                }, {
                    icon: 'shanchuheimingdan',
                    tooltip: optimizeStatus ? '黑名单': '该词优化方式为只优化价格，黑名单功能不可用',
                    cb: () => {
                        console.log( 'aaaa' )
                    }
                }, {
                    icon: 'shanchu',
                    tooltip: '删除关键词',
                    popup: ( <DelKeyword/> )
                }, {
                    icon: 'qushi',
                    tooltip: '历史趋势'
                }, {
                    icon: isFocusKeyword ? "nofocus": 'guanzhu',
                    tooltip: '重点关注'
                }
            ]}/> )
    }
    getTableCols() {
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
                    const active = record.get( 'hover' ) || record.get( 'active' );
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    if ( record.get( 'matchScope' ) == 1 ) {
                        text = '[ ' + text + ' ]'
                    }
                    return <span>
                        {record.get( 'wordscorelist' ) && record.getIn( [ 'wordscorelist', 'wirelessQscore' ] ) >= 6 && ( <Icon type="wuxian"/> )}
                        {
                            record.get( 'wordscorelist' ) && record.getIn( [ 'wordscorelist', 'wirelessQscore' ] ) >= 6 && ( <Tooltip title="有机会在淘宝网电脑版搜索结果首页左侧推广位置展示（每天定时更新）" arrowPointAtCenter="arrowPointAtCenter">
                                <Icon type="zuo01"/>
                            </Tooltip> )
                        }
                        {record.get( 'isFocusKeyword' ) && ( <Icon type="star"/> )}
                        <span>{text}</span>
                        {this.getExtraBtnGroup( record )}
                    </span>
                }
            }, {
                title: 'PC出价',
                dataIndex: 'maxPrice',
                width: 110,
                fixed: 'left',
                render: ( price, record ) => {
                    const active = record.get( 'hover' ) || record.get( 'active' );
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    const obj = formatNum( price, { mode: 'price' } )
                    return ( <span>
                        {obj.text}
                        <span>元</span>
                        {
                            active && ( <Trigger popup={( <EditWordPrice mode='pc'/> )}>
                                <span className="table-edit-icon">
                                    <Icon type="xiugaibi" className="show-on-row-hover"/>
                                </span>
                            </Trigger> )
                        }
                    </span> )
                }
            }, {
                title: '移动出价',
                dataIndex: 'maxMobilePrice',
                width: 110,
                fixed: 'left',
                render: ( price, record ) => {
                    const active = record.get( 'hover' ) || record.get( 'active' );
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    if ( record.get( 'mobileIsDefaultPrice' ) ) {
                        price = record.get( 'maxPrice' ) * mobileDiscount / 100
                    }
                    const obj = formatNum( price, { mode: 'price' } );
                    return ( <span>
                        {obj.text}
                        元 {
                            active && ( <Trigger popup={( <EditWordPrice mode='mobile'/> )}>
                                <span className="table-edit-icon">
                                    <Icon type="xiugaibi" className="show-on-row-hover"/>
                                </span>
                            </Trigger> )
                        }
                    </span> )
                }
            }, {
                title: '实时排名',
                dataIndex: 'rank',
                width: 90,
                fixed: 'left',
                render: ( text, record ) => {
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    if ( text ) {
                        return ( <span>{text}</span> )
                    } else {
                        return ( <a href="#">查排名</a> )
                    }
                }
            }, {
                title: '抢排名',
                dataIndex: 'grabPc',
                colSpan: 2,
                width: 60,
                render: ( text, record ) => {
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    let pc = record.getIn( [ 'grab', 'pc' ] ),
                        pcAuto = record.getIn( [ 'grab', 'pcAuto' ] )
                    if ( pcAuto == -1 ) {
                        pc = -1
                    }
                    if ( pcAuto == 0 && pc != 9 ) {
                        pc = 11
                    }
                    const pcStatus = grabRankStatusPcMap[ pc ];
                    return ( <span>
                        {
                            pcAuto != -1 && ( <Tooltip title="抢排名词管理" arrowPointAtCenter="arrowPointAtCenter">
                                <Icon type="qiangpaiming"/>
                            </Tooltip> )
                        }
                        <a href="#">{pcStatus.title}</a>
                    </span> )
                }
            }, {
                title: '抢排名',
                dataIndex: 'grabMobile',
                colSpan: 0,
                width: 60,
                render: ( text, record ) => {
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    let mobile = record.getIn( [ 'grab', 'mobile' ] ),
                        mobileAuto = record.getIn( [ 'grab', 'mobileAuto' ] )
                    if ( mobileAuto == -1 ) {
                        mobile = -1
                    }
                    if ( mobileAuto == 0 && mobile != 9 ) {
                        mobile = 11
                    }
                    const mobileStatus = grabRankStatusMobileMap[ mobile ];
                    return ( <span>
                        {
                            mobileAuto != -1 && ( <Tooltip title="抢排名词管理" arrowPointAtCenter="arrowPointAtCenter">
                                <Icon type="qiangpaiming"/>
                            </Tooltip> )
                        }
                        <a href="#">{mobileStatus.title}</a>
                    </span> )
                }

            }, {
                title: 'PC质量分',
                dataIndex: 'wordscorelist.qscore',
                width: 90,
                sorter: ( a, b ) => ( a.wordscorelist.qscore - b.wordscorelist.qscore ),
                sortOrder: sorter.columnKey == 'wordscorelist.qscore' && sorter.order,
                render: ( text, record ) => {
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    return this.formatQscore( text )
                }
            }, {
                title: '移动质量分',
                dataIndex: 'wordscorelist.wirelessQscore',
                width: 90,
                sorter: ( a, b ) => ( a.wordscorelist.wirelessQscore - b.wordscorelist.wirelessQscore ),
                sortOrder: sorter.columnKey === 'wordscorelist.wirelessQscore' && sorter.order,
                render: ( text, record ) => {
                    if ( record.get( '_isChildren' ) ) {
                        return ( <span>-</span> )
                    }
                    return this.formatQscore( text )
                }
            }
        ];
        reportSort.forEach( key => {
            cols.push( {
                title: keywordReports[ key ].name,
                dataIndex: key,
                width: 80,
                grow: true,
                accuracy: 2,
                unit: keywordReports[ key ].unit
            } )
        } )

        cols.push( {
            title: '优化方式',
            key: 'opType',
            width: 130,
            fixed: 'right',
            render: ( val, record ) => {
                if ( record.get( '_isChildren' ) ) {
                    return ( <span>&nbsp;</span> )
                }
                const blackStatus = record.get( 'blackStatus' ),
                    isOptimizeChangePrice = record.get( 'isOptimizeChangePrice' ),
                    isOptimizeChangeMobilePrice = record.get( 'isOptimizeChangeMobilePrice' ),
                    isOptimizeChangeMatchScope = record.get( 'isOptimizeChangeMatchScope' ),
                    optimizeStatus = record.get( 'optimizeStatus' )
                if ( blackStatus != 'toDel' ) {
                    return ( <div className="op-type">
                        {( ( isOptimizeChangeMatchScope == 0 || isOptimizeChangeMatchScope == 0 ) && optimizeStatus != -1 && optimizeStatus != 9 ) && ( <Icon type="dian"></Icon> )}
                        {this._getOptimizeStatus( optimizeStatus )}
                        {
                            ( optimizeStatus == 1 || optimizeStatus == 0 ) && ( <Tooltip
                                title={`PC: ${ isOptimizeChangePrice == 1 ? '优化' : '不优化'}, 无线: ${ isOptimizeChangeMobilePrice == 1 ? '优化' : '不优化' }`}
                                arrowPointAtCenter="arrowPointAtCenter">
                                <div className="status-block">
                                    <div className={`${ isOptimizeChangePrice == 1 ? 'active' : '' }`}></div>
                                    <div className={`${ isOptimizeChangeMobilePrice == 1 ? 'active' : '' }`}></div>
                                </div>
                            </Tooltip> )
                        }
                        <Trigger popup={( <EditWordPrice mode='mobile'/> )}>
                            <span className="table-edit-icon">
                                <Icon type="xiugaibi" className="show-on-row-hover"/>
                            </span>
                        </Trigger>
                    </div> )
                } else {
                    return ( <Tooltip title="该关键词包含黑名单词，将在下一次优化时被删除，且不再被投放。">
                        <div className="label label-primary">待删除</div>
                    </Tooltip> )
                }
            }
        } );
        return cols;
    }
    _getOptimizeStatus( optimizeStatus ) {
        switch ( optimizeStatus ) {
            case 1:
                return ( <span className="msg-success">全自动优化</span> )
            case - 1:
                return ( <span className="msg-danger">不自动优化</span> )
            case 0:
                return ( <span className="msg-success">只优化价格</span> )
            case 2:
                return ( <span className="msg-success">只优化出词
                    <Tooltip title="此特殊状态下，效果差该关键词依旧会被删词，如不想被删除，请手动设为【不自动优化】" arrowPointAtCenter="arrowPointAtCenter">
                        <Icon type="wenhao"/>
                    </Tooltip>
                </span> )
            case 3:
                return ( <span className="msg-success">不优化[出词&出价]</span> )
            case 9:
                return ( <span className="msg-success">按配置优化</span> )
            default:
                return ( <span >未知状态</span> )
        }
    }
    formatQscore( score ) {
        if ( score > 0 ) {
            return ( <span>{score}</span> )
        } else if ( score < 0 && score > -4 ) {
            return ( <span>未投放</span> )
        } else if ( score == 0 ) {
            return ( <span>-</span> )
        } else {
            return ( <span>
                <span>?</span>
                <Tooltip title="淘宝接口异常，请稍候重试" arrowPointAtCenter="arrowPointAtCenter">
                    <Icon type="warning"/>
                </Tooltip>
            </span> )
        }
    }
    getTableData() {
        let { keywords, keywordMap, keywordDetailMap } = this.props.keyword;
        const { keywordStatus } = this.state
        const { filters } = this.props.view;
        let arr = []
        keywordDetailMap = keywordDetailMap || {}
        if ( keywords ) {
            arr = keywords.map( id => ( {
                ...keywordMap[id],
                children: keywordDetailMap[id],
                ...keywordStatus[ id ]
            } ) )
        }
        // arr = arr.slice( 0, 15 )
        return arr
    }
    render() {
        // let infoObj = pick(this.props.head.adgroup, [ 'adgroupId', 'campaignId' ])
        const { selectedRowKeys, isMandate } = this.state
        const modeSw = ( <Radio.Group className="keyword-list-type" defaultValue='1' onChange={this.onChangeGroupMode}>
            <Radio.Button value="1" className="btn">
                <Icon type="biaogefenlie"/>
            </Radio.Button>
            <Radio.Button value="2" className="btn">
                <Icon type="biaogeshouqi"/>
            </Radio.Button>
        </Radio.Group> )
        const filterExtraComponent = ( <div className="filter-extra-bar">
            {modeSw}
            <Button type="primary">智能淘词</Button>
            <Trigger popup={( <AddUserWord/> )}>
                <Button type="primary">指定加词</Button>
            </Trigger>
        </div> )
        const btnProps = {
            selectedRowKeys,
            keywordMap: this.props.keyword.keywordMap,
            afterCb: this.clear
        }
        return ( <Layout className="keyword-list">
            {
                selectedRowKeys.length == 0 ? ( <div className="control-row">
                    <KeywordFilter mode="full" extraComponent={filterExtraComponent} onSetFilter="onSetFilter"/>
                </div> ) : ( <div className="control-row">
                    {modeSw}
                    <EditMultiWordPrice
                        mobileDiscount={this.props.adgroup.mobileDiscount}
                        selectedRowKeys={selectedRowKeys}
                        keywordMap={this.props.keyword.keywordMap}
                        api={this.props.postKeyword}></EditMultiWordPrice>
                    <Trigger popup={( <DelKeyword {...btnProps}/> )}>
                        <Button type="primary">删除关键词</Button>
                    </Trigger>
                    <EditMatch isMandate={isMandate} {...btnProps}/>
                    <Button type="primary">抢排名</Button>
                    <Button type="primary">查排名</Button>
                    <ClipboardButton option-text={this.getWordForCopy} className="ant-btn" onSuccess={this.onCopySuccess}>复制关键词</ClipboardButton>
                    <Button>重点关注词</Button>
                    {
                        isMandate && ( <Trigger popup={( <EditOptimization type='scope'/> )}>
                            <Button>修改优化方式</Button>
                        </Trigger> )
                    }
                    <Dropdown
                        trigger={[ 'click' ]}
                        overlay={( <Menu onClick={this.onSeparateClick}>
                            <Menu.Item key="0">汇总数据</Menu.Item>
                            <Menu.Item key="1">PC/无线数据</Menu.Item>
                            <Menu.Item key="2">站内/站外数据</Menu.Item>
                            <Menu.Item key="3">PC/无线/站内/站外数据</Menu.Item>
                        </Menu> )}>
                        <Button>
                            细分数据
                            <IconAntd type="down"/>
                        </Button>
                    </Dropdown>
                    <div className="filter-sw">
                        <Button type="primary">
                            关键词筛选
                            <IconAntd type="down"/>
                        </Button>
                    </div>
                    <KeywordFilter mode="tag"/>
                </div> )
            }
            <Table
                ref={this.setTableRef}
                dataSource={this.getTableData()}
                filters={this.props.view.filters}
                columns={this.getTableCols()}
                {...this.tableConfig}
                {...this.state}/>
        </Layout> )
    }
}
