(function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).nipplejs = e()
    }
})(function() {
    function e() {}
    function t(e, n) {
        return this.identifier = n.identifier,
        this.position = n.position,
        this.frontPosition = n.frontPosition,
        this.collection = e,
        this.defaults = {
            size: 100,
            threshold: .1,
            color: "white",
            fadeTime: 250,
            dataOnly: !1,
            restOpacity: .5,
            mode: "dynamic",
            zone: document.body
        },
        this.config(n),
        "dynamic" === this.options.mode && (this.options.restOpacity = 0),
        this.id = t.id,
        t.id += 1,
        this.buildEl().stylize(),
        this.instance = {
            el: this.ui.el,
            on: this.on.bind(this),
            off: this.off.bind(this),
            show: this.show.bind(this),
            hide: this.hide.bind(this),
            add: this.addToDom.bind(this),
            remove: this.removeFromDom.bind(this),
            destroy: this.destroy.bind(this),
            resetDirection: this.resetDirection.bind(this),
            computeDirection: this.computeDirection.bind(this),
            trigger: this.trigger.bind(this),
            position: this.position,
            frontPosition: this.frontPosition,
            ui: this.ui,
            identifier: this.identifier,
            id: this.id,
            options: this.options
        },
        this.instance
    }
    function n(e, t) {
        return this.nipples = [],
        this.idles = [],
        this.actives = [],
        this.ids = [],
        this.pressureIntervals = {},
        this.manager = e,
        this.id = n.id,
        n.id += 1,
        this.defaults = {
            zone: document.body,
            multitouch: !1,
            maxNumberOfNipples: 10,
            mode: "dynamic",
            position: {
                top: 0,
                left: 0
            },
            catchDistance: 200,
            size: 100,
            threshold: .1,
            color: "white",
            fadeTime: 250,
            dataOnly: !1,
            restOpacity: .5
        },
        this.config(t),
        "static" !== this.options.mode && "semi" !== this.options.mode || (this.options.multitouch = !1),
        this.options.multitouch || (this.options.maxNumberOfNipples = 1),
        this.updateBox(),
        this.prepareNipples(),
        this.bindings(),
        this.begin(),
        this.nipples
    }
    function r(e) {
        var t = this;
        t.ids = {},
        t.index = 0,
        t.collections = [],
        t.config(e),
        t.prepareCollections();
        var n;
        return c.bindEvt(window, "resize", function(e) {
            clearTimeout(n),
            n = setTimeout(function() {
                var e, n = c.getScroll();
                t.collections.forEach(function(t) {
                    t.forEach(function(t) {
                        e = t.el.getBoundingClientRect(),
                        t.position = {
                            x: n.x + e.left,
                            y: n.y + e.top
                        }
                    })
                })
            }, 100)
        }),
        t.collections
    }
    var i, o = !!("ontouchstart"in window), s = !!window.PointerEvent, a = !!window.MSPointerEvent, l = {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup"
    }, u = {};
    s ? i = {
        start: "pointerdown",
        move: "pointermove",
        end: "pointerup"
    } : a ? i = {
        start: "MSPointerDown",
        move: "MSPointerMove",
        end: "MSPointerUp"
    } : o ? (i = {
        start: "touchstart",
        move: "touchmove",
        end: "touchend"
    },
    u = l) : i = l;
    var c = {};
    c.distance = function(e, t) {
        var n = t.x - e.x
          , r = t.y - e.y;
        return Math.sqrt(n * n + r * r)
    }
    ,
    c.angle = function(e, t) {
        var n = t.x - e.x
          , r = t.y - e.y;
        return c.degrees(Math.atan2(r, n))
    }
    ,
    c.findCoord = function(e, t, n) {
        var r = {
            x: 0,
            y: 0
        };
        return n = c.radians(n),
        r.x = e.x - t * Math.cos(n),
        r.y = e.y - t * Math.sin(n),
        r
    }
    ,
    c.radians = function(e) {
        return e * (Math.PI / 180)
    }
    ,
    c.degrees = function(e) {
        return e * (180 / Math.PI)
    }
    ,
    c.bindEvt = function(e, t, n) {
        e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent(t, n)
    }
    ,
    c.unbindEvt = function(e, t, n) {
        e.removeEventListener ? e.removeEventListener(t, n) : e.detachEvent && e.detachEvent(t, n)
    }
    ,
    c.trigger = function(e, t, n) {
        var r = new CustomEvent(t,n);
        e.dispatchEvent(r)
    }
    ,
    c.prepareEvent = function(e) {
        return "front" != e.target.className && "back" != e.target.className || e.preventDefault(),
        e.type.match(/^touch/) ? e.changedTouches : e
    }
    ,
    c.getScroll = function() {
        return {
            x: void 0 !== window.pageXOffset ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
            y: void 0 !== window.pageYOffset ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
        }
    }
    ,
    c.applyPosition = function(e, t) {
        t.x && t.y ? (e.style.left = t.x + "px",
        e.style.top = t.y + "px") : (t.top || t.right || t.bottom || t.left) && (e.style.top = t.top,
        e.style.right = t.right,
        e.style.bottom = t.bottom,
        e.style.left = t.left)
    }
    ,
    c.getTransitionStyle = function(e, t, n) {
        var r = c.configStylePropertyObject(e);
        for (var i in r)
            if (r.hasOwnProperty(i))
                if ("string" == typeof t)
                    r[i] = t + " " + n;
                else {
                    for (var o = "", s = 0, a = t.length; s < a; s += 1)
                        o += t[s] + " " + n + ", ";
                    r[i] = o.slice(0, -2)
                }
        return r
    }
    ,
    c.getVendorStyle = function(e, t) {
        var n = c.configStylePropertyObject(e);
        for (var r in n)
            n.hasOwnProperty(r) && (n[r] = t);
        return n
    }
    ,
    c.configStylePropertyObject = function(e) {
        var t = {};
        t[e] = "";
        return ["webkit", "Moz", "o"].forEach(function(n) {
            t[n + e.charAt(0).toUpperCase() + e.slice(1)] = ""
        }),
        t
    }
    ,
    c.extend = function(e, t) {
        for (var n in t)
            t.hasOwnProperty(n) && (e[n] = t[n]);
        return e
    }
    ,
    c.safeExtend = function(e, t) {
        var n = {};
        for (var r in e)
            e.hasOwnProperty(r) && t.hasOwnProperty(r) ? n[r] = t[r] : e.hasOwnProperty(r) && (n[r] = e[r]);
        return n
    }
    ,
    c.map = function(e, t) {
        if (e.length)
            for (var n = 0, r = e.length; n < r; n += 1)
                t(e[n]);
        else
            t(e)
    }
    ,
    e.prototype.on = function(e, t) {
        var n, r = e.split(/[ ,]+/g);
        this._handlers_ = this._handlers_ || {};
        for (var i = 0; i < r.length; i += 1)
            n = r[i],
            this._handlers_[n] = this._handlers_[n] || [],
            this._handlers_[n].push(t);
        return this
    }
    ,
    e.prototype.off = function(e, t) {
        return this._handlers_ = this._handlers_ || {},
        void 0 === e ? this._handlers_ = {} : void 0 === t ? this._handlers_[e] = null : this._handlers_[e] && this._handlers_[e].indexOf(t) >= 0 && this._handlers_[e].splice(this._handlers_[e].indexOf(t), 1),
        this
    }
    ,
    e.prototype.trigger = function(e, t) {
        var n, r = this, i = e.split(/[ ,]+/g);
        r._handlers_ = r._handlers_ || {};
        for (var o = 0; o < i.length; o += 1)
            n = i[o],
            r._handlers_[n] && r._handlers_[n].length && r._handlers_[n].forEach(function(e) {
                e.call(r, {
                    type: n,
                    target: r
                }, t)
            })
    }
    ,
    e.prototype.config = function(e) {
        this.options = this.defaults || {},
        e && (this.options = c.safeExtend(this.options, e))
    }
    ,
    e.prototype.bindEvt = function(e, t) {
        var n = this;
        return n._domHandlers_ = n._domHandlers_ || {},
        n._domHandlers_[t] = function() {
            "function" == typeof n["on" + t] ? n["on" + t].apply(n, arguments) : console.warn('[WARNING] : Missing "on' + t + '" handler.')
        }
        ,
        c.bindEvt(e, i[t], n._domHandlers_[t]),
        u[t] && c.bindEvt(e, u[t], n._domHandlers_[t]),
        n
    }
    ,
    e.prototype.unbindEvt = function(e, t) {
        return this._domHandlers_ = this._domHandlers_ || {},
        c.unbindEvt(e, i[t], this._domHandlers_[t]),
        u[t] && c.unbindEvt(e, u[t], this._domHandlers_[t]),
        delete this._domHandlers_[t],
        this
    }
    ,
    t.prototype = new e,
    t.constructor = t,
    t.id = 0,
    t.prototype.buildEl = function(e) {
        return this.ui = {},
        this.options.dataOnly ? this : (this.ui.el = document.createElement("div"),
        this.ui.back = document.createElement("div"),
        this.ui.front = document.createElement("div"),
        this.ui.el.className = "nipple collection_" + this.collection.id,
        this.ui.back.className = "back",
        this.ui.front.className = "front",
        this.ui.el.setAttribute("id", "nipple_" + this.collection.id + "_" + this.id),
        this.ui.el.appendChild(this.ui.back),
        this.ui.el.appendChild(this.ui.front),
        this)
    }
    ,
    t.prototype.stylize = function() {
        if (this.options.dataOnly)
            return this;
        var e = this.options.fadeTime + "ms"
          , t = c.getVendorStyle("borderRadius", "50%")
          , n = c.getTransitionStyle("transition", "opacity", e)
          , r = {};
        return r.el = {
            position: "absolute",
            opacity: this.options.restOpacity,
            display: "block",
            zIndex: 999
        },
        r.back = {
            position: "absolute",
            display: "block",
            width: this.options.size + "px",
            height: this.options.size + "px",
            marginLeft: -this.options.size / 2 + "px",
            marginTop: -this.options.size / 2 + "px",
            background: this.options.color,
            opacity: ".5"
        },
        r.front = {
            width: this.options.size / 2 + "px",
            height: this.options.size / 2 + "px",
            position: "absolute",
            display: "block",
            marginLeft: -this.options.size / 4 + "px",
            marginTop: -this.options.size / 4 + "px",
            background: this.options.color,
            opacity: ".5"
        },
        c.extend(r.el, n),
        c.extend(r.back, t),
        c.extend(r.front, t),
        this.applyStyles(r),
        this
    }
    ,
    t.prototype.applyStyles = function(e) {
        for (var t in this.ui)
            if (this.ui.hasOwnProperty(t))
                for (var n in e[t])
                    this.ui[t].style[n] = e[t][n];
        return this
    }
    ,
    t.prototype.addToDom = function() {
        return this.options.dataOnly || document.body.contains(this.ui.el) ? this : (this.options.zone.appendChild(this.ui.el),
        this)
    }
    ,
    t.prototype.removeFromDom = function() {
        return this.options.dataOnly || !document.body.contains(this.ui.el) ? this : (this.options.zone.removeChild(this.ui.el),
        this)
    }
    ,
    t.prototype.destroy = function() {
        clearTimeout(this.removeTimeout),
        clearTimeout(this.showTimeout),
        clearTimeout(this.restTimeout),
        this.trigger("destroyed", this.instance),
        this.removeFromDom(),
        this.off()
    }
    ,
    t.prototype.show = function(e) {
        var t = this;
        return t.options.dataOnly ? t : (clearTimeout(t.removeTimeout),
        clearTimeout(t.showTimeout),
        clearTimeout(t.restTimeout),
        t.addToDom(),
        t.restCallback(),
        setTimeout(function() {
            t.ui.el.style.opacity = 1
        }, 0),
        t.showTimeout = setTimeout(function() {
            t.trigger("shown", t.instance),
            "function" == typeof e && e.call(this)
        }, t.options.fadeTime),
        t)
    }
    ,
    t.prototype.hide = function(e) {
        var t = this;
        return t.options.dataOnly ? t : (t.ui.el.style.opacity = t.options.restOpacity,
        clearTimeout(t.removeTimeout),
        clearTimeout(t.showTimeout),
        clearTimeout(t.restTimeout),
        t.removeTimeout = setTimeout(function() {
            var n = "dynamic" === t.options.mode ? "none" : "block";
            t.ui.el.style.display = n,
            "function" == typeof e && e.call(t),
            t.trigger("hidden", t.instance)
        }, t.options.fadeTime),
        t.restPosition(),
        t)
    }
    ,
    t.prototype.restPosition = function(e) {
        var t = this;
        t.frontPosition = {
            x: 0,
            y: 0
        };
        var n = t.options.fadeTime + "ms"
          , r = {};
        r.front = c.getTransitionStyle("transition", ["top", "left"], n);
        var i = {
            front: {}
        };
        i.front = {
            left: t.frontPosition.x + "px",
            top: t.frontPosition.y + "px"
        },
        t.applyStyles(r),
        t.applyStyles(i),
        t.restTimeout = setTimeout(function() {
            "function" == typeof e && e.call(t),
            t.restCallback()
        }, t.options.fadeTime)
    }
    ,
    t.prototype.restCallback = function() {
        var e = {};
        e.front = c.getTransitionStyle("transition", "none", ""),
        this.applyStyles(e),
        this.trigger("rested", this.instance)
    }
    ,
    t.prototype.resetDirection = function() {
        this.direction = {
            x: !1,
            y: !1,
            angle: !1
        }
    }
    ,
    t.prototype.computeDirection = function(e) {
        var t, n, r, i = e.angle.radian, o = Math.PI / 4, s = Math.PI / 2;
        if (t = i > o && i < 3 * o ? "up" : i > -o && i <= o ? "left" : i > 3 * -o && i <= -o ? "down" : "right",
        n = i > -s && i < s ? "left" : "right",
        r = i > 0 ? "up" : "down",
        e.force > this.options.threshold) {
            var a = {};
            for (var l in this.direction)
                this.direction.hasOwnProperty(l) && (a[l] = this.direction[l]);
            var u = {};
            this.direction = {
                x: n,
                y: r,
                angle: t
            },
            e.direction = this.direction;
            for (var l in a)
                a[l] === this.direction[l] && (u[l] = !0);
            if (u.x && u.y && u.angle)
                return e;
            u.x && u.y || this.trigger("plain", e),
            u.x || this.trigger("plain:" + n, e),
            u.y || this.trigger("plain:" + r, e),
            u.angle || this.trigger("dir dir:" + t, e)
        }
        return e
    }
    ,
    n.prototype = new e,
    n.constructor = n,
    n.id = 0,
    n.prototype.prepareNipples = function() {
        var e = this.nipples;
        e.on = this.on.bind(this),
        e.off = this.off.bind(this),
        e.options = this.options,
        e.destroy = this.destroy.bind(this),
        e.ids = this.ids,
        e.id = this.id,
        e.processOnMove = this.processOnMove.bind(this),
        e.processOnEnd = this.processOnEnd.bind(this),
        e.get = function(t) {
            if (void 0 === t)
                return e[0];
            for (var n = 0, r = e.length; n < r; n += 1)
                if (e[n].identifier === t)
                    return e[n];
            return !1
        }
    }
    ,
    n.prototype.bindings = function() {
        this.bindEvt(this.options.zone, "start"),
        this.options.zone.style.touchAction = "none",
        this.options.zone.style.msTouchAction = "none"
    }
    ,
    n.prototype.begin = function() {
        var e = this.options;
        if ("static" === e.mode) {
            var t = this.createNipple(e.position, this.manager.getIdentifier());
            t.add(),
            this.idles.push(t)
        }
    }
    ,
    n.prototype.createNipple = function(e, n) {
        var r = c.getScroll()
          , i = {}
          , o = this.options;
        if (e.x && e.y)
            i = {
                x: e.x - (r.x + this.box.left),
                y: e.y - (r.y + this.box.top)
            };
        else if (e.top || e.right || e.bottom || e.left) {
            var s = document.createElement("DIV");
            s.style.display = "hidden",
            s.style.top = e.top,
            s.style.right = e.right,
            s.style.bottom = e.bottom,
            s.style.left = e.left,
            s.style.position = "absolute",
            o.zone.appendChild(s);
            var a = s.getBoundingClientRect();
            o.zone.removeChild(s),
            i = e,
            e = {
                x: a.left + r.x,
                y: a.top + r.y
            }
        }
        var l = new t(this,{
            color: o.color,
            size: o.size,
            threshold: o.threshold,
            fadeTime: o.fadeTime,
            dataOnly: o.dataOnly,
            restOpacity: o.restOpacity,
            mode: o.mode,
            identifier: n,
            position: e,
            zone: o.zone,
            frontPosition: {
                x: 0,
                y: 0
            }
        });
        return o.dataOnly || (c.applyPosition(l.ui.el, i),
        c.applyPosition(l.ui.front, l.frontPosition)),
        this.nipples.push(l),
        this.trigger("added " + l.identifier + ":added", l),
        this.manager.trigger("added " + l.identifier + ":added", l),
        this.bindNipple(l),
        l
    }
    ,
    n.prototype.updateBox = function() {
        this.box = this.options.zone.getBoundingClientRect()
    }
    ,
    n.prototype.bindNipple = function(e) {
        var t, n = this, r = function(e, r) {
            t = e.type + " " + r.id + ":" + e.type,
            n.trigger(t, r)
        };
        e.on("destroyed", n.onDestroyed.bind(n)),
        e.on("shown hidden rested dir plain", r),
        e.on("dir:up dir:right dir:down dir:left", r),
        e.on("plain:up plain:right plain:down plain:left", r)
    }
    ,
    n.prototype.pressureFn = function(e, t, n) {
        var r = this
          , i = 0;
        clearInterval(r.pressureIntervals[n]),
        r.pressureIntervals[n] = setInterval(function() {
            var n = e.force || e.pressure || e.webkitForce || 0;
            n !== i && (t.trigger("pressure", n),
            r.trigger("pressure " + t.identifier + ":pressure", n),
            i = n)
        }
        .bind(r), 100)
    }
    ,
    n.prototype.onstart = function(e) {
        var t = this
          , n = t.options;
        e = c.prepareEvent(e),
        t.updateBox();
        return c.map(e, function(e) {
            t.actives.length < n.maxNumberOfNipples && t.processOnStart(e)
        }),
        t.manager.bindDocument(),
        !1
    }
    ,
    n.prototype.processOnStart = function(e) {
        var t, n = this, r = n.options, i = n.manager.getIdentifier(e), o = e.force || e.pressure || e.webkitForce || 0, s = {
            x: e.pageX,
            y: e.pageY
        }, a = n.getOrCreate(i, s);
        a.identifier = i;
        var l = function(t) {
            t.trigger("start", t),
            n.trigger("start " + t.id + ":start", t),
            t.show(),
            o > 0 && n.pressureFn(e, t, t.identifier),
            n.processOnMove(e)
        };
        if ((t = n.idles.indexOf(a)) >= 0 && n.idles.splice(t, 1),
        n.actives.push(a),
        n.ids.push(a.identifier),
        "semi" !== r.mode)
            l(a);
        else {
            if (!(c.distance(s, a.position) <= r.catchDistance))
                return a.destroy(),
                void n.processOnStart(e);
            l(a)
        }
        return a
    }
    ,
    n.prototype.getOrCreate = function(e, t) {
        var n, r = this.options;
        return /(semi|static)/.test(r.mode) ? (n = this.idles[0]) ? (this.idles.splice(0, 1),
        n) : "semi" === r.mode ? this.createNipple(t, e) : (console.warn("Coudln't find the needed nipple."),
        !1) : n = this.createNipple(t, e)
    }
    ,
    n.prototype.processOnMove = function(e) {
        var t = this.options
          , n = this.manager.getIdentifier(e)
          , r = this.nipples.get(n);
        if (!r)
            return console.error("Found zombie joystick with ID " + n),
            void this.manager.removeIdentifier(n);
        r.identifier = n;
        var i = r.options.size / 2
          , o = {
            x: e.pageX,
            y: e.pageY
        }
          , s = c.distance(o, r.position)
          , a = c.angle(o, r.position)
          , l = c.radians(a)
          , u = s / i;
        s > i && (s = i,
        o = c.findCoord(r.position, s, a)),
        r.frontPosition = {
            x: o.x - r.position.x,
            y: o.y - r.position.y
        },
        t.dataOnly || c.applyPosition(r.ui.front, r.frontPosition);
        var h = {
            identifier: r.identifier,
            position: o,
            force: u,
            pressure: e.force || e.pressure || e.webkitForce || 0,
            distance: s,
            angle: {
                radian: l,
                degree: a
            },
            instance: r
        };
        (h = r.computeDirection(h)).angle = {
            radian: c.radians(180 - a),
            degree: 180 - a
        },
        r.trigger("move", h),
        this.trigger("move " + r.id + ":move", h)
    }
    ,
    n.prototype.processOnEnd = function(e) {
        var t = this
          , n = t.options
          , r = t.manager.getIdentifier(e)
          , i = t.nipples.get(r)
          , o = t.manager.removeIdentifier(i.identifier);
        i && (n.dataOnly || i.hide(function() {
            "dynamic" === n.mode && (i.trigger("removed", i),
            t.trigger("removed " + i.id + ":removed", i),
            t.manager.trigger("removed " + i.id + ":removed", i),
            i.destroy())
        }),
        clearInterval(t.pressureIntervals[i.identifier]),
        i.resetDirection(),
        i.trigger("end", i),
        t.trigger("end " + i.id + ":end", i),
        t.ids.indexOf(i.identifier) >= 0 && t.ids.splice(t.ids.indexOf(i.identifier), 1),
        t.actives.indexOf(i) >= 0 && t.actives.splice(t.actives.indexOf(i), 1),
        /(semi|static)/.test(n.mode) ? t.idles.push(i) : t.nipples.indexOf(i) >= 0 && t.nipples.splice(t.nipples.indexOf(i), 1),
        t.manager.unbindDocument(),
        /(semi|static)/.test(n.mode) && (t.manager.ids[o.id] = o.identifier))
    }
    ,
    n.prototype.onDestroyed = function(e, t) {
        this.nipples.indexOf(t) >= 0 && this.nipples.splice(this.nipples.indexOf(t), 1),
        this.actives.indexOf(t) >= 0 && this.actives.splice(this.actives.indexOf(t), 1),
        this.idles.indexOf(t) >= 0 && this.idles.splice(this.idles.indexOf(t), 1),
        this.ids.indexOf(t.identifier) >= 0 && this.ids.splice(this.ids.indexOf(t.identifier), 1),
        this.manager.removeIdentifier(t.identifier),
        this.manager.unbindDocument()
    }
    ,
    n.prototype.destroy = function() {
        this.unbindEvt(this.options.zone, "start"),
        this.nipples.forEach(function(e) {
            e.destroy()
        });
        for (var e in this.pressureIntervals)
            this.pressureIntervals.hasOwnProperty(e) && clearInterval(this.pressureIntervals[e]);
        this.trigger("destroyed", this.nipples),
        this.manager.unbindDocument(),
        this.off()
    }
    ,
    r.prototype = new e,
    r.constructor = r,
    r.prototype.prepareCollections = function() {
        var e = this;
        e.collections.create = e.create.bind(e),
        e.collections.on = e.on.bind(e),
        e.collections.off = e.off.bind(e),
        e.collections.destroy = e.destroy.bind(e),
        e.collections.get = function(t) {
            var n;
            return e.collections.every(function(e) {
                return !(n = e.get(t))
            }),
            n
        }
    }
    ,
    r.prototype.create = function(e) {
        return this.createCollection(e)
    }
    ,
    r.prototype.createCollection = function(e) {
        var t = new n(this,e);
        return this.bindCollection(t),
        this.collections.push(t),
        t
    }
    ,
    r.prototype.bindCollection = function(e) {
        var t, n = this, r = function(e, r) {
            t = e.type + " " + r.id + ":" + e.type,
            n.trigger(t, r)
        };
        e.on("destroyed", n.onDestroyed.bind(n)),
        e.on("shown hidden rested dir plain", r),
        e.on("dir:up dir:right dir:down dir:left", r),
        e.on("plain:up plain:right plain:down plain:left", r)
    }
    ,
    r.prototype.bindDocument = function() {
        this.binded || (this.bindEvt(document, "move").bindEvt(document, "end"),
        this.binded = !0)
    }
    ,
    r.prototype.unbindDocument = function(e) {
        Object.keys(this.ids).length && !0 !== e || (this.unbindEvt(document, "move").unbindEvt(document, "end"),
        this.binded = !1)
    }
    ,
    r.prototype.getIdentifier = function(e) {
        var t;
        return e ? void 0 === (t = void 0 === e.identifier ? e.pointerId : e.identifier) && (t = this.latest || 0) : t = this.index,
        void 0 === this.ids[t] && (this.ids[t] = this.index,
        this.index += 1),
        this.latest = t,
        this.ids[t]
    }
    ,
    r.prototype.removeIdentifier = function(e) {
        var t = {};
        for (var n in this.ids)
            if (this.ids[n] === e) {
                t.id = n,
                t.identifier = this.ids[n],
                delete this.ids[n];
                break
            }
        return t
    }
    ,
    r.prototype.onmove = function(e) {
        return this.onAny("move", e),
        !1
    }
    ,
    r.prototype.onend = function(e) {
        return this.onAny("end", e),
        !1
    }
    ,
    r.prototype.onAny = function(e, t) {
        var n, r = this, i = "processOn" + e.charAt(0).toUpperCase() + e.slice(1);
        t = c.prepareEvent(t);
        return c.map(t, function(e) {
            n = r.getIdentifier(e),
            c.map(r.collections, function(e, t, n) {
                n.ids.indexOf(t) >= 0 && (n[i](e),
                e._found_ = !0)
            }
            .bind(null, e, n)),
            e._found_ || r.removeIdentifier(n)
        }),
        !1
    }
    ,
    r.prototype.destroy = function() {
        this.unbindDocument(!0),
        this.ids = {},
        this.index = 0,
        this.collections.forEach(function(e) {
            e.destroy()
        }),
        this.off()
    }
    ,
    r.prototype.onDestroyed = function(e, t) {
        if (this.collections.indexOf(t) < 0)
            return !1;
        this.collections.splice(this.collections.indexOf(t), 1)
    }
    ;
    var h = new r;
    return {
        create: function(e) {
            return h.create(e)
        },
        factory: h
    }
});
