
(() => {
  const STORAGE = "heritageCRM_v1";
  const SESSION = "heritageCRM_session";
  const seed = {"enquiries":[{"id":"HH-2026-000184","officeId":"york","sourceOffice":"York","name":"John Smith","email":"john.smith@example.com","phone":"07700 123456","person":"Margaret Smith","postcode":"YO24 1AA","careType":"Personal care","message":"Looking for support following a recent hospital discharge.","status":"new","assignedTo":"york-manager","createdAt":"2026-08-11T09:24:00","notes":[]},{"id":"HH-2026-000185","officeId":"york","sourceOffice":"York","name":"Sarah Jones","email":"sarah.jones@example.com","phone":"07700 234567","person":"Sarah Jones","postcode":"YO30 4AA","careType":"Dementia care","message":"Would like to understand what support is available at home.","status":"contacted","assignedTo":"york-manager","createdAt":"2026-08-10T14:10:00","notes":[{"user":"york-manager","text":"Called family and arranged an initial discussion.","createdAt":"2026-08-10T15:05:00"}]},{"id":"HH-2026-000186","officeId":"birmingham-south","sourceOffice":"Birmingham South","name":"David Brown","email":"david.brown@example.com","phone":"07700 345678","person":"David Brown","postcode":"B28 0XB","careType":"Companionship","message":"Looking for regular companionship and help around the home.","status":"assessment","assignedTo":"birmingham-manager","createdAt":"2026-08-11T08:40:00","notes":[]},{"id":"HH-2026-000187","officeId":"cardiff","sourceOffice":"Cardiff","name":"Emma Williams","email":"emma.williams@example.com","phone":"07700 456789","person":"Robert Williams","postcode":"CF10 3AB","careType":"Respite care","message":"We need some respite support for a family carer.","status":"new","assignedTo":"cardiff-manager","createdAt":"2026-08-11T10:05:00","notes":[]},{"id":"HH-2026-000188","officeId":null,"sourceOffice":"Birmingham South","name":"Peter Green","email":"peter.green@example.com","phone":"07700 567890","person":"Peter Green","postcode":"CV1 2AB","careType":"Personal care","message":"We found the Birmingham page but live in Coventry.","status":"new","assignedTo":"national-admin","createdAt":"2026-08-11T10:25:00","notes":[]}]};
  const users = [{"id":"national-admin","name":"National Admin","email":"admin@heritagehealthcare.co.uk","password":"admin123","role":"national","officeId":null},{"id":"york-manager","name":"York Office Manager","email":"york.manager@heritagehealthcare.co.uk","password":"york123","role":"manager","officeId":"york"},{"id":"birmingham-manager","name":"Birmingham South Manager","email":"birmingham.manager@heritagehealthcare.co.uk","password":"bham123","role":"manager","officeId":"birmingham-south"},{"id":"cardiff-manager","name":"Cardiff Office Manager","email":"cardiff.manager@heritagehealthcare.co.uk","password":"cardiff123","role":"manager","officeId":"cardiff"}];
  const offices = [{"id":"north-east","name":"North East"},{"id":"north-tyneside-south-northumberland","name":"North Tyneside & South Northumberland"},{"id":"cheadle-wilmslow","name":"Cheadle & Wilmslow"},{"id":"rochdale","name":"Rochdale"},{"id":"trafford-cheshire","name":"Trafford & Cheshire"},{"id":"barnsley","name":"Barnsley"},{"id":"kirklees","name":"Kirklees"},{"id":"northallerton-richmond-north-yorkshire","name":"Northallerton & Richmond (North Yorkshire)"},{"id":"wakefield","name":"Wakefield"},{"id":"york","name":"York"},{"id":"leicester","name":"Leicester"},{"id":"milton-keynes","name":"Milton Keynes"},{"id":"northampton","name":"Northampton"},{"id":"st-albans-watford","name":"St Albans & Watford"},{"id":"coventry","name":"Coventry"},{"id":"birmingham-south","name":"Birmingham South"},{"id":"windsor","name":"Windsor"},{"id":"bristol","name":"Bristol"},{"id":"basildon","name":"Basildon"},{"id":"ealing-coming-soon","name":"Ealing \u2013 Coming Soon"},{"id":"hounslow-richmond","name":"Hounslow \u2013 Richmond"},{"id":"wandsworth","name":"Wandsworth"},{"id":"epsom-ewell-sutton","name":"Epsom and Ewell, Sutton"},{"id":"cardiff","name":"Cardiff"},{"id":"swansea","name":"Swansea"}];

  const load = () => {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) {
      localStorage.setItem(STORAGE, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
    try { return JSON.parse(raw); } catch(e) {
      localStorage.setItem(STORAGE, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
  };
  const save = db => localStorage.setItem(STORAGE, JSON.stringify(db));
  const session = () => {
    const id = localStorage.getItem(SESSION);
    return users.find(u => u.id === id) || null;
  };
  const officeName = id => offices.find(o => o.id === id)?.name || "National Office";
  const moneySafe = s => String(s || "").replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#039;'}[c]));

  const routePostcode = postcode => {
    const data=window.HERITAGE_POSTCODE_ROUTING;
    if(!data) return {status:"national",officeId:null,office:null,sector:""};
    const pc=String(postcode||"").toUpperCase().replace(/[^A-Z0-9 ]/g," ").replace(/\s+/g," ").trim();
    const m=pc.match(/^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d)(?:[A-Z]{2})?$/);
    if(!m) return {status:"invalid",officeId:null,office:null,sector:""};
    const sector=`${m[1]} ${m[2]}`;
    const matches=Object.entries(data.offices).filter(([,o])=>Array.isArray(o.postcodes)&&o.postcodes.includes(sector));
    if(matches.length===1){const [id,o]=matches[0];return {status:"local",officeId:id,office:o,sector};}
    if(matches.length>1)return {status:"ambiguous",officeId:null,office:null,sector,matches};
    return {status:"national",officeId:null,office:null,sector};
  };

  window.HeritageCRM = {load,save,session,officeName,users,offices,seed};

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.crmPage;

    // Login
    if (page === "login") {
      const form = document.querySelector("#login-form");
      const alert = document.querySelector("#login-alert");
      form?.addEventListener("submit", e => {
        e.preventDefault();
        const email = form.email.value.trim().toLowerCase();
        const password = form.password.value;
        const user = users.find(u => u.email.toLowerCase() === email && u.password === password);
        if (!user) {
          alert.textContent = "Email or password not recognised.";
          alert.classList.add("show");
          return;
        }
        localStorage.setItem(SESSION, user.id);
        location.href = user.role === "national" ? "admin-routing.html" : "crm-dashboard.html";
      });
      return;
    }

    // Guard CRM pages.
    const current = session();
    if (!current) {
      location.href = "crm-login.html";
      return;
    }

    // Shared UI.
    document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = current.name);
    document.querySelectorAll("[data-office-name]").forEach(el => el.textContent = current.role === "national" ? "National Office" : officeName(current.officeId));
    document.querySelectorAll("[data-national-only]").forEach(el => el.style.display = current.role === "national" ? "" : "none");
    document.querySelectorAll("[data-future-leads-card]").forEach(el => el.style.display = current.role === "national" ? "" : "none");
    document.querySelectorAll("[data-logout]").forEach(el => el.addEventListener("click", e => {
      e.preventDefault(); localStorage.removeItem(SESSION); location.href = "crm-login.html";
    }));

    let db = load();
    const visible = () => current.role === "national"
      ? db.enquiries
      : db.enquiries.filter(e => e.officeId === current.officeId);

    const statusLabel = s => ({
      "new":"New","contacted":"Contacted","assessment":"Assessment booked",
      "care-started":"Care started","lost":"Lost","not-proceeding":"Not proceeding"
    }[s] || s);

    const toast = msg => {
      const el = document.querySelector("#crm-toast");
      if (!el) return;
      el.textContent = msg; el.classList.add("show");
      setTimeout(()=>el.classList.remove("show"),2500);
    };

    const renderDashboard = () => {
      const list = visible();
      const byStatus = s => list.filter(e=>e.status===s).length;
      document.querySelector("[data-stat=total]")?.replaceChildren(document.createTextNode(list.length));
      document.querySelector("[data-stat=new]")?.replaceChildren(document.createTextNode(byStatus("new")));
      document.querySelector("[data-stat=assessment]")?.replaceChildren(document.createTextNode(byStatus("assessment")));
      document.querySelector("[data-stat=started]")?.replaceChildren(document.createTextNode(byStatus("care-started")));
      document.querySelector("[data-stat=future-leads]")?.replaceChildren(document.createTextNode((db.leads||[]).filter(l=>l.status==="future-follow-up").length));
      const tbody = document.querySelector("#recent-enquiries");
      if (!tbody) return;
      tbody.innerHTML = list.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,8).map(e => `
        <tr onclick="location.href='crm-enquiry.html?id=${encodeURIComponent(e.id)}'">
          <td><a href="crm-enquiry.html?id=${encodeURIComponent(e.id)}">${moneySafe(e.name)}</a></td>
          <td>${moneySafe(e.postcode)}</td>
          <td>${moneySafe(e.careType)}</td>
          <td><span class="crm-badge status-${e.status}">${statusLabel(e.status)}</span></td>
          <td>${new Date(e.createdAt).toLocaleDateString("en-GB")}</td>
        </tr>`).join("") || `<tr><td colspan="5">No enquiries yet.</td></tr>`;
    };

    if (page === "future-leads") {
      if (current.role !== "national") {
        document.querySelector(".crm-content").innerHTML = '<section class="crm-section"><div class="crm-card"><h2>National Office only</h2><p style="font-size:12px;line-height:1.7;color:#718083">Future coverage leads are managed by National Office.</p></div></section>';
      } else {
        const tbody=document.querySelector("#future-lead-list");
        const leads=(db.leads||[]).filter(l=>l.status==="future-follow-up").sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
        tbody.innerHTML=leads.map(l=>`<tr><td><strong>${moneySafe(l.name)}</strong><br><small>${moneySafe(l.email)} · ${moneySafe(l.phone)}</small></td><td>${moneySafe(l.postcode)}</td><td>${moneySafe(l.careType)}</td><td>${moneySafe(l.urgency)}</td><td>${new Date(l.createdAt).toLocaleDateString("en-GB")}</td><td><span class="crm-badge status-new">Future follow-up</span></td></tr>`).join("") || '<tr><td colspan="6">No future coverage leads yet.</td></tr>';
      }
    }

    if (page === "dashboard") renderDashboard();

    if (page === "enquiries") {
      const tbody = document.querySelector("#enquiry-list");
      const search = document.querySelector("#enquiry-search");
      const status = document.querySelector("#enquiry-status");
      const render = () => {
        const q = search.value.toLowerCase();
        const s = status.value;
        const list = visible().filter(e => (!s || e.status===s) && (!q || [e.name,e.email,e.phone,e.postcode,e.careType].join(" ").toLowerCase().includes(q)));
        tbody.innerHTML = list.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(e => `
          <tr onclick="location.href='crm-enquiry.html?id=${encodeURIComponent(e.id)}'">
            <td><strong>${moneySafe(e.id)}</strong></td><td>${moneySafe(e.name)}</td><td>${moneySafe(e.postcode)}</td>
            <td>${moneySafe(e.careType)}</td><td>${current.role==="national"?moneySafe(officeName(e.officeId)):""}</td>
            <td><span class="crm-badge status-${e.status}">${statusLabel(e.status)}</span></td>
            <td>${new Date(e.createdAt).toLocaleDateString("en-GB")}</td>
          </tr>`).join("") || `<tr><td colspan="7">No enquiries match your search.</td></tr>`;
      };
      search.addEventListener("input",render); status.addEventListener("change",render); render();
    }

    if (page === "enquiry") {
      const params = new URLSearchParams(location.search);
      const id = params.get("id");
      let e = db.enquiries.find(x=>x.id===id);
      if (!e || (current.role!=="national" && e.officeId!==current.officeId)) {
        document.querySelector("#enquiry-error").textContent = "This enquiry is not available to your account.";
        return;
      }
      const fill = () => {
        document.querySelector("[data-e-name]").textContent=e.name;
        document.querySelector("[data-e-id]").textContent=e.id;
        document.querySelector("[data-e-office]").textContent=officeName(e.officeId);
        document.querySelector("[data-e-email]").textContent=e.email;
        document.querySelector("[data-e-phone]").textContent=e.phone;
        document.querySelector("[data-e-postcode]").textContent=e.postcode;
        document.querySelector("[data-e-person]").textContent=e.person;
        document.querySelector("[data-e-care]").textContent=e.careType;
        document.querySelector("[data-e-message]").textContent=e.message;
        const sel=document.querySelector("#e-status"); sel.value=e.status;
        const notes=document.querySelector("#e-notes");
        notes.innerHTML=(e.notes||[]).slice().reverse().map(n=>`<div class="crm-note">${moneySafe(n.text)}<small>${moneySafe(n.user)} · ${new Date(n.createdAt).toLocaleString("en-GB")}</small></div>`).join("") || "<p style='font-size:11px;color:#718083'>No notes yet.</p>";
      };
      fill();
      document.querySelector("#save-status").addEventListener("click",()=>{
        e.status=document.querySelector("#e-status").value; save(db); fill(); toast("Enquiry status updated");
      });
      document.querySelector("#add-note").addEventListener("click",()=>{
        const input=document.querySelector("#new-note");
        if(!input.value.trim()) return;
        e.notes=e.notes||[]; e.notes.push({user:current.name,text:input.value.trim(),createdAt:new Date().toISOString()});
        input.value=""; save(db); fill(); toast("Note added");
      });
      document.querySelector("#email-customer").addEventListener("click",()=>{
        const subject=`Heritage Healthcare — ${e.id}`;
        const body=`Dear ${e.name},\n\nThank you for contacting Heritage Healthcare.\n\nKind regards,\n${officeName(e.officeId)}\n${offices.find(o=>o.id===e.officeId)?.email||"care@heritagehealthcare.co.uk"}`;
        location.href=`mailto:${encodeURIComponent(e.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
      document.querySelector("#reassign")?.addEventListener("click",()=>{
        if(current.role!=="national") return;
        const select=document.querySelector("#assign-office");
        e.officeId=select.value; e.assignedTo=current.id; save(db); fill(); toast("Enquiry reassigned");
      });
      const assign = document.querySelector("#assign-office");
      if(assign && current.role==="national") {
        assign.innerHTML=offices.map(o=>`<option value="${o.id}" ${o.id===e.officeId?"selected":""}>${moneySafe(o.name)}</option>`).join("");
      }
    }

    if (page === "new-enquiry") {
      const form=document.querySelector("#crm-new-enquiry");
      form.addEventListener("submit",e=>{
        e.preventDefault();
        const data=new FormData(form);
        const id="HH-"+new Date().getFullYear()+"-"+String(db.enquiries.length+189).padStart(6,"0");
        const route=routePostcode(data.get("postcode"));
        const officeId=route.status==="local" ? route.officeId : (current.role==="national" ? data.get("officeId") : null);
        db.enquiries.push({
          id,officeId,sourceOffice:current.role==="national" ? officeName(officeId) : officeName(current.officeId),name:data.get("name"),email:data.get("email"),
          phone:data.get("phone"),person:data.get("person"),postcode:data.get("postcode"),careType:data.get("careType"),
          message:data.get("message"),status:"new",assignedTo:officeId?`${officeId}-manager`:"national-admin",
          routingStatus:route.status,postcodeSector:route.sector,matchedOffice:route.office?.name || "National Office",
          createdAt:new Date().toISOString(),notes:[]
        });
        save(db); location.href="crm-enquiry.html?id="+encodeURIComponent(id);
      });
    }

    if (page === "reports") {
      const list=visible(), total=list.length, converted=list.filter(e=>e.status==="care-started").length;
      document.querySelector("[data-report-total]").textContent=total;
      document.querySelector("[data-report-converted]").textContent=converted;
      document.querySelector("[data-report-rate]").textContent=total?Math.round(converted/total*100)+"%":"0%";
      const groups={}; list.forEach(e=>groups[e.careType]=(groups[e.careType]||0)+1);
      document.querySelector("#care-breakdown").innerHTML=Object.entries(groups).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<tr><td>${moneySafe(k)}</td><td>${v}</td><td><div style="height:7px;background:#e6ece8;border-radius:10px"><div style="height:7px;width:${Math.round(v/Math.max(total,1)*100)}%;background:#4f8272;border-radius:10px"></div></div></td></tr>`).join("")||"<tr><td colspan=3>No data.</td></tr>";
    }
  });
})();
