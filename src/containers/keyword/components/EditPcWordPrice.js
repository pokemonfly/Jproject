import React from 'react';
import {
    Layout,
    Alert,
    Radio,
    Select,
    Form,
    Input,
    Tooltip,
    Button
} from 'antd'
import Icon from '@/containers/shared/Icon';
import { validator } from '@/utils/constants'
import './EditWordPrice.less'
const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const selectItem = [
    {
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
]

@Form.create( )
export default class EditPcWordPrice extends React.Component {
    state = {
        value: 1
    }
    onRadioChange = ( e ) => {
        // this.setState({ value: e.target.value });
        this.props.form.validateFields(['price'], {
            force: e.target.value == 2
        });
    }
    onSelectChange = ( e ) => {}
    onSubmit = ( e ) => {
        e.preventDefault( );
        this.props.form.validateFields(( err, values ) => {
            if ( !err ) {
                console.log( 'Received values of form: ', values );
                this.props.onClose( );
            }
        });
    }

    renderOption( ) {
        return selectItem.map(i => (
            <Option value={i.value.toString( )} key={i.value}>{i.text}</Option>
        ))
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        const {
            optimizeStatus = '1',
            maxPrice,
            currentDiscount
        } = this.props;
        const pcPrice = ( maxPrice / 100 * currentDiscount / 100 ).toFixed( 2 );
        const pcCurrentPrice = ( maxPrice / 100 ).toFixed( 2 );
        let dayPrice = 0
        return (
            <Form className="float-panel edit-word-price" onSubmit={this.onSubmit}>
                <p className="header">修改PC出价：</p>
                {optimizeStatus == '1' && ( <Alert message="如果您手动修改了价格，该词将设为不自动优化。但您可以再手动开启" type="warning"/> )}
                <p className="describe">PC实际出价：{pcPrice}元=当前PC出价（{pcCurrentPrice}）* 当前分时折扣（{currentDiscount}%）</p>
                <FormItem>
                    {getFieldDecorator('radio-group', { initialValue: 1 })(
                        <RadioGroup onChange={this.onRadioChange}>
                            <Radio value={1}>
                                <span>使用PC全网均价：</span>
                                {getFieldDecorator('select', { initialValue: "1" })(
                                    <Select onChange={this.onSelectChange} className="select-percent">
                                        {this.renderOption( )}
                                    </Select>
                                )}
                                <span>{dayPrice.toFixed( 2 )}
                                    元</span>
                            </Radio><br/>
                            <Radio value={2}>
                                <span>使用PC全网均价：</span>
                                {getFieldDecorator('price', {
                                    initialValue: 1,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入'
                                        }, {
                                            validator: validator.editPrice
                                        }
                                    ]
                                })( <Input className="input-price"/> )}
                            </Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem className="mobile-setting">
                    {getFieldDecorator('mobileIsDefaultPrice', { initialValue: 0 })(
                        <RadioGroup>
                            <Radio value={0}>
                                <span>无线端设置为自定义模式（价格不会变动）</span>
                                <Tooltip title="该设置可以使PC端的改价不影响到无线端的价格变化" arrowPointAtCenter>
                                    <Icon type="wenhao"/>
                                </Tooltip>
                            </Radio><br/>
                            <Radio value={1}>
                                <span>无线端价格设置为折扣出价</span>
                                <Tooltip title="该设置可以使无线端价格跟随PC*当前的移动折扣出价" arrowPointAtCenter>
                                    <Icon type="wenhao"/>
                                </Tooltip>
                            </Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <div className="footer">
                    <Button type="primary" htmlType="submit">确定</Button>
                    <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                </div>
            </Form>
        )
    }
}
