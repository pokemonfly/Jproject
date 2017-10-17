import React from 'react';
import Trigger from 'rc-trigger';
import { omit } from 'lodash';
import { findDOMNode } from 'react-dom';
import contains from 'rc-util/lib/Dom/contains';
import { hasClass } from 'rc-util/lib/Dom/class';
/*
HACK
源： https://github.com/react-component/trigger/blob/master/src/index.js
为了保证Trigger内部可以再次触发其他的trigger而不关闭

??? antd Popover  似乎有同样的功能 
*/
class TriggerHack extends Trigger {
    componentWillMount( ) {
        super.componentWillMount( )
        this.onDocumentClick = ( ) => {
            if ( this.props.mask && !this.props.maskClosable ) {
                return;
            }
            const target = event.target;
            const root = findDOMNode( this );
            const popupNode = this.getPopupDomNode( );
            // TODO
            if (target.offsetParent && hasClass( target.offsetParent, "ant-select-dropdown" )) {
                return;
            }
            if (!contains( root, target ) && !contains( popupNode, target )) {
                this.close( );
            }
        }
    }
    render( ) {
        return super.render( )
    }
}

export default class TriggerEX extends React.Component {
    static defaultProps = {
        action: ['click'],
        popupAlign: {
            points: [
                'tl', 'bl'
            ],
            offset: [ 0, 4 ]
        },
        width: null,
        destroyPopupOnHide: true
    }
    constructor( props ) {
        super( props )
        if ( this.props.width ) {
            this.state = {
                popupStyle: {
                    width: this.props.width
                }
            }
        }
    }
    setPopupVisible( flag ) {
        this.refs.trigger.setPopupVisible( flag )
    }
    onClose = ( ) => {
        this.setPopupVisible( false )
    }
    render( ) {
        const popup = React.cloneElement(this.props.popup, { onClose: this.onClose })
        return (
            <TriggerHack
                {...omit(this.props, ['context', 'popup', 'width'])}
                {...this.state}
                popup={popup}
                ignoreClz={[ 'ant-select-dropdown' ]}
                ref='trigger'>
                {this.props.children}
            </TriggerHack>
        )
    }
}
