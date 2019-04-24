(function() {
    var e = function() {
        this.init()
    };
    e.prototype = {
        init: function() {
            var e = this || t;
            return e._counter = 1e3,
            e._codecs = {},
            e._howls = [],
            e._muted = !1,
            e._volume = 1,
            e._canPlayEvent = "canplaythrough",
            e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null,
            e.masterGain = null,
            e.noAudio = !1,
            e.usingWebAudio = !0,
            e.autoSuspend = !0,
            e.ctx = null,
            e.mobileAutoEnable = !0,
            e._setup(),
            e
        },
        volume: function(e) {
            var n = this || t;
            if (e = parseFloat(e),
            n.ctx || u(),
            void 0 !== e && e >= 0 && e <= 1) {
                if (n._volume = e,
                n._muted)
                    return n;
                n.usingWebAudio && (n.masterGain.gain.value = e);
                for (var r = 0; r < n._howls.length; r++)
                    if (!n._howls[r]._webAudio)
                        for (var i = n._howls[r]._getSoundIds(), o = 0; o < i.length; o++) {
                            var s = n._howls[r]._soundById(i[o]);
                            s && s._node && (s._node.volume = s._volume * e)
                        }
                return n
            }
            return n._volume
        },
        mute: function(e) {
            var n = this || t;
            n.ctx || u(),
            n._muted = e,
            n.usingWebAudio && (n.masterGain.gain.value = e ? 0 : n._volume);
            for (var r = 0; r < n._howls.length; r++)
                if (!n._howls[r]._webAudio)
                    for (var i = n._howls[r]._getSoundIds(), o = 0; o < i.length; o++) {
                        var s = n._howls[r]._soundById(i[o]);
                        s && s._node && (s._node.muted = !!e || s._muted)
                    }
            return n
        },
        unload: function() {
            for (var e = this || t, n = e._howls.length - 1; n >= 0; n--)
                e._howls[n].unload();
            return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(),
            e.ctx = null,
            u()),
            e
        },
        codecs: function(e) {
            return (this || t)._codecs[e.replace(/^x-/, "")]
        },
        _setup: function() {
            var e = this || t;
            if (e.state = e.ctx ? e.ctx.state || "running" : "running",
            e._autoSuspend(),
            !e.usingWebAudio)
                if ("undefined" != typeof Audio)
                    try {
                        void 0 === (new Audio).oncanplaythrough && (e._canPlayEvent = "canplay")
                    } catch (t) {
                        e.noAudio = !0
                    }
                else
                    e.noAudio = !0;
            try {
                (new Audio).muted && (e.noAudio = !0)
            } catch (e) {}
            return e.noAudio || e._setupCodecs(),
            e
        },
        _setupCodecs: function() {
            var e = this || t
              , n = null;
            try {
                n = "undefined" != typeof Audio ? new Audio : null
            } catch (t) {
                return e
            }
            if (!n || "function" != typeof n.canPlayType)
                return e;
            var r = n.canPlayType("audio/mpeg;").replace(/^no$/, "")
              , i = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g)
              , o = i && parseInt(i[0].split("/")[1], 10) < 33;
            return e._codecs = {
                mp3: !(o || !r && !n.canPlayType("audio/mp3;").replace(/^no$/, "")),
                mpeg: !!r,
                opus: !!n.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                oga: !!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!n.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                aac: !!n.canPlayType("audio/aac;").replace(/^no$/, ""),
                caf: !!n.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                m4a: !!(n.canPlayType("audio/x-m4a;") || n.canPlayType("audio/m4a;") || n.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(n.canPlayType("audio/x-mp4;") || n.canPlayType("audio/mp4;") || n.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                webm: !!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                dolby: !!n.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                flac: !!(n.canPlayType("audio/x-flac;") || n.canPlayType("audio/flac;")).replace(/^no$/, "")
            },
            e
        },
        _enableMobileAudio: function() {
            var e = this || t
              , n = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator && e._navigator.userAgent)
              , r = !!("ontouchend"in window || e._navigator && e._navigator.maxTouchPoints > 0 || e._navigator && e._navigator.msMaxTouchPoints > 0);
            if (!e._mobileEnabled && e.ctx && (n || r)) {
                e._mobileEnabled = !1,
                e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0,
                e.unload()),
                e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
                var i = function() {
                    t._autoResume();
                    var n = e.ctx.createBufferSource();
                    n.buffer = e._scratchBuffer,
                    n.connect(e.ctx.destination),
                    void 0 === n.start ? n.noteOn(0) : n.start(0),
                    "function" == typeof e.ctx.resume && e.ctx.resume(),
                    n.onended = function() {
                        n.disconnect(0),
                        e._mobileEnabled = !0,
                        e.mobileAutoEnable = !1,
                        document.removeEventListener("touchstart", i, !0),
                        document.removeEventListener("touchend", i, !0)
                    }
                };
                return document.addEventListener("touchstart", i, !0),
                document.addEventListener("touchend", i, !0),
                e
            }
        },
        _autoSuspend: function() {
            var e = this;
            if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && t.usingWebAudio) {
                for (var n = 0; n < e._howls.length; n++)
                    if (e._howls[n]._webAudio)
                        for (var r = 0; r < e._howls[n]._sounds.length; r++)
                            if (!e._howls[n]._sounds[r]._paused)
                                return e;
                return e._suspendTimer && clearTimeout(e._suspendTimer),
                e._suspendTimer = setTimeout(function() {
                    e.autoSuspend && (e._suspendTimer = null,
                    e.state = "suspending",
                    e.ctx.suspend().then(function() {
                        e.state = "suspended",
                        e._resumeAfterSuspend && (delete e._resumeAfterSuspend,
                        e._autoResume())
                    }))
                }, 3e4),
                e
            }
        },
        _autoResume: function() {
            var e = this;
            if (e.ctx && void 0 !== e.ctx.resume && t.usingWebAudio)
                return "running" === e.state && e._suspendTimer ? (clearTimeout(e._suspendTimer),
                e._suspendTimer = null) : "suspended" === e.state ? (e.ctx.resume().then(function() {
                    e.state = "running";
                    for (var t = 0; t < e._howls.length; t++)
                        e._howls[t]._emit("resume")
                }),
                e._suspendTimer && (clearTimeout(e._suspendTimer),
                e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0),
                e
        }
    };
    var t = new e
      , n = function(e) {
        e.src && 0 !== e.src.length ? this.init(e) : console.error("An array of source files must be passed with any new Howl.")
    };
    n.prototype = {
        init: function(e) {
            var n = this;
            return t.ctx || u(),
            n._autoplay = e.autoplay || !1,
            n._format = "string" != typeof e.format ? e.format : [e.format],
            n._html5 = e.html5 || !1,
            n._muted = e.mute || !1,
            n._loop = e.loop || !1,
            n._pool = e.pool || 5,
            n._preload = "boolean" != typeof e.preload || e.preload,
            n._rate = e.rate || 1,
            n._sprite = e.sprite || {},
            n._src = "string" != typeof e.src ? e.src : [e.src],
            n._volume = void 0 !== e.volume ? e.volume : 1,
            n._xhrWithCredentials = e.xhrWithCredentials || !1,
            n._duration = 0,
            n._state = "unloaded",
            n._sounds = [],
            n._endTimers = {},
            n._queue = [],
            n._onend = e.onend ? [{
                fn: e.onend
            }] : [],
            n._onfade = e.onfade ? [{
                fn: e.onfade
            }] : [],
            n._onload = e.onload ? [{
                fn: e.onload
            }] : [],
            n._onloaderror = e.onloaderror ? [{
                fn: e.onloaderror
            }] : [],
            n._onplayerror = e.onplayerror ? [{
                fn: e.onplayerror
            }] : [],
            n._onpause = e.onpause ? [{
                fn: e.onpause
            }] : [],
            n._onplay = e.onplay ? [{
                fn: e.onplay
            }] : [],
            n._onstop = e.onstop ? [{
                fn: e.onstop
            }] : [],
            n._onmute = e.onmute ? [{
                fn: e.onmute
            }] : [],
            n._onvolume = e.onvolume ? [{
                fn: e.onvolume
            }] : [],
            n._onrate = e.onrate ? [{
                fn: e.onrate
            }] : [],
            n._onseek = e.onseek ? [{
                fn: e.onseek
            }] : [],
            n._onresume = [],
            n._webAudio = t.usingWebAudio && !n._html5,
            void 0 !== t.ctx && t.ctx && t.mobileAutoEnable && t._enableMobileAudio(),
            t._howls.push(n),
            n._autoplay && n._queue.push({
                event: "play",
                action: function() {
                    n.play()
                }
            }),
            n._preload && n.load(),
            n
        },
        load: function() {
            var e = null;
            if (t.noAudio)
                this._emit("loaderror", null, "No audio support.");
            else {
                "string" == typeof this._src && (this._src = [this._src]);
                for (var n = 0; n < this._src.length; n++) {
                    var i, s;
                    if (this._format && this._format[n])
                        i = this._format[n];
                    else {
                        if ("string" != typeof (s = this._src[n])) {
                            this._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                            continue
                        }
                        (i = /^data:audio\/([^;,]+);/i.exec(s)) || (i = /\.([^.]+)$/.exec(s.split("?", 1)[0])),
                        i && (i = i[1].toLowerCase())
                    }
                    if (i || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),
                    i && t.codecs(i)) {
                        e = this._src[n];
                        break
                    }
                }
                if (e)
                    return this._src = e,
                    this._state = "loading",
                    "https:" === window.location.protocol && "http:" === e.slice(0, 5) && (this._html5 = !0,
                    this._webAudio = !1),
                    new r(this),
                    this._webAudio && o(this),
                    this;
                this._emit("loaderror", null, "No codec support for selected audio sources.")
            }
        },
        play: function(e, n) {
            var r = this
              , i = null;
            if ("number" == typeof e)
                i = e,
                e = null;
            else {
                if ("string" == typeof e && "loaded" === r._state && !r._sprite[e])
                    return null;
                if (void 0 === e) {
                    e = "__default";
                    for (var o = 0, s = 0; s < r._sounds.length; s++)
                        r._sounds[s]._paused && !r._sounds[s]._ended && (o++,
                        i = r._sounds[s]._id);
                    1 === o ? e = null : i = null
                }
            }
            var a = i ? r._soundById(i) : r._inactiveSound();
            if (!a)
                return null;
            if (i && !e && (e = a._sprite || "__default"),
            "loaded" !== r._state) {
                a._sprite = e,
                a._ended = !1;
                var l = a._id;
                return r._queue.push({
                    event: "play",
                    action: function() {
                        r.play(l)
                    }
                }),
                l
            }
            if (i && !a._paused)
                return n || setTimeout(function() {
                    r._emit("play", a._id)
                }, 0),
                a._id;
            r._webAudio && t._autoResume();
            var u = Math.max(0, a._seek > 0 ? a._seek : r._sprite[e][0] / 1e3)
              , c = Math.max(0, (r._sprite[e][0] + r._sprite[e][1]) / 1e3 - u)
              , h = 1e3 * c / Math.abs(a._rate);
            a._paused = !1,
            a._ended = !1,
            a._sprite = e,
            a._seek = u,
            a._start = r._sprite[e][0] / 1e3,
            a._stop = (r._sprite[e][0] + r._sprite[e][1]) / 1e3,
            a._loop = !(!a._loop && !r._sprite[e][2]);
            var d = a._node;
            if (r._webAudio) {
                var p = function() {
                    r._refreshBuffer(a);
                    var e = a._muted || r._muted ? 0 : a._volume;
                    d.gain.setValueAtTime(e, t.ctx.currentTime),
                    a._playStart = t.ctx.currentTime,
                    void 0 === d.bufferSource.start ? a._loop ? d.bufferSource.noteGrainOn(0, u, 86400) : d.bufferSource.noteGrainOn(0, u, c) : a._loop ? d.bufferSource.start(0, u, 86400) : d.bufferSource.start(0, u, c),
                    h !== 1 / 0 && (r._endTimers[a._id] = setTimeout(r._ended.bind(r, a), h)),
                    n || setTimeout(function() {
                        r._emit("play", a._id)
                    }, 0)
                };
                "running" === t.state ? p() : (r.once("resume", p),
                r._clearTimer(a._id))
            } else {
                var f = function() {
                    d.currentTime = u,
                    d.muted = a._muted || r._muted || t._muted || d.muted,
                    d.volume = a._volume * t.volume(),
                    d.playbackRate = a._rate;
                    try {
                        if (d.play(),
                        d.paused)
                            return void r._emit("playerror", a._id, "Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction.");
                        h !== 1 / 0 && (r._endTimers[a._id] = setTimeout(r._ended.bind(r, a), h)),
                        n || r._emit("play", a._id)
                    } catch (e) {
                        r._emit("playerror", a._id, e)
                    }
                }
                  , g = window && window.ejecta || !d.readyState && t._navigator.isCocoonJS;
                if (4 === d.readyState || g)
                    f();
                else {
                    var m = function() {
                        f(),
                        d.removeEventListener(t._canPlayEvent, m, !1)
                    };
                    d.addEventListener(t._canPlayEvent, m, !1),
                    r._clearTimer(a._id)
                }
            }
            return a._id
        },
        pause: function(e) {
            var t = this;
            if ("loaded" !== t._state)
                return t._queue.push({
                    event: "pause",
                    action: function() {
                        t.pause(e)
                    }
                }),
                t;
            for (var n = t._getSoundIds(e), r = 0; r < n.length; r++) {
                t._clearTimer(n[r]);
                var i = t._soundById(n[r]);
                if (i && !i._paused && (i._seek = t.seek(n[r]),
                i._rateSeek = 0,
                i._paused = !0,
                t._stopFade(n[r]),
                i._node))
                    if (t._webAudio) {
                        if (!i._node.bufferSource)
                            continue;
                        void 0 === i._node.bufferSource.stop ? i._node.bufferSource.noteOff(0) : i._node.bufferSource.stop(0),
                        t._cleanBuffer(i._node)
                    } else
                        isNaN(i._node.duration) && i._node.duration !== 1 / 0 || i._node.pause();
                arguments[1] || t._emit("pause", i ? i._id : null)
            }
            return t
        },
        stop: function(e, t) {
            var n = this;
            if ("loaded" !== n._state)
                return n._queue.push({
                    event: "stop",
                    action: function() {
                        n.stop(e)
                    }
                }),
                n;
            for (var r = n._getSoundIds(e), i = 0; i < r.length; i++) {
                n._clearTimer(r[i]);
                var o = n._soundById(r[i]);
                o && (o._seek = o._start || 0,
                o._rateSeek = 0,
                o._paused = !0,
                o._ended = !0,
                n._stopFade(r[i]),
                o._node && (n._webAudio ? o._node.bufferSource && (void 0 === o._node.bufferSource.stop ? o._node.bufferSource.noteOff(0) : o._node.bufferSource.stop(0),
                o._panner && (o._panner.disconnect(),
                o._panner = null),
                n._cleanBuffer(o._node)) : isNaN(o._node.duration) && o._node.duration !== 1 / 0 || (o._node.currentTime = o._start || 0,
                o._node.pause())),
                t || n._emit("stop", o._id))
            }
            return n
        },
        mute: function(e, n) {
            var r = this;
            if ("loaded" !== r._state)
                return r._queue.push({
                    event: "mute",
                    action: function() {
                        r.mute(e, n)
                    }
                }),
                r;
            if (void 0 === n) {
                if ("boolean" != typeof e)
                    return r._muted;
                r._muted = e
            }
            for (var i = r._getSoundIds(n), o = 0; o < i.length; o++) {
                var s = r._soundById(i[o]);
                s && (s._muted = e,
                r._webAudio && s._node ? s._node.gain.setValueAtTime(e ? 0 : s._volume, t.ctx.currentTime) : s._node && (s._node.muted = !!t._muted || e),
                r._emit("mute", s._id))
            }
            return r
        },
        volume: function() {
            var e, n, r = this, i = arguments;
            if (0 === i.length)
                return r._volume;
            if (1 === i.length || 2 === i.length && void 0 === i[1]) {
                r._getSoundIds().indexOf(i[0]) >= 0 ? n = parseInt(i[0], 10) : e = parseFloat(i[0])
            } else
                i.length >= 2 && (e = parseFloat(i[0]),
                n = parseInt(i[1], 10));
            var o;
            if (!(void 0 !== e && e >= 0 && e <= 1))
                return (o = n ? r._soundById(n) : r._sounds[0]) ? o._volume : 0;
            if ("loaded" !== r._state)
                return r._queue.push({
                    event: "volume",
                    action: function() {
                        r.volume.apply(r, i)
                    }
                }),
                r;
            void 0 === n && (r._volume = e),
            n = r._getSoundIds(n);
            for (var s = 0; s < n.length; s++)
                (o = r._soundById(n[s])) && (o._volume = e,
                i[2] || r._stopFade(n[s]),
                r._webAudio && o._node && !o._muted ? o._node.gain.setValueAtTime(e, t.ctx.currentTime) : o._node && !o._muted && (o._node.volume = e * t.volume()),
                r._emit("volume", o._id));
            return r
        },
        fade: function(e, n, r, i, o) {
            var s = this;
            if ("loaded" !== s._state)
                return s._queue.push({
                    event: "fade",
                    action: function() {
                        s.fade(e, n, r, i)
                    }
                }),
                s;
            null == o && s.volume(e, i);
            for (var a = s._getSoundIds(i), l = 0; l < a.length; l++) {
                var u = s._soundById(a[l]);
                if (u && (i || s._stopFade(a[l]),
                s._webAudio && !u._muted)) {
                    var c = t.ctx.currentTime
                      , h = c + r / 1e3;
                    u._volume = e,
                    null == o && u._node.gain.setValueAtTime(e, c),
                    u._node.gain.linearRampToValueAtTime(n, h)
                }
            }
            return s
        },
        _startFadeInterval: function(e, t, n, r, i) {
            var o = this
              , s = t
              , a = t > n ? "out" : "in"
              , l = Math.abs(t - n) / .01
              , u = l > 0 ? r / l : r;
            u < 4 && (l = Math.ceil(l / (4 / u)),
            u = 4),
            e._interval = setInterval(function() {
                l > 0 && (s += "in" === a ? .01 : -.01),
                s = Math.max(0, s),
                s = Math.min(1, s),
                s = Math.round(100 * s) / 100,
                o._webAudio ? (void 0 === i && (o._volume = s),
                e._volume = s) : o.volume(s, e._id, !0),
                (n < t && s <= n || n > t && s >= n) && (clearInterval(e._interval),
                e._interval = null,
                o.volume(n, e._id),
                o._emit("fade", e._id))
            }, u)
        },
        _stopFade: function(e) {
            var n = this._soundById(e);
            return n && n._interval && (this._webAudio && n._node.gain.cancelScheduledValues(t.ctx.currentTime),
            clearInterval(n._interval),
            n._interval = null,
            this._emit("fade", e)),
            this
        },
        loop: function() {
            var e, t, n, r = arguments;
            if (0 === r.length)
                return this._loop;
            if (1 === r.length) {
                if ("boolean" != typeof r[0])
                    return !!(n = this._soundById(parseInt(r[0], 10))) && n._loop;
                e = r[0],
                this._loop = e
            } else
                2 === r.length && (e = r[0],
                t = parseInt(r[1], 10));
            for (var i = this._getSoundIds(t), o = 0; o < i.length; o++)
                (n = this._soundById(i[o])) && (n._loop = e,
                this._webAudio && n._node && n._node.bufferSource && (n._node.bufferSource.loop = e,
                e && (n._node.bufferSource.loopStart = n._start || 0,
                n._node.bufferSource.loopEnd = n._stop)));
            return this
        },
        rate: function() {
            var e, n, r = this, i = arguments;
            if (0 === i.length)
                n = r._sounds[0]._id;
            else if (1 === i.length) {
                r._getSoundIds().indexOf(i[0]) >= 0 ? n = parseInt(i[0], 10) : e = parseFloat(i[0])
            } else
                2 === i.length && (e = parseFloat(i[0]),
                n = parseInt(i[1], 10));
            var o;
            if ("number" != typeof e)
                return (o = r._soundById(n)) ? o._rate : r._rate;
            if ("loaded" !== r._state)
                return r._queue.push({
                    event: "rate",
                    action: function() {
                        r.rate.apply(r, i)
                    }
                }),
                r;
            void 0 === n && (r._rate = e),
            n = r._getSoundIds(n);
            for (var s = 0; s < n.length; s++)
                if (o = r._soundById(n[s])) {
                    o._rateSeek = r.seek(n[s]),
                    o._playStart = r._webAudio ? t.ctx.currentTime : o._playStart,
                    o._rate = e,
                    r._webAudio && o._node && o._node.bufferSource ? o._node.bufferSource.playbackRate.value = e : o._node && (o._node.playbackRate = e);
                    var a = r.seek(n[s])
                      , l = 1e3 * ((r._sprite[o._sprite][0] + r._sprite[o._sprite][1]) / 1e3 - a) / Math.abs(o._rate);
                    !r._endTimers[n[s]] && o._paused || (r._clearTimer(n[s]),
                    r._endTimers[n[s]] = setTimeout(r._ended.bind(r, o), l)),
                    r._emit("rate", o._id)
                }
            return r
        },
        seek: function() {
            var e, n, r = this, i = arguments;
            if (0 === i.length)
                n = r._sounds[0]._id;
            else if (1 === i.length) {
                r._getSoundIds().indexOf(i[0]) >= 0 ? n = parseInt(i[0], 10) : r._sounds.length && (n = r._sounds[0]._id,
                e = parseFloat(i[0]))
            } else
                2 === i.length && (e = parseFloat(i[0]),
                n = parseInt(i[1], 10));
            if (void 0 === n)
                return r;
            if ("loaded" !== r._state)
                return r._queue.push({
                    event: "seek",
                    action: function() {
                        r.seek.apply(r, i)
                    }
                }),
                r;
            var o = r._soundById(n);
            if (o) {
                if (!("number" == typeof e && e >= 0)) {
                    if (r._webAudio) {
                        var s = r.playing(n) ? t.ctx.currentTime - o._playStart : 0
                          , a = o._rateSeek ? o._rateSeek - o._seek : 0;
                        return o._seek + (a + s * Math.abs(o._rate))
                    }
                    return o._node.currentTime
                }
                var l = r.playing(n);
                l && r.pause(n, !0),
                o._seek = e,
                o._ended = !1,
                r._clearTimer(n),
                l && r.play(n, !0),
                !r._webAudio && o._node && (o._node.currentTime = e),
                r._emit("seek", n)
            }
            return r
        },
        playing: function(e) {
            if ("number" == typeof e) {
                var t = this._soundById(e);
                return !!t && !t._paused
            }
            for (var n = 0; n < this._sounds.length; n++)
                if (!this._sounds[n]._paused)
                    return !0;
            return !1
        },
        duration: function(e) {
            var t = this._duration
              , n = this._soundById(e);
            return n && (t = this._sprite[n._sprite][1] / 1e3),
            t
        },
        state: function() {
            return this._state
        },
        unload: function() {
            for (var e = this, n = e._sounds, r = 0; r < n.length; r++) {
                if (n[r]._paused || e.stop(n[r]._id),
                !e._webAudio) {
                    /MSIE |Trident\//.test(t._navigator && t._navigator.userAgent) || (n[r]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"),
                    n[r]._node.removeEventListener("error", n[r]._errorFn, !1),
                    n[r]._node.removeEventListener(t._canPlayEvent, n[r]._loadFn, !1)
                }
                delete n[r]._node,
                e._clearTimer(n[r]._id);
                var o = t._howls.indexOf(e);
                o >= 0 && t._howls.splice(o, 1)
            }
            var s = !0;
            for (r = 0; r < t._howls.length; r++)
                if (t._howls[r]._src === e._src) {
                    s = !1;
                    break
                }
            return i && s && delete i[e._src],
            t.noAudio = !1,
            e._state = "unloaded",
            e._sounds = [],
            e = null,
            null
        },
        on: function(e, t, n, r) {
            var i = this["_on" + e];
            return "function" == typeof t && i.push(r ? {
                id: n,
                fn: t,
                once: r
            } : {
                id: n,
                fn: t
            }),
            this
        },
        off: function(e, t, n) {
            var r = this["_on" + e]
              , i = 0;
            if ("number" == typeof t && (n = t,
            t = null),
            t || n)
                for (i = 0; i < r.length; i++) {
                    var o = n === r[i].id;
                    if (t === r[i].fn && o || !t && o) {
                        r.splice(i, 1);
                        break
                    }
                }
            else if (e)
                this["_on" + e] = [];
            else {
                var s = Object.keys(this);
                for (i = 0; i < s.length; i++)
                    0 === s[i].indexOf("_on") && Array.isArray(this[s[i]]) && (this[s[i]] = [])
            }
            return this
        },
        once: function(e, t, n) {
            return this.on(e, t, n, 1),
            this
        },
        _emit: function(e, t, n) {
            for (var r = this["_on" + e], i = r.length - 1; i >= 0; i--)
                r[i].id && r[i].id !== t && "load" !== e || (setTimeout(function(e) {
                    e.call(this, t, n)
                }
                .bind(this, r[i].fn), 0),
                r[i].once && this.off(e, r[i].fn, r[i].id));
            return this
        },
        _loadQueue: function() {
            var e = this;
            if (e._queue.length > 0) {
                var t = e._queue[0];
                e.once(t.event, function() {
                    e._queue.shift(),
                    e._loadQueue()
                }),
                t.action()
            }
            return e
        },
        _ended: function(e) {
            var n = e._sprite;
            if (!this._webAudio && e._node && !e._node.paused)
                return setTimeout(this._ended.bind(this, e), 100),
                this;
            var r = !(!e._loop && !this._sprite[n][2]);
            if (this._emit("end", e._id),
            !this._webAudio && r && this.stop(e._id, !0).play(e._id),
            this._webAudio && r) {
                this._emit("play", e._id),
                e._seek = e._start || 0,
                e._rateSeek = 0,
                e._playStart = t.ctx.currentTime;
                var i = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                this._endTimers[e._id] = setTimeout(this._ended.bind(this, e), i)
            }
            return this._webAudio && !r && (e._paused = !0,
            e._ended = !0,
            e._seek = e._start || 0,
            e._rateSeek = 0,
            this._clearTimer(e._id),
            this._cleanBuffer(e._node),
            t._autoSuspend()),
            this._webAudio || r || this.stop(e._id),
            this
        },
        _clearTimer: function(e) {
            return this._endTimers[e] && (clearTimeout(this._endTimers[e]),
            delete this._endTimers[e]),
            this
        },
        _soundById: function(e) {
            for (var t = 0; t < this._sounds.length; t++)
                if (e === this._sounds[t]._id)
                    return this._sounds[t];
            return null
        },
        _inactiveSound: function() {
            this._drain();
            for (var e = 0; e < this._sounds.length; e++)
                if (this._sounds[e]._ended)
                    return this._sounds[e].reset();
            return new r(this)
        },
        _drain: function() {
            var e = this._pool
              , t = 0
              , n = 0;
            if (!(this._sounds.length < e)) {
                for (n = 0; n < this._sounds.length; n++)
                    this._sounds[n]._ended && t++;
                for (n = this._sounds.length - 1; n >= 0; n--) {
                    if (t <= e)
                        return;
                    this._sounds[n]._ended && (this._webAudio && this._sounds[n]._node && this._sounds[n]._node.disconnect(0),
                    this._sounds.splice(n, 1),
                    t--)
                }
            }
        },
        _getSoundIds: function(e) {
            if (void 0 === e) {
                for (var t = [], n = 0; n < this._sounds.length; n++)
                    t.push(this._sounds[n]._id);
                return t
            }
            return [e]
        },
        _refreshBuffer: function(e) {
            return e._node.bufferSource = t.ctx.createBufferSource(),
            e._node.bufferSource.buffer = i[this._src],
            e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node),
            e._node.bufferSource.loop = e._loop,
            e._loop && (e._node.bufferSource.loopStart = e._start || 0,
            e._node.bufferSource.loopEnd = e._stop),
            e._node.bufferSource.playbackRate.value = e._rate,
            this
        },
        _cleanBuffer: function(e) {
            if (this._scratchBuffer) {
                e.bufferSource.onended = null,
                e.bufferSource.disconnect(0);
                try {
                    e.bufferSource.buffer = this._scratchBuffer
                } catch (e) {}
            }
            return e.bufferSource = null,
            this
        }
    };
    var r = function(e) {
        this._parent = e,
        this.init()
    };
    r.prototype = {
        init: function() {
            var e = this._parent;
            return this._muted = e._muted,
            this._loop = e._loop,
            this._volume = e._volume,
            this._rate = e._rate,
            this._seek = 0,
            this._paused = !0,
            this._ended = !0,
            this._sprite = "__default",
            this._id = ++t._counter,
            e._sounds.push(this),
            this.create(),
            this
        },
        create: function() {
            var e = this._parent
              , n = t._muted || this._muted || this._parent._muted ? 0 : this._volume;
            return e._webAudio ? (this._node = void 0 === t.ctx.createGain ? t.ctx.createGainNode() : t.ctx.createGain(),
            this._node.gain.setValueAtTime(n, t.ctx.currentTime),
            this._node.paused = !0,
            this._node.connect(t.masterGain)) : (this._node = new Audio,
            this._errorFn = this._errorListener.bind(this),
            this._node.addEventListener("error", this._errorFn, !1),
            this._loadFn = this._loadListener.bind(this),
            this._node.addEventListener(t._canPlayEvent, this._loadFn, !1),
            this._node.src = e._src,
            this._node.preload = "auto",
            this._node.volume = n * t.volume(),
            this._node.load()),
            this
        },
        reset: function() {
            var e = this._parent;
            return this._muted = e._muted,
            this._loop = e._loop,
            this._volume = e._volume,
            this._rate = e._rate,
            this._seek = 0,
            this._rateSeek = 0,
            this._paused = !0,
            this._ended = !0,
            this._sprite = "__default",
            this._id = ++t._counter,
            this
        },
        _errorListener: function() {
            this._parent._emit("loaderror", this._id, this._node.error ? this._node.error.code : 0),
            this._node.removeEventListener("error", this._errorFn, !1)
        },
        _loadListener: function() {
            var e = this._parent;
            e._duration = Math.ceil(10 * this._node.duration) / 10,
            0 === Object.keys(e._sprite).length && (e._sprite = {
                __default: [0, 1e3 * e._duration]
            }),
            "loaded" !== e._state && (e._state = "loaded",
            e._emit("load"),
            e._loadQueue()),
            this._node.removeEventListener(t._canPlayEvent, this._loadFn, !1)
        }
    };
    var i = {}
      , o = function(e) {
        var t = e._src;
        if (i[t])
            return e._duration = i[t].duration,
            void l(e);
        if (/^data:[^;]+;base64,/.test(t)) {
            for (var n = atob(t.split(",")[1]), r = new Uint8Array(n.length), o = 0; o < n.length; ++o)
                r[o] = n.charCodeAt(o);
            a(r.buffer, e)
        } else {
            var u = new XMLHttpRequest;
            u.open("GET", t, !0),
            u.withCredentials = e._xhrWithCredentials,
            u.responseType = "arraybuffer",
            u.onload = function() {
                var t = (u.status + "")[0];
                "0" === t || "2" === t || "3" === t ? a(u.response, e) : e._emit("loaderror", null, "Failed loading audio file with status: " + u.status + ".")
            }
            ,
            u.onerror = function() {
                e._webAudio && (e._html5 = !0,
                e._webAudio = !1,
                e._sounds = [],
                delete i[t],
                e.load())
            }
            ,
            s(u)
        }
    }
      , s = function(e) {
        try {
            e.send()
        } catch (t) {
            e.onerror()
        }
    }
      , a = function(e, n) {
        t.ctx.decodeAudioData(e, function(e) {
            e && n._sounds.length > 0 && (i[n._src] = e,
            l(n, e))
        }, function() {
            n._emit("loaderror", null, "Decoding audio data failed.")
        })
    }
      , l = function(e, t) {
        t && !e._duration && (e._duration = t.duration),
        0 === Object.keys(e._sprite).length && (e._sprite = {
            __default: [0, 1e3 * e._duration]
        }),
        "loaded" !== e._state && (e._state = "loaded",
        e._emit("load"),
        e._loadQueue())
    }
      , u = function() {
        try {
            "undefined" != typeof AudioContext ? t.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? t.ctx = new webkitAudioContext : t.usingWebAudio = !1
        } catch (e) {
            t.usingWebAudio = !1
        }
        var e = /iP(hone|od|ad)/.test(t._navigator && t._navigator.platform)
          , n = t._navigator && t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
          , r = n ? parseInt(n[1], 10) : null;
        if (e && r && r < 9) {
            var i = /safari/.test(t._navigator && t._navigator.userAgent.toLowerCase());
            (t._navigator && t._navigator.standalone && !i || t._navigator && !t._navigator.standalone && !i) && (t.usingWebAudio = !1)
        }
        t.usingWebAudio && (t.masterGain = void 0 === t.ctx.createGain ? t.ctx.createGainNode() : t.ctx.createGain(),
        t.masterGain.gain.value = t._muted ? 0 : 1,
        t.masterGain.connect(t.ctx.destination)),
        t._setup()
    };
    "function" == typeof define && define.amd && define([], function() {
        return {
            Howler: t,
            Howl: n
        }
    }),
    "undefined" != typeof exports && (exports.Howler = t,
    exports.Howl = n),
    "undefined" != typeof window ? (window.HowlerGlobal = e,
    window.Howler = t,
    window.Howl = n,
    window.Sound = r) : "undefined" != typeof global && (global.HowlerGlobal = e,
    global.Howler = t,
    global.Howl = n,
    global.Sound = r)
})();
