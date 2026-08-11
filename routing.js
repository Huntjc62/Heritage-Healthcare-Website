
/*
 Heritage Healthcare V3 — enquiry routing demo
 ------------------------------------------------
 Production note:
 This is deliberately client-side for the downloadable prototype.
 A production site MUST perform the final postcode lookup and email
 routing server-side, never trusting browser-supplied routing decisions.
*/
(() => {
  const normalisePostcode = value => String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  const postcodeArea = value => {
    const pc = normalisePostcode(value);
    const match = pc.match(/^[A-Z]{1,2}[0-9][0-9A-Z]?/);
    return match ? match[0] : "";
  };

  const findOffice = (postcode, sourceOffice) => {
    const area = postcodeArea(postcode);
    if (!area) return {status:"invalid", office:null, area:""};

    const matches = Object.entries(window.HERITAGE_ROUTING.offices)
      .filter(([, office]) => office.postcodes.includes(area));

    // Prefer the source office if it explicitly covers the postcode.
    const sourceMatch = matches.find(([slug]) => slug === sourceOffice);
    if (sourceMatch) return {status:"local", office:{slug:sourceMatch[0], ...sourceMatch[1]}, area};

    // Another Heritage office covers it: national office receives the enquiry,
    // with a suggested destination for national review.
    if (matches.length) return {status:"other-office", office:{slug:matches[0][0], ...matches[0][1]}, area};

    return {status:"national", office:null, area};
  };

  window.HeritageRouting = { normalisePostcode, postcodeArea, findOffice };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-enquiry-form]").forEach(form => {
      const sourceOffice = form.dataset.sourceOffice || "";
      const postcode = form.querySelector("[name=postcode]");
      const result = form.querySelector("[data-routing-result]");
      const routeField = form.querySelector("[name=routing]");
      const officeField = form.querySelector("[name=matched_office]");
      const emailField = form.querySelector("[name=route_email]");

      const updateRoute = () => {
        const route = findOffice(postcode?.value, sourceOffice);
        if (routeField) routeField.value = route.status;
        if (officeField) officeField.value = route.status === "local"
          ? route.office.name
          : route.status === "other-office"
            ? route.office.name
            : "National Office";
        if (emailField) emailField.value = route.status === "local"
          ? route.office.email
          : window.HERITAGE_ROUTING.national.email;

        if (!result) return;
        result.className = "routing-result";
        if (!postcode?.value) {
          result.textContent = "";
          result.classList.remove("show");
          return;
        }
        if (route.status === "local") {
          result.innerHTML = `<strong>✓ Local coverage found</strong><span>Your enquiry will be routed to ${route.office.name}.</span>`;
        } else if (route.status === "other-office") {
          result.innerHTML = `<strong>✓ Heritage coverage found</strong><span>This postcode appears to be covered by ${route.office.name}. Your enquiry will go to the National Office for review, with ${route.office.name} suggested as the local team.</span>`;
        } else if (route.status === "national") {
          result.innerHTML = `<strong>National review</strong><span>We couldn't identify a listed local office for this postcode. Your enquiry will be sent to the National Office.</span>`;
        } else {
          result.innerHTML = `<strong>Check your postcode</strong><span>Enter a valid UK postcode so we can identify the right route. You can still submit an enquiry without a postcode.</span>`;
        }
        result.classList.add("show");
      };

      postcode?.addEventListener("input", updateRoute);
      postcode?.addEventListener("blur", updateRoute);

      form.addEventListener("submit", event => {
        event.preventDefault();
        updateRoute();

        const route = findOffice(postcode?.value, sourceOffice);
        const success = form.querySelector("[data-form-success]");
        if (success) {
          const destination = route.status === "local"
            ? route.office.name
            : route.status === "other-office"
              ? "National Office (suggested local team: " + route.office.name + ")"
              : "National Office";
          success.innerHTML = `<strong>Enquiry captured successfully.</strong><br>V1 routing result: <b>${destination}</b>.<br><small>This downloadable prototype does not send real email. Production will send securely to the routed office and log the enquiry centrally.</small>`;
          success.classList.add("show");
        }
      });
    });
  });
})();
