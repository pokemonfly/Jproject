import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { Icon as AntdIcon, Select, Button, Menu, Dropdown } from 'antd';
import Trigger from '@/containers/shared/Trigger';
import EditOptimization from './EditOptimization'
import EditPriceModal from './EditPriceModal'
import { pick } from 'lodash'
import { OPTIMIZE_TYPE } from '@/utils/constants'
import './KeywordInfo.less'

const Option = Select.Option;

@connect(state => ({ campaignMap: state.layout.campaignMap }))
export default class KeywordInfo extends Component {
    constructor( props ) {
        super( props );
        this.componentWillReceiveProps( props )
    }
    componentWillReceiveProps( props ) {
        const { campaignMap, campaignId, mobileWordMaxPrice, mobileDiscount } = props
        if (campaignMap.hasOwnProperty( campaignId )) {
            this.campaign = campaignMap[campaignId];
            this.wordPriceLimit = this.campaign.wordPriceLimit == -1 ? mobileWordMaxPrice / ( mobileDiscount / 100 ) : this.campaign.wordPriceLimit
        }
    }
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
                            {...pick(this.props, ['adgroupId', 'campaignId', 'type','optimizationState', 'isOptimizeChangePrice','isOptimizeChangeMatchScope','isOptimizeChangeMobilePrice'])}/> )}>
                            <Button>
                                <span>
                                    {OPTIMIZE_TYPE[optimizationState]}
                                    <AntdIcon type="down"/></span>
                            </Button>
                        </Trigger>

                        <span>PC限价：{wordMaxPrice}</span><EditPriceModal {...this.props} editType='pc' title="PC限价" wordPriceLimit={this.wordPriceLimit}/>
                        <span>移动限价：{mobileWordMaxPrice}</span><EditPriceModal {...this.props} editType='mobile' title="移动限价"/>
                        <span>移动溢价：{mobileDiscount}</span><EditPriceModal {...this.props} editType='mobileDiscount' title="移动溢价"/>
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
