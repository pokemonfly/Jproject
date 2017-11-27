import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {
    Layout,
    Checkbox,
    Select,
    Tooltip,
    InputNumber,
    Button,
    Alert,
    Form,
    Row,
    Radio,
    Col
} from 'antd'
import { pick, uniq, isEqual } from 'lodash'
import Icon from '@/containers/shared/Icon';
import { Dialog } from '@/containers/shared/Dialog';
import { postOneKeyOptimizations } from './OneKeyRedux'
import './OneKeyOptimize.less'

@Dialog( { title: '一键优化', width: 800, hasForm: true, hasConnect: true } )
@connect( state => ( { query: state.location.query } ), dispatch => ( bindActionCreators( {
    postOneKeyOptimizations
}, dispatch ) ), null, { withRef: true } )
@Form.create( { withRef: true } )
export default class OneKeyOptimize extends React.Component {
    static defaultProps = {
        keywordsPage: true
    }
    okCallback( closeHandler ) {
        this.props.form.validateFields( ( err, formObj ) => {
        if ( !err ) {
                    let commitObj = {
                        ...pick( this.props, [ 'keywordsPage', 'adgroupIds' ] ),
                        ...pick( formObj, [
                            // 平台选择
                            'rulePlatform',
                            // * 优化删词   删除7点没展现词
                            'del7NoImpression',
                            // 删除14天没点击词
                            'del14NoClick',
                            // * 优化改价
                            'changePriceType',
                            // * 优化创意  是否优化创意标题
                            'optimizeCreativeTitle'
                            // 是否主图前4覆盖创意图
                            'coverCreativeImg',
                            // * 修改匹配方式
                            'specificMatchScope',
                            // * 搜索人群优化
                            'searchCrowdType'
                        ],
                        // 优化删词 0:标准 1:强制 2:删除和宝贝类目不相等的词 3:按照关键词报表数据进行删词
                        'delWordType' : 3 }
                    if ( commitObj.del7NoImpression ) {
                        commitObj.noImpressionDay = formObj.noImpressionDay
                    }
                    if ( commitObj.del14NoClick ) {
                        commitObj.noClickDay = formObj.noClickDay
                    }
                    //优化改价 0:标准 1:价格合法化 2:一键设置全网均价 3:所有关键词指定出价 4:所有关键词指定往上调价  默认-1:不优化
                    switch ( commitObj.changePriceType ) {}
                    //所有关键词指定往上调价 saUpperPrice 全网均价的上限 wnaUpperPrice
                    //

                    //如果激活将优化将前4张主图作为创意替换现有创意  二度确认框
                    if ( commitObj.coverCreativeImg ) {}

                    this.postOneKeyOptimizations( commitObj )closeHandler();
            }
        }
    ) }
render() {
    const { getFieldDecorator } = this.props.form;
    const colLeftCfg = {
        span: 11,
        offset: 1
    }
    const colRightCfg = {
        span: 12
    }
    const inputDayCfg = {
        min: 1,
        precision: 0
    }
    const perCfg = {
        min: 0.01
    }
    return ( <Form className="one-key-optimize ">
        <Row>
            <Col>
                <Icon type="ci"/>
                <b>优化删词</b>
                <span className="sub-text">(近30天成交/加购/收藏词不会删除)</span>
                {
                    getFieldDecorator( 'rulePlatform', { initialValue: 'PLATFORM_SUMMARY' } )( <Select className="select">
                        <Option value="PLATFORM_SUMMARY">汇总</Option>
                        <Option value="PLATFORM_PC">PC</Option>
                        <Option value="PLATFORM_MOBILE">无线</Option>
                    </Select> )
                }
            </Col>
        </Row>
        <Row>
            <Col {...colLeftCfg}>
                {
                    getFieldDecorator( 'del7NoImpression', { valuePropName: 'checked' } )( <Checkbox>
                        删除 {getFieldDecorator( 'noImpressionDay', { initialValue: 7 } )( <InputNumber {...inputDayCfg}/> )}
                        天没展现词
                    </Checkbox> )
                }
            </Col>
            <Col {...colRightCfg}>
                {
                    getFieldDecorator( 'rule1', { valuePropName: 'checked' } )( <Checkbox>
                        {getFieldDecorator( 'rule1Day', { initialValue: 7 } )( <InputNumber {...inputDayCfg}/> )}
                        天点击率小于 {getFieldDecorator( 'rule1Per', { initialValue: 1 } )( <InputNumber {...perCfg}/> )}
                        %
                    </Checkbox> )
                }
            </Col>
        </Row>
        <Row>
            <Col {...colLeftCfg}>
                {
                    getFieldDecorator( 'del14NoClick', { valuePropName: 'checked' } )( <Checkbox>
                        删除 {getFieldDecorator( 'noClickDay', { initialValue: 14 } )( <InputNumber {...inputDayCfg}/> )}
                        天没点击词
                    </Checkbox> )
                }
            </Col>
            <Col {...colRightCfg}>
                {
                    getFieldDecorator( 'rule2', { valuePropName: 'checked' } )( <Checkbox>
                        {getFieldDecorator( 'rule2Day', { initialValue: 7 } )( <InputNumber {...inputDayCfg}/> )}
                        天点击率小于宝贝点击率的 {getFieldDecorator( 'rule2Per', { initialValue: 100 } )( <InputNumber {...perCfg}/> )}
                        %
                    </Checkbox> )
                }
            </Col>
        </Row>
        <Row>
            <Col {...colLeftCfg} span={20}>
                {
                    getFieldDecorator( 'rule5', { valuePropName: 'checked' } )( <Checkbox>
                        {getFieldDecorator( 'rule5Day', { initialValue: 7 } )( <InputNumber {...inputDayCfg}/> )}
                        天点击率小于行业点击率的 {getFieldDecorator( 'rule5Per', { initialValue: 100 } )( <InputNumber {...perCfg}/> )}
                        %
                    </Checkbox> )
                }
            </Col>
        </Row>
        <hr class="line"/>
        <Row>
            <Col>
                <Icon type="money"/>
                <b>优化改价</b>
            </Col>
        </Row>
        {
            getFieldDecorator( 'changePriceType', { initialValue: -1 } )( <Radio.Group className="radio-group">
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={-1}>不调整出价</Radio>
                    </Col>
                    <Col {...colRightCfg}>
                        <Radio value={1}>一键低于出价上限</Radio>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={2}>一键设置全网均价</Radio>
                    </Col>
                    <Col {...colRightCfg}>
                        <Radio value={3}>所有关键词指定出价</Radio>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={4}>关键词指定</Radio>
                    </Col>
                </Row>
            </Radio.Group> )
        }
        <hr class="line"/>
        <Row>
            <Col>
                <Icon type="shuzichuangyi"/>
                <b>优化创意</b>
            </Col>
        </Row>
        <Row>
            <Col {...colLeftCfg}>
                {
                    getFieldDecorator( 'optimizeCreativeTitle', { valuePropName: 'checked' } )( <Checkbox>
                        优化创意标题
                        <Tooltip
                            title={( <span>
                                1. 系统会尽可能添加4个创意标题来优化质量分, 并可能相应添加4个创意图, 所以会出现重复创意图 & #xa;
                                <br/>
                                2. 请放心, 系统在添加创意图时, 会优先选择效果较好的创意图, 所以不会对宝贝的效果造成影响.
                            </span> )}
                            arrowPointAtCenter="arrowPointAtCenter">
                            <Icon type="wenhao"/>
                        </Tooltip>
                    </Checkbox> )
                }
            </Col>
        </Row>
        {
            this.props.form.getFieldValue( 'optimizeCreativeTitle' ) && ( <Row>
                <Col {...colLeftCfg} offset={2}>
                    {
                        getFieldDecorator( 'coverCreativeImg', { valuePropName: 'checked' } )( <Checkbox>
                            将前4张主图作为创意替换现有创意
                        </Checkbox> )
                    }
                </Col>
            </Row> )
        }
        <hr class="line"/>
        <Row>
            <Col>
                <Icon type="xiugai"/>
                <b>修改匹配方式</b>
            </Col>
        </Row>
        {
            getFieldDecorator( 'specificMatchScope', { initialValue: -1 } )( <Radio.Group className="radio-group">
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={-1}>不调整出价</Radio>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={4}>广泛匹配</Radio>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={1}>精准匹配</Radio>
                    </Col>
                </Row>
            </Radio.Group> )
        }
        <hr class="line"/>
        <Row>
            <Col>
                <Icon type="renqun"/>
                <b>搜索人群优化</b>
            </Col>
        </Row>
        {
            getFieldDecorator( 'searchCrowdType', { initialValue: -1 } )( <Radio.Group className="radio-group">
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={-1}>不调整出价</Radio>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={1}>
                            对所有宝贝添加优质访客人群,默认溢价为 {getFieldDecorator( 'crowDiscountInput', { initialValue: 5 } )( <InputNumber min={5} max={300}/> )}
                            %
                        </Radio>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={2}>
                            修改已有人群溢价 {
                                getFieldDecorator( 'crowdPriceRange', { initialValue: '1' } )( <Select className="select">
                                    <Option value="1">上调</Option>
                                    <Option value="-1">下调</Option>
                                </Select> )
                            }
                            {getFieldDecorator( 'crowdPrice', { initialValue: 5 } )( <InputNumber {...perCfg}/> )}
                            %
                        </Radio>
                    </Col>
                </Row>
                <Row>
                    <Col {...colLeftCfg}>
                        <Radio value={3}>删除所有搜索人群</Radio>
                    </Col>
                </Row>
            </Radio.Group> )
        }
    </Form> )
}
}
