import{U as o,ay as p,az as u,aA as l,aB as c,aC as f,aD as d,aE as m,aF as h,aG as A,aH as g,d as y,u as P,y as v,x as C,aI as w,aJ as E,aK as b,aL as R}from"./chunks/framework.DStOEALM.js";import{t as S}from"./chunks/theme.ak2wd-s2.js";function i(e){if(e.extends){const a=i(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const s=i(S),_=y({name:"VitePressApp",setup(){const{site:e,lang:a,dir:t}=P();return v(()=>{C(()=>{document.documentElement.lang=a.value,document.documentElement.dir=t.value})}),e.value.router.prefetchLinks&&w(),E(),b(),s.setup&&s.setup(),()=>R(s.Layout)}});async function D(){globalThis.__VITEPRESS__=!0;const e=x(),a=T();a.provide(u,e);const t=l(e.route);return a.provide(c,t),a.component("Content",f),a.component("ClientOnly",d),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:a,router:e,siteData:m}),{app:a,router:e,data:t}}function T(){return h(_)}function x(){let e=o,a;return A(t=>{let n=g(t),r=null;return n&&(e&&(a=n),(e||a===n)&&(n=n.replace(/\.js$/,".lean.js")),r=import(n)),o&&(e=!1),r},s.NotFound)}o&&D().then(({app:e,router:a,data:t})=>{a.go().then(()=>{p(a.route,t.site),e.mount("#app")})});export{D as createApp};
