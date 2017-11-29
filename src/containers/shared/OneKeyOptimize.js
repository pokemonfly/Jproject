import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import classNames from 'classnames'
import {
    Layout,
    Checkbox,
    Select,
    Tooltip,
    InputNumber,
    Input,
    Button,
    Alert,
    Form,
    Row,
    Radio,
    Switch,
    Col
} from 'antd'
import { pick, uniq, isEqual } from 'lodash'
import Icon from '@/containers/shared/Icon';
import { Dialog } from '@/containers/shared/Dialog';
import { postOneKeyOptimizations } from './OneKeyRedux'
import './OneKeyOptimize.less'
const Option = Select.Option;

//TODO  缺少积分兑换逻辑  联动的检查剩一半 确认弹窗  后续轮询  优化宝贝数量达到上限
@Dialog( { title: '一键优化', width: 800, hasForm: true, hasConnect: true } )
@connect( state => ( { query: state.location.query } ), dispatch => ( bindActionCreators( {
    postOneKeyOptimizations
}, dispatch ) ), null, { withRef: true } )
@Form.create( { withRef: true } )
export default class OneKeyOptimize extends React.Component {
    static defaultProps = {
        isMandate: true,
        keywordsPage: true
    }
    state = {
        ruleSw: false
    }
    componentDidUpdate() {
        if ( this._forceCheck ) {
            this.props.form.validateFields( { force: true } );
            this._forceCheck = false
        }
    }
    reset() {
        this.props.form.resetFields()
    }
    onClickRuleSw = () => {
        this.setState( {
            ruleSw: !this.state.ruleSw
        } )
    }
    onSwitchChange = ( key, checked ) => {
        // 必须保证pc 或 无线选中一个
        if ( !checked ) {
            this.props.form.setFieldsValue( { [ key ]: true } )
        }
    }
    okCallback( closeHandler ) {
        const { keywordsPage, adgroupIds, query } = this.props;
        this.props.form.validateFields( ( err, formObj ) => {
            if ( !err ) {
                let commitObj = {
                    campaignId: query.campaignId,
                    keywordsPage: keywordsPage,
                    adgroupIds: adgroupIds || [query.adgroupId],
                    ...pick( formObj, [
                        // 平台选择
                        'rulePlatform',
                        // * 优化改价
                        'changePriceType',
                        // * 优化创意  是否优化创意标题
                        'optimizeCreativeTitle',
                        // 是否主图前4覆盖创意图
                        'coverCreativeImg'
                    ] ),
                    // 优化删词 0:标准 1:强制 2:删除和宝贝类目不相等的词 3:按照关键词报表数据进行删词
                    'delWordType': 3
                };
                // * 优化删词  删除7天没展现词
                if ( formObj.del7NoImpression ) {
                    commitObj = {
                        ...commitObj,
                        ...pick( formObj, [ 'del7NoImpression', 'noImpressionDay' ] )
                    }
                }
                // 删除14天没点击词
                if ( formObj.del14NoClick ) {
                    commitObj = {
                        ...commitObj,
                        ...pick( formObj, [ 'del14NoClick', 'noClickDay' ] )
                    }
                }
                let delWordRules = [],
                    ruleIds = [ 1, 2, 5 ];
                ruleIds.forEach( id => {
                    let d = formObj['rule' + id + 'Day'],
                        p = formObj['rule' + id + 'Per'];
                    if ( formObj['rule' + id] && d && p ) {
                        delWordRules.push( {
                            "ruleId": id,
                            "params": [ d, p ]
                        } )
                    }
                } )
                delWordRules.length && ( commitObj.delWordRules = delWordRules )
                // * 优化改价 0:标准 1:价格合法化 2:一键设置全网均价 3:所有关键词指定出价 4:所有关键词指定往上调价  默认-1:不优化
                commitObj.changeMobilePriceType = commitObj.changePriceType
                switch ( commitObj.changePriceType ) {
                    case 2:
                        commitObj.changePriceType = formObj.pcChangePriceType ? 2:
                        -1;
                        commitObj.changeMobilePriceType = formObj.wirelessChangePriceType ? 2:
                        -1;
                        // isChangeTag 不传接口500
                        commitObj = {
                            ...commitObj,
                            isChangeTag: false,
                            ...pick( formObj, [ 'wnaPercentage', 'isChangeTag' ] )
                        }
                        // 全网均价的上限
                        if ( formObj.wnaUpperPrice ) {
                            commitObj.wnaUpperPrice = formObj.wnaUpperPrice * 100
                        }
                        break;
                    case 3:
                        commitObj = {
                            ...commitObj,
                            ...pick( formObj, [ 'specificPrice', 'specificMobilePrice' ] )
                        }
                        break;
                    case 4:
                        let direction = commitObj.direction;
                        commitObj = {
                            ...commitObj,
                            ...pick( formObj, [ 'specificAddPrice', 'specificAddMobilePrice' ] )
                        }
                        commitObj.specificAddPrice *= direction
                        commitObj.specificAddMobilePrice *= direction
                        //所有关键词指定往上调价 上限
                        if ( formObj.saUpperPrice && direction == 1 ) {
                            commitObj.saUpperPrice = formObj.saUpperPrice * 100
                        }
                        commitObj.changePriceRules = [
                            {
                                "ruleId": direction == 1 ^ formObj.ruleType == "PPC" ? 3: 4,
                                "params": [ formObj.ruleValue, formObj.ruleType ]
                            }
                        ]
                        break;
                }
                // * 修改匹配方式
                if ( formObj.specificMatchScope > -1 ) {
                    commitObj.specificMatchScope = formObj.specificMatchScope
                }
                // * 搜索人群优化
                let searchCrowdType = formObj.searchCrowdType;
                switch ( searchCrowdType ) {
                    case 1:
                        commitObj.forceAddCrowd = true
                        commitObj.newCrowdDiscount = formObj.newCrowdDiscount
                        break;
                    case 2:
                        commitObj.batchUpdateCrowdDiscount = formObj.crowdPriceRange * formObj.crowdPrice
                        break;
                    case 3:
                        commitObj.batchDeleteCrowd = true
                        break;
                }
                commitObj.searchCrowdType = searchCrowdType == -1 ? -1 : 0;
                // TODO  如果激活将优化将前4张主图作为创意替换现有创意  二度确认框
                if ( commitObj.coverCreativeImg ) {}

                this.props.postOneKeyOptimizations( commitObj );
                closeHandler();
            }
        } )
    }
    inputMaker( name, cfg, com ) {
        const { getFieldError, getFieldDecorator } = this.props.form;
        const clz = classNames( { 'has-error': getFieldError( name ) } )
        return ( <span className={clz}>
            {getFieldDecorator( name, cfg )( com )}
        </span> )
    }

    forceCheck = () => {
        this._forceCheck = true;
    }
    render() {
        const { ruleSw } = this.state
        const { isMandate } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form;
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
        const priceCfg = {
            min: 0.05
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
                        getFieldDecorator( 'del7NoImpression', { valuePropName: 'checked' } )( <Checkbox onChange={this.forceCheck}>
                            删除 {
                                this.inputMaker( 'noImpressionDay', {
                                    initialValue: 7,
                                    rules: [
                                        {
                                            required: getFieldValue( 'del7NoImpression' )
                                        }
                                    ]
                                }, ( <InputNumber {...inputDayCfg}/> ) )
                            }
                            天没展现词
                        </Checkbox> )
                    }
                </Col>
                <Col {...colRightCfg}>
                    {
                        getFieldDecorator( 'rule1', { valuePropName: 'checked' } )( <Checkbox onChange={this.forceCheck}>
                            {
                                this.inputMaker( 'rule1Day', {
                                    initialValue: 7,
                                    rules: [
                                        {
                                            required: getFieldValue( 'rule1' )
                                        }
                                    ]
                                }, ( <InputNumber {...inputDayCfg}/> ) )
                            }
                            天点击率小于 {
                                this.inputMaker( 'rule1Per', {
                                    initialValue: 1,
                                    rules: [
                                        {
                                            required: getFieldValue( 'rule1' )
                                        }
                                    ]
                                }, ( <InputNumber {...perCfg}/> ) )
                            }
                            %
                        </Checkbox> )
                    }
                </Col>
            </Row>
            <Row>
                <Col {...colLeftCfg}>
                    {
                        getFieldDecorator( 'del14NoClick', { valuePropName: 'checked' } )( <Checkbox onChange={this.forceCheck}>
                            删除 {
                                this.inputMaker( 'noClickDay', {
                                    initialValue: 14,
                                    rules: [
                                        {
                                            required: getFieldValue( 'del14NoClick' )
                                        }
                                    ]
                                }, ( <InputNumber {...inputDayCfg}/> ) )
                            }
                            天没点击词
                        </Checkbox> )
                    }
                </Col>
                <Col {...colRightCfg}>
                    {
                        getFieldDecorator( 'rule2', { valuePropName: 'checked' } )( <Checkbox onChange={this.forceCheck}>
                            {
                                this.inputMaker( 'rule2Day', {
                                    initialValue: 7,
                                    rules: [
                                        {
                                            required: getFieldValue( 'rule2' )
                                        }
                                    ]
                                }, ( <InputNumber {...inputDayCfg}/> ) )
                            }
                            天点击率小于宝贝点击率的 {
                                this.inputMaker( 'rule2Per', {
                                    initialValue: 100,
                                    rules: [
                                        {
                                            required: getFieldValue( 'rule2' )
                                        }
                                    ]
                                }, ( <InputNumber {...perCfg}/> ) )
                            }
                            %
                        </Checkbox> )
                    }
                </Col>
            </Row>
            <Row>
                <Col {...colLeftCfg} span={20}>
                    {
                        getFieldDecorator( 'rule5', { valuePropName: 'checked' } )( <Checkbox onChange={this.forceCheck}>
                            {
                                this.inputMaker( 'rule5Day', {
                                    initialValue: 7,
                                    rules: [
                                        {
                                            required: getFieldValue( 'rule5' )
                                        }
                                    ]
                                }, ( <InputNumber {...inputDayCfg}/> ) )
                            }
                            天点击率小于行业点击率的 {
                                this.inputMaker( 'rule5Per', {
                                    initialValue: 100,
                                    rules: [
                                        {
                                            required: getFieldValue( 'rule5' )
                                        }
                                    ]
                                }, ( <InputNumber {...perCfg}/> ) )
                            }
                            %
                        </Checkbox> )
                    }
                </Col>
            </Row>
            <hr className="line"/>
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
                        {
                            isMandate && ( <Col {...colRightCfg}>
                                <Radio value={1}>一键低于出价上限</Radio>
                            </Col> )
                        }
                    </Row>
                    <Row>
                        <Col {...colLeftCfg}>
                            <Radio value={2}>一键设置全网均价</Radio>
                            {
                                getFieldValue( 'changePriceType' ) == 2 && ( <div className="detail-setting">
                                    <div>
                                        <span>PC：
                                        </span>
                                        {
                                            getFieldDecorator( 'pcChangePriceType', {
                                                valuePropName: 'checked',
                                                initialValue: true
                                            } )( <Switch onChange={this.onSwitchChange.bind( this, 'wirelessChangePriceType' )}/> )
                                        }
                                        <span className="mgl">无线：
                                        </span>
                                        {
                                            getFieldDecorator( 'wirelessChangePriceType', {
                                                valuePropName: 'checked',
                                                initialValue: true
                                            } )( <Switch onChange={this.onSwitchChange.bind( this, 'pcChangePriceType' )}/> )
                                        }
                                    </div>
                                    <div>
                                        <span className="wna-tag">设置为全网均价的
                                        </span>
                                        {getFieldDecorator( 'wnaPercentage', { initialValue: 100 } )( <InputNumber min={50} max={200}/> )}
                                        <span>%</span>
                                    </div>
                                    <div>
                                        <span className="wna-tag">价格不得高于</span>
                                        {getFieldDecorator( 'wnaUpperPrice' )( <InputNumber min={0.05} max={99.99}/> )}
                                        <span>元</span>
                                    </div>
                                    {
                                        getFieldValue( 'wirelessChangePriceType' ) && ( <div>
                                            {
                                                getFieldDecorator( 'isChangeTag', { valuePropName: 'checked' } )( <Checkbox>
                                                    修改成单独出价
                                                </Checkbox> )
                                            }
                                        </div> )
                                    }
                                </div> )
                            }
                        </Col>
                        <Col {...colRightCfg}>
                            <Radio value={3}>所有关键词指定出价</Radio>
                            {
                                getFieldValue( 'changePriceType' ) == 3 && ( <div className="detail-setting">
                                    <div>
                                        <span className="spe-tag">PC:</span>
                                        {getFieldDecorator( 'specificPrice' )( <InputNumber/> )}
                                        <span>元</span>
                                    </div>
                                    <div>
                                        <span className="spe-tag">无线:</span>
                                        {getFieldDecorator( 'specificMobilePrice' )( <InputNumber/> )}
                                        <span>元</span>
                                    </div>
                                </div> )
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col {...colLeftCfg}>
                            <Radio value={4}>关键词指定</Radio>
                            {
                                getFieldDecorator( 'direction', { initialValue: '1' } )( <Select className="select">
                                    <Option value="1">上调</Option>
                                    <Option value="-1">下调</Option>
                                </Select> )
                            }
                            {
                                getFieldValue( 'changePriceType' ) == 4 && ( <span className="rule-sw" onClick={this.onClickRuleSw}>关键词规则
                                    <Icon type={ruleSw ? "xiangshang" : "xiangxia"}/></span> )
                            }
                            {
                                getFieldValue( 'changePriceType' ) == 4 && ( <div className="detail-setting">
                                    {
                                        ruleSw && ( <div className="detail-setting-sw">
                                            <div>
                                                对符合以下条件的关键词进行操作：
                                            </div>
                                            <div>
                                                {getFieldDecorator( 'ruleValue', { initialValue: 7 } )( <InputNumber {...inputDayCfg}/> )}
                                                天 {
                                                    getFieldDecorator( 'ruleType', { initialValue: 'ROI' } )( <Select className="select">
                                                        <Option value="ROI">ROI</Option>
                                                        <Option value="PPC">PPC</Option>
                                                        <Option value="CTR">点击率</Option>
                                                    </Select> )
                                                }
                                                {getFieldValue( 'ruleType' ) == "PPC" ^ getFieldValue( 'direction' ) == '1' ? '大于等于宝贝' : '小于宝贝'}
                                            </div>
                                            <hr className="line"/>
                                        </div> )
                                    }
                                    <div>
                                        <span className="spe-tag">PC:</span>
                                        {getFieldDecorator( 'specificAddPrice' )( <InputNumber {...priceCfg}/> )}
                                        元
                                    </div>
                                    <div>
                                        <span className="spe-tag">无线:</span>
                                        {getFieldDecorator( 'specificAddMobilePrice' )( <InputNumber {...priceCfg}/> )}
                                        元
                                    </div>
                                    {
                                        getFieldValue( 'direction' ) == '1' && ( <div>
                                            <span className="spe-tag">价格不高于:</span>
                                            {getFieldDecorator( 'saUpperPrice' )( <InputNumber min={0.05} max={99.99}/> )}
                                            元
                                        </div> )
                                    }
                                </div> )
                            }
                        </Col>
                    </Row>
                </Radio.Group> )
            }
            <hr className="line"/>
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
                                    1. 系统会尽可能添加4个创意标题来优化质量分, 并可能相应添加4个创意图, 所以会出现重复创意图
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
                getFieldValue( 'optimizeCreativeTitle' ) && ( <Row>
                    <Col {...colLeftCfg} offset={2}>
                        {
                            getFieldDecorator( 'coverCreativeImg', { valuePropName: 'checked' } )( <Checkbox>
                                将前4张主图作为创意替换现有创意
                            </Checkbox> )
                        }
                    </Col>
                </Row> )
            }
            <hr className="line"/>
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
            <hr className="line"/>
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
                                对所有宝贝添加优质访客人群,默认溢价为 {getFieldDecorator( 'newCrowdDiscount', { initialValue: 5 } )( <InputNumber min={5} max={300}/> )}
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
