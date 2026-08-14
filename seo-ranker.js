
(() => {
  const strip=s=>String(s||"").replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
  const countWords=s=>{const x=strip(s);return x?x.split(/\s+/).length:0};
  const escapeReg=s=>String(s||"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const hasPhrase=(text,key)=>key && new RegExp(`\\b${escapeReg(key).replace(/\s+/g,"\\\\s+")}\\b`,"i").test(text);
  const checksFor=(data)=>{
    const title=data.title.trim(), meta=data.meta.trim(), keyword=data.keyword.trim(), content=data.content;
    const plain=strip(content), words=countWords(content);
    const h1=(content.match(/<h1\b/gi)||[]).length, h2=(content.match(/<h2\b/gi)||[]).length, h3=(content.match(/<h3\b/gi)||[]).length;
    const links=(content.match(/<a\b[^>]*href=/gi)||[]).length;
    const items=[];
    items.push({ok:title.length>=30&&title.length<=65,label:title.length?`SEO title is ${title.length} characters`:"Add an SEO title",detail:"Aim for a concise, descriptive page title."});
    items.push({ok:!keyword||hasPhrase(title,keyword),label:keyword?`Primary topic appears in the SEO title`:"Add a primary search topic",detail:"Use the phrase naturally when it genuinely describes the page."});
    items.push({ok:meta.length>=120&&meta.length<=170,label:meta.length?`Meta description is ${meta.length} characters`:"Add a meta description",detail:"Write a useful, accurate summary that encourages the right visitor to click."});
    items.push({ok:!keyword||hasPhrase(meta,keyword),label:keyword?`Primary topic appears in the meta description`:"Add a primary search topic",detail:"Include it only where natural; avoid keyword stuffing."});
    items.push({ok:h1===1,label:h1===1?"Exactly one H1 is present":(h1===0?"Add one H1":"Use only one H1"),detail:"Your H1 should clearly summarise the page."});
    items.push({ok:h2>=1,label:h2>=1?`${h2} H2 section${h2===1?"":"s"} structure the content`:"Add H2 section headings",detail:"Break longer content into useful sections for readers."});
    items.push({ok:!keyword||hasPhrase(content,keyword),label:keyword?`Primary topic appears in the main content`:"Set a primary topic",detail:"Cover the topic naturally rather than repeating it excessively."});
    items.push({ok:words>=600,label:`${words} words of main content`,detail:"There is no Google-preferred word count; this checks whether the page has enough room to answer the topic properly."});
    items.push({ok:words>=300&&words<=3500,label:"Content length is proportionate",detail:"Avoid thin content, but don't pad an article simply to hit a number."});
    items.push({ok:plain.length>0&&/[.!?]/.test(plain),label:"Readable prose is present",detail:"Use clear, useful sentences and answer the reader's question directly."});
    items.push({ok:h3+h2>=2,label:"Content has a useful hierarchy",detail:"Use headings to organise the journey through the topic."});
    items.push({ok:links>=1,label:links>=1?"Internal or relevant links are included":"Add a useful internal link",detail:"Help readers continue to a relevant care, location or contact page."});
    items.push({ok:/(experience|expert|registered|qualified|care team|years|local team|clinician|specialist|professional)/i.test(plain),label:"Expertise/trust signals are evident",detail:"Where appropriate, show genuine experience, expertise, authorship or local knowledge."});
    return {items,words,h1,h2,h3,links};
  };

  window.HeritageSEO={
    init(opts){
      const $=s=>document.querySelector(s);
      const content=$(opts.content), title=$(opts.title), meta=$(opts.meta), keyword=$(opts.keyword), live=$(opts.liveKeyword);
      if(!content)return;
      const sync=()=>{
        if(live && document.activeElement!==live) live.value=keyword?.value||"";
        const data={title:title?.value||"",meta:meta?.value||"",keyword:(live?.value||keyword?.value||"").trim(),content:content.innerHTML||""};
        const result=checksFor(data);
        let score=100;
        result.items.forEach((x,i)=>{if(!x.ok)score-=i===0?8:i===4?10:i===7?7:6});
        // Reward strong structure, but keep this as an editorial score rather than a ranking prediction.
        score=Math.max(0,Math.min(100,score));
        const num=$("#seo-score-number"), fill=$("#seo-bar-fill"), ring=$("#seo-score"), verdict=$("#seo-verdict"), checks=$("#seo-checks"), suggestions=$("#seo-suggestions");
        if(num)num.textContent=score;
        if(fill)fill.style.width=score+"%";
        if(ring)ring.className="seo-score "+(score>=80?"good":score>=60?"mid":"low");
        if(verdict)verdict.textContent=score>=90?"Excellent editorial SEO foundation":score>=80?"Strong — a few improvements could help":score>=60?"Good start — several opportunities remain":"Needs work — improve the fundamentals first";
        if(checks)checks.innerHTML=result.items.map(x=>`<div class="seo-check ${x.ok?"pass":"fail"}"><span class="seo-dot"></span><span>${x.label}</span></div>`).join("");
        const suggestionsList=result.items.filter(x=>!x.ok).map(x=>`<li>${x.detail}</li>`);
        if(!keyword?.value && !live?.value) suggestionsList.unshift("<li>Choose one primary search topic that matches the question this page is designed to answer.</li>");
        if(suggestions) suggestions.innerHTML=(suggestionsList.slice(0,7).length?suggestionsList.slice(0,7):["<li>Great job. Keep the content useful, original and accurate.</li>"]).join("");
      };
      [title,meta,keyword,live,content].filter(Boolean).forEach(el=>el.addEventListener("input",sync));
      sync();
    }
  };
})();
