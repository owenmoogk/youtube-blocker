(this.webpackJsonpwebpage=this.webpackJsonpwebpage||[]).push([[0],{11:function(e,t,c){},13:function(e,t,c){"use strict";c.r(t);var s=c(1),a=c.n(s),n=c(5),r=c.n(n),l=c(6),i=c(2),b=(c(11),c(0));function d(){var e=Object(s.useState)([]),t=Object(i.a)(e,2),c=t[0],a=t[1],n=Object(s.useState)(),r=Object(i.a)(n,2),d=r[0],j=r[1],o=Object(s.useState)(),u=Object(i.a)(o,2),O=u[0],h=u[1],x=Object(s.useState)(),m=Object(i.a)(x,2),p=m[0],f=m[1],v=Object(s.useState)(),g=Object(i.a)(v,2),N=g[0],S=g[1];function k(e){return!e.includes(" ")&&e.includes(".")}return Object(s.useEffect)((function(){var e=JSON.parse(localStorage.getItem("sites"));null!=e&&a(e),S("true"===(localStorage.getItem("blockSubpages")||"true"))}),[]),Object(b.jsxs)("div",{children:[Object(b.jsx)("nav",{class:"navbar navbar-custom navbar-fixed-top",children:Object(b.jsx)("div",{class:"container-fluid",children:Object(b.jsx)("div",{class:"navbar-header",children:Object(b.jsxs)("a",{class:"navbar-brand",children:[Object(b.jsx)("span",{children:"Block"})," Site"]})})})}),Object(b.jsxs)("div",{className:"main",children:[Object(b.jsx)("br",{}),Object(b.jsxs)("div",{className:"row",id:"dashboard",children:[Object(b.jsxs)("div",{className:"col-lg-12 nopadding",children:[Object(b.jsx)("form",{onSubmit:function(e){return function(e){if(e.preventDefault(),O&&k(O))if(!p||k(p)){var t,s=Object(l.a)(c);try{for(s.s();!(t=s.n()).done;)if(t.value.block==O)return void j("That website is already blocked.")}catch(n){s.e(n)}finally{s.f()}a(c.concat([{block:O,redirect:p||"#"}])),h(""),f(""),j("")}else j("Please enter a valid redirect website.");else j("Please enter a valid website")}(e)},children:Object(b.jsxs)("div",{className:"input-group",children:[Object(b.jsx)("input",{type:"text",className:"form-control input-md",placeholder:"Add site to block",onChange:function(e){return h(e.target.value)},value:O}),Object(b.jsx)("input",{type:"text",className:"form-control input-md",placeholder:"Add redirect (optional)",onChange:function(e){return f(e.target.value)},value:p}),Object(b.jsx)("button",{type:"submit",className:"btn btn-primary btn-md",children:"Add"})]})}),Object(b.jsx)("br",{}),Object(b.jsx)("p",{children:d})]}),Object(b.jsxs)("p",{children:["Block Subpages: ",Object(b.jsx)("span",{id:"subpageBlock",children:Object(b.jsx)("button",{class:"btn btn-primary",onClick:function(){return localStorage.setItem("blockSubpages",!N),void S(!N)},children:N?"ON":"OFF"})})]}),Object(b.jsxs)("div",{className:"col-lg-12 nopadding",children:[Object(b.jsx)("div",{className:"table",children:Object(b.jsxs)("table",{className:"table table-bordered table-hover",children:[Object(b.jsx)("thead",{children:Object(b.jsxs)("tr",{children:[Object(b.jsxs)("th",{children:["Blocked (",c.length,")"]}),Object(b.jsx)("th",{children:"Redirects"}),Object(b.jsx)("th",{className:"action_btns",children:"Delete"})]})}),Object(b.jsx)("tbody",{children:c.map((function(e,t){return Object(b.jsxs)("tr",{children:[Object(b.jsx)("td",{className:"site_name",children:Object(b.jsx)("a",{children:e.block})}),Object(b.jsx)("td",{className:"site_name",children:"#"==e.redirect?Object(b.jsx)("p",{children:"None"}):Object(b.jsx)("a",{href:e.redirect,target:"_blank",children:e.redirect})}),Object(b.jsx)("td",{className:"td_btn",children:Object(b.jsx)("i",{className:"fa fa-minus-circle",onClick:function(){return t=e,void a(c.filter((function(e){return e!==t})));var t}})})]},t)}))})]})}),Object(b.jsx)("p",{className:"text-center",children:Object(b.jsxs)("button",{className:"btn btn-primary",onClick:function(){localStorage.setItem("sites",JSON.stringify(c))},children:[Object(b.jsx)("i",{className:"fa fa-save"})," Save changes"]})})]})]})]})]})}r.a.render(Object(b.jsx)(a.a.StrictMode,{children:Object(b.jsx)(d,{})}),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.fbe0844b.chunk.js.map