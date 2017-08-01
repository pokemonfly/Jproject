import React from 'react';
import classNames from 'classnames'
import { omit } from 'lodash'
import './Icon.less'

const Icon = ( props ) => {
    const {
        type,
        className = '',
        spin
    } = props;
    let classString = classNames( {
        iconfont: true,
        'anticon-spin': !!spin,
        [ `icon-${ type }` ]: true
    }, className )

    return <i {...omit(props, ['spin', 'type'])} className={classString}></i>
}
export default Icon;
