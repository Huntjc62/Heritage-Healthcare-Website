
(() => {
  const KEY="heritageLocalBlogs_v1";
  const esc=s=>String(s||"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#039;"}[c]));
  const toHtml=s=>{
      const v=String(s||"");
      if(/<\s*(h1|h2|h3|h4|p|ul|ol|li|strong|em)\b/i.test(v)) return v.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/\son\w+=(?:"[^"]*"|'[^']*')/gi,"");
      return v.split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,"<br>")}</p>`).join("");
    };
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}};
  document.addEventListener("DOMContentLoaded",()=>{
    const page=document.querySelector("[data-local-office-id]");if(!page)return;
    const office=page.dataset.localOfficeId, name=page.dataset.localOfficeName||office;
    const blogs=(load()[office]||[]).filter(x=>x.status==="published").sort((a,b)=>new Date(b.publishedAt||b.updatedAt)-new Date(a.publishedAt||a.updatedAt));
    document.querySelectorAll("[data-public-office]").forEach(e=>e.textContent=name);
    const id=new URLSearchParams(location.search).get("article");
    const grid=document.querySelector("#local-public-grid");
    if(id){
      const x=blogs.find(a=>a.id===id);
      if(x){
        document.title=`${x.title} | ${name} | Heritage Healthcare`;
        document.querySelector("#local-public-content").innerHTML=`<a class="article-back" href="${page.dataset.blogFile}">← Back to ${esc(name)} articles</a><div class="article-meta" style="margin:24px 0 10px">${esc(x.category)} · ${new Date(x.publishedAt||x.updatedAt).toLocaleDateString("en-GB")}</div><h1>${esc(x.title)}</h1><p class="article-excerpt">${esc(x.excerpt)}</p><div class="blog-body">${toHtml(x.content)}</div>`;
        return;
      }
    }
    if(!grid)return;
    grid.innerHTML=blogs.map(x=>`<article class="local-article-card"><div class="local-article-art"></div><div class="local-article-body"><small>${esc(x.category)}</small><h2>${esc(x.title)}</h2><p>${esc(x.excerpt)}</p><a href="${page.dataset.blogFile}?article=${encodeURIComponent(x.id)}">Read article →</a></div></article>`).join("") || `<div class="local-empty" style="grid-column:1/-1">This office hasn't published any local articles yet. Check back soon.</div>`;
  });
})();
