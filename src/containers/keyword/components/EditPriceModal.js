import React from 'react';
import {
    Modal,
    Radio,
    Form,
    InputNumber,
    Checkbox,
    Tooltip
} from 'antd'
import { pick } from 'lodash'
import './EditPriceModal.less'
import Icon from '@/containers/shared/Icon'

@Form.create()
export default class EditPriceModal extends React.Component {
    state = {
        visible: false
    }
    setVisible( visible ) {
        this.setState( { visible } )
    }
    showConfirm() {}
    commit = () => {
        const { editType, wordPriceLimit } = this.props
        const formObj = this.props.form.getFieldsValue();
        let commitObj = pick( this.props, [ 'adgroupId', 'campaignId' ] )
        switch ( editType ) {
            case 'pc':
                commitObj.wordMaxPriceScope = formObj.wordMaxPriceScope
                commitObj.wordMaxPrice = commitObj.wordMaxPriceScope == 1 ? wordPriceLimit:
                formObj.wordMaxPrice;
                break;
            case 'mobile':
                commitObj.mobileWordMaxPrice = formObj.mobileWordMaxPrice;
                commitObj.mobileSinglePrice = formObj.mobileSinglePrice;
                commitObj.mobileWordMaxPriceScope = 2;
                break;
            case 'mobileDiscount':
                // isOptimizeMobileDiscount
                commitObj.mobileDiscount = formObj.mobileDiscountType == 2 ? formObj.mobileDiscount:
                -1
                break;
        }
        console.log( 'EditPriceModal commit Obj: ', commitObj )
        this.props.api( commitObj )
        this.setVisible( false );
    }
    close = () => {
        this.setVisible( false );
    }
    show = () => {
        this.setVisible( true );
    }
    renderContent() {
        const { getFieldDecorator } = this.props.form;
        const {
            editType,
            wordPriceLimit,
            wordMaxPrice,
            campaignMobileDiscount,
            mobileDiscountType,
            mobileWordMaxPrice,
            mobileDiscount,
            isOptimizeMobileDiscount
        } = this.props
        const numberCfg = {
            min: 0.05,
            max: 99.99
        }
        return ( <Form>
            {
                editType == 'pc' && getFieldDecorator( 'wordMaxPriceScope', {
                    initialValue: wordMaxPrice == -1 ? 1: 2
                } )( <Radio.Group onChange={this.onOptimizeChange}>
                    <Form.Item>
                        <Radio value={1}>
                            <span>使用计划PC最高限价：{wordPriceLimit}
                                元</span>
                        </Radio>
                    </Form.Item>
                    <Form.Item>
                        <Radio value={2}>
                            <span>使用宝贝PC最高限价：</span>
                            {
                                getFieldDecorator( 'wordMaxPrice', {
                                    initialValue: wordMaxPrice == -1 ? '': wordMaxPrice
                                } )( <InputNumber addonAfter="元" className="input-price" placeholder='0.05至99.99' {...numberCfg}/> )
                            }
                        </Radio>
                    </Form.Item>
                </Radio.Group> )
            }
            {
                editType == 'mobile' && ( <Form.Item>
                    <div>
                        <span>使用宝贝无线最高限价：</span>
                        {getFieldDecorator( 'mobileWordMaxPrice', { initialValue: mobileWordMaxPrice } )( <InputNumber addonAfter="元" className="input-price" placeholder='0.05至99.99' {...numberCfg}/> )}
                    </div>
                    {
                        getFieldDecorator( 'mobileSinglePrice', { initialValue: false } )( <Checkbox>将所有关键词无线出价改成单独出价
                            <Tooltip title="修改无线限价时，会将移动折扣出价的关键词改成自定义出价">
                                <Icon type="wenhao"/>
                            </Tooltip>
                        </Checkbox> )
                    }
                </Form.Item> )
            }
            {
                editType == 'mobileDiscount' && getFieldDecorator( 'mobileDiscountType', { initialValue: mobileDiscountType } )( <Radio.Group>
                    <Form.Item>
                        <Radio value={1}>
                            <span>{`使用计划移动折扣：${ campaignMobileDiscount }%`}</span>
                        </Radio>
                    </Form.Item>
                    <Form.Item>
                        <Radio value={2}>
                            <span>使用宝贝移动折扣：</span>
                            {getFieldDecorator( 'mobileDiscount', { initialValue: mobileDiscount } )( <InputNumber addonAfter="%" className="input-price" placeholder='0.05至99.99' {...numberCfg}/> )}
                        </Radio>
                    </Form.Item>
                </Radio.Group> )
            }
        </Form> )
    }
    render() {
        const { title } = this.props
        const { visible } = this.state
        return ( <div className="edit-price">
            <Icon type="xiugaibi" className="edit-icon" onClick={this.show}/>
            <Modal title={title} visible={visible} onOk={this.commit} onCancel={this.close} width={320} wrapClassName="edit-price-modal">
                {this.renderContent()}
            </Modal>
        </div> )
    }
}
