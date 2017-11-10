import React from 'react';
import {
    Layout,
    Alert,
    Radio,
    Select,
    Form,
    InputNumber,
    Tooltip,
    Switch,
    Button
} from 'antd'
import Dialog from '@/containers/shared/Dialog';
import { pick } from 'lodash'
import './EditQScoreLimit.less'

@Dialog({ title: '质量分下限', width: 320, hasForm: true, sid: "EditQScoreLimit" })
@Form.create({ withRef: true })
export default class EditQScoreLimit extends React.Component {
    state = {
        visible: this.props.isOpenQScoreLimit == '1'
    }
    okCallback( closeHandler ) {
        this.props.form.validateFields(( err, formObj ) => {
            if ( !err ) {
                let commitObj = {
                    ...pick(this.props, [ 'adgroupId', 'campaignId' ]),
                    ...pick(formObj, [ 'qScoreLimitOpenStatus', 'pcQScoreFloor', 'mobileQScoreFloor' ])
                }
                this.props.api( commitObj )
                closeHandler( )
            }
        });
        return false
    }
    onChangeQsScore = ( ) => {
        this.setState({
            visible: !this.state.visible
        })
    }
    render( ) {
        const { pcQScoreFloor, mobileQScoreFloor, isOpenQScoreLimit } = this.props;
        const { visible } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="edit-qscore-limit ">
                <Form.Item>
                    {getFieldDecorator('qScoreLimitOpenStatus', {
                        valuePropName: 'checked',
                        initialValue: isOpenQScoreLimit == '1'
                    })( <Switch onChange={this.onChangeQsScore} checkedChildren="开" unCheckedChildren="关"/> )}
                </Form.Item>
                {visible && (
                    <div className="ant-form-inline">
                        <Form.Item>
                            <span className="score-type">PC：</span>
                            {getFieldDecorator('pcQScoreFloor', {
                                initialValue: pcQScoreFloor > -1 ? pcQScoreFloor : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入质量分'
                                    }
                                ]
                            })( <InputNumber className="input-num" min={1} max={10} precision={0}/> )}
                        </Form.Item>
                        <Form.Item>
                            <span className="score-type">无线：</span>
                            {getFieldDecorator('mobileQScoreFloor', {
                                initialValue: mobileQScoreFloor > -1 ? mobileQScoreFloor : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入质量分'
                                    }
                                ]
                            })( <InputNumber className="input-num" min={1} max={10} precision={0}/> )}
                        </Form.Item>
                    </div>
                )}
            </Form>
        )
    }
}
