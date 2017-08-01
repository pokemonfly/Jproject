import React, { Component, PropTypes } from 'react';
import { Radio, Icon, Dropdown } from 'antd';
import './KeywordFilter.less'

const { Group, Button } = Radio
export default class KeywordFilter extends Component {
    render( ) {
        return (
            <div>
                <Group className="keyword-filter">
                    <Dropdown overlay={< div > 出价的下拉框组件 < /div>} trigger={[ 'click' ]}>
                        <Button value="a">出价
                            <Icon type="down"/>
                        </Button>
                    </Dropdown>
                    <Button value="b">质量分
                        <Icon type="down"/></Button>
                    <Button value="c">展现时长
                        <Icon type="down"/></Button>
                </Group>
            </div>
        );
    }
}
