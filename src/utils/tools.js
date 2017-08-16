import { isString, isUndefined } from 'lodash'

/*
minVal 返回结果不低于此数值
zeroTransfer 结果为0时转义 mode 预设
accuracy: 小数进度
*/
export function formatNum(val, {
    minVal = 0,
    zeroTransfer = '-',
    mode,
    accuracy = 2,
    divide = false
}) {
    switch ( mode ) {
        case 'price':
            minVal = 0.05
            zeroTransfer = 0.05
            divide = true
            break;
        default:
            break;
    }
    var num = val;
    if (isString( num )) {
        num = parseFloat( num );
    }
    //包含undefined
    if (isNaN( num )) {
        console.warn( 'formatPrice error' + val );
        return { text: zeroTransfer, value: '#', num, hasError: true }
    }
    if ( !num ) {
        return { text: zeroTransfer, real: num, num, hasError: true }
    }
    if ( divide ) {
        num = num / 100
    }
    if ( num < minVal ) {
        num = minVal
    }
    num = num.toFixed( accuracy )
    return {text: num, real: num, num: parseFloat( num )}
}
