// Last time updated at Sep 21, 2015, 08:32:23

// Latest file can be found here: https://cdn.webrtc-experiment.com/DetectRTC.js

// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Documentation - github.com/muaz-khan/DetectRTC
// ____________
// DetectRTC.js

// DetectRTC.hasWebcam (has webcam device!)
// DetectRTC.hasMicrophone (has microphone device!)
// DetectRTC.hasSpeakers (has speakers!)
// DetectRTC.isScreenCapturingSupported
// DetectRTC.isSctpDataChannelsSupported
// DetectRTC.isRtpDataChannelsSupported
// DetectRTC.isAudioContextSupported
// DetectRTC.isWebRTCSupported
// DetectRTC.isDesktopCapturingSupported
// DetectRTC.isMobileDevice
// DetectRTC.isWebSocketsSupported

// DetectRTC.DetectLocalIPAddress(callback)

// ----------todo: add
// DetectRTC.videoResolutions
// DetectRTC.screenResolutions

'use strict';

if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevices
    // Thanks @xdumaine/enumerateDevices
    navigator.enumerateDevices = function(callback) {
        navigator.mediaDevices.enumerateDevices().then(callback);
    };
}

var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);
var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);

function getBrowserInfo() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after 'Opera' or after 'Version'
    if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
        browserName = 'Opera';
        fullVersion = nAgt.substring(verOffset + 6);

        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
            fullVersion = nAgt.substring(verOffset + 8);
        }
    }
    // In MSIE, the true version is after 'MSIE' in userAgent
    else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
        browserName = 'IE';
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after 'Chrome' 
    else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
        browserName = 'Chrome';
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after 'Safari' or after 'Version' 
    else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
        browserName = 'Safari';
        fullVersion = nAgt.substring(verOffset + 7);

        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
            fullVersion = nAgt.substring(verOffset + 8);
        }
    }
    // In Firefox, the true version is after 'Firefox' 
    else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
        browserName = 'Firefox';
        fullVersion = nAgt.substring(verOffset + 8);
    }

    // In most other browsers, 'name/version' is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);

        if (browserName.toLowerCase() === browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }

    if (isEdge) {
        browserName = 'Edge';
        fullVersion = navigator.userAgent.split('Edge/')[1];
    }

    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    majorVersion = parseInt('' + fullVersion, 10);

    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return {
        fullVersion: fullVersion,
        version: majorVersion,
        name: browserName
    };
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    },
    getOsName: function() {
        var osName = 'Unknown OS';
        if (isMobile.Android()) {
            osName = 'Android';
        }

        if (isMobile.BlackBerry()) {
            osName = 'BlackBerry';
        }

        if (isMobile.iOS()) {
            osName = 'iOS';
        }

        if (isMobile.Opera()) {
            osName = 'Opera Mini';
        }

        if (isMobile.Windows()) {
            osName = 'Windows';
        }

        return osName;
    }
};

var osName = 'Unknown OS';

if (isMobile.any()) {
    osName = isMobile.getOsName();
} else {
    if (navigator.appVersion.indexOf('Win') !== -1) {
        osName = 'Windows';
    }

    if (navigator.appVersion.indexOf('Mac') !== -1) {
        osName = 'MacOS';
    }

    if (navigator.appVersion.indexOf('X11') !== -1) {
        osName = 'UNIX';
    }

    if (navigator.appVersion.indexOf('Linux') !== -1) {
        osName = 'Linux';
    }
}


var isCanvasSupportsStreamCapturing = false;
(function detectCanvasCaptureStream() {
    // latest Firefox nighly is supporting this "awesome" feature!
    var canvas = document.createElement('canvas');

    if (typeof canvas.captureStream === 'function') {
        isCanvasSupportsStreamCapturing = true;
    } else if (typeof canvas.mozCaptureStream === 'function') {
        isCanvasSupportsStreamCapturing = true;
    } else if (typeof canvas.webkitCaptureStream === 'function') {
        isCanvasSupportsStreamCapturing = true;
    }
})();

var isVideoSupportsStreamCapturing = false;
(function detectVideoCaptureStream() {
    var video = document.createElement('video');
    if (typeof video.captureStream === 'function') {
        isVideoSupportsStreamCapturing = true;
    } else if (typeof video.mozCaptureStream === 'function') {
        isVideoSupportsStreamCapturing = true;
    } else if (typeof video.webkitCaptureStream === 'function') {
        isVideoSupportsStreamCapturing = true;
    }
})();

// via: https://github.com/diafygi/webrtc-ips
function DetectLocalIPAddress(callback) {
    getIPs(function(ip) {
        //local IPs
        if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
            callback('Local: ' + ip);
        }

        //assume the rest are public IPs
        else {
            callback('Public: ' + ip);
        }
    });
}

//get the IP addresses associated with an account
function getIPs(callback) {
    var ipDuplicates = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    // bypass naive webrtc blocking using an iframe
    if (!RTCPeerConnection) {
        var iframe = document.getElementById('iframe');
        if (!iframe) {
            //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
            throw 'NOTE: you need to have an iframe in the page right above the script tag.';
        }
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{
            RtpDataChannels: true
        }]
    };

    //firefox already has a default stun server in about:config
    //    media.peerconnection.default_iceservers =
    //    [{"url": "stun:stun.services.mozilla.com"}]
    var servers;

    //add same stun server for chrome
    if (useWebKit) {
        servers = {
            iceServers: [{
                urls: 'stun:stun.services.mozilla.com'
            }]
        };

        if (typeof DetectRTC !== 'undefined' && DetectRTC.browser.isFirefox && DetectRTC.browser.version <= 38) {
            servers[0] = {
                url: servers[0].urls
            };
        }
    }

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate) {
        //match just the IP address
        var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        var ipAddress = ipRegex.exec(candidate)[1];

        //remove duplicates
        if (ipDuplicates[ipAddress] === undefined) {
            callback(ipAddress);
        }

        ipDuplicates[ipAddress] = true;
    }

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        //skip non-candidate events
        if (ice.candidate) {
            handleCandidate(ice.candidate.candidate);
        }
    };

    //create a bogus data channel
    pc.createDataChannel('');

    //create an offer sdp
    pc.createOffer(function(result) {

        //trigger the stun server request
        pc.setLocalDescription(result, function() {}, function() {});

    }, function() {});

    //wait for a while to let everything done
    setTimeout(function() {
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line) {
            if (line.indexOf('a=candidate:') === 0) {
                handleCandidate(line);
            }
        });
    }, 1000);
}

var MediaDevices = [];

// ---------- Media Devices detection
var canEnumerate = false;
if (typeof MediaStreamTrack !== 'undefined') {
    canEnumerate = true;
} else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
    canEnumerate = true;
}

var hasMicrophone = canEnumerate;
var hasSpeakers = canEnumerate;
var hasWebcam = canEnumerate;

// http://dev.w3.org/2011/webrtc/editor/getusermedia.html#mediadevices
// todo: switch to enumerateDevices when landed in canary.
function CheckDeviceSupport(callback) {
    // This method is useful only for Chrome!

    if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
    }

    if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
    }

    if (!navigator.enumerateDevices) {
        if (callback) {
            callback();
        }
        return;
    }

    MediaDevices = [];
    navigator.enumerateDevices(function(devices) {
        devices.forEach(function(_device) {
            var device = {};
            for (var d in _device) {
                device[d] = _device[d];
            }

            var skip;
            MediaDevices.forEach(function(d) {
                if (d.id === device.id) {
                    skip = true;
                }
            });

            if (skip) {
                return;
            }

            // if it is MediaStreamTrack.getSources
            if (device.kind === 'audio') {
                device.kind = 'audioinput';
            }

            if (device.kind === 'video') {
                device.kind = 'videoinput';
            }

            if (!device.deviceId) {
                device.deviceId = device.id;
            }

            if (!device.id) {
                device.id = device.deviceId;
            }

            if (!device.label) {
                device.label = 'Please invoke getUserMedia once.';
            }

            if (device.kind === 'audioinput' || device.kind === 'audio') {
                hasMicrophone = true;
            }

            if (device.kind === 'audiooutput') {
                hasSpeakers = true;
            }

            if (device.kind === 'videoinput' || device.kind === 'video') {
                hasWebcam = true;
            }

            // there is no 'videoouput' in the spec.

            MediaDevices.push(device);
        });

        if (typeof DetectRTC !== 'undefined') {
            DetectRTC.MediaDevices = MediaDevices;
            DetectRTC.hasMicrophone = MediaDevices;
            DetectRTC.hasSpeakers = MediaDevices;
            DetectRTC.hasWebcam = MediaDevices;
        }

        if (callback) {
            callback();
        }
    });
}

// check for microphone/camera support!
new CheckDeviceSupport();

var DetectRTC = {};

// ----------
// DetectRTC.browser.name || DetectRTC.browser.version || DetectRTC.browser.fullVersion
DetectRTC.browser = getBrowserInfo();

// DetectRTC.isChrome || DetectRTC.isFirefox || DetectRTC.isEdge
DetectRTC.browser['is' + DetectRTC.browser.name] = true;

var isHTTPs = location.protocol === 'https:';
var isNodeWebkit = !!(window.process && (typeof window.process === 'object') && window.process.versions && window.process.versions['node-webkit']);

// --------- Detect if system supports WebRTC 1.0 or WebRTC 1.1.
var isWebRTCSupported = false;
['webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'].forEach(function(item) {
    if (item in window) {
        isWebRTCSupported = true;
    }
});
DetectRTC.isWebRTCSupported = isWebRTCSupported;

// --------- Detect if system supports screen capturing API
var isScreenCapturingSupported = false;
if (DetectRTC.browser.isChrome && DetectRTC.browser.version >= 35) {
    isScreenCapturingSupported = true;
} else if (DetectRTC.browser.isFirefox && DetectRTC.browser.version >= 34) {
    isScreenCapturingSupported = true;
}

if (!isHTTPs) {
    isScreenCapturingSupported = false;
}
DetectRTC.isScreenCapturingSupported = isScreenCapturingSupported;

// --------- Detect if WebAudio API are supported
var webAudio = {};
['AudioContext', 'webkitAudioContext', 'mozAudioContext', 'msAudioContext'].forEach(function(item) {
    if (item in window) {
        webAudio.isSupported = true;

        if ('createMediaStreamSource' in window[item].prototype) {
            webAudio.isCreateMediaStreamSourceSupported = true;
        }
    }
});
DetectRTC.isAudioContextSupported = webAudio.isSupported;
DetectRTC.isCreateMediaStreamSourceSupported = webAudio.isCreateMediaStreamSourceSupported;

// ---------- Detect if SCTP/RTP channels are supported.

DetectRTC.isRtpDataChannelsSupported = DetectRTC.browser.isChrome && DetectRTC.browser.version > 31;
var isSCTPSupportd = false;
if (DetectRTC.browser.isFirefox && DetectRTC.browser.version > 28) {
    isSCTPSupportd = true;
} else if (DetectRTC.browser.isChrome && DetectRTC.browser.version > 25) {
    isSCTPSupportd = true;
} else if (DetectRTC.browser.isOpera && DetectRTC.browser.version >= 11) {
    isSCTPSupportd = true;
}
DetectRTC.isSctpDataChannelsSupported = isSCTPSupportd;

// ---------

DetectRTC.isMobileDevice = isMobileDevice; // "isMobileDevice" boolean is defined in "getBrowserInfo.js"

// ------

DetectRTC.isWebSocketsSupported = 'WebSocket' in window && 2 === window.WebSocket.CLOSING;
if (DetectRTC.isWebSocketsSupported) {
    var websocket = new WebSocket('wss://test.com:443/');
    websocket.onopen = function() {
        DetectRTC.isWebSocketsBlocked = false;
    };
    websocket.onerror = function() {
        DetectRTC.isWebSocketsBlocked = true;
    };
}

// ------
var isGetUserMediaSupported = false;
if (navigator.getUserMedia) {
    isGetUserMediaSupported = true;
} else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    isGetUserMediaSupported = true;
}
if (DetectRTC.browser.isChrome && DetectRTC.browser.version >= 47 && !isHTTPs) {
    DetectRTC.isGetUserMediaSupported = 'Requires HTTPs';
}
DetectRTC.isGetUserMediaSupported = false;

// -----------
DetectRTC.osName = osName; // "osName" is defined in "detectOSName.js"

// ----------
DetectRTC.isCanvasSupportsStreamCapturing = isCanvasSupportsStreamCapturing;
DetectRTC.isVideoSupportsStreamCapturing = isVideoSupportsStreamCapturing;

// ------
DetectRTC.DetectLocalIPAddress = DetectLocalIPAddress;

// -------
DetectRTC.load = CheckDeviceSupport;

DetectRTC.MediaDevices = MediaDevices;
DetectRTC.hasMicrophone = MediaDevices;
DetectRTC.hasSpeakers = MediaDevices;
DetectRTC.hasWebcam = MediaDevices;

// ------
var isSetSinkIdSupported = false;
if ('setSinkId' in document.createElement('video')) {
    isSetSinkIdSupported = true;
}
DetectRTC.isSetSinkIdSupported = isSetSinkIdSupported;

// -----
var isRTPSenderReplaceTracksSupported = false;
if (DetectRTC.browser.isFirefox /*&& DetectRTC.browser.version > 39*/ ) {
    /*global mozRTCPeerConnection:true */
    if ('getSenders' in mozRTCPeerConnection.prototype) {
        isRTPSenderReplaceTracksSupported = true;
    }
} else if (DetectRTC.browser.isChrome) {
    /*global webkitRTCPeerConnection:true */
    if ('getSenders' in webkitRTCPeerConnection.prototype) {
        isRTPSenderReplaceTracksSupported = true;
    }
}
DetectRTC.isRTPSenderReplaceTracksSupported = isRTPSenderReplaceTracksSupported;

//-------
DetectRTC.isORTCSupported = typeof RTCIceGatherer !== 'undefined';
