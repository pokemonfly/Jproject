import fetch from 'isomorphic-fetch'

function toQueryString( paramsObject ) {
    return Object.keys( paramsObject ).map( key => `${ encodeURIComponent( key ) }=${ encodeURIComponent(paramsObject[key]) }` ).join( '&' );
}
// 简单封装下共通处理的ajax
export default({
    api,
    success,
    error,
    format,
    method,
    body
}) => {
    let cfg = {
        method: method || 'GET',
        credentials: 'include'
    };
    if ( body ) {
        if ( cfg.method == 'GET' ) {
            api += '?' + toQueryString( body )
        } else {
            cfg.body = JSON.stringify( body )
        }
    }
    return fetch( api, cfg ).then(response => response.json( )).then(json => {
        if ( json.success ) {
            return json
        } else {
            throw json
        }
    }).then(format || (json => {
        return json
    })).then( success ).catch(error || (err => console.error( err )))
}
