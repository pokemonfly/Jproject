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
export default function Dialog({
    wrapClassName = '',
    maskClosable = true,
    width = 320,
    zIndex = 1000,
    title = '弹窗',
    hasForm = false,
    sid = null,
    single = true
}) {
    return ( WrappedComponent ) => {
        return ( props ) => {
            // 防止重复弹窗
            if (sid && single && _cache[sid]) {
                return
            }
            // 追加DOM
            let div = document.createElement( 'div' );
            document.body.appendChild( div );
            _cache[sid] = div

            function remove( ) {
                const unmountResult = ReactDOM.unmountComponentAtNode( div );
                if ( unmountResult && div.parentNode ) {
                    div.parentNode.removeChild( div );
                }
                if (_cache[sid]) {
                    delete _cache[sid]
                }
            }

            class HOC extends React.Component {
                componentDidMount( ) {
                    // https://github.com/ant-design/ant-design/pull/2992  很绝望
                    this.wc = hasForm ? this.refs.wc.refs.wrappedComponent.refs.formWrappedComponent : this.refs.wc
                }
                close = ( ) => {
                    this.wc.closeCallback && this.wc.closeCallback( );
                    remove( )
                }
                ok = ( ) => {
                    let r = true;
                    this.wc.okCallback && (r = this.wc.okCallback( remove ));
                    if ( r ) {
                        remove( )
                    }
                }
                render( ) {
                    return (
                        <Modal
                            onCancel={this.close}
                            onOk={this.ok}
                            visible
                            wrapClassName={wrapClassName}
                            title={title}
                            maskClosable={maskClosable}
                            width={width}
                            zIndex={zIndex}>
                            <WrappedComponent {...props} ref="wc"/>
                        </Modal>
                    )
                }
            }
            ReactDOM.render( ( <HOC/> ), div );
        }
    }
}
