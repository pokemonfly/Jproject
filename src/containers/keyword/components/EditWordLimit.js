import React from 'react';
import {
    Modal,
    Layout,
    Alert,
    Radio,
    Select,
    Form,
    InputNumber,
    Tooltip,
    Button,
    Switch
} from 'antd'
import { pick } from 'lodash'
import { SimpleDialog } from '@/containers/shared/Dialog';
import './EditWordLimit.less'

@SimpleDialog({ title: '出词数量控制', width: 370, hasForm: true, sid: "EditWordLimit" })
@Form.create({ withRef: true })
export default class EditWordLimit extends React.Component {
    state = {
        visible: this.props.wordLimit != -1
    }
    okCallback( closeHandler ) {
        this.props.form.validateFields(( err, formObj ) => {
            if ( !err ) {
                let commitObj = pick(this.props, [ 'adgroupIds', 'campaignId' ])
                commitObj = {
                    scope: 1,
                    optimizationSettingMap: {
                        add_upper_limit: !formObj.wordLimitSwitch ? -1 : formObj.wordLimit
                    },
                    ...commitObj
                }
                this.props.api( commitObj );
                closeHandler( )
            }
        });
        return false
    }
    onChangeCommit = ( ) => {
        this.setState({
            visible: !this.state.visible
        })
    }
    render( ) {
        const { getFieldDecorator } = this.props.form;
        const { visible } = this.state
        const { wordLimit } = this.props
        return (
            <Form onSubmit={this.commit} className="edit-word-limit">
                <Form.Item>
                    {getFieldDecorator('wordLimitSwitch', {
                        valuePropName: 'checked',
                        initialValue: wordLimit != -1
                    })( <Switch onChange={this.onChangeCommit} checkedChildren="开" unCheckedChildren="关"/> )}
                </Form.Item>
                {visible && (
                    <Form.Item>
                        <span>
                            当宝贝多于（包含） {getFieldDecorator('wordLimit', {
                                initialValue: wordLimit == -1 ? '' : wordLimit,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入数量'
                                    }
                                ]
                            })( <InputNumber className="input-num" min={1} max={200} precision={0}/> )}
                            个关键词时，系统不再加词。
                        </span>
                    </Form.Item>
                )}
            </Form>
        )
    }
}
