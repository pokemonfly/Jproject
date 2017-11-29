import React from 'react';
import ReactDOM from 'react-dom';
import {
    Modal,
    Radio,
    Form,
    Input,
    Checkbox,
    Tooltip
} from 'antd'
let _cache = {}

// 组件弹窗化 并显示
export function SimpleDialog( {
    wrapClassName = '',
    maskClosable = true,
    width = 320,
    zIndex = 1000,
    title = '弹窗',
    hasForm = false,
    sid = null,
    single = true,
    noFooter = false
} ) {
    return( WrappedComponent ) => {
        return( props ) => {
            // 防止重复弹窗
            if ( sid && single && _cache[ sid ] ) {
                return
            }
            // 追加DOM
            let div = document.createElement( 'div' );
            document.body.appendChild( div );
            _cache[ sid ] = div

            function remove() {
                const unmountResult = ReactDOM.unmountComponentAtNode( div );
                if ( unmountResult && div.parentNode ) {
                    div.parentNode.removeChild( div );
                }
                if ( _cache[ sid ] ) {
                    delete _cache[ sid ]
                }
            }

            class HOC extends React.Component {
                componentDidMount() {
                    // https://github.com/ant-design/ant-design/pull/2992  很绝望
                    this.wc = hasForm ? this.refs.wc.refs.wrappedComponent.refs.formWrappedComponent : this.refs.wc
                }
                close = () => {
                    this.wc.closeCallback && this.wc.closeCallback();
                    remove()
                }
                ok = () => {
                    let r = true;
                    this.wc.okCallback && ( r = this.wc.okCallback( remove ) );
                    if ( r ) {
                        remove()
                    }
                }
                render() {
                    let p = {
                        visible: true,
                        width,
                        maskClosable,
                        title,
                        wrapClassName,
                        zIndex
                    }
                    if ( noFooter ) {
                        p.footer = null
                    }
                    return ( <Modal onCancel={this.close} onOk={this.ok} {... p}>
                        <WrappedComponent {...props} ref="wc"/>
                    </Modal> )
                }
            }
            ReactDOM.render( ( <HOC/> ), div );
        }
    }
}

export function Dialog( {
    wrapClassName = '',
    maskClosable = true,
    width = 320,
    zIndex = 1000,
    title = '弹窗',
    hasForm = false,
    hasConnect = true,
    sid = null,
    single = true
} ) {
    return( WrappedComponent ) => {
        return class HOC extends React.Component {
            state = {
                visible: false
            }
            close = () => {
                let rf = this.refs.wc.getWrappedInstance();
                if ( hasForm ) {
                    rf = rf.refs.wrappedComponent.refs.formWrappedComponent
                }
                rf.closeCallback && rf.closeCallback();
                this.hide()
            }
            ok = () => {
                let r = true;
                let rf = this.refs.wc.getWrappedInstance();
                if ( hasForm ) {
                    rf = rf.refs.wrappedComponent.refs.formWrappedComponent
                }
                rf.okCallback && ( r = rf.okCallback( this.hide ) );
                if ( r ) {
                    this.hide()
                }
            }
            show = () => {
                this.setState( { visible: true } )
            }
            hide = () => {
                this.setState( { visible: false } )
            }
            render() {
                return ( <Modal
                    onCancel={this.close}
                    onOk={this.ok}
                    visible={this.state.visible}
                    wrapClassName={wrapClassName}
                    title={title}
                    maskClosable={maskClosable}
                    width={width}
                    zIndex={zIndex}>
                    <WrappedComponent {...this.props} ref="wc"/>
                </Modal> )
            }
        }
    }
}
