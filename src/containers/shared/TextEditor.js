import React from 'react';
import classnames from 'classnames'
import { Input } from 'antd'
import { trim } from 'lodash'
import './TextEditor.less'

// 待扩展
const { TextArea } = Input;
const reg = new RegExp( "[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]", 'g' );

export default class TextEditor extends React.Component {
    state = {
        text: this.props.text
    }
    getTextArr( ) {
        const { text } = this.state;
        return text.split( "\n" ).map(e => trim( e ).replace( reg, ' ' )).filter( e => e.length > 0 );
    }
    clear( ) {
        this.setState({ text: '' })
    }
    change = ( e ) => {
        let text = e.target.value;
        this.setState({ text })
    }
    render( ) {
        const { placeholder, className } = this.props
        const { text } = this.state;
        const cn = classnames( 'text-editor', className )
        return (
            <div className={cn}>
                <TextArea placeholder={placeholder} value={text} onChange ={this.change}/>
            </div>
        )
    }
}
