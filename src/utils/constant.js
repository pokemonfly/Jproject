// 全局 常量 配置
export const versionNameMap = {
    1: '快车托管',
    2: '云托管定制版',
    3: '基础版',
    4: '锦囊版',
    5: '旗舰版',
    6: '直钻结合版',
    106: '体验版',
    7: '智囊版',
    8: 'VIP大客户',
    9: '快车托管'
}

export const getEngineType = ( type ) => {
    switch ( type ) {
        case 0:
            return '长尾'
        case 1:
            return '加力'
        case 2:
            return '无线'
        case 6:
            return 'ROI'
        default:
            return '未知'
    }
}
