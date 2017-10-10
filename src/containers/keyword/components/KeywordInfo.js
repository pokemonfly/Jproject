import React, { Component, PropTypes } from 'react';
import { Icon, Select, Button } from 'antd';
const Option = Select.Option;
import './KeywordInfo.less'

export default class KeywordInfo extends Component {
    optimizeChange( ) {}
    render( ) {
        const {
            numIid,
            title,
            picUrl,
            catName,
            price,
            volume,
            num,
            wordMaxPrice,
            mobileWordMaxPrice,
            mobileDiscount,
            onlineStatus
        } = this.props;
        return (
            <div className="keyword-info">
                <div className="left">
                    <a href={"https://item.taobao.com/item.htm?id=" + numIid} target="_blank">
                        <img src={`${ picUrl }_100x100`} alt=""/></a>
                </div>
                <div className="right">
                    <div className="row1">
                        <a href={"https://item.taobao.com/item.htm?id=" + numIid} target="_blank">{title}
                        </a>
                        <span className="tag">{onlineStatus == 'online' ? '推广中' : '已暂停'}</span>
                    </div>
                    <div className="row2">
                        <Select defaultValue="1" onChange={this.optimizeChange} className='select'>
                            <Option value="1">全自动优化</Option>
                            <Option value="0">只优化价格</Option>
                            <Option value="-1">不自动优化</Option>
                        </Select>
                        <span>{` PC限价： ${ wordMaxPrice }`}</span>
                        <span>{` 移动限价： ${ mobileWordMaxPrice }`}</span>
                        <span>{` 移动溢价： ${ mobileDiscount }%`}</span>
                    </div>
                    <div className="row3">
                        <span className="cat " title={catName}>{catName}</span>
                        <span className="detail">{` | ￥${ price } |  销量 ${ volume } 件 |  库存 ${ num } 件`}</span>
                    </div>
                </div>
            </div>
        )
    }
}
