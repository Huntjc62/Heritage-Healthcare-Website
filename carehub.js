
(() => {
 const KEY="heritageCMS_content_v1";
 const esc=s=>String(s||"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#039;"}[c]));
 const textToHtml=s=>{
      const v=String(s||"");
      if(/<\s*(h1|h2|h3|h4|p|ul|ol|li|strong|em)\b/i.test(v)) return v.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/\son\w+=(?:"[^"]*"|'[^']*')/gi,"");
      return v.split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,"<br>")}</p>`).join("");
    };
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"blogs":[],"guides":[]}')}catch(e){return {blogs:[],guides:[]}}};
 document.addEventListener("DOMContentLoaded",()=>{
  const db=load(), published=db.guides.filter(x=>x.status==="published").sort((a,b)=>new Date(b.publishedAt||b.updatedAt)-new Date(a.publishedAt||a.updatedAt));
  const grid=document.querySelector("#public-guide-grid"); if(!grid)return;
  const id=new URLSearchParams(location.search).get("guide");
  if(id){
    const x=published.find(a=>a.id===id);
    if(x){
      document.title=`${x.title} | Heritage Healthcare Care Hub`;
      const main=document.querySelector("main");
      main.innerHTML=`<section class="content-section cream"><div class="blog-article" style="max-width:900px;margin:auto"><a class="article-back" href="care-hub.html">← Back to Care Hub</a><div class="article-meta" style="margin:25px 0 12px;color:#5c4d9b;font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:900">${esc(x.category)} · Care Guide</div><h1>${esc(x.title)}</h1><p class="article-excerpt">${esc(x.excerpt)}</p><div class="blog-body">${textToHtml(x.content)}</div></div></section>`;
      return;
    }
  }
  grid.innerHTML=published.map(x=>`<article class="resource-card"><div class="resource-art"></div><div><small>${esc(x.category)}</small><h3>${esc(x.title)}</h3><p style="font-size:11px;color:#68677a;line-height:1.7">${esc(x.excerpt)}</p><a href="care-hub.html?guide=${encodeURIComponent(x.id)}">Read guide →</a></div></article>`).join("") || `<div class="cms-empty" style="grid-column:1/-1">New Care Hub guides will appear here once Head Office publishes them.</div>`;
 });
})();
