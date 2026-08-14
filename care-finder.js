
(() => {
  const form=document.querySelector("#care-finder-form");
  if(!form)return;
  const steps=[...form.querySelectorAll(".finder-step")];
  const progress=document.querySelector("#finder-progress");
  const result=document.querySelector("#finder-result");
  const submitResult=document.querySelector("#finder-submit-result");
  const postcode=document.querySelector("#postcode");
  const postcodeNext=document.querySelector("#postcode-next");
  let current=1, route=null, crmId=null;

  const coverageModal=document.querySelector("#coverage-modal");
  const uncoveredPostcode=document.querySelector("#uncovered-postcode");
  const openCoverageModal=pc=>{
    if(uncoveredPostcode)uncoveredPostcode.textContent=String(pc||"").trim().toUpperCase();
    if(coverageModal){
      coverageModal.classList.add("open");
      coverageModal.setAttribute("aria-hidden","false");
      document.body.style.overflow="hidden";
      coverageModal.querySelector("[data-close-coverage]")?.focus();
    }
  };
  const closeCoverageModal=()=>{
    if(coverageModal){
      coverageModal.classList.remove("open");
      coverageModal.setAttribute("aria-hidden","true");
      document.body.style.overflow="";
      postcode?.focus();
    }
  };
  document.querySelectorAll("[data-close-coverage]").forEach(el=>el.addEventListener("click",closeCoverageModal));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&coverageModal?.classList.contains("open"))closeCoverageModal()});

  const escape=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const officePages={
    "cheadle-wilmslow":"cheadle-and-wilmslow.html",
    "north-tyneside-south-northumberland":"north-tyneside-and-south-northumberland.html",
    "st-albans-watford":"st-albans-and-watford.html",
    "trafford-cheshire":"trafford-and-cheshire.html",
    "epsom-ewell-sutton":"locations.html"
  };
  const officePage=slug=>officePages[slug]||`${slug}.html`;

  function showStep(n){
    current=n;
    steps.forEach(s=>s.classList.toggle("hidden",Number(s.dataset.step)!==n));
    if(progress)progress.style.width=`${(n/8)*100}%`;
    window.scrollTo({top:form.closest(".finder-card")?.getBoundingClientRect().top+window.scrollY-90,behavior:"smooth"});
  }

  function field(name,value){
    let el=form.querySelector(`[name="${name}"]`);
    if(!el){el=document.createElement("input");el.type="hidden";el.name=name;form.appendChild(el)}
    el.value=value||"";
  }

  function selectedSupports(){
    return [...form.querySelectorAll('input[name="support"]:checked')].map(x=>x.value);
  }

  function buildMessage(){
    return [
      `Reason for enquiry: ${form.reason?.value||""}`,
      `How often support may be needed: ${form.frequency?.value||""}`,
      `Urgency: ${form.urgency?.value||""}`,
      `Areas of support requested: ${selectedSupports().join(", ")||"Not specified"}`,
      "",
      `Additional information: ${form.message?.value||""}`
    ].join("\n");
  }

  form.querySelectorAll(".choice[data-field]").forEach(choice=>{
    choice.addEventListener("click",()=>{
      field(choice.dataset.field,choice.dataset.value);
      if(choice.dataset.field==="care_type")document.querySelector('[name="care_type"]').value=choice.dataset.value;
      showStep(Number(choice.dataset.next));
    });
  });

  form.querySelector(".finder-next[data-next='6']")?.addEventListener("click",()=>{
    if(selectedSupports().length===0){
      result.textContent="Choose at least one area, or select Other / not sure.";
      result.className="finder-result show warning";
      return;
    }
    result.className="finder-result";
    showStep(6);
  });

  postcode?.addEventListener("input",()=>{
    route=window.HeritageRouting?.findOffice(postcode.value);
    if(!postcode.value){result.className="finder-result";result.innerHTML="";return}
    if(route?.status==="local"){
      result.className="finder-result show";
      result.innerHTML=`<strong>✓ Local coverage found</strong><span>Your postcode is covered by ${escape(route.office.name)}. Continue to send your requirements to that local team.</span>`;
    }else if(route?.status==="national"){
      result.className="finder-result show warning";
      result.innerHTML=`<strong>We may not currently cover this postcode</strong><span>We'll confirm this after you submit your details. If we don't cover the area, you can ask us to contact you when we do.</span>`;
    }else{
      result.className="finder-result show warning";
      result.innerHTML=`<strong>Let's check that postcode</strong><span>Enter a full UK postcode, for example YO24 1AA.</span>`;
    }
  });

  postcodeNext?.addEventListener("click",()=>{
    route=window.HeritageRouting?.findOffice(postcode.value);
    if(!postcode.value.trim()||route?.status==="invalid"){
      result.className="finder-result show error";
      result.textContent="Please enter a full UK postcode so we can identify the correct team.";
      return;
    }
    result.className="finder-result";
    showStep(8);
  });

  form.addEventListener("submit",e=>{
    e.preventDefault();

    submitResult.className="finder-result";
    submitResult.innerHTML="";

    // Give the user a visible explanation rather than silently relying on
    // browser validation when a required field has been missed.
    if(!form.checkValidity()){
      const firstInvalid=form.querySelector(":invalid");
      if(firstInvalid){
        firstInvalid.focus();
        submitResult.className="finder-result show error";
        submitResult.innerHTML="<strong>Please complete the highlighted details.</strong><span>We need your name, email, phone number, postcode and consent before we can send the enquiry.</span>";
      }
      return;
    }

    route=window.HeritageRouting?.findOffice(postcode.value);
    if(!route || route.status==="invalid"){
      showStep(7);
      result.className="finder-result show error";
      result.innerHTML="<strong>We couldn't verify that postcode.</strong><span>Please enter a full UK postcode, for example YO24 1AA.</span>";
      return;
    }

    field("message",buildMessage());
    field("source_office","Main website");
    field("routing",route.status);
    field("matched_office",route.office?.name||"National Office");
    field("route_email",route.office?.email||"care@heritagehealthcare.co.uk");

    const submitButton=form.querySelector("#finder-submit");
    if(submitButton)submitButton.disabled=true;

    if(route.status==="local" || route.status==="local-no-email"){
      crmId=window.HeritageRouting?.saveToCRM(route,form);
      const page=officePage(route.office.slug);

      // Always give immediate feedback, then take the visitor to the local
      // office page automatically. The CRM capture happens before redirect.
      submitResult.className="finder-result show";
      submitResult.innerHTML=`<strong>✓ We've found your local Heritage Healthcare team.</strong><span>Your care requirements have been sent to ${escape(route.office.name)} and saved as a new CRM enquiry.</span><span>Taking you to your local team now…</span>`;

      window.setTimeout(()=>{
        window.location.href=page;
      },1400);
      return;
    }

    // No verified coverage: show the requested pop-up first.
    // The existing future-follow-up option remains available after the user
    // closes the message, so the lead is never silently lost.
    openCoverageModal(postcode.value);

    submitResult.className="finder-result show warning";
    submitResult.innerHTML=`<strong>We don't currently cover this postcode.</strong><span>If you'd like, you can still ask National Office to keep your details for future coverage.</span><div class="finder-result-actions"><button type="button" class="button button-primary finder-followup-btn" id="followup-yes">Yes — contact me in future →</button><button type="button" class="button button-secondary" id="followup-no">No thanks</button></div>`;

    document.querySelector("#followup-yes")?.addEventListener("click",saveFollowup,{once:true});
    document.querySelector("#followup-no")?.addEventListener("click",()=>{
      submitResult.className="finder-result show";
      submitResult.innerHTML="<strong>No problem.</strong><span>We haven't stored a future follow-up request. You can try again later.</span>";
    },{once:true});

    if(submitButton)submitButton.disabled=false;
  });

  function saveFollowup(){
    try{
      const key="heritageCRM_v1";
      const db=JSON.parse(localStorage.getItem(key)||'{"enquiries":[],"leads":[]}');
      if(!Array.isArray(db.leads))db.leads=[];
      const id="LEAD-"+new Date().getFullYear()+"-"+String(db.leads.length+1).padStart(6,"0");
      db.leads.push({
        id,type:"future-coverage",status:"future-follow-up",source:"Care Finder",
        name:form.name.value.trim(),email:form.email.value.trim(),phone:form.phone.value.trim(),
        postcode:postcode.value.trim().toUpperCase(),postcodeSector:route?.sector||"",
        person:form.person?.value||"",careType:form.care_type?.value||"",
        reason:form.reason?.value||"",frequency:form.frequency?.value||"",
        urgency:form.urgency?.value||"",support:selectedSupports(),
        message:form.message.value.trim(),assignedTo:"national-admin",
        officeId:null,createdAt:new Date().toISOString(),followUpWhen:"When Heritage Healthcare coverage becomes available in this postcode"
      });
      localStorage.setItem(key,JSON.stringify(db));
      submitResult.className="finder-result show";
      submitResult.innerHTML="<strong>You're on our future follow-up list.</strong><span>We've saved your details with National Office. If Heritage Healthcare begins covering your postcode, the team can follow up with you.</span>";
    }catch(err){
      submitResult.className="finder-result show error";
      submitResult.textContent="We couldn't save the follow-up request in this browser. Please contact National Office directly.";
    }
  }

  showStep(1);
})();
