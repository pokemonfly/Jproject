import React from 'react';
import { Layout } from 'antd'
import './CustomerService.less'

export default class CustomerService extends React.Component {
    render( ) {
        return (
            <Layout className="customer-service">
                <div>
                    <span>专属客服</span>
                    <span>tp_快云科技:服务专员立春</span>
                    <span>(在线时间：09:00 -- 18：00)</span>
                    <span>联系不上</span>
                    <span>点击这里给我发消息</span>
                    <span>快云科技，为您提供一对一指导</span>
                </div>
            </Layout>
        )
    }
}
