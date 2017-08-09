import React from 'react';
import Trigger from 'rc-trigger';
import { omit } from 'lodash';

export default class TriggerEX extends React.Component {
    static defaultProps = {
        action: ['click'],

        popupAlign: {
            points: [
                'tl', 'bl'
            ],
            offset: [ 0, 3 ]
        },
        destroyPopupOnHide: true
    }
    render( ) {
        return (
            <Trigger {...omit(this.props, ['context'])}>{this.props.children}</Trigger>
        )
    }
}
