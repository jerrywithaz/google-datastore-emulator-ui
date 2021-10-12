(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{238:function(e,t,n){},239:function(e,t,n){},273:function(e,t,n){"use strict";n.r(t);var i=n(0),r=n.n(i),a=n(50),c=n.n(a),o=(n(238),n(194)),s=n(28),u=(n(239),n(400)),l=n(399),d=n(401),j=n(403),f=n(404),h=n(402),b=n(196),p=n.n(b),O=n(81),g=n(188),v=n(2),x=new O.QueryClient({defaultOptions:{queries:{refetchOnMount:!1,refetchOnWindowFocus:!1}}}),m=function(e){var t=e.children;return Object(v.jsxs)(O.QueryClientProvider,{client:x,children:[t,Object(v.jsx)(g.ReactQueryDevtools,{})]})},S=n(6),y=n(390),w=n(405),_=n(395),k=n(391),C=n(94),R=n.n(C),P=n(126),L=n(189),E=n.n(L).a.create({baseURL:"http://localhost:8002"});function I(){return M.apply(this,arguments)}function M(){return(M=Object(P.a)(R.a.mark((function e(){var t;return R.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.get("/datastore/kinds");case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var z=function(e){return Object(O.useQuery)("kinds",I,e)},F=n(113),T=n(393);function D(){return(D=Object(P.a)(R.a.mark((function e(t,n,i){var r,a,c,o;return R.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.get("/datastore/entities/".concat(t),{params:{page:n,pageSize:i}});case 2:return r=e.sent,a=r.data,c=a.info,o=a.entities,e.abrupt("return",{info:c,entities:o.map((function(e){var t,n;return Object(F.a)(Object(F.a)({},e),{},{id:null!==(t=null!==(n=e.id)&&void 0!==n?n:null===e||void 0===e?void 0:e.__key__)&&void 0!==t?t:"set by client: ".concat(Object(T.a)())})}))});case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Q=function(e,t){var n=Object(i.useState)(0),r=Object(S.a)(n,2),a=r[0],c=r[1],o=Object(i.useState)(10),s=Object(S.a)(o,2),u=s[0],l=s[1],d=Object(i.useState)(u),j=Object(S.a)(d,2),f=j[0],h=j[1];return{result:Object(O.useQuery)(["entitiesByKind",e,a.toString(),u.toString()],(function(){return function(e,t,n){return D.apply(this,arguments)}(e,a,u)}),Object(F.a)(Object(F.a)({},t),{},{enabled:!!e,onSuccess:function(e){var t=e.info.moreResults;"MORE_RESULTS_AFTER_LIMIT"!==t&&"MORE_RESULTS_AFTER_CURSOR"!==t||h((a+2)*u)}})),changePage:c,page:a,setPageSize:l,pageSize:u,rowCount:f}};var U=function(e){var t=[];e.forEach((function(e){Object.keys(e).forEach((function(e){t.includes(e)||t.push(e)}))})),t.sort();var n=t.findIndex((function(e){return"id"===e.toLowerCase()}));n>-1?(t.splice(n,1),t.unshift("id")):t.unshift("id");var i=t.findIndex((function(e){return"__key__"===e.toLowerCase()}));return i>-1&&t.splice(i,1),t},A=n(190),B=function(){var e=Object(i.useState)(""),t=Object(S.a)(e,2),n=t[0],r=t[1],a=z({onSuccess:function(e){n||r(e[0])}}),c=a.data,o=void 0===c?[]:c,s=a.isLoading,u=Q(n),d=u.result,j=d.data,f=d.isLoading,h=d.refetch,b=d.isRefetching,p=u.changePage,O=u.page,g=u.pageSize,x=u.setPageSize,m=u.rowCount,C=Object(i.useMemo)((function(){return U((null===j||void 0===j?void 0:j.entities)||[])}),[j]),R=Object(i.useMemo)((function(){return C.map((function(e){return{field:e,headerName:e,flex:1,valueFormatter:function(e){return Array.isArray(e.value)||"object"===typeof e.value?JSON.stringify(e.value):e.value},minWidth:200}}))}),[C]);return Object(v.jsxs)(l.a,{children:[Object(v.jsxs)(w.a,{children:[Object(v.jsx)(_.a,{id:"kinds-select-label",children:"Kinds"}),Object(v.jsx)(y.a,{autoWidth:!0,placeholder:"Kinds",value:n,onChange:function(e){return r(e.target.value)},label:"Kinds",labelId:"kinds-select-label",id:"kinds-select",children:o.map((function(e){return Object(v.jsx)(k.a,{value:e,children:e},e)}))})]}),Object(v.jsx)(l.a,{height:600,width:"100%",marginTop:"20px",children:Object(v.jsx)(A.a,{pagination:!0,paginationMode:"server",rows:(null===j||void 0===j?void 0:j.entities)||[],rowCount:m,columns:R,pageSize:g,page:O,rowsPerPageOptions:[5,10,25,50,100],checkboxSelection:!0,disableSelectionOnClick:!0,loading:f||s||b,onPageChange:function(e){p(e),h()},getRowId:function(e){var t;return null!==(t=e.__key__)&&void 0!==t?t:e.id},rowHeight:40,onPageSizeChange:x,componentsProps:{pagination:{labelDisplayedRows:function(e){var t=e.from,n=e.to;return"".concat(t,"-").concat(n," of many")},nextIconButtonProps:{disabled:!1}}},filterModel:{items:[]}})})]})},K=function(){return Object(v.jsx)(o.a,{children:Object(v.jsx)(m,{children:Object(v.jsxs)(l.a,{height:"100%",width:"100%",display:"flex",flexDirection:"column",children:[Object(v.jsx)(l.a,{children:Object(v.jsx)(u.a,{position:"static",children:Object(v.jsxs)(d.a,{children:[Object(v.jsx)(h.a,{size:"large",edge:"start",color:"inherit","aria-label":"menu",sx:{mr:2},children:Object(v.jsx)(p.a,{})}),Object(v.jsx)(j.a,{variant:"h6",component:"div",sx:{flexGrow:1},children:"Google Datastore Emulator UI"}),Object(v.jsx)(f.a,{color:"inherit",children:"Login"})]})})}),Object(v.jsx)(l.a,{flex:1,padding:"20px",children:Object(v.jsx)(s.c,{children:Object(v.jsx)(s.a,{path:"/",component:B})})})]})})})},J=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,410)).then((function(t){var n=t.getCLS,i=t.getFID,r=t.getFCP,a=t.getLCP,c=t.getTTFB;n(e),i(e),r(e),a(e),c(e)}))};c.a.render(Object(v.jsx)(r.a.StrictMode,{children:Object(v.jsx)(K,{})}),document.getElementById("root")),J()}},[[273,1,2]]]);