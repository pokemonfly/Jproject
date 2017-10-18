import { isString, isUndefined } from 'lodash'
import { notification } from 'antd';
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

export function formatReport( report ) {
    for ( let key in report ) {
        if (report.hasOwnProperty( key )) {
            if ( report.click ) {
                report.directPpr = report.directCartTotal / report.click * 100
                report.indirectPpr = report.indirectCartTotal / report.click * 100
                report.favItemRate = report.favItemCount / report.click * 100
                report.favShopRate = report.favShopCount / report.click * 100
                report.favRate = report.favCount / report.click * 100
                if ( report.cartTotal ) {
                    // 总加购率
                    report.pprTotal = report.cartTotal / report.click * 100
                    // 直接加购收藏率（兴趣度）
                    report.directPprFavRate = ( report.favItemCount + report.directCartTotal ) / report.click * 100
                    //加购收藏率
                    report.pprFavRate = ( report.favCount + report.cartTotal ) / report.click * 100
                }
            }
        }
    }
}

/** 右上角 的贴条提示
 params  obj / string / string,string,string
*/
export function notify( ) {
    let obj
    if ( arguments.length == 3 ) {
        obj = {
            type: arguments[0],
            message: arguments[1],
            description: arguments[2]
        }
    } else {
        if (isString(arguments[0])) {
            obj = {
                description: arguments[0]
            }
        } else {
            obj = arguments[0]
        }
    }
    let {
        type = 'success',
        message = '操作成功',
        description
    } = obj
    notification[type]({ message, description, duration: 3 });
}
