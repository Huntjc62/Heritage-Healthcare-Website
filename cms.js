
(() => {
  const CONTENT = "heritageCMS_content_v1";
  const SESSION = "heritageCRM_session";

  const seed = {
    blogs: [
      {
        id:"blog-001",type:"blog",title:"How to Know When Someone You Love Might Need More Support at Home",
        slug:"how-to-know-when-someone-needs-more-support-at-home",
        category:"Family Advice",excerpt:"A practical guide to spotting the small changes that may suggest someone could benefit from additional support.",
        content:"Knowing when to talk about care can be difficult. Often, the signs are small: routines become harder to manage, meals are missed or everyday tasks take longer than they used to.\n\nThe aim is not to take independence away. Good homecare should support someone to remain themselves, in the place they know best, with the right help around them.\n\nIf you are worried about someone, start with an open conversation and focus on what would make everyday life easier.",
        seoTitle:"Signs Someone May Need More Support at Home | Heritage Healthcare",
        seoDescription:"Practical advice for families who are wondering whether a loved one may benefit from additional support at home.",
        status:"published",publishedAt:"2026-08-12T10:00:00Z",updatedAt:"2026-08-12T10:00:00Z"
      },
      {
        id:"blog-002",type:"blog",title:"Homecare and Independence: How the Two Can Work Together",
        slug:"homecare-and-independence",
        category:"Homecare",excerpt:"Discover how the right homecare can help people remain independent, confident and connected.",
        content:"Homecare is not about doing everything for someone. The best support starts with what a person can do, what they want to continue doing and where a little help could make life easier.\n\nFrom preparing meals to supporting personal routines, care should be shaped around the individual rather than forcing the individual into a routine.",
        seoTitle:"Homecare and Independence | Heritage Healthcare",
        seoDescription:"Learn how personalised homecare can support independence and confidence at home.",
        status:"published",publishedAt:"2026-08-10T10:00:00Z",updatedAt:"2026-08-10T10:00:00Z"
      }
    ],
    guides: [
      {
        id:"guide-001",type:"guide",title:"Understanding Homecare: A Guide for Families",
        slug:"understanding-homecare",
        category:"Getting Started",excerpt:"A straightforward introduction to homecare, what it can include and how families can begin.",
        content:"Homecare provides practical and personal support in a person's own home.\n\nIt can include personal care, companionship, support with meals, medication prompts, household routines and specialist care depending on individual needs.\n\nStarting the process usually begins with a conversation about what is becoming difficult and what good support would look like.",
        seoTitle:"Understanding Homecare | Heritage Healthcare Care Hub",
        seoDescription:"A practical guide to understanding homecare and starting a conversation about support.",
        status:"published",publishedAt:"2026-08-12T10:00:00Z",updatedAt:"2026-08-12T10:00:00Z"
      },
      {
        id:"guide-002",type:"guide",title:"Preparing for Care at Home After Hospital",
        slug:"preparing-for-care-at-home-after-hospital",
        category:"Hospital to Home",excerpt:"What families can think about when someone is returning home after a hospital stay.",
        content:"Coming home after hospital can be a positive milestone, but the first few days can also feel uncertain.\n\nThink about mobility, meals, medication, personal routines, appointments and whether family members can realistically provide the support needed.\n\nA care assessment can help identify practical support and make the transition home feel more manageable.",
        seoTitle:"Preparing for Care at Home After Hospital | Heritage Healthcare",
        seoDescription:"Practical guidance for families preparing for a loved one's return home after hospital.",
        status:"published",publishedAt:"2026-08-11T10:00:00Z",updatedAt:"2026-08-11T10:00:00Z"
      }
    ]
  };

  const currentUser = () => {
    const id = localStorage.getItem(SESSION);
    try {
      const users = window.HeritageCRM?.users || [];
      return users.find(u => u.id === id) || null;
    } catch(e){ return null; }
  };
  const requireAdmin = () => {
    const user=currentUser();
    if(!user || user.role!=="national"){
      location.href="crm-login.html?message=admin";
      return null;
    }
    return user;
  };
  const clone = x => JSON.parse(JSON.stringify(x));
  const load = () => {
    const raw=localStorage.getItem(CONTENT);
    if(!raw){localStorage.setItem(CONTENT,JSON.stringify(seed));return clone(seed);}
    try{return JSON.parse(raw)}catch(e){localStorage.setItem(CONTENT,JSON.stringify(seed));return clone(seed);}
  };
  const save = db => {
    localStorage.setItem(CONTENT,JSON.stringify(db));
    window.dispatchEvent(new CustomEvent("heritage-cms-updated"));
  };
  const esc = s => String(s||"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#039;"}[c]));
  const textToHtml = s => String(s||"");
  const toast = msg => {
    const el=document.querySelector("#cms-toast"); if(!el)return;
    el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2300);
  };
  const allContent = db => [...db.blogs,...db.guides].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
  const newId = type => `${type}-${Date.now()}`;

  window.HeritageCMS = {load,save,requireAdmin,esc,textToHtml};

  document.addEventListener("DOMContentLoaded",()=>{
    const user=requireAdmin(); if(!user)return;
    document.querySelectorAll("[data-cms-user]").forEach(el=>el.textContent=user.name);

    const page=document.body.dataset.cmsPage;
    const db=load();

    if(page==="dashboard"){
      const render=()=>{
        const blogs=db.blogs,guides=db.guides;
        document.querySelector("[data-count=blogs]").textContent=blogs.length;
        document.querySelector("[data-count=published-blogs]").textContent=blogs.filter(x=>x.status==="published").length;
        document.querySelector("[data-count=guides]").textContent=guides.length;
        document.querySelector("[data-count=published-guides]").textContent=guides.filter(x=>x.status==="published").length;
        const latest=document.querySelector("#cms-latest");
        latest.innerHTML=allContent(db).slice(0,8).map(x=>`
          <div class="cms-list-item"><div><div class="cms-meta"><span class="cms-badge ${x.type}">${x.type==="blog"?"Blog":"Guide"}</span><span class="cms-badge ${x.status}">${x.status}</span></div>
          <h3>${esc(x.title)}</h3><p>${esc(x.category)} · Updated ${new Date(x.updatedAt).toLocaleDateString("en-GB")}</p></div>
          <div class="cms-actions"><a class="cms-button secondary" href="cms-editor.html?type=${x.type}&id=${encodeURIComponent(x.id)}">Edit</a></div></div>`).join("")||`<div class="cms-empty">No content yet.</div>`;
      };
      render();
    }

    if(page==="content"){
      const list=document.querySelector("#cms-content-list"),filter=document.querySelector("#cms-filter");
      const render=()=>{
        const f=filter.value;
        const items=allContent(db).filter(x=>!f||x.type===f);
        list.innerHTML=items.map(x=>`
          <div class="cms-list-item"><div><div class="cms-meta"><span class="cms-badge ${x.type}">${x.type==="blog"?"Blog":"Guide"}</span><span class="cms-badge ${x.status}">${x.status}</span></div>
          <h3>${esc(x.title)}</h3><p>${esc(x.category)} · /${x.type==="blog"?"blog":"care-hub"}/${esc(x.slug)}</p></div>
          <div class="cms-actions"><a class="cms-button secondary" href="cms-editor.html?type=${x.type}&id=${encodeURIComponent(x.id)}">Edit</a>
          <button class="cms-button ${x.status==="published"?"danger":"cyan"}" data-toggle="${esc(x.id)}">${x.status==="published"?"Unpublish":"Publish"}</button>
          <button class="cms-button danger" data-delete="${esc(x.id)}">Delete</button></div></div>`).join("")||`<div class="cms-empty">No content found.</div>`;
        list.querySelectorAll("[data-toggle]").forEach(btn=>btn.addEventListener("click",()=>{
          const item=allContent(db).find(x=>x.id===btn.dataset.toggle);if(!item)return;
          item.status=item.status==="published"?"draft":"published";
          item.updatedAt=new Date().toISOString();
          save(db);render();toast(item.status==="published"?"Published to the website":"Moved back to draft");
        }));
        list.querySelectorAll("[data-delete]").forEach(btn=>btn.addEventListener("click",()=>{
          if(!confirm("Delete this content? This cannot be undone in this browser."))return;
          db.blogs=db.blogs.filter(x=>x.id!==btn.dataset.delete);
          db.guides=db.guides.filter(x=>x.id!==btn.dataset.delete);
          save(db);render();toast("Content deleted");
        }));
      };
      filter.addEventListener("change",render);render();
    }

    if(page==="editor"){
      const params=new URLSearchParams(location.search);
      const type=params.get("type")==="guide"?"guide":"blog";
      const id=params.get("id");
      let item=allContent(db).find(x=>x.id===id && x.type===type);
      if(!item){
        item={id:newId(type),type,title:"",slug:"",category:type==="blog"?"Family Advice":"Care Guide",excerpt:"",content:"",seoTitle:"",seoDescription:"",status:"draft",publishedAt:null,updatedAt:new Date().toISOString()};
      }
      document.querySelector("[data-editor-type]").textContent=type==="blog"?"Blog article":"Care Hub guide";
      document.querySelector("#title").value=item.title;
      document.querySelector("#slug").value=item.slug;
      document.querySelector("#category").value=item.category;
      document.querySelector("#excerpt").value=item.excerpt;
      document.querySelector("#content").innerHTML=item.content||"";
      document.querySelector("#seo-title").value=item.seoTitle;
      document.querySelector("#seo-description").value=item.seoDescription;
      document.querySelector("#status").value=item.status;
      const existing=!!id;
      const updatePreview=()=>{
        document.querySelector("#preview-kicker").textContent=type==="blog"?"HERITAGE HEALTHCARE · BLOG":"HERITAGE CARE HUB · GUIDE";
        document.querySelector("#preview-title").textContent=document.querySelector("#title").value||"Your title";
        document.querySelector("#preview-excerpt").textContent=document.querySelector("#excerpt").value||"Your introduction will appear here.";
        document.querySelector("#preview-body").innerHTML=document.querySelector("#content").innerHTML||"<p>Your content will appear here.</p>";
      };
      document.querySelectorAll("#title,#excerpt,#content").forEach(el=>el.addEventListener("input",updatePreview));
      document.querySelectorAll("[data-editor-toolbar] button").forEach(btn=>btn.addEventListener("mousedown",e=>e.preventDefault()));
      document.querySelectorAll("[data-editor-toolbar] button").forEach(btn=>btn.addEventListener("click",()=>{
        document.querySelector("#content").focus();
        document.execCommand(btn.dataset.cmd,false,btn.dataset.value||null);
        updatePreview();
      }));
      updatePreview();

      document.querySelector("#save-draft").addEventListener("click",()=>persist("draft"));
      document.querySelector("#publish").addEventListener("click",()=>persist("published"));
      function persist(status){
        const title=document.querySelector("#title").value.trim();
        if(!title){alert("Please add a title.");return;}
        const slug=(document.querySelector("#slug").value.trim()||title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
        const now=new Date().toISOString();
        const next={
          ...item,title,slug,category:document.querySelector("#category").value.trim()||"Care",
          excerpt:document.querySelector("#excerpt").value.trim(),content:document.querySelector("#content").innerHTML.trim(),
          seoTitle:document.querySelector("#seo-title").value.trim(),seoDescription:document.querySelector("#seo-description").value.trim(),
          status,updatedAt:now,publishedAt:status==="published"?(item.publishedAt||now):item.publishedAt
        };
        const target=db[type==="blog"?"blogs":"guides"];
        const idx=target.findIndex(x=>x.id===next.id);
        if(idx>=0)target[idx]=next;else target.push(next);
        save(db);toast(status==="published"?"Published":"Draft saved");
        setTimeout(()=>location.href="cms-content.html",400);
      }
    }
  });
})();
