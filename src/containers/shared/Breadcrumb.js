import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import "./Breadcrumb.less"

export default class BreadcrumbEX extends React.Component {
    render( ) {
        return (
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>首页</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">智能推广</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item >
                    <a href="">计划名</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>管理关键词</Breadcrumb.Item>
            </Breadcrumb>
        )
    }
}
