import React from 'react';
import { Input, Icon as AntdIcon } from 'antd'
import Icon from '@/containers/shared/Icon'

export default class EditableText extends React.Component {
    state = {
        value: this.props.value || '',
        editable: false
    }
    componentWillReceiveProps( nextProps ) {
        this.setState({
            value: nextProps.value || ''
        })
    }
    onChange = ( e ) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = ( ) => {
        let r = true;
        if ( this.props.onChange ) {
            r = this.props.onChange( this.state.valueue );
        }
        if ( r !== false ) {
            this.setState({ editable: false });
        }
    }
    cancel = ( ) => {
        this.setState({
            editable: false,
            value: this.props.value || ''
        });
    }
    edit = ( ) => {
        this.setState({ editable: true });
    }
    render( ) {
        const { editable, value } = this.state
        const { width } = this.props
        return editable ? (
            <span>
                <Input value={value} onChange={this.onChange} style={{
                    width: width - 10
                }}/>
                <AntdIcon
                    type="check"
                    className="editable-cell-icon-check"
                    onClick={this.check}
                    style={{
                    marginLeft: 3
                }}/>
                <AntdIcon
                    type="close"
                    className="editable-cell-icon-check"
                    onClick={this.cancel}
                    style={{
                    marginLeft: 3
                }}/>
            </span>
        ) : (
            <span style={{
                width: width
            }}>
                {value.toString( )}
                <Icon type="xiugaibi" className="edit-icon" onClick={this.edit}/>
            </span>
        )
    }
}
