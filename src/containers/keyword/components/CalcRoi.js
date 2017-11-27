import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {
    Layout,
    Alert,
    Radio,
    Select,
    Tooltip,
    Switch,
    Input,
    Button,
    Form
} from 'antd'
import moment from 'moment'
import { SimpleDialog } from '@/containers/shared/Dialog';
import EditableText from '@/containers/shared/EditableText';
import { pick } from 'lodash'
import { fetchAdgroupsProfiles, fetchAdgroupsProfit, postAdgroupsProfit } from './AdgroupRedux'
import { add, divide } from '@/utils/math';
import './CalcRoi.less'

@SimpleDialog( { title: 'ROI盈亏点', width: 580, hasForm: true, sid: "CalcRoi", footer: null } )
@Form.create( { withRef: true } )
export class CalcRoiDialog extends React.Component {
    state = {
        ...this.props
    }
    onPriceChange = () => {
        let r = true
        this.props.form.validateFields( ['price'], ( err ) => {
            r = !err
        } )
        return r;
    }
    calc = () => {
        this.props.form.validateFields( ( err, formObj ) => {
            if ( !err ) {
                let st = {
                    price: +formObj.price,
                    profit: +formObj.profit
                };
                this.props.api( {
                    ...this.props,
                    itemPrice: st.price,
                    itemProfit: st.profit
                } )
                this.setState( st )
            }
        } );
    }
    closeCallback = () => {
        this.props.onClose && this.props.onClose( this.state );
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { roi, price, profit } = this.state;
        let r = 0,
            trueRoi,
            symbol
        if ( profit && roi != null ) {
            trueRoi = +divide( price, profit ).toFixed( 2 )
            if ( trueRoi == roi ) {
                symbol = '='
            } else if ( trueRoi > roi ) {
                r = -1;
                symbol = '>'
            } else {
                r = 1;
                symbol = '<'
            }
        }
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 8
            }
        };
        const formTailLayout = {
            wrapperCol: {
                span: 8,
                offset: 6
            }
        };
        return ( <Form className="calc-roi">
            <Alert
                message={( <span>
                    当前您达到的ROI真的是赚钱的吗？
                    <a href="https://fuwu09212.bbs.taobao.com/detail.html?postId=6491701" target="_blank">
                        点击阅读文章了解该功能</a>
                </span> )}
                type="success"/>
            <Form.Item label="该商品客单价" {...formItemLayout}>
                {
                    getFieldDecorator( 'price', {
                        initialValue: price,
                        validateFirst: true,
                        rules: [
                            {
                                required: true,
                                message: '请输入客单价'
                            }, {
                                type: "number",
                                min: 0.01,
                                transform: v => +v,
                                range: true,
                                message: '请输入正确的客单价'
                            }
                        ]
                    } )( <EditableText width={120} onCommit={this.onPriceChange}/> )
                }
            </Form.Item>
            <Form.Item label="当前15天ROI" {...formItemLayout}>
                <span>{roi}</span>
            </Form.Item>
            <Form.Item label="请填写该商品利润" {...formItemLayout}>
                {
                    getFieldDecorator( 'profit', {
                        initialValue: profit,
                        validateFirst: true,
                        rules: [
                            {
                                required: true,
                                message: '请输入商品利润'
                            }, {
                                type: "number",
                                min: 0.01,
                                transform: v => +v,
                                range: true,
                                message: '请输入正确的商品利润'
                            }
                        ]
                    } )( <Input addonAfter="元"/> )
                }
            </Form.Item>
            <Form.Item label="" {...formTailLayout}>
                <Button type="primary" onClick={this.calc}>
                    计算ROI盈亏点</Button>
            </Form.Item>
            <Form.Item>
                <span className="">ROI盈亏点 = 1 / (该商品利润 / 该商品客单价)</span>
                {
                    r != 0 && ( <span className=" exp">
                        {`= 1 /  ( ${ profit}  / ${ price} ) = ${ trueRoi }`}
                    </span> )
                }
            </Form.Item>
            <Form.Item>
                <span className="">
                    <b>结论：</b>
                </span>
                {r == 0 && ( <span className=" default-str">输入宝贝利润，立即判断宝贝是否赚钱</span> )}
                {
                    r != 0 && ( <span className=" result">
                        {`ROI盈亏点 ${ trueRoi} ${ symbol} 当前15天ROI ${ roi }`}
                    </span> )
                }
                {r == 1 && ( <span className=" good result-tag ">赚钱</span> )}
                {r == -1 && ( <span className=" bad result-tag">不赚钱</span> )}
            </Form.Item>
            <Form.Item>
                <span >
                    <b>优化思路：</b>
                </span>
                {r == 0 && ( <span>根据结论，给出相应的优化思路</span> )}
                {
                    r == 1 && ( <span className=" good ">
                        <span className="opt-tag">持续推广</span>
                        <span className="opt-tag">加大投入</span>
                    </span> )
                }
                {
                    r == -1 && ( <span className=" bad ">
                        <span className="opt-tag">提高转化率</span>
                        <span className="opt-tag">提高客单价</span>
                        <span className="opt-tag">降低PPC</span>
                        <a
                            href="https://www.taobao.com/go/market/webww/ww.php?ver=3&touid=tp_%E5%BF%AB%E4%BA%91%E7%A7%91%E6%8A%80&siteid=cntaobao&status=1&charset=utf-8"
                            className="opt-link"
                            target="_blank">咨询专业车手</a>
                    </span> )
                }
            </Form.Item>
        </Form> )
    }
}

@connect( state => ( { query: state.location.query, adgroup: state.keyword.adgroup } ), dispatch => ( bindActionCreators( {
    fetchAdgroupsProfiles,
    fetchAdgroupsProfit,
    postAdgroupsProfit
}, dispatch ) ) )
export default class CalcRoi extends React.Component {
    state = {
        fromDate: moment().subtract( 15, 'days' ).format( 'YYYY-MM-DD' ),
        toDate: moment().subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
        roi: null
    }
    componentWillMount() {
        // 需要最近15天的ROI
        this.props.fetchAdgroupsProfiles( {
            ...this.props.query,
            ...this.state
        } );
        this.props.fetchAdgroupsProfit( this.props.query );
    }
    componentWillReceiveProps( nextProps ) {
        if ( nextProps.adgroup.isFetching ) {
            return;
        }
        const { fromDate, toDate } = this.state;
        const { report, itemPrice, itemProfit, adgroup } = nextProps.adgroup
        const price = itemPrice || +adgroup.price;
        const str = `${ fromDate}-${ toDate }`;
        const roi = report[ str ] ? report[ str ].realRoi : null
        this.setState( { roi, price, profit: itemProfit } )
    }
    onDialogClose = ( obj ) => {
        this.setState( obj )
    }
    onClickCalcRoi = () => {
        CalcRoiDialog( {
            ...this.props.query,
            itemId: this.props.adgroup.adgroup.numIid,
            ...this.state,
            api: this.props.postAdgroupsProfit,
            onClose: this.onDialogClose
        } )
    }
    render() {
        const { roi, price, profit } = this.state
        let btnStr = '计算ROI盈亏点'
        if ( profit && roi != null ) {
            let r = divide( price, profit );
            btnStr = r > roi ? 'ROI盈亏：不赚钱款' : 'ROI盈亏：赚钱款'
        }
        return ( <Button type="primary" onClick={this.onClickCalcRoi}>{btnStr}</Button> )
    }
}
