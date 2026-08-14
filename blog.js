
(() => {
  const KEY="heritageCMS_content_v1";
  const esc=s=>String(s||"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#039;"}[c]));
  const textToHtml=s=>{
      const v=String(s||"");
      if(/<\s*(h1|h2|h3|h4|p|ul|ol|li|strong|em)\b/i.test(v)) return v.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/\son\w+=(?:"[^"]*"|'[^']*')/gi,"");
      return v.split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,"<br>")}</p>`).join("");
    };
  const seed={blogs:[],guides:[]};
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||JSON.stringify(seed))}catch(e){return seed}};
  document.addEventListener("DOMContentLoaded",()=>{
    const db=load();
    const published=db.blogs.filter(x=>x.status==="published").sort((a,b)=>new Date(b.publishedAt||b.updatedAt)-new Date(a.publishedAt||a.updatedAt));
    const grid=document.querySelector("#public-blog-grid");
    const render=(cat="")=>{
      const items=published.filter(x=>!cat||x.category===cat);
      grid.innerHTML=items.map(x=>`<article class="blog-card"><div class="blog-art"></div><div class="blog-card-body"><small>${esc(x.category)}</small><h3>${esc(x.title)}</h3><p>${esc(x.excerpt)}</p><a href="blog.html?article=${encodeURIComponent(x.id)}">Read article →</a></div></article>`).join("")||`<div class="cms-empty" style="grid-column:1/-1">No published articles in this category yet.</div>`;
    };
    render();
    document.querySelectorAll("[data-blog-filter]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-blog-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.blogFilter)}));
    const id=new URLSearchParams(location.search).get("article");
    if(id){
      const x=published.find(a=>a.id===id);
      if(x){
        document.title=`${x.title} | Heritage Healthcare`;
        const main=document.querySelector("main");
        main.innerHTML=`<section class="content-section cream"><div class="blog-article"><a class="article-back" href="blog.html">← Back to blog</a><div class="article-meta" style="margin:25px 0 12px">${esc(x.category)} · ${new Date(x.publishedAt||x.updatedAt).toLocaleDateString("en-GB")}</div><h1>${esc(x.title)}</h1><p class="article-excerpt">${esc(x.excerpt)}</p><div class="blog-body">${textToHtml(x.content)}</div></div></section>`;
      }
    }
  });
})();
