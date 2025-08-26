// This script collects device/browser info and sends it via EmailJS
// IMPORTANT: Replace the placeholders with your EmailJS credentials

// EmailJS Initialization - You need to sign up and get your credentials
// See https://www.emailjs.com/docs/sdk/installation/
(function(){
    emailjs.init("VcalrjM3vIz1HQLCG"); // <-- Replace with your EmailJS user ID
})();

// Fetch the visitor's IP using ipinfo.io (free, limited usage)
function getIPInfo() {
    return fetch("https://ipinfo.io/json?token=347837a25e2357") // <-- Get a free token at ipinfo.io
        .then(response => response.json())
        .catch(() => ({ ip: "Unavailable", city: "", region: "", country: "" }));
}

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
