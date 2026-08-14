
(() => {
  const KEY="heritageLocalBlogs_v1", SESSION="heritageCRM_session";
  const seed={};
  const safe=s=>String(s||"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#039;"}[c]));
  const html=s=>String(s||"");
  const db=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}};
  const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const session=()=>{try{return window.HeritageCRM?.session?.()||null}catch(e){return null}};
  const getOffice=()=>session()?.officeId||null;
  const getBlogs=(office)=>db()[office]||[];
  const setBlogs=(office,blogs)=>{const all=db();all[office]=blogs;save(all)};
  const officeName=()=>window.HeritageCRM?.officeName?.(getOffice())||"Local Office";
  const slugify=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const toast=msg=>{const e=document.querySelector("#local-toast");if(!e)return;e.textContent=msg;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2200)};
  const guard=()=>{
    const u=session();
    if(!u||u.role==="national"){location.href="crm-login.html";return null}
    return u;
  };
  const esc= safe;
  window.HeritageLocalCMS={db,getBlogs,setBlogs};

  document.addEventListener("DOMContentLoaded",()=>{
    const user=guard();if(!user)return;
    document.querySelectorAll("[data-local-user]").forEach(e=>e.textContent=user.name);
    document.querySelectorAll("[data-local-office]").forEach(e=>e.textContent=officeName());
    const homeLink=document.querySelector("[data-local-home]");
    if(homeLink) homeLink.href = `${user.officeId}.html`;
    const blogLink=document.querySelector("[data-local-blog]");
    if(blogLink) blogLink.href = `${user.officeId}-blog.html`;
    document.querySelectorAll("[data-local-logout]").forEach(e=>e.addEventListener("click",ev=>{ev.preventDefault();localStorage.removeItem(SESSION);location.href="crm-login.html"}));

    const page=document.body.dataset.localPage, office=user.officeId;
    if(page==="dashboard"){
      const render=()=>{
        const blogs=getBlogs(office),pub=blogs.filter(b=>b.status==="published");
        document.querySelector("[data-count=total]").textContent=blogs.length;
        document.querySelector("[data-count=published]").textContent=pub.length;
        document.querySelector("[data-count=drafts]").textContent=blogs.filter(b=>b.status==="draft").length;
        const list=document.querySelector("#local-latest");
        list.innerHTML=blogs.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,8).map(b=>`
        <div class="local-item"><div><span class="local-badge ${b.status}">${b.status}</span><h3>${esc(b.title)}</h3><p>${esc(b.category)} · Updated ${new Date(b.updatedAt).toLocaleDateString("en-GB")}</p></div>
        <div class="local-actions"><a class="local-button secondary" href="local-cms-editor.html?id=${encodeURIComponent(b.id)}">Edit</a></div></div>`).join("")||`<div class="local-empty">You haven't created any local articles yet.</div>`;
      };render();
    }

    if(page==="list"){
      const list=document.querySelector("#local-blog-list");
      const render=()=>{
        const blogs=getBlogs(office).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
        list.innerHTML=blogs.map(b=>`<div class="local-item"><div><span class="local-badge ${b.status}">${b.status}</span><h3>${esc(b.title)}</h3><p>${esc(b.category)} · ${b.slug}</p></div><div class="local-actions"><a class="local-button secondary" href="local-cms-editor.html?id=${encodeURIComponent(b.id)}">Edit</a><button class="local-button ${b.status==="published"?"danger":"cyan"}" data-toggle="${esc(b.id)}">${b.status==="published"?"Unpublish":"Publish"}</button><button class="local-button danger" data-delete="${esc(b.id)}">Delete</button></div></div>`).join("")||`<div class="local-empty">No articles yet. Create your first local blog article.</div>`;
        list.querySelectorAll("[data-toggle]").forEach(btn=>btn.onclick=()=>{const blogs=getBlogs(office);const b=blogs.find(x=>x.id===btn.dataset.toggle);if(!b)return;b.status=b.status==="published"?"draft":"published";b.updatedAt=new Date().toISOString();setBlogs(office,blogs);render();toast(b.status==="published"?"Published to local blog":"Unpublished")});
        list.querySelectorAll("[data-delete]").forEach(btn=>btn.onclick=()=>{if(!confirm("Delete this local article?"))return;setBlogs(office,getBlogs(office).filter(x=>x.id!==btn.dataset.delete));render();toast("Article deleted")});
      };render();
    }

    if(page==="editor"){
      const id=new URLSearchParams(location.search).get("id");
      const blogs=getBlogs(office);
      let item=blogs.find(x=>x.id===id);
      if(!item)item={id:"local-"+Date.now(),title:"",slug:"",category:"Local Advice",excerpt:"",content:"",status:"draft",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
      const fields=["title","slug","category","excerpt","content","seoTitle","seoDescription"];
      fields.forEach(k=>{const el=document.querySelector("#"+k);if(!el)return;if(k==="content")el.innerHTML=item[k]||"";else el.value=item[k]||""});
      document.querySelector("#status").value=item.status;
      const update=()=>{
        document.querySelector("#preview-title").textContent=document.querySelector("#title").value||"Your local article";
        document.querySelector("#preview-excerpt").textContent=document.querySelector("#excerpt").value||"Your local introduction will appear here.";
        document.querySelector("#preview-body").innerHTML=document.querySelector("#content").innerHTML||"<p>Your article content will appear here.</p>";
      };
      document.querySelectorAll("#title,#excerpt,#content").forEach(e=>e.addEventListener("input",update));
      document.querySelectorAll("[data-editor-toolbar] button").forEach(btn=>btn.addEventListener("mousedown",e=>e.preventDefault()));
      document.querySelectorAll("[data-editor-toolbar] button").forEach(btn=>btn.addEventListener("click",()=>{
        document.querySelector("#content").focus();
        document.execCommand(btn.dataset.cmd,false,btn.dataset.value||null);
        update();
      }));
      update();
      const persist=status=>{
        const title=document.querySelector("#title").value.trim();if(!title){alert("Please add a title.");return}
        const now=new Date().toISOString(),next={...item,title,slug:document.querySelector("#slug").value.trim()||slugify(title),category:document.querySelector("#category").value.trim()||"Local Advice",excerpt:document.querySelector("#excerpt").value.trim(),content:document.querySelector("#content").innerHTML.trim(),seoTitle:document.querySelector("#seoTitle").value.trim(),seoDescription:document.querySelector("#seoDescription").value.trim(),status,updatedAt:now,publishedAt:status==="published"?(item.publishedAt||now):item.publishedAt,officeId:office};
        const arr=getBlogs(office),idx=arr.findIndex(x=>x.id===next.id);if(idx>=0)arr[idx]=next;else arr.push(next);setBlogs(office,arr);toast(status==="published"?"Published":"Draft saved");setTimeout(()=>location.href="local-cms.html",350);
      };
      document.querySelector("#save-draft").onclick=()=>persist("draft");document.querySelector("#publish").onclick=()=>persist("published");
    }
  });
})();
