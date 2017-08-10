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
export default class EditWordPrice extends React.Component {
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
    getFormContent( ) {
        let dayPrice = 0
        const { getFieldDecorator } = this.props.form;
        const { mobileIsDefaultPrice, mode } = this.props
        const { discountPrice, currentPrice } = this.state
        if ( mode == 'pc' ) {
            return (
                <div>
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
                                        initialValue: currentPrice,
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
                </div>
            )
        } else {
            return (
                <div>
                    <FormItem>
                        {getFieldDecorator('radio-group', { initialValue: 2 })(
                            <RadioGroup onChange={this.onRadioChange}>
                                <Radio value={2}>
                                    <span>使用移动折扣出价：</span>
                                    <span>{discountPrice}
                                        元</span>
                                </Radio><br/>
                                <Radio value={0}>
                                    <span>
                                        <Icon type="zidingyi"/>
                                        使用无线全网均价：
                                        <Tooltip title="快车计算所得的无线全网均价为无线站内的全网均价" arrowPointAtCenter>
                                            <Icon type="wenhao"/>
                                        </Tooltip>
                                    </span>
                                    {getFieldDecorator('select', { initialValue: "1" })(
                                        <Select onChange={this.onSelectChange} className="select-percent">
                                            {this.renderOption( )}
                                        </Select>
                                    )}
                                    <span>{dayPrice.toFixed( 2 )}
                                        元</span>
                                </Radio><br/>
                                <Radio value={0}>
                                    <span>
                                        <Icon type="zidingyi"/>
                                        自定义无线出价：
                                    </span>
                                    {getFieldDecorator('price', {
                                        initialValue: currentPrice,
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
                </div>
            )
        }
    }
    constructor( props ) {
        super( props )
        const {
            maxPrice,
            maxMobilePrice,
            mobileDiscount,
            currentDiscount,
            mode,
            mobileIsDefaultPrice
        } = props;
        let price,
            currentPrice,
            modeStr,
            discountPrice
        if ( mode == 'pc' ) {
            price = ( maxPrice / 100 * currentDiscount / 100 ).toFixed( 2 );
            currentPrice = ( maxPrice / 100 ).toFixed( 2 );
            modeStr = 'PC'
        } else {
            discountPrice = ( maxPrice / 100 * mobileDiscount / 100 ).toFixed( 2 )
            if ( mobileIsDefaultPrice == 0 ) {
                price = ( maxMobilePrice / 100 * currentDiscount / 100 ).toFixed( 2 );
                currentPrice = ( maxMobilePrice / 100 ).toFixed( 2 );
            } else {
                price = ( maxPrice / 100 * currentDiscount / 100 * mobileDiscount / 100 ).toFixed( 2 );
                currentPrice = discountPrice;
            }
            modeStr = '无线'
        }
        this.state = {
            price,
            currentPrice,
            modeStr,
            discountPrice
        }
    }
    render( ) {
        const {
            optimizeStatus = '1',
            currentDiscount
        } = this.props;
        const { price, currentPrice, modeStr } = this.state
        return (
            <Form className="float-panel edit-word-price" onSubmit={this.onSubmit}>
                <p className="header">修改{modeStr}出价：</p>
                {optimizeStatus == '1' && ( <Alert message="如果您手动修改了价格，该词将设为不自动优化。但您可以再手动开启" type="warning"/> )}
                <p className="describe">{modeStr}实际出价：{price}元=当前{modeStr}出价（{currentPrice}）* 当前分时折扣（{currentDiscount}%）</p>
                {this.getFormContent( )}
                <div className="footer">
                    <Button type="primary" htmlType="submit">确定</Button>
                    <a onClick={this.props.onClose} className="cancel-btn">取消</a>
                </div>
            </Form>
        )
    }
}
