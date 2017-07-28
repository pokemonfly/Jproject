webpackJsonp([3],{202:function(e,t,n){"use strict";function u(e){return e&&e.__esModule?e:{default:e}}function r(e){return{type:f,subreddit:e}}function d(e){return{type:p,subreddit:e}}function i(e,t){return{type:c,subreddit:e,posts:t.data.children.map(function(e){return e.data}),receivedAt:Date.now()}}function a(e){return function(t){return(0,o.default)("https://www.reddit.com/r/"+e+".json").then(function(e){return e.json()}).then(function(n){return t(i(e,n))})}}function s(e){return function(t){t(a(e))}}Object.defineProperty(t,"__esModule",{value:!0}),t.INVALIDATE_SUBREDDIT=t.SELECT_SUBREDDIT=t.RECEIVE_POSTS=t.REQUEST_POSTS=void 0,t.selectSubreddit=r,t.invalidateSubreddit=d,t.fetchPosts=a,t.fetchPostsIfNeeded=s;var l=n(146),o=u(l),c=(t.REQUEST_POSTS="REQUEST_POSTS",t.RECEIVE_POSTS="RECEIVE_POSTS"),f=t.SELECT_SUBREDDIT="SELECT_SUBREDDIT",p=t.INVALIDATE_SUBREDDIT="INVALIDATE_SUBREDDIT"},532:function(e,t,n){"use strict";function u(e){return e&&e.__esModule?e:{default:e}}function r(e){var t=e.root,n=t.selectedSubreddit,u=t.postsBySubreddit,r=u[n]||{isFetching:!0,items:[]},d=r.isFetching,i=r.lastUpdated,a=r.items;return{selectedSubreddit:n,posts:a,isFetching:d,lastUpdated:i}}Object.defineProperty(t,"__esModule",{value:!0});var d=n(22),i=u(d),a=n(5),s=u(a),l=n(8),o=u(l),c=n(7),f=u(c),p=n(6),h=u(p),E=n(1),S=u(E),v=n(39),_=n(202),T=n(533),y=u(T),R=n(534),b=u(R),m=function(e){function t(e){(0,s.default)(this,t);var n=(0,f.default)(this,(t.__proto__||(0,i.default)(t)).call(this,e));return n.handleChange=n.handleChange.bind(n),n.handleRefreshClick=n.handleRefreshClick.bind(n),n}return(0,h.default)(t,e),(0,o.default)(t,[{key:"componentDidMount",value:function(){var e=this.props,t=e.dispatch,n=e.selectedSubreddit;t((0,_.fetchPosts)(n))}},{key:"componentWillReceiveProps",value:function(e){if(e.selectedSubreddit!==this.props.selectedSubreddit){var t=e.dispatch,n=e.selectedSubreddit;t((0,_.fetchPostsIfNeeded)(n))}}},{key:"handleChange",value:function(e){this.props.dispatch((0,_.selectSubreddit)(e))}},{key:"handleRefreshClick",value:function(e){e.preventDefault();var t=this.props,n=t.dispatch,u=t.selectedSubreddit;n((0,_.invalidateSubreddit)(u)),n((0,_.fetchPostsIfNeeded)(u))}},{key:"render",value:function(){var e=this.props,t=e.selectedSubreddit,n=e.posts,u=e.isFetching,r=e.lastUpdated;return S.default.createElement("div",null,S.default.createElement(y.default,{value:t,onChange:this.handleChange,options:["reactjs","frontend"]}),S.default.createElement("p",null,r&&S.default.createElement("span",null,"Last updated at ",new Date(r).toLocaleTimeString(),". "," "),!u&&S.default.createElement("a",{href:"#",onClick:this.handleRefreshClick},"Refresh")),u&&0===n.length&&S.default.createElement("h2",null,"Loading..."),!u&&0===n.length&&S.default.createElement("h2",null,"Empty."),n.length>0&&S.default.createElement("div",{style:{opacity:u?.5:1}},S.default.createElement(b.default,{posts:n})))}}]),t}(E.Component);m.propTypes={selectedSubreddit:E.PropTypes.string.isRequired,posts:E.PropTypes.array.isRequired,isFetching:E.PropTypes.bool.isRequired,lastUpdated:E.PropTypes.number,dispatch:E.PropTypes.func.isRequired},t.default=(0,v.connect)(r)(m)},533:function(e,t,n){"use strict";function u(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(22),d=u(r),i=n(5),a=u(i),s=n(8),l=u(s),o=n(7),c=u(o),f=n(6),p=u(f),h=n(1),E=u(h),S=function(e){function t(){return(0,a.default)(this,t),(0,c.default)(this,(t.__proto__||(0,d.default)(t)).apply(this,arguments))}return(0,p.default)(t,e),(0,l.default)(t,[{key:"render",value:function(){var e=this.props,t=e.value,n=e.onChange,u=e.options;return E.default.createElement("span",null,E.default.createElement("h1",null,t),E.default.createElement("select",{onChange:function(e){return n(e.target.value)},value:t},u.map(function(e){return E.default.createElement("option",{value:e,key:e},e)})))}}]),t}(h.Component);t.default=S,S.propTypes={options:h.PropTypes.arrayOf(h.PropTypes.string.isRequired).isRequired,value:h.PropTypes.string.isRequired,onChange:h.PropTypes.func.isRequired}},534:function(e,t,n){"use strict";function u(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(22),d=u(r),i=n(5),a=u(i),s=n(8),l=u(s),o=n(7),c=u(o),f=n(6),p=u(f),h=n(1),E=u(h),S=function(e){function t(){return(0,a.default)(this,t),(0,c.default)(this,(t.__proto__||(0,d.default)(t)).apply(this,arguments))}return(0,p.default)(t,e),(0,l.default)(t,[{key:"render",value:function(){return E.default.createElement("ul",null,this.props.posts.map(function(e,t){return E.default.createElement("li",{key:t},e.title)}))}}]),t}(h.Component);t.default=S,S.propTypes={posts:h.PropTypes.array.isRequired}},536:function(e,t,n){"use strict";function u(e){return e&&e.__esModule?e:{default:e}}function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"reactjs",t=arguments[1];switch(t.type){case f.SELECT_SUBREDDIT:return t.subreddit;default:return e}}function d(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{isFetching:!1,didInvalidate:!1,items:[]},t=arguments[1];switch(t.type){case f.INVALIDATE_SUBREDDIT:return(0,o.default)({},e,{didInvalidate:!0});case f.REQUEST_POSTS:return(0,o.default)({},e,{isFetching:!0,didInvalidate:!1});case f.RECEIVE_POSTS:return(0,o.default)({},e,{isFetching:!1,didInvalidate:!1,items:t.posts,lastUpdated:t.receivedAt});default:return e}}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];switch(t.type){case f.INVALIDATE_SUBREDDIT:case f.RECEIVE_POSTS:case f.REQUEST_POSTS:return(0,o.default)({},e,(0,s.default)({},t.subreddit,d(e[t.subreddit],t)));default:return e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(14),s=u(a),l=n(86),o=u(l),c=n(41),f=n(202),p=(0,c.combineReducers)({postsBySubreddit:i,selectedSubreddit:r});t.default=p}});