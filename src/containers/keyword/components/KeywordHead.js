import React, { Component, PropTypes } from 'react';
import PubSub from 'pubsub-js';
import './KeywordHeadStyle.less'
import Table from '@/containers/shared/Table'

export default class KeywordHead extends React.Component {
    state = {
        filters: {
            'key': {
                type: 'key',
                key: 20,
                fn: ( type, key, obj ) => {
                    return obj[type] < key
                }
            }
        },
        isGroup: true,
        groupTitleRender: ({ rowData, key, className, style, position }) => {
            return (
                <div role="row" key={key} className={className} style={style} onClick={this.handleGroupTitle.bind( this, rowData.index )}>
                    {position == 'left' && (
                        <span>
                            {rowData.title}
                            ({rowData.count})
                        </span>
                    )}
                </div>
            )
        },
        groupSetting: [
            {
                title: 'group1',
                show: true,
                filter: ( obj ) => {
                    return obj.key % 2 == 0
                }
            }, {
                title: 'group2',
                show: false,
                filter: ( obj ) => {
                    return obj.key % 2 == 1
                }
            }
        ],
        detailVisiable: {
            type: 1,
            'c1': 1
        },
        detailRowRender: ({ columnIndex, dataKey, rowData }) => {
            if ( columnIndex == 0 && dataKey == 'name' && rowData.key == 'c1' ) {
                return (
                    <span
                        style={{
                        height: 60,
                        width: 200,
                        background: 'red',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        overflow: 'hidden'
                    }}>xxx
                        <br/>
                        yyy
                        <br/>
                        bbxxx
                        <br/>
                        yyy
                        <br/>
                        bb</span>
                )
            } else {
                return null;
            }
        }
    }
    handleGroupTitle( index ) {
        let { groupSetting } = this.state
        groupSetting[index].show = !groupSetting[index].show;
        this.setState({ groupSetting })
    }
    getData( ) {
        const data = [ ];
        for ( let i = 0; i < 100; i++ ) {
            data.push({ key: i, name: `Edrward ${ i }`, age: 32, address: `London Park no. ${ i }` });
        }
        data[0].children = [
            {
                key: 'c1',
                address: '34234234',
                visible: (detailVisiable, { key }) => ( detailVisiable[key] == 1 )
            }, {
                key: 'c11',
                address: '34234234',
                visible: (detailVisiable, { key }) => ( detailVisiable.type == 1 )
            }, {
                key: 'c2',
                name: 'c2',
                age: 2,
                address: '34234234999',
                visible: (detailVisiable, { key }) => ( detailVisiable.type == 1 )
            }
        ]
        return data;
    }
    render( ) {
        window.xx = this
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
        const { type } = this.state
        return (
            <div className="keyword-head">
                <div ></div>

            </div>
        );
    }
}

//    <Table dataSource={this.getData( )} columns={columns} {...this.state}/>
