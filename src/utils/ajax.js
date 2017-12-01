import fetch from 'isomorphic-fetch'
import {isEqual} from 'lodash'

function toQueryString(paramsObject) {
    return Object.keys(paramsObject).map(key => `${ encodeURIComponent(key) }=${ encodeURIComponent(paramsObject[key]) }`).join('&');
}

// 请求队列
var fetchQueue = {}

function getQueueFetch(key) {
    return fetchQueue[key]
}

function addQueueFetch(key, success) {
    if (fetchQueue[key]) {
        fetchQueue[key].push(success)
    } else {
        fetchQueue[key] = [success]
    }
}

function emptyQueueFetch(key) {
    fetchQueue[key] = []
}

// 简单封装下共通处理的ajax
export default ({
                    api,
                    success,
                    error,
                    format,
                    method = 'GET',
                    body
                }) => {
    let cfg = {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-HTTP-Method-Override': method,
            'Accept': 'application/json'
        }
    };
    if (body) {
        if (cfg.method == 'GET') {
            api += '?' + toQueryString(body)
        } else {
            cfg.body = JSON.stringify(body)
        }
    }

    let key = toQueryString({
        ...body,
        _api: api,
        _method: method
    })
    let cbs = getQueueFetch(key)
    if (cbs) {
        cbs.push(success)
        return null
    } else {
        addQueueFetch(key, success)
        cbs = getQueueFetch(key)
    }

    return fetch(api, cfg).then(response => response.json()).then(json => {
        if (json.success) {
            return json
        } else {
            throw json
        }
    }).then(format || (json => {
        return json
    })).then((data) => {
        cbs.forEach((cb) => {
            cb(data)
        })
        emptyQueueFetch(key)
    }).catch(error || (err => console.error(err)))
}
