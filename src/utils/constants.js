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

export const grabRankStatusMap = {
    '-1': {
        // 抢PC  抢无限
        title: '抢',
        type: 'btn'
    },
    0: {
        title: '待开始',
        type: 'link'
    },
    1: {
        title: '正在抢',
        type: 'link',
        className: 'success'
    },
    2: {
        title: '已抢到',
        type: 'link',
        className: 'success'
    },
    3: {
        title: '抢失败',
        type: 'link',
        className: 'error'
    },
    4: {
        title: '暂停抢',
        type: 'link',
        className: 'warning'
    },
    5: {
        title: '暂停抢',
        type: 'link',
        className: 'warning'
    },
    // 9: {     title: '体验结束',     type: 'link',     className: 'warning' }, 非后端定义的类型
    11: {
        title: '手动抢',
        type: 'link',
        className: 'warning'
    }
}
