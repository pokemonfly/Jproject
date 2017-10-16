import React, { Component, PropTypes } from 'react';
import { Icon as AntdIcon, Select, Button, Menu, Dropdown } from 'antd';
import EditableText from '@/containers/shared/EditableText'
import Trigger from '@/containers/shared/Trigger';
import EditOptimization from './EditOptimization'
import { pick } from 'lodash'
import { OPTIMIZE_TYPE } from '@/utils/constants'
const Option = Select.Option;
import './KeywordInfo.less'

export default class KeywordInfo extends Component {
    optimizeChange( ) {}
    onOnlineStatusChange = ({ key }) => {
        let params = pick(this.props, [ 'adgroupId', 'campaignId' ])
        params.onlineStatus = key
        this.props.api( params );
    }
    onOptimizationChange = ({ key }) => {}
    onPriceChange( ) {}
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
            onlineStatus,
            optimizationState
        } = this.props;
        const onlineStatusMenu = (
            <Menu onClick={this.onOnlineStatusChange}>
                {onlineStatus != 'online' && (
                    <Menu.Item key="online">推广中</Menu.Item>
                )}
                {onlineStatus == 'online' && (
                    <Menu.Item key="offline">已暂停</Menu.Item>
                )}
            </Menu>
        )
        return (
            <div className="keyword-info">
                <div className="left">
                    <a href={"https://item.taobao.com/item.htm?id=" + numIid} target="_blank">
                        <img src={`${ picUrl }_100x100`} alt=""/></a>
                </div>
                <div className="right">
                    <div className="row1">
                        <a className="title" href={"https://item.taobao.com/item.htm?id=" + numIid} target="_blank">{title}
                        </a>
                        <Dropdown overlay={onlineStatusMenu} trigger={[ 'click' ]}>
                            <a className="ant-dropdown-link" href="#">
                                <span className="tag">{onlineStatus == 'online' ? '推广中' : '已暂停'}</span>
                            </a>
                        </Dropdown>
                    </div>
                    <div className="row2">
                        <Trigger
                            popup={( <EditOptimization
                            hasOff={false}
                            hasTitle={false}
                            hasHmAuth={true}
                            api={this.props.api}
                            {...pick(this.props, ['adgroupId', 'campaignId', 'type'])}/> )}>
                            <Button>
                                <span>
                                    {OPTIMIZE_TYPE[optimizationState]}
                                    <AntdIcon type="down"/></span>
                            </Button>
                        </Trigger>
                        <span>PC限价：</span><EditableText value={wordMaxPrice} onChange={this.onPriceChange.bind( this, 'pc' )} width={100}/>
                        <span>移动限价：</span><EditableText value={mobileWordMaxPrice} onChange={this.onPriceChange.bind( this, 'mobile' )} width={100}/>
                        <span>移动溢价：</span><EditableText value={mobileDiscount} onChange={this.onPriceChange.bind( this, 'discount' )} width={100}/>
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
