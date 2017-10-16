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
        width: 240,
        items: [
            {
                type: 'range',
                key: 'maxPrice',
                name: 'PC',
                unit: '元'
            }, {
                type: 'range',
                key: 'maxMobilePrice',
                name: '无线',
                unit: '元'
            }
        ]
    }, {
        name: '质量分',
        type: 'qscore',
        width: 220,
        items: [
            {
                type: 'range',
                key: 'qscore',
                name: 'PC'
            }, {
                type: 'range',
                key: 'wirelessQscore',
                name: '无线'
            }
        ]
    }, {
        name: '展现时长',
        type: 'createTime',
        width: 235,
        items: [
            {
                type: 'range',
                key: 'createTime',
                name: '展现时长(天)'
            }
        ]
    }, {
        name: '展现量',
        type: 'impressions',
        width: 222,
        items: [
            {
                type: 'scope'
            }, {
                type: 'hr'
            }, {
                type: 'radio',
                items: [
                    {
                        type: 'tag',
                        value: 0,
                        key: 'impressions',
                        name: '无展现'
                    }, {
                        type: 'range',
                        key: 'impressions',
                        name: '展现量'
                    }
                ]
            }
        ]
    }, {
        name: '点击量',
        type: 'click',
        width: 222,
        items: [
            {
                type: 'scope'
            }, {
                type: 'hr'
            }, {
                type: 'range',
                key: 'click',
                name: '点击量'
            }
        ]
    }, {
        name: '点击率',
        type: 'ctr',
        width: 290,
        items: [
            {
                type: 'scope'
            }, {
                type: 'hr'
            }, {
                type: 'radio',
                items: [
                    {
                        type: 'range',
                        value: 0,
                        key: 'ctr',
                        name: '点击率：'
                    }, {
                        type: 'tag',
                        key: 'ctr',
                        value: 1,
                        name: '点击率小于市场平均'
                    }, {
                        type: 'tag',
                        key: 'ctr',
                        value: 2,
                        name: '点击率等于市场平均'
                    }, {
                        type: 'tag',
                        key: 'ctr',
                        value: 3,
                        name: '点击率大于市场平均'
                    }
                ]
            }
        ]
    }, {
        name: 'ROI',
        type: 'roi',
        width: 222,
        items: [
            {
                type: 'scope'
            }, {
                type: 'hr'
            }, {
                type: 'range',
                key: 'realRoi',
                name: 'ROI：'
            }
        ]
    }, {
        name: '全网均价',
        type: 'dayPrice',
        width: 240,
        items: [
            {
                type: 'scope'
            }, {
                type: 'hr'
            }, {
                type: 'range',
                key: 'dayPrice',
                name: '全网均价：'
            }
        ]
    }, {
        name: '全网展现',
        type: 'dayPv',
        width: 222,
        items: [
            {
                type: 'scope'
            }, {
                type: 'hr'
            }, {
                type: 'range',
                key: 'dayPv',
                name: '全网展现：'
            }
        ]
    }, {
        name: '全网点击指数',
        type: 'dayClick',
        width: 280,
        items: [
            {
                type: 'scope'
            }, {
                type: 'hr'
            }, {
                type: 'range',
                key: 'dayClick',
                name: '全网点击指数：'
            }
        ]
    }
];
@Form.create( )
class FilterPanel extends Component {
    rowRender = ( obj, ind ) => {
        const { getFieldDecorator } = this.props.form;
        switch ( obj.type ) {
            case 'range':
                return (
                    <Form.Item key={ind}>
                        <span className="name">{obj.name}</span>
                        {getFieldDecorator( obj.key + 'Min' )( <Input size="small" className="input-num" addonAfter={obj.unit}/> )}
                        <span className="to-mark">-</span>
                        {getFieldDecorator( obj.key + 'Max' )( <Input size="small" className="input-num" addonAfter={obj.unit}/> )}
                    </Form.Item>
                )
            case 'scope':
                return (
                    <Form.Item key={ind}>
                        {getFieldDecorator('scope', { initialValue: 0 })(
                            <Radio.Group >
                                <Radio value={0} key={0}>
                                    <span>汇总</span>
                                </Radio>
                                <Radio value={1} key={1}>
                                    <span>PC</span>
                                </Radio>
                                <Radio value={2} key={2}>
                                    <span>无线</span>
                                </Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                )
            case 'hr':
                return ( <hr key={ind}/> )
            case 'tag':
                return (
                    <span key={ind}>{obj.name}</span>
                )
            case 'radio':
                return (
                    <Form.Item key={ind}>
                        {getFieldDecorator( 'radio' )(
                            <Radio.Group >
                                {obj.items.map(( item, indx ) => {
                                    return (
                                        <Radio value={indx}>
                                            {this.rowRender( item, indx )}
                                        </Radio>
                                    )
                                })}
                            </Radio.Group>
                        )}
                    </Form.Item>
                )
            default:
                return ''
        }
    }
    render( ) {
        const { items, width } = this.props
        if ( !items )
            return null;
        return (
            <Layout className="float-panel keyword-filter-panel" style={{
                width
            }}>
                <Form>
                    {items.map( this.rowRender )}
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
