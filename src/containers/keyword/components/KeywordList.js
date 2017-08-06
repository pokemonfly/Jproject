import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Radio, Tabs, Button, Table } from 'antd';
import { connect } from 'react-redux'
import KeywordFilter from './KeywordFilter'
import Icon from '../../shared/Icon'
import { fetchKeywordList, keywordTableChange } from './KeywordListRedux'
import './KeywordList.less'

const { Column, ColumnGroup } = Table;
const rowSelection = {
    onChange: ( selectedRowKeys, selectedRows ) => {
        console.log( `selectedRowKeys: ${ selectedRowKeys }`, 'selectedRows: ', selectedRows );
    },
    getCheckboxProps: record => ( {
        disabled: record.name === 'Disabled User'
    } )
};

@connect( state => ( { user: state.user, campaign: state.campaign, keyword: state.keyword.keywordList, view: state.keyword.keywordView } ),
    dispatch => ( bindActionCreators( {
        keywordTableChange,
        fetchKeywordList
    }, dispatch ) ) )
export default class KeywordList extends React.Component {
    componentWillMount() {
        this.props.fetchKeywordList();
    }
    getTableCols() {
        const { sorter } = this.props.keyword
        let cols = [
            {
                title: '关键词',
                dataIndex: 'word',
                width: 200,
                render: text => <a href="#">{text}</a>
            }, {
                title: 'PC出价',
                dataIndex: 'maxPrice',
                render: text => <span>{text / 100}元</span>
            }, {
                title: '移动出价',
                dataIndex: 'maxMobilePrice',
                render: text => <span>{text / 100}元</span>
            }, {
                title: '抢排名',
                dataIndex: ''
            }, {
                title: '实时排名',
                dataIndex: '',
                sorter: ( a, b ) => a.age - b.age,
                sortOrder: sorter.columnKey === 'age' && sorter.order,
            }, {
                title: 'PC质量分',
                dataIndex: '',
                sorter: ( a, b ) => a.age - b.age,
                sortOrder: sorter.columnKey === 'age' && sorter.order,
            }, {
                title: '移动质量分',
                dataIndex: '',
                sorter: ( a, b ) => a.age - b.age,
                sortOrder: sorter.columnKey === 'age' && sorter.order,
            }
        ];

        cols.push( {
            title: '优化方式',

            render: val => {

            }
        } )
        return cols;
    }
    getTableData() {
        const { keywords, keywordMap } = this.props.keyword;
        const { filters } = this.props.view;
        let arr = []
        if ( keywords ) {
            arr = keywords.map( id => keywordMap[ id ] )
            if ( filters ) {
                for ( let f in filters ) {
                    let o = filters[ f ];
                    arr = arr.filter( o.fn.bind( null, o.type, o.key ) )
                }
            }
        }
        return arr
    }
    render() {
        return (
            <div className="keyword-list">
                <div>
                    <Radio.Group className="keyword-list-type">
                        <Radio.Button value="a">
                            <Icon type="biaogefenlie"/></Radio.Button>
                        <Radio.Button value="c">
                            <Icon type="biaogeshouqi"/></Radio.Button>
                    </Radio.Group>
                    <Button>智能淘词</Button>
                    <Button>指定加词</Button>
                    <Button>细分数据</Button>
                    <KeywordFilter onSetFilter/>
                </div>
                <Table dataSource={this.getTableData()} rowSelection={rowSelection} columns={this.getTableCols()}
                    pagination={false}
                    onChange={this.props.keywordTableChange}></Table>
            </div>
        );
    }
}
