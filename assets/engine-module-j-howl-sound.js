(function() {
    HowlerGlobal.prototype._pos = [0, 0, 0],
    HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0],
    HowlerGlobal.prototype.stereo = function(e) {
        if (!this.ctx || !this.ctx.listener)
            return this;
        for (var t = this._howls.length - 1; t >= 0; t--)
            this._howls[t].stereo(e);
        return this
    }
    ,
    HowlerGlobal.prototype.pos = function(e, t, n) {
        return this.ctx && this.ctx.listener ? (t = "number" != typeof t ? this._pos[1] : t,
        n = "number" != typeof n ? this._pos[2] : n,
        "number" != typeof e ? this._pos : (this._pos = [e, t, n],
        this.ctx.listener.setPosition(this._pos[0], this._pos[1], this._pos[2]),
        this)) : this
    }
    ,
    HowlerGlobal.prototype.orientation = function(e, t, n, r, i, o) {
        if (!this.ctx || !this.ctx.listener)
            return this;
        var s = this._orientation;
        return t = "number" != typeof t ? s[1] : t,
        n = "number" != typeof n ? s[2] : n,
        r = "number" != typeof r ? s[3] : r,
        i = "number" != typeof i ? s[4] : i,
        o = "number" != typeof o ? s[5] : o,
        "number" != typeof e ? s : (this._orientation = [e, t, n, r, i, o],
        this.ctx.listener.setOrientation(e, t, n, r, i, o),
        this)
    }
    ,
    Howl.prototype.init = function(e) {
        return function(t) {
            return this._orientation = t.orientation || [1, 0, 0],
            this._stereo = t.stereo || null,
            this._pos = t.pos || null,
            this._pannerAttr = {
                coneInnerAngle: void 0 !== t.coneInnerAngle ? t.coneInnerAngle : 360,
                coneOuterAngle: void 0 !== t.coneOuterAngle ? t.coneOuterAngle : 360,
                coneOuterGain: void 0 !== t.coneOuterGain ? t.coneOuterGain : 0,
                distanceModel: void 0 !== t.distanceModel ? t.distanceModel : "inverse",
                maxDistance: void 0 !== t.maxDistance ? t.maxDistance : 1e4,
                panningModel: void 0 !== t.panningModel ? t.panningModel : "HRTF",
                refDistance: void 0 !== t.refDistance ? t.refDistance : 1,
                rolloffFactor: void 0 !== t.rolloffFactor ? t.rolloffFactor : 1
            },
            this._onstereo = t.onstereo ? [{
                fn: t.onstereo
            }] : [],
            this._onpos = t.onpos ? [{
                fn: t.onpos
            }] : [],
            this._onorientation = t.onorientation ? [{
                fn: t.onorientation
            }] : [],
            e.call(this, t)
        }
    }(Howl.prototype.init),
    Howl.prototype.stereo = function(t, n) {
        var r = this;
        if (!r._webAudio)
            return r;
        if ("loaded" !== r._state)
            return r._queue.push({
                event: "stereo",
                action: function() {
                    r.stereo(t, n)
                }
            }),
            r;
        var i = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";
        if (void 0 === n) {
            if ("number" != typeof t)
                return r._stereo;
            r._stereo = t,
            r._pos = [t, 0, 0]
        }
        for (var o = r._getSoundIds(n), s = 0; s < o.length; s++) {
            var a = r._soundById(o[s]);
            if (a) {
                if ("number" != typeof t)
                    return a._stereo;
                a._stereo = t,
                a._pos = [t, 0, 0],
                a._node && (a._pannerAttr.panningModel = "equalpower",
                a._panner && a._panner.pan || e(a, i),
                "spatial" === i ? a._panner.setPosition(t, 0, Math.abs(1 - t)) : a._panner.pan.value = t),
                r._emit("stereo", a._id)
            }
        }
        return r
    }
    ,
    Howl.prototype.pos = function(t, n, r, i) {
        var o = this;
        if (!o._webAudio)
            return o;
        if ("loaded" !== o._state)
            return o._queue.push({
                event: "pos",
                action: function() {
                    o.pos(t, n, r, i)
                }
            }),
            o;
        if (n = "number" != typeof n ? 0 : n,
        r = "number" != typeof r ? -.5 : r,
        void 0 === i) {
            if ("number" != typeof t)
                return o._pos;
            o._pos = [t, n, r]
        }
        for (var s = o._getSoundIds(i), a = 0; a < s.length; a++) {
            var l = o._soundById(s[a]);
            if (l) {
                if ("number" != typeof t)
                    return l._pos;
                l._pos = [t, n, r],
                l._node && (l._panner && !l._panner.pan || e(l, "spatial"),
                l._panner.setPosition(t, n, r)),
                o._emit("pos", l._id)
            }
        }
        return o
    }
    ,
    Howl.prototype.orientation = function(t, n, r, i) {
        var o = this;
        if (!o._webAudio)
            return o;
        if ("loaded" !== o._state)
            return o._queue.push({
                event: "orientation",
                action: function() {
                    o.orientation(t, n, r, i)
                }
            }),
            o;
        if (n = "number" != typeof n ? o._orientation[1] : n,
        r = "number" != typeof r ? o._orientation[2] : r,
        void 0 === i) {
            if ("number" != typeof t)
                return o._orientation;
            o._orientation = [t, n, r]
        }
        for (var s = o._getSoundIds(i), a = 0; a < s.length; a++) {
            var l = o._soundById(s[a]);
            if (l) {
                if ("number" != typeof t)
                    return l._orientation;
                l._orientation = [t, n, r],
                l._node && (l._panner || (l._pos || (l._pos = o._pos || [0, 0, -.5]),
                e(l, "spatial")),
                l._panner.setOrientation(t, n, r)),
                o._emit("orientation", l._id)
            }
        }
        return o
    }
    ,
    Howl.prototype.pannerAttr = function() {
        var t, n, r, i = arguments;
        if (!this._webAudio)
            return this;
        if (0 === i.length)
            return this._pannerAttr;
        if (1 === i.length) {
            if ("object" != typeof i[0])
                return (r = this._soundById(parseInt(i[0], 10))) ? r._pannerAttr : this._pannerAttr;
            t = i[0],
            void 0 === n && (t.pannerAttr || (t.pannerAttr = {
                coneInnerAngle: t.coneInnerAngle,
                coneOuterAngle: t.coneOuterAngle,
                coneOuterGain: t.coneOuterGain,
                distanceModel: t.distanceModel,
                maxDistance: t.maxDistance,
                refDistance: t.refDistance,
                rolloffFactor: t.rolloffFactor,
                panningModel: t.panningModel
            }),
            this._pannerAttr = {
                coneInnerAngle: void 0 !== t.pannerAttr.coneInnerAngle ? t.pannerAttr.coneInnerAngle : this._coneInnerAngle,
                coneOuterAngle: void 0 !== t.pannerAttr.coneOuterAngle ? t.pannerAttr.coneOuterAngle : this._coneOuterAngle,
                coneOuterGain: void 0 !== t.pannerAttr.coneOuterGain ? t.pannerAttr.coneOuterGain : this._coneOuterGain,
                distanceModel: void 0 !== t.pannerAttr.distanceModel ? t.pannerAttr.distanceModel : this._distanceModel,
                maxDistance: void 0 !== t.pannerAttr.maxDistance ? t.pannerAttr.maxDistance : this._maxDistance,
                refDistance: void 0 !== t.pannerAttr.refDistance ? t.pannerAttr.refDistance : this._refDistance,
                rolloffFactor: void 0 !== t.pannerAttr.rolloffFactor ? t.pannerAttr.rolloffFactor : this._rolloffFactor,
                panningModel: void 0 !== t.pannerAttr.panningModel ? t.pannerAttr.panningModel : this._panningModel
            })
        } else
            2 === i.length && (t = i[0],
            n = parseInt(i[1], 10));
        for (var o = this._getSoundIds(n), s = 0; s < o.length; s++)
            if (r = this._soundById(o[s])) {
                var a = r._pannerAttr;
                a = {
                    coneInnerAngle: void 0 !== t.coneInnerAngle ? t.coneInnerAngle : a.coneInnerAngle,
                    coneOuterAngle: void 0 !== t.coneOuterAngle ? t.coneOuterAngle : a.coneOuterAngle,
                    coneOuterGain: void 0 !== t.coneOuterGain ? t.coneOuterGain : a.coneOuterGain,
                    distanceModel: void 0 !== t.distanceModel ? t.distanceModel : a.distanceModel,
                    maxDistance: void 0 !== t.maxDistance ? t.maxDistance : a.maxDistance,
                    refDistance: void 0 !== t.refDistance ? t.refDistance : a.refDistance,
                    rolloffFactor: void 0 !== t.rolloffFactor ? t.rolloffFactor : a.rolloffFactor,
                    panningModel: void 0 !== t.panningModel ? t.panningModel : a.panningModel
                };
                var l = r._panner;
                l ? (l.coneInnerAngle = a.coneInnerAngle,
                l.coneOuterAngle = a.coneOuterAngle,
                l.coneOuterGain = a.coneOuterGain,
                l.distanceModel = a.distanceModel,
                l.maxDistance = a.maxDistance,
                l.refDistance = a.refDistance,
                l.rolloffFactor = a.rolloffFactor,
                l.panningModel = a.panningModel) : (r._pos || (r._pos = this._pos || [0, 0, -.5]),
                e(r, "spatial"))
            }
        return this
    }
    ,
    Sound.prototype.init = function(e) {
        return function() {
            var t = this._parent;
            this._orientation = t._orientation,
            this._stereo = t._stereo,
            this._pos = t._pos,
            this._pannerAttr = t._pannerAttr,
            e.call(this),
            this._stereo ? t.stereo(this._stereo) : this._pos && t.pos(this._pos[0], this._pos[1], this._pos[2], this._id)
        }
    }(Sound.prototype.init),
    Sound.prototype.reset = function(e) {
        return function() {
            var t = this._parent;
            return this._orientation = t._orientation,
            this._pos = t._pos,
            this._pannerAttr = t._pannerAttr,
            e.call(this)
        }
    }(Sound.prototype.reset);
    var e = function(e, t) {
        "spatial" === (t = t || "spatial") ? (e._panner = Howler.ctx.createPanner(),
        e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle,
        e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle,
        e._panner.coneOuterGain = e._pannerAttr.coneOuterGain,
        e._panner.distanceModel = e._pannerAttr.distanceModel,
        e._panner.maxDistance = e._pannerAttr.maxDistance,
        e._panner.refDistance = e._pannerAttr.refDistance,
        e._panner.rolloffFactor = e._pannerAttr.rolloffFactor,
        e._panner.panningModel = e._pannerAttr.panningModel,
        e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2])) : (e._panner = Howler.ctx.createStereoPanner(),
        e._panner.pan.value = e._stereo),
        e._panner.connect(e._node),
        e._paused || e._parent.pause(e._id, !0).play(e._id)
    }
})();
