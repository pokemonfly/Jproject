import React, { Component, PropTypes } from 'react';
import {
    Radio,
    Icon,
    Dropdown,
    Tag,
    Layout,
    Form,
    Input,
    Button
} from 'antd';
import './KeywordFilter.less'

const { Group } = Radio

const CFG = [
    {
        name: '出价',
        type: 'price',
        height: 56,
        width: 240,
        items: [
            {
                type: 'range',
                key: 'maxPrice',
                name: 'PC出价',
                unit: '元'
            }, {
                type: 'range',
                key: 'maxMobilePrice',
                name: '无线出价',
                unit: '元'
            }
        ]
    }, {
        name: '质量分',
        type: 'qscore',
        height: 56,
        width: 210,
        key: [ 'wordscorelist', 'qscore', 'wirelessQscore' ]
    }, {
        name: '展现时长',
        type: 'createTime',
        height: 56,
        width: 275,
        key: [ 'keyword', 'createTime' ]
    }, {
        name: '展现量',
        type: 'impressions',
        height: 80,
        width: 222,
        key: [ 'report', 'impressions' ]
    }, {
        name: '点击量',
        id: 'filter-click-box',
        type: 'click',
        height: 56,
        width: 222,
        key: [ 'report', 'click' ]
    }, {
        name: '点击率',
        type: 'ctr',
        height: 116,
        width: 290,
        key: [ 'report', 'ctr' ]
    }, {
        name: 'ROI',
        type: 'roi',
        height: 56,
        width: 222,
        key: [ 'report', 'realRoi' ]
    }, {
        name: '全网均价',
        type: 'dayPrice',
        height: 40,
        width: 240,
        key: [ 'wordBase', 'dayPrice' ]
    }, {
        name: '全网展现',
        type: 'dayPv',
        height: 56,
        width: 222,
        key: [ 'wordBase', 'dayPv' ]
    }, {
        name: '全网点击指数',
        type: 'dayClick',
        height: 56,
        width: 280,
        key: [ 'wordBase', 'dayClick' ]
    }
]
@Form.create( )
class FilterPanel extends Component {
    render( ) {
        const { items, width } = this.props
        const { getFieldDecorator } = this.props.form;
        if ( !items )
            return null;
        return (
            <Layout className="float-panel keyword-filter-panel" style={{
                width
            }}>
                <Form>
                    {items.map(( obj ) => {
                        switch ( obj.type ) {
                            case 'range':
                                return (
                                    <Form.Item key={obj.key}>
                                        <span className="name">{obj.name}</span>
                                        {getFieldDecorator( obj.key + 'Min' )( <Input size="small" className="input-num" addonAfter={obj.unit}/> )}
                                        <span className="to-mark">-</span>
                                        {getFieldDecorator( obj.key + 'Max' )( <Input size="small" className="input-num" addonAfter={obj.unit}/> )}
                                    </Form.Item>
                                )
                            default:
                                return ''
                        }
                    })}
                    <div className="footer">
                        <Button type="primary" onClick={this.onSubmit}>确定</Button>
                        <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                    </div>
                </Form>
            </Layout>
        )
    }
}
export default class KeywordFilter extends Component {
    onCloseTag = ( ) => {}
    renderTagRow( ) {
        return (
            <div className="filter-tag-row">
                <span>已选条件：
                </span>
                <Tag className="filter-tag" closable onClose={this.onCloseTag}>
                    PC质量分：1-3
                </Tag>
                <Tag className="filter-tag" closable onClose={this.onCloseTag}>
                    PC质量分：1-3
                </Tag>
            </div>
        )
    }
    createOverlay( obj ) {
        return ( <FilterPanel {...obj}/> )
    }
    renderFilter( ) {
        return (
            <Group className="filter-bar">
                {CFG.map(( obj ) => {
                    return (
                        <Dropdown overlay={this.createOverlay( obj )} trigger={[ 'click' ]} key={obj.type}>
                            <Radio.Button value={obj.type}>{obj.name}
                                <Icon type="down"/>
                            </Radio.Button>
                        </Dropdown>
                    )
                })}
            </Group>
        )
    }
    render( ) {
        const { mode, extraComponent } = this.props
        switch ( mode ) {
            case 'tag':
                return (
                    <div className="keyword-filter">
                        {this.renderTagRow( )}
                    </div>
                )
            case 'filter':
                return (
                    <div className="keyword-filter">
                        {this.renderFilter( )}
                    </div>
                )
            case 'full':
            default:
                return (
                    <div className="keyword-filter">
                        <div className="filter-row">
                            {extraComponent}
                            {this.renderFilter( )}
                        </div>
                        {this.renderTagRow( )}
                    </div>
                );
        }
    }
}
