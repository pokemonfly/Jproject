import fetch from 'isomorphic-fetch'
// 简单封装下共通处理的ajax
export default({
    api,
    success,
    error,
    format,
    method,
    body
}) => {
    return fetch(api, {
        method: method || 'GET',
        body: JSON.stringify( body ),
        credentials: 'include'
    }).then(response => response.json( )).then(json => {
        if ( json.success ) {
            return json
        } else {
            throw json
        }
    }).then(format || (json => {
        return json
    })).then( success ).catch(error || (err => console.error( err )))
}
