
customElements.define(X.SpResults.is, X.SpResults);
r.Sp_results = {};
r.Sp_results.SpResults = {};
n.crypt = {};
n.crypt.stringToByteArray = function(a) {
    for (var b = [], d = 0, e = 0; e < a.length; e++) {
        var f = a.charCodeAt(e);
        255 < f && (b[d++] = f & 255, f >>= 8);
        b[d++] = f
    }
    return b
};
n.crypt.byteArrayToString = function(a) {
    if (8192 >= a.length) return String.fromCharCode.apply(null, a);
    for (var b = "", d = 0; d < a.length; d += 8192) {
        var e = n.array.slice(a, d, d + 8192);
        b += String.fromCharCode.apply(null, e)
    }
    return b
};
n.crypt.byteArrayToHex = function(a, b) {
    return n.array.map(a, function(a) {
        a = a.toString(16);
        return 1 < a.length ? a : "0" + a
    }).join(b || "")
};
n.crypt.hexToByteArray = function(a) {
    n.asserts.assert(0 == a.length % 2, "Key string length must be multiple of 2");
    for (var b = [], d = 0; d < a.length; d += 2) b.push(parseInt(a.substring(d, d + 2), 16));
    return b
};
n.crypt.stringToUtf8ByteArray = function(a) {
    for (var b = [], d = 0, e = 0; e < a.length; e++) {
        var f = a.charCodeAt(e);
        128 > f ? b[d++] = f : (2048 > f ? b[d++] = f >> 6 | 192 : (55296 == (f & 64512) && e + 1 < a.length && 56320 == (a.charCodeAt(e + 1) & 64512) ? (f = 65536 + ((f & 1023) << 10) + (a.charCodeAt(++e) & 1023), b[d++] = f >> 18 | 240, b[d++] = f >> 12 & 63 | 128) : b[d++] = f >> 12 | 224, b[d++] = f >> 6 & 63 | 128), b[d++] = f & 63 | 128)
    }
    return b
};
n.crypt.utf8ByteArrayToString = function(a) {
    for (var b = [], d = 0, e = 0; d < a.length;) {
        var f = a[d++];
        if (128 > f) b[e++] = String.fromCharCode(f);
        else if (191 < f && 224 > f) {
            var g = a[d++];
            b[e++] = String.fromCharCode((f & 31) << 6 | g & 63)
        } else if (239 < f && 365 > f) {
            g = a[d++];
            var h = a[d++],
                l = a[d++];
            f = ((f & 7) << 18 | (g & 63) << 12 | (h & 63) << 6 | l & 63) - 65536;
            b[e++] = String.fromCharCode(55296 + (f >> 10));
            b[e++] = String.fromCharCode(56320 + (f & 1023))
        } else g = a[d++], h = a[d++], b[e++] = String.fromCharCode((f & 15) << 12 | (g & 63) << 6 | h & 63)
    }
    return b.join("")
};
n.crypt.xorByteArray = function(a, b) {
    n.asserts.assert(a.length == b.length, "XOR array lengths must match");
    for (var d = [], e = 0; e < a.length; e++) d.push(a[e] ^ b[e]);
    return d
};
n.crypt.base64 = {};
n.crypt.base64.byteToCharMap_ = null;
n.crypt.base64.charToByteMap_ = null;
n.crypt.base64.byteToCharMapWebSafe_ = null;
n.crypt.base64.ENCODED_VALS_BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
n.crypt.base64.ENCODED_VALS = n.crypt.base64.ENCODED_VALS_BASE + "+/=";
n.crypt.base64.ENCODED_VALS_WEBSAFE = n.crypt.base64.ENCODED_VALS_BASE + "-_.";
n.crypt.base64.ASSUME_NATIVE_SUPPORT_ = n.userAgent.GECKO || n.userAgent.WEBKIT && !n.userAgent.product.SAFARI || n.userAgent.OPERA;
n.crypt.base64.HAS_NATIVE_ENCODE_ = n.crypt.base64.ASSUME_NATIVE_SUPPORT_ || "function" == typeof n.global.btoa;
n.crypt.base64.HAS_NATIVE_DECODE_ = n.crypt.base64.ASSUME_NATIVE_SUPPORT_ || !n.userAgent.product.SAFARI && !n.userAgent.IE && "function" == typeof n.global.atob;
n.crypt.base64.encodeByteArray = function(a, b) {
    n.asserts.assert(n.isArrayLike(a), "encodeByteArray takes an array as a parameter");
    n.crypt.base64.init_();
    b = b ? n.crypt.base64.byteToCharMapWebSafe_ : n.crypt.base64.byteToCharMap_;
    for (var d = [], e = 0; e < a.length; e += 3) {
        var f = a[e],
            g = e + 1 < a.length,
            h = g ? a[e + 1] : 0,
            l = e + 2 < a.length,
            p = l ? a[e + 2] : 0,
            m = f >> 2;
        f = (f & 3) << 4 | h >> 4;
        h = (h & 15) << 2 | p >> 6;
        p &= 63;
        l || (p = 64, g || (h = 64));
        d.push(b[m], b[f], b[h], b[p])
    }
    return d.join("")
};
n.crypt.base64.encodeString = function(a, b) {
    return n.crypt.base64.HAS_NATIVE_ENCODE_ && !b ? n.global.btoa(a) : n.crypt.base64.encodeByteArray(n.crypt.stringToByteArray(a), b)
};
n.crypt.base64.decodeString = function(a, b) {
    function d(a) {
        e += String.fromCharCode(a)
    }
    if (n.crypt.base64.HAS_NATIVE_DECODE_ && !b) return n.global.atob(a);
    var e = "";
    n.crypt.base64.decodeStringInternal_(a, d);
    return e
};
n.crypt.base64.decodeStringToByteArray = function(a) {
    function b(a) {
        d.push(a)
    }
    var d = [];
    n.crypt.base64.decodeStringInternal_(a, b);
    return d
};
n.crypt.base64.decodeStringToUint8Array = function(a) {
    function b(a) {
        f[g++] = a
    }
    n.asserts.assert(!n.userAgent.IE || n.userAgent.isVersionOrHigher("10"), "Browser does not support typed arrays");
    var d = a.length,
        e = 0;
    "=" === a[d - 2] ? e = 2 : "=" === a[d - 1] && (e = 1);
    var f = new Uint8Array(Math.ceil(3 * d / 4) - e),
        g = 0;
    n.crypt.base64.decodeStringInternal_(a, b);
    return f.subarray(0, g)
};
n.crypt.base64.decodeStringInternal_ = function(a, b) {
    function d(b) {
        for (; e < a.length;) {
            var d = a.charAt(e++),
                f = n.crypt.base64.charToByteMap_[d];
            if (null != f) return f;
            if (!n.string.isEmptyOrWhitespace(d)) throw Error("Unknown base64 encoding at char: " + d);
        }
        return b
    }
    n.crypt.base64.init_();
    for (var e = 0;;) {
        var f = d(-1),
            g = d(0),
            h = d(64),
            l = d(64);
        if (64 === l && -1 === f) break;
        f = f << 2 | g >> 4;
        b(f);
        64 != h && (g = g << 4 & 240 | h >> 2, b(g), 64 != l && (h = h << 6 & 192 | l, b(h)))
    }
};
n.crypt.base64.init_ = function() {
    if (!n.crypt.base64.byteToCharMap_) {
        n.crypt.base64.byteToCharMap_ = {};
        n.crypt.base64.charToByteMap_ = {};
        n.crypt.base64.byteToCharMapWebSafe_ = {};
        for (var a = 0; a < n.crypt.base64.ENCODED_VALS.length; a++) n.crypt.base64.byteToCharMap_[a] = n.crypt.base64.ENCODED_VALS.charAt(a), n.crypt.base64.charToByteMap_[n.crypt.base64.byteToCharMap_[a]] = a, n.crypt.base64.byteToCharMapWebSafe_[a] = n.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(a), a >= n.crypt.base64.ENCODED_VALS_BASE.length && (n.crypt.base64.charToByteMap_[n.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(a)] =
            a)
    }
};

xc = {
    DEFAULT: "Default",
    COMMAND_AND_SEARCH: "Command / Search",
    PHONE_CALL: "Phone call",
    VIDEO: "Video"
};

Y.SpApp = function() {
    var a = Polymer.Element.call(this) || this;
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext, navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    } catch (b) {
        return a.errorClient = "BROWSER_UNSUPPORTED", a.controlsDisabled = !1, a
    }
    if (!navigator.getUserMedia || !window.AudioContext) return a.errorClient = "BROWSER_UNSUPPORTED", a.controlsDisabled = !0, a;
    a.audioContext = new AudioContext;
    a.checkServer_();
    a.transcripts =
        a.recognitionModels.map(function(a) {
            a.isEnabled = !1;
            return a
        });
    return a
};
k.inherits(Y.SpApp, Polymer.Element);
c = Y.SpApp.prototype;
c.checkServer_ = function() {
    var a = this;
    this.initFallback_();
    var b = new XMLHttpRequest;
    b.onload = function() {
        200 <= b.status && 400 > b.status && (a.streamingAvailable = !0, a.controlsDisabled = !1)
    };
    b.onerror = function() {
        a.initFallback_()
    };
    b.open("GET", "//" + this.urlServer + "/status", !0);
    b.send()
};
c.convertFileToArrayBuffer_ = function(a) {
    return new Promise(function(b, d) {
        var e = new FileReader;
        e.onload = function(a) {
            b(a.target.result)
        };
        e.onerror = function(a) {
            d(a.target.error)
        };
        e.readAsArrayBuffer(a)
    })
};
c.decodeArrayBuffer_ = function(a) {
    var b = this,
        d = a.slice(0);
    return new Promise(function(e, f) {
        b.audioContext.decodeAudioData(d, function(d) {
            d.duration > b.audioDurationLimit && (b.errorClient = "AUDIO_LENGTH", f());
            b.audioDuration = d.duration;
            if (1 === d.numberOfChannels) e(a);
            else {
                b.fileUploadStatus = "CONVERTING";
                window.OfflineAudioContext || (f(), b.errorClient = "MULTI_CHANNEL");
                b.sampleRate = d.sampleRate;
                var g = new OfflineAudioContext(1, d.length, d.sampleRate),
                    l = g.createBufferSource(),
                    p = g.createChannelMerger(1);
                l.buffer =
                    d;
                l.connect(p);
                p.connect(g.destination);
                l.start();
                g.startRendering().then(function(a) {
                    var b = a,
                        d = void 0;
                    d = d || {};
                    a = b.numberOfChannels;
                    var f = b.sampleRate,
                        g = d.float32 ? 3 : 1;
                    d = 3 === g ? 32 : 16;
                    if (2 === a) {
                        var h = b.getChannelData(0);
                        b = b.getChannelData(1);
                        for (var l = h.length + b.length, p = new Float32Array(l), m = 0, y = 0; m < l;) p[m++] = h[y], p[m++] = b[y], y++;
                        h = p
                    } else h = b.getChannelData(0);
                    b = a;
                    l = d / 8;
                    p = b * l;
                    a = new ArrayBuffer(44 + h.length * l);
                    m = new DataView(a);
                    tc(m, 0, "RIFF");
                    m.setUint32(4, 36 + h.length * l, !0);
                    tc(m, 8, "WAVE");
                    tc(m, 12, "fmt ");
                    m.setUint32(16, 16, !0);
                    m.setUint16(20, g, !0);
                    m.setUint16(22, b, !0);
                    m.setUint32(24, f, !0);
                    m.setUint32(28, f * p, !0);
                    m.setUint16(32, p, !0);
                    m.setUint16(34, d, !0);
                    tc(m, 36, "data");
                    m.setUint32(40, h.length * l, !0);
                    if (1 === g)
                        for (d = m, f = 44, g = 0; g < h.length; g++, f += 2) b = Math.max(-1, Math.min(1, h[g])), d.setInt16(f, 0 > b ? 32768 * b : 32767 * b, !0);
                    else
                        for (d = m, f = 44, g = 0; g < h.length; g++, f += 4) d.setFloat32(f, h[g], !0);
                    e(a)
                }).catch(function(a) {
                    f(a)
                })
            }
        }, function(a) {
            f(a)
        })
    })
};
c.fileUploadValueChanged_ = function(a) {
    var b = this;
    a ? (this.resetResults_(), this.controlsDisabled = !0, this.fileUploadProgress = 20, this.convertFileToArrayBuffer_(a).then(function(a) {
        b.decodeArrayBuffer_(a).then(function(a) {
            a = new Uint8Array(a);
            b.getTranscripts_(n.crypt.base64.encodeByteArray(a))
        }, function(a) {
            a && (console.log(a), b.errorClient = "DECODE_FAILED");
            b.controlsDisabled = !1;
            b.fileUploadProgress = 0
        })
    }), mc({
        type: "speech-api",
        name: "fileUploaded"
    })) : this.fileUploadProgress = 0
};
c.getErrorMessage_ = function(a) {
    return this.messages.error[a] || a
};
c.getTranscripts_ = function(a) {
    var b = this;
    if (!this.fileUploadCanceled) {
        this.fileUploadProgress = 30;
        this.fileUploadStatus = "TRANSCRIBING";
        var d = {
            config: {
                encoding: "LINEAR16",
                languageCode: this.languageSelected,
                sampleRateHertz: this.sampleRate,
                enableAutomaticPunctuation: this.punctuationEnabled
            },
            audio: {
                content: a
            }
        };
        var e = setInterval(function() {
            return b.updateProgressMeter_()
        }, 50);
        this.recognitionModels.forEach(function(a) {
            var f = b.transcripts.map(function(a) {
                return a.id
            }).indexOf(a.id);
            if (a.enabledLanguages &&
                !a.enabledLanguages.includes(b.languageSelected)) {
                b.set("transcripts." + f + ".isEnabled", !1);
                var h = b.getErrorMessage_("MODEL_UNAVAILABLE");
                b.set("transcripts." + f + ".error", h)
            } else h = JSON.parse(JSON.stringify(d)), h.config.model = a.id, b.set("transcripts." + f + ".isEnabled", !0), b.postAudioRequest_(JSON.stringify(h)).then(JSON.parse).then(function(d) {
                b.fileUploadProgress = 0;
                clearInterval(e);
                b.controlsDisabled = !1;
                b.errorServer = null;
                d.results && d.results.length ? b.setResults_(d.results, a.id) : (d = b.getErrorMessage_("MODEL_ERROR"),
                    b.set("transcripts." + f + ".error", d))
            }, function(a) {
                console.log(a);
                try {
                    var d = a && "" !== a && JSON.parse(a);
                    var f = d.error && d.error.message
                } catch (u) {
                    f = a && "" !== a ? a : "API_POST_ERROR"
                }
                b.fileUploadProgress = 0;
                clearInterval(e);
                b.controlsDisabled = !1;
                b.errorServer = f
            }), a.showEnhanced && (h.config.useEnhanced = !0, b.postAudioRequest_(JSON.stringify(h)).then(JSON.parse).then(function(a) {
                b.fileUploadCanceled || (a = a.results.map(function(a) {
                    return a.alternatives[0].transcript
                }), b.set("transcripts." + f + ".enhancedResults", a))
            }, function(a) {
                console.log(a)
            }))
        })
    }
};
c.initFallback_ = function() {
    var a = this;
    if (!this.checkRecorder && !window.Recorder) {
        var b = document.createElement("script");
        b.src = this.recorderLib;
        b.type = "text/javascript";
        b.async = !0;
        document.head.appendChild(b);
        this.checkRecorder = setInterval(function() {
            window.Recorder && (a.controlsDisabled = !1, a.maxRecordTime = 3E4, clearInterval(a.checkRecorder))
        }, 200);
        this.streamingAvailable = !1
    }
};
c.onInputTypeSelectedChanged_ = function() {
    this.resetResults_()
};
c.onIsRecordingChanged_ = function(a, b) {
    "undefined" !== typeof b && (this.isRecording ? this.startRecording_() : this.stopRecording_())
};
c.postAudioRequest_ = function(a, b) {
    var d = this;
    b = void 0 === b ? "recognize" : b;
    return new Promise(function(e, f) {
        var g = d.urlApi + b;
        g = d.urlProxy + "?url=" + encodeURIComponent(g);
        var h = new XMLHttpRequest;
        h.onload = function() {
            200 <= h.status && 400 > h.status ? e(h.response) : f(h.response)
        };
        h.onerror = function() {
            f(h.response)
        };
        h.open("POST", g, !0);
        h.send(a)
    })
};

c.processAudio_ = function(a) {
    a = a.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
    for (var b = a.length, d = new Int16Array(b); b--;) d[b] = 32767 * Math.min(1, a[b]);
    1 !== this.socket.readyState ? this.errorServer = "SERVICE_UNAVAILABLE" : this.socket.send(d.buffer)
};

c.resetResults_ = function() {
    var a = this;
    this.resultsReady = !1;
    this.transcripts && this.transcripts.length && this.transcripts.forEach(function(b, d) {
        a.set("transcripts." + d + ".tempResult", null);
        a.set("transcripts." + d + ".results", null);
        a.set("transcripts." + d + ".enhancedResults", null);
        a.set("transcripts." + d + ".isEnabled", !1)
    })
};
c.setResults_ = function(a, b) {
    b = void 0 === b ? "default" : b;
    this.fileUploadCanceled || (b = this.transcripts.map(function(a) {
        return a.id
    }).indexOf(b), a = a.map(function(a) {
        if ("string" === typeof a) var b = a;
        else a.text ? b = a.text : a.alternatives && a.alternatives[0].transcript && (b = a.alternatives[0].transcript);
        return b
    }), this.resultsReady = !0, this.set("transcripts." + b + ".error", !1), this.set("transcripts." + b + ".isEnabled", !0), this.set("transcripts." + b + ".results", a), this.set("transcripts." + b + ".tempResult", null))
};
c.setTimeDisplay_ = function() {
    var a = Date.now() - this.startTime;
    a >= this.maxRecordTime ? this.stopRecording_() : 1E3 <= a && (a = 1E4 > a ? "0" + a.toString().slice(0, -3) : a.toString().slice(0, -3), this.timeDisplay = "00:" + a + " / 00:" + this.maxRecordTime / 1E3)
};

c.startRecording_ = function() {
    var a = this;
    this.controlsDisabled = !0;
    this.fileUploadValue = null;
    this.resetResults_();
    this.tabSelected = 0;
    this.timeDisplay = "00:00 / 00:" + this.maxRecordTime / 1E3;
    this.startTime = Date.now();
    this.streamingAvailable ? this.startStreaming_() : (this.startFallback_(), this.updateInterval = setInterval(function() {
        a.setTimeDisplay_()
    }, 500));
    mc({
        type: "speech-api",
        name: "recordStarted"
    })
};

c.startFallback_ = function() {
    var a = this;
    navigator.getUserMedia({
        audio: {
            mandatory: {
                googEchoCancellation: "false",
                googAutoGainControl: "false",
                googNoiseSuppression: "false",
                googHighpassFilter: "false"
            },
            optional: []
        }
    }, function(b) {
        var d = a.audioContext.createMediaStreamSource(b);
        a.mediaTrack = b.getTracks()[0];
        a.recorder = new window.Recorder(d, {
            numChannels: 1,
            workerPath: a.recorderWorkerLib
        });
        a.recorder.clear();
        a.recorder.record()
    }, function() {
        a.errorClient = "MICROPHONE_INACCESSIBLE";
        a.stopFallback_()
    })
};

c.startStreaming_ = function() {
    var a = this;
    this.socket = new WebSocket("wss://" + this.urlServer + "/ws");
    this.socket.binaryType = "arraybuffer";
    this.socket.onopen = function() {
        a.socket.send(JSON.stringify({
            format: "LINEAR16",
            language: a.languageSelected,
            punctuation: a.punctuationEnabled,
            rate: a.audioContext.sampleRate
        }));
        navigator.getUserMedia({
            audio: !0
        }, function(b) {
            a.tabSelected = 0;
            var d = a.audioContext.createMediaStreamSource(b);
            a.processor = a.audioContext.createScriptProcessor(a.bufferSize, 1, 1);
            a.processor.onaudioprocess =
                function(b) {
                    a.processAudio_(b)
                };
            a.processor.connect(a.audioContext.destination);
            d.connect(a.processor);
            a.mediaTrack = b.getTracks()[0];
            a.updateInterval = setInterval(function() {
                a.setTimeDisplay_()
            }, 500)
        }, function() {
            a.errorClient = "MICROPHONE_INACCESSIBLE";
            a.stopRecording_()
        })
    };
    this.socket.onmessage = function(b) {
        b = JSON.parse(b.data);
        b.isFinal ? a.transcripts[0].results ? (a.set("transcripts.0.tempResult", null), a.push("transcripts.0.results", b.text)) : a.setResults_([b.text]) : (a.resultsReady = !0, a.set("transcripts.0.isEnabled", !0), a.set("transcripts.0.tempResult", b.text))
    };
    this.socket.onclose = function(b) {
        1006 === b.code ? a.errorServer = "SERVICE_UNAVAILABLE" : a.controlsDisabled = !1
    };
    this.socket.onerror = function() {
        a.errorServer = "SERVICE_UNAVAILABLE"
    }
};

c.stopFallback_ = function() {
    var a = this;
    this.controlsDisabled = !1;
    this.recorder && setTimeout(function() {
        a.recorder.stop();
        a.mediaTrack && (a.mediaTrack.stop(), a.mediaTrack = {});
        a.recorder.exportWAV(function(b) {
            a.fileUploadValue = b
        })
    }, 500)
};

c.stopRecording_ = function() {
    var a = Date.now() - this.startTime;
    this.isRecording = !1;
    clearInterval(this.updateInterval);
    this.timeDisplay = "00:00 / 00:" + this.maxRecordTime / 1E3;
    this.streamingAvailable ? this.stopStreaming_() : this.stopFallback_();
    mc({
        type: "speech-api",
        name: "recordStopped",
        metadata: {
            recordingTime: a
        }
    })
};

c.stopStreaming_ = function() {
    var a = this;
    setTimeout(function() {
        a.audioContext && "running" == a.audioContext.state && (a.processor && (a.processor.onaudioprocess = function() {}), a.processor = {});
        a.socket && 1 == a.socket.readyState && (a.socket && a.socket.close(), a.socket = {});
        a.set("transcripts.0.tempResult", null);
        a.mediaTrack && a.mediaTrack.stop && (a.mediaTrack.stop(), a.mediaTrack = {})
    }, 1500);
    clearInterval(this.updateInterval);
    this.timeDisplay = "00:00 / 00:" + this.maxRecordTime / 1E3
};


k.global.Object.defineProperties(Y.SpApp, {
    is: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return "sp-app"
        }
    },
    properties: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return {
                audioContext: {
                    type: Object
                },
                audioDuration: {
                    type: Number
                },
                audioDurationLimit: {
                    readOnly: !0,
                    type: Number,
                    value: 59
                },
                bufferSize: {
                    readOnly: !0,
                    type: Number,
                    value: 4096
                },
                checkRecorder: {
                    type: Number,
                    value: 0
                },
                controlsDisabled: {
                    type: Boolean,
                    value: !1
                },
                errorClient: {
                    notify: !0,
                    type: String
                },
                errorServer: {
                    type: String
                },
                fileUploadCanceled: {
                    type: Boolean,
                    value: !1
                },
                fileUploadProgress: {
                    notify: !0,
                    type: Number,
                    value: null
                },
                fileUploadStatus: {
                    notify: !0,
                    type: String
                },
                fileUploadValue: {
                    observer: "fileUploadValueChanged_",
                    type: Object,
                    value: null
                },
                inputTypes: {
                    type: Array,
                    value: function() {
                        return [{
                            id: "microphone",
                            name: uc.MICROPHONE
                        }, {
                            id: "file",
                            name: uc.FILE
                        }]
                    }
                },
                inputTypeSelected: {
                    observer: "onInputTypeSelectedChanged_",
                    type: String,
                    value: "microphone"
                },
                isRecording: {
                    observer: "onIsRecordingChanged_",
                    type: Boolean,
                    value: !1
                },
                languages: {
                    type: Array,
                    value: wc
                },
                languageSelected: {
                    type: String,
                    value: "en-US"
                },
                maxRecordTime: {
                    type: Number,
                    value: 5E4
                },
                mediaTrack: {
                    type: Object
                },
                processor: {
                    type: Object
                },
                punctuationEnabled: {
                    notify: !0,
                    type: Boolean,
                    value: !0
                },
                recognitionModels: {
                    notify: !0,
                    type: Array,
                    value: function() {
                        return [{
                            id: "default",
                            name: xc.DEFAULT
                        }, {
                            id: "command_and_search",
                            name: xc.COMMAND_AND_SEARCH
                        }, {
                            id: "phone_call",
                            name: xc.PHONE_CALL,
                            showEnhanced: !0,
                            enabledLanguages: ["en-US"]
                        }, {
                            id: "video",
                            name: xc.VIDEO,
                            enabledLanguages: ["en-US"]
                        }]
                    }
                },
                recorder: {
                    type: Object
                },
                recorderLib: {
                    type: String,
                    value: "https://cloud.google.com/_static/js/recorder-bundle.js"
                },
                recorderWorkerLib: {
                    type: String,
                    value: "https://cloud.google.com/_static/js/recorderWorker-bundle.js"
                },
                resultsReady: {
                    type: Boolean,
                    value: !1
                },
                sampleRate: {
                    type: Number,
                    value: null
                },
                startTime: {
                    type: Number
                },
                messages: {
                    type: Object,
                    value: function() {
                        return {
                            error: vc
                        }
                    }
                },
                socket: {
                    type: Object
                },
                streamingAvailable: {
                    type: Boolean
                },
                tabSelected: {
                    notify: !0,
                    type: Number,
                    value: 0
                },
                timeDisplay: {
                    type: String,
                    value: "00:00"
                },
                transcripts: {
                    notify: !0,
                    type: Array,
                    value: function() {
                        return []
                    }
                },
                updateInterval: {
                    type: Number
                },
                urlApi: {
                    readOnly: !0,
                    type: String,
                    value: "https://speech.googleapis.com/v1p1beta1/speech:"
                },
                urlProxy: {
                    readOnly: !0,
                    type: String,
                    value: "https://cxl-services.appspot.com/proxy"
                },
                urlServer: {
                    type: String,
                    value: "cloudspeech.goog"
                }
            }
        }
    }
});
Y.SpApp.prototype._setAudioDurationLimit = function() {};
Y.SpApp.prototype._setBufferSize = function() {};
Y.SpApp.prototype._setUrlApi = function() {};
Y.SpApp.prototype._setUrlProxy = function() {};
customElements.define(Y.SpApp.is, Y.SpApp);
r.SpApp = {};
r.SpApp.SpApp = {};
