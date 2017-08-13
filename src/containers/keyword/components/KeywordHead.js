import React, { Component, PropTypes } from 'react';
import PubSub from 'pubsub-js';
import './KeywordHeadStyle.less'
import Table from '@/containers/shared/Table'

export default class KeywordHead extends React.Component {
    getData( ) {
        const data = [ ];
        for ( let i = 0; i < 1000; i++ ) {
            data.push({ key: i, name: `Edrward ${ i }`, age: 32, address: `London Park no. ${ i }` });
        }
        return data;

    }
    componentDidUpdate( ) {
        PubSub.publish( 'table.resize' )
    }
    render( ) {

        const columns = [
            {
                title: 'Full Name',
                width: 100,
                dataIndex: 'name',
                key: 'name',
                fixed: 'left'
            }, {
                title: 'Age',
                width: 100,
                dataIndex: 'age',
                key: 'age',
                fixed: 'left'
            }, {
                title: 'Column 1',
                dataIndex: 'address',
                key: '1',
                width: 150
            }, {
                title: 'Column 2',
                dataIndex: 'address',
                key: '2',
                width: 150
            }, {
                title: 'Column 3',
                dataIndex: 'address',
                key: '3',
                width: 150
            }, {
                title: 'Column 4',
                dataIndex: 'address',
                key: '4',
                width: 150
            }, {
                title: 'Column 5',
                dataIndex: 'address',
                key: '5',
                width: 150
            }, {
                title: 'Column 6',
                dataIndex: 'address',
                key: '6',
                width: 150
            }, {
                title: 'Column 7',
                dataIndex: 'address',
                key: '7',
                width: 150
            }, {
                title: 'Column 8',
                dataIndex: 'address',
                key: '8',
                width: 150
            }, {
                title: 'Column 9',
                dataIndex: 'address',
                key: '9',
                width: 150
            }, {
                title: 'Column 10',
                dataIndex: 'address',
                key: '10',
                width: 150
            }, {
                title: 'Column 11',
                dataIndex: 'address',
                key: '11',
                width: 150
            }, {
                title: 'Column 12',
                dataIndex: 'address',
                key: '12',
                width: 150
            }, {
                title: 'Column 13',
                dataIndex: 'address',
                key: '13',
                width: 150
            }, {
                title: 'Action',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: ( ) => (
                    <a href="#">action</a>
                )
            }
        ];
        return (
            <div className="keyword-head">
                <div style={{
                    height: "200px"
                }}></div>

            </div>
        );
    }
}

//        <Table dataSource={this.getData( )} columns={columns}/>
