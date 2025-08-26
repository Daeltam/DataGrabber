// This script collects device/browser info and sends it via EmailJS
// IMPORTANT: Replace the placeholders with your EmailJS credentials

// EmailJS Initialization - You need to sign up and get your credentials
// See https://www.emailjs.com/docs/sdk/installation/
(function(){
    emailjs.init("VcalrjM3vIz1HQLCG"); // <-- Replace with your EmailJS user ID
})();

// Fetch IP info from ipapi
fetch("https://ipapi.co/json/")
  .then(response => response.json())
  .then(ipInfo => {
    const deviceInfo = getDeviceInfo(); // your function as before
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      ip: ipInfo.ip,
      network: ipInfo.network,
      version: ipInfo.version,
      city: ipInfo.city,
      region: ipInfo.region,
      region_code: ipInfo.region_code,
      country: ipInfo.country,
      country_name: ipInfo.country_name,
      country_code: ipInfo.country_code,
      country_code_iso3: ipInfo.country_code_iso3,
      country_capital: ipInfo.country_capital,
      country_tld: ipInfo.country_tld,
      continent_code: ipInfo.continent_code,
      in_eu: ipInfo.in_eu,
      postal: ipInfo.postal,
      latitude: ipInfo.latitude,
      longitude: ipInfo.longitude,
      timezone: ipInfo.timezone,
      utc_offset: ipInfo.utc_offset,
      country_calling_code: ipInfo.country_calling_code,
      currency: ipInfo.currency,
      currency_name: ipInfo.currency_name,
      languages: ipInfo.languages,
      country_area: ipInfo.country_area,
      country_population: ipInfo.country_population,
      asn: ipInfo.asn,
      org: ipInfo.org,

      userAgent: deviceInfo.userAgent,
      platform: deviceInfo.platform,
      language: deviceInfo.language,
      cookiesEnabled: deviceInfo.cookiesEnabled,
      screen: JSON.stringify(deviceInfo.screen),
      online: deviceInfo.online,
    })
    .then(() => {
      document.getElementById("log-status").innerText = "Log sent successfully!";
    })
    .catch((error) => {
      document.getElementById("log-status").innerText = "Failed to send log: " + JSON.stringify(error);
    });
  })
  .catch((error) => {
    document.getElementById("log-status").innerText = "Failed to fetch IP info: " + JSON.stringify(error);
  });

// Collect device/browser info
function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        online: navigator.onLine
    };
}

// Send the collected info via EmailJS
function sendLogEmail(ipInfo, deviceInfo) {
    // Prepare data for EmailJS template
    const emailParams = {
        ip: ipInfo.ip,
        location: `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`,
        userAgent: deviceInfo.userAgent,
        platform: deviceInfo.platform,
        language: deviceInfo.language,
        cookiesEnabled: deviceInfo.cookiesEnabled,
        screen: JSON.stringify(deviceInfo.screen),
        timezone: deviceInfo.timezone,
        online: deviceInfo.online,
        // Add more fields as needed
    };

    // Replace the placeholders below with your EmailJS service/template IDs
    emailjs.send("service_5fifa81", "service_5fifa81", emailParams)
        .then(() => {
            document.getElementById("log-status").innerText = "Log sent successfully.";
        })
        .catch((error) => {
            document.getElementById("log-status").innerText = "Failed to send log: " + error;
        });
}

// Main logic
getIPInfo().then(ipInfo => {
    const deviceInfo = getDeviceInfo();
    sendLogEmail(ipInfo, deviceInfo);
});
