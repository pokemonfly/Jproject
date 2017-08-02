import React, { PropTypes } from 'react';
import { Radio, Tabs, Button, Table } from 'antd';
import { connect } from 'react-redux'
import KeywordFilter from './KeywordFilter'
import Icon from '../../shared/Icon'
import { fetchKeywordList } from '../KeywordRedux'
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
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a href="#">{text}</a>
    }, {
        title: 'Age',
        dataIndex: 'age'
    }, {
        title: 'Address',
        dataIndex: 'address'
    }
];
@connect(state => ({ user: state.user, campaign: state.campaign, keyword: state.keyword }))
export default class KeywordList extends React.Component {
    componentWillMount( ) {
        this.props.dispatch(fetchKeywordList( ));
    }
    render( ) {
        const data = [
            {
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park'
            }, {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park'
            }, {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park'
            }, {
                key: '4',
                name: 'Disabled User',
                age: 99,
                address: 'Sidney No. 1 Lake Park'
            }
        ];
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
                <Table dataSource={data} rowSelection={rowSelection} columns={columns}></Table>
            </div>
        );
    }
}
