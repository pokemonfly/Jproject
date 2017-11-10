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
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { isString, find, remove } from 'lodash'
import { filterKeyword, removeKeywordFilter } from './KeywordViewRedux'
import Trigger from '@/containers/shared/Trigger';
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
                title: 'PC出价',
                unit: '元'
            }, {
                type: 'range',
                key: 'maxMobilePrice',
                name: '无线',
                title: '无线出价',
                unit: '元'
            }
        ],
        fn: ( type, filterOpt, keywordObj ) => {
            const { maxPriceMin, maxPriceMax, maxMobilePriceMin, maxMobilePriceMax } = filterOpt;
            const { maxPrice, maxMobilePrice } = keywordObj
            if ( maxPriceMin && maxPriceMin * 100 > maxPrice ) {
                return false
            }
            if ( maxMobilePriceMin && maxMobilePriceMin * 100 > maxMobilePrice ) {
                return false
            }
            if ( maxPriceMax && maxPriceMax * 100 < maxPrice ) {
                return false
            }
            if ( maxMobilePriceMax && maxMobilePriceMax * 100 < maxMobilePrice ) {
                return false
            }
            return true;
        }
    }, {
        name: '质量分',
        type: 'qscore',
        width: 220,
        items: [
            {
                type: 'range',
                key: 'qscore',
                name: 'PC',
                title: 'PC质量分'
            }, {
                type: 'range',
                key: 'wirelessQscore',
                name: '无线',
                title: '无线质量分'
            }
        ],
        fn: ( type, filterOpt, keywordObj ) => {
            const { qscoreMin, qscoreMax, wirelessQscoreMin, wirelessQscoreMax } = filterOpt;
            const { qscore, wirelessQscore } = keywordObj
            if ( qscore && qscoreMin > qscore ) {
                return false
            }
            if ( wirelessQscoreMin && wirelessQscoreMin > wirelessQscore ) {
                return false
            }
            if ( qscoreMax && qscoreMax < qscore ) {
                return false
            }
            if ( wirelessQscoreMax && wirelessQscoreMax < wirelessQscore ) {
                return false
            }
            return true;
        }
    }, {
        name: '展现时长',
        type: 'createTime',
        width: 250,
        items: [
            {
                type: 'range',
                key: 'createTime',
                name: '展现时长(天)',
                title: '展现时长'
            }
        ],
        // fn
    }, {
        name: '展现量',
        type: 'impressions',
        width: 245,
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
                        value: 1,
                        key: 'impressions',
                        name: '展现量',
                        title: ''
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
                        name: '点击率：',
                        title: '',
                        unit: '%'
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
        width: 250,
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
        ],
        fn: ( type, filterOpt, keywordObj ) => {
            const { dayClickMin, dayClickMax, scope } = filterOpt;
            let tar;
            switch ( scope ) {
                case 1:
                    tar = keywordObj[type];
                    break;
                case 2:
                    tar = keywordObj[type];
                    break;
                default:
                    tar = keywordObj[type];
            }
            if ( dayClickMin && dayClickMin > tar ) {
                return false
            }
            if ( dayClickMax && dayClickMax < tar ) {
                return false
            }
            return true;
        }
    }
];
@connect(null, dispatch => (bindActionCreators( {
    filterKeyword,
    removeKeywordFilter
}, dispatch )))
@Form.create( )
class FilterPanel extends Component {
    onSubmit = ( ) => {
        let formObj = this.props.form.getFieldsValue( )
        let { type, fn, toString } = this.props;

        for ( const key in formObj ) {
            if (isString(formObj[key])) {
                // 转为数字
                formObj[key] = +formObj[key]
            }
        }
        this.props.filterKeyword({
            type,
            obj: formObj,
            fn: fn || this.createFilter( formObj )
        })
        this.props.afterCb({key: type, str: this.toString( formObj )})
        this.props.onClose( )
    }
    createFilter({ scope }) {
        // TODO
        return ( type, filterOpt, keywordObj ) => {
            return true
        }
    }
    toString( formObj, items = this.props.items, tag ) {
        let s = '',
            name = '';
        items.forEach(obj => {
            if ( tag != undefined && tag != obj.value ) {
                return;
            }
            switch ( obj.type ) {
                case 'range':
                    let min = formObj[obj.key + 'Min'],
                        max = formObj[obj.key + 'Max'],
                        unit = obj.unit || '',
                        title = 'title' in obj ? obj.title : obj.name;
                    if ( min && max && min > max ) {
                        let _t = max
                        max = min
                        min = _t
                    }
                    if ( min || max ) {
                        if ( s ) {
                            s = s + ', '
                        }
                        if ( title.length ) {
                            s += `${ title }：`;
                        }
                        if ( min && !max ) {
                            s += `${ min }${ unit }以上`
                        } else if ( max && !min ) {
                            s += `${ max }${ unit }以下`
                        } else {
                            s += `${ min }${ unit }-${ max }${ unit }`
                        }
                    }
                    break;
                case 'scope' : let { scope } = formObj;
                    switch ( scope ) {
                        case 0:
                            name = '汇总' + this.props.name
                            break;
                        case 1:
                            name = 'PC' + this.props.name
                            break;
                        case 2:
                            name = '无线' + this.props.name
                            break;
                    }
                    break;
                case 'radio' : let { radio } = formObj
                    s = this.toString( formObj, obj.items, radio, '' );
                    break;
                case 'tag' : s = obj.name
                    break;
            }
        })
        return `${ name ? name + ': ' : '' }${ s }`
    }
    rowRender = ( obj, ind ) => {
        const { getFieldDecorator } = this.props.form;
        switch ( obj.type ) {
            case 'range':
                return (
                    <Form.Item key={ind} className="range-row">
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
                                        <Radio value={indx} className="radio-row" key={indx}>
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

@connect(null, dispatch => (bindActionCreators( {
    removeKeywordFilter
}, dispatch )))
export default class KeywordFilter extends Component {
    state = {
        selectedFilter: [ ]
    }
    afterCb = ( obj ) => {
        const { selectedFilter } = this.state
        let selected = find(selectedFilter, ( o ) => {
            return o.key == obj.key
        })
        if ( selected ) {
            Object.assign( selected, obj )
        } else {
            selectedFilter.push( obj )
        }
        this.setState({ selectedFilter })
    }
    onCloseTag = ( key ) => {
        const { selectedFilter } = this.state
        remove(selectedFilter, ( o ) => {
            return o.key == key
        })
        this.setState({ selectedFilter })
        this.props.removeKeywordFilter( key )
    }
    renderTagRow( ) {
        const { selectedFilter } = this.state
        if ( !selectedFilter.length ) {
            return null
        } else {
            return (
                <div className="filter-tag-row">
                    <span>已选条件：
                    </span>
                    {selectedFilter.map(( obj, ind ) => {
                        return (
                            <Tag className="filter-tag" key={ind} closable onClose={this.onCloseTag.bind( obj.key )}>
                                {obj.str}
                            </Tag>
                        )
                    })}
                </div>
            )
        }
    }
    createOverlay( obj ) {
        return ( <FilterPanel {...obj} afterCb={this.afterCb}/> )
    }
    renderFilter( ) {
        return (
            <Group className="filter-bar">
                {CFG.map(( obj ) => {
                    return (
                        <Trigger popup={this.createOverlay( obj )} key={obj.type}>
                            <Radio.Button value={obj.type}>{obj.name}
                                <Icon type="down"/>
                            </Radio.Button>
                        </Trigger>
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
