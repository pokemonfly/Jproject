import React from 'react';
import {
    Menu,
    Dropdown,
    Form,
    Radio,
    Input,
    Select,
    Checkbox,
    Tooltip,
    Button
} from 'antd'
import Icon from '../../shared/Icon'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import DropdownButton from '@/containers/shared/DropdownButton'
import './EditMultiWordPrice.less'
import EditWordPrice from './EditWordPrice'

const selectItem = [
    {
        value: 0.01,
        text: '1%'
    }, {
        value: 0.02,
        text: '2%'
    }, {
        value: 0.03,
        text: '3%'
    }, {
        value: 0.04,
        text: '4%'
    }, {
        value: 0.05,
        text: '5%'
    }, {
        value: 0.1,
        text: '10%'
    }, {
        value: 0.2,
        text: '20%'
    }, {
        value: 0.3,
        text: '30%'
    }, {
        value: 0.4,
        text: '40%'
    }, {
        value: 0.5,
        text: '50%'
    }, {
        value: 0.6,
        text: '60%'
    }, {
        value: 0.7,
        text: '70%'
    }, {
        value: 0.8,
        text: '80%'
    }, {
        value: 0.9,
        text: '90%'
    }, {
        value: 1,
        text: '100%'
    }, {
        value: 1.1,
        text: '110%'
    }, {
        value: 1.2,
        text: '120%'
    }, {
        value: 1.3,
        text: '130%'
    }, {
        value: 1.4,
        text: '140%'
    }, {
        value: 1.5,
        text: '150%'
    }, {
        value: 2,
        text: '200%'
    }, {
        value: 3,
        text: '300%'
    }, {
        value: 4,
        text: '400%'
    }, {
        value: 5,
        text: '500%'
    }
];

@Form.create( )
@DropdownButton
export default class EditMultiWordPrice extends React.Component {
    static defaultProps = {
        menu: [
            {
                key: 1,
                name: '加价'
            }, {
                key: 2,
                name: '减价'
            }, {
                key: 3,
                name: '设置为全网均价'
            }, {
                key: 4,
                name: '自定义出价'
            }
        ],
        width: "260px"
    }
    constructor( props ) {
        super( props );
        this.state = {
            type: 1
        }
    }
    onTypeChange = ( e ) => {
        this.setState({ type: e.target.value })
    }
    onSubmit = ( ) => {
        this.props.onClose( );
    }

    handleButtonClick = ( type ) => {
        this.setState({ type })
        this.refs.trigger.setPopupVisible( true )
    }
    renderOption( ) {
        return selectItem.map(i => (
            <Option value={i.value.toString( )} key={i.value}>{i.text}</Option>
        ))
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        const { activeKey, isShowNotOptimizeStatus } = this.props
        const { type } = this.state;
        let str;
        switch ( activeKey ) {
            case 1:
                str = '加价';
                break;
            case 2:
                str = '降价';
                break;
            case 3:
                switch ( type ) {
                    case 1:
                        str = 'PC';
                        break;
                    case 2:
                        str = '无线';
                        break;
                    case 0:
                        str = '全网';
                        break;
                }
                break;
        }
        return (
            <div>
                <Form className="float-panel edit-multi-word-price" onSubmit={this.onSubmit}>
                    <p className="header">修改出价：</p>
                    <Form.Item className="sep-line">
                        {getFieldDecorator('type', { initialValue: type })(
                            <Radio.Group onChange={this.onTypeChange}>
                                <Radio value={1}>PC</Radio>
                                <Radio value={2}>无线</Radio>
                                <Radio value={0}>PC + 无线</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {( activeKey == 1 || activeKey == 2 ) && (
                        <Form.Item>
                            {getFieldDecorator('radio', { initialValue: 1 })(
                                <Radio.Group >
                                    <Radio value={0}>
                                        <span>{str}：</span>
                                        {getFieldDecorator( 'value' )( <Input addonAfter="元" className="input-price"/> )}
                                    </Radio>
                                    <Radio value={1}>
                                        <span>{str}：</span>
                                        {getFieldDecorator('select', { initialValue: "0.1" })(
                                            <Select onChange={this.onSelectChange} className="select-percent">
                                                {this.renderOption( )}
                                            </Select>
                                        )}
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    )}
                    {activeKey == 3 && (
                        <Form.Item>
                            {getFieldDecorator('radio', { initialValue: 1 })(
                                <Radio.Group >
                                    <Radio value={0}>
                                        <span>{str}：</span>
                                        {getFieldDecorator( 'value' )( <Input addonAfter="元" className="input-price"/> )}
                                    </Radio>
                                    <Radio value={1}>
                                        <span>{str}：</span>
                                        {getFieldDecorator('select', { initialValue: "1.2" })(
                                            <Select onChange={this.onSelectChange} className="select-percent">
                                                {this.renderOption( )}
                                            </Select>
                                        )}
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    )}
                    {activeKey == 4 && type == 2 && (
                        <Form.Item>
                            {getFieldDecorator('radio', { initialValue: 1 })(
                                <Radio.Group >
                                    <Radio value={1}>
                                        <span>使用移动折扣出价</span>
                                    </Radio>
                                    <Radio value={3}>
                                        <span>使用自定义出价（价格不变）</span>
                                    </Radio>
                                    <Radio value={2}>
                                        <span>自定义出价：</span>
                                        {getFieldDecorator( 'value' )( <Input addonAfter="元" className="input-price"/> )}
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    )}
                    {activeKey == 4 && type != 2 && (
                        <Form.Item>
                            <span>自定义出价：</span>
                            {getFieldDecorator( 'value' )( <Input addonAfter="元" className="input-price"/> )}
                        </Form.Item>
                    )}
                    {( activeKey == 1 || activeKey == 3 ) && (
                        <Form.Item>
                            不得高于：{getFieldDecorator('limit', { initialValue: 1 })( <Input addonAfter="元" className="input-price"/> )}
                        </Form.Item>
                    )}
                    {isShowNotOptimizeStatus && (
                        <Form.Item >
                            <hr/> {getFieldDecorator( 'isNotSetOptimize' )(
                                <Checkbox >关键词设为不自动优化?</Checkbox>
                            )}
                            <Tooltip title="当关键词为不自动优化时,系统不会再优化价格;当关键词优化时,系统会根据限价调整关键词价格" arrowPointAtCenter>
                                <Icon type="wenhao"/>
                            </Tooltip>
                        </Form.Item>
                    )}
                    <div className="footer">
                        <Button type="primary" htmlType="submit">确定</Button>
                        <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                    </div>
                </Form>
            </div>
        )
    }
}
