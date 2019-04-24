!function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e, t) {
        var n = (t = t || $).createElement("script");
        n.text = e,
        t.head.appendChild(n).parentNode.removeChild(n)
    }
    function r(e) {
        var t = !!e && "length"in e && e.length
          , n = ae.type(e);
        return "function" !== n && !ae.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }
    function i(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    function o(e, t, n) {
        return ae.isFunction(t) ? ae.grep(e, function(e, r) {
            return !!t.call(e, r, e) !== n
        }) : t.nodeType ? ae.grep(e, function(e) {
            return e === t !== n
        }) : "string" != typeof t ? ae.grep(e, function(e) {
            return ee.call(t, e) > -1 !== n
        }) : ve.test(t) ? ae.filter(t, e, n) : (t = ae.filter(t, e),
        ae.grep(e, function(e) {
            return ee.call(t, e) > -1 !== n && 1 === e.nodeType
        }))
    }
    function s(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    function a(e) {
        return e
    }
    function l(e) {
        throw e
    }
    function u(e, t, n, r) {
        var i;
        try {
            e && ae.isFunction(i = e.promise) ? i.call(e).done(t).fail(n) : e && ae.isFunction(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    function c() {
        $.removeEventListener("DOMContentLoaded", c),
        e.removeEventListener("load", c),
        ae.ready()
    }
    function h() {
        this.expando = ae.expando + h.uid++
    }
    function d(e, t, n) {
        var r;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(Oe, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = function(e) {
                        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Ae.test(e) ? JSON.parse(e) : e)
                    }(n)
                } catch (e) {}
                Me.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    function p(e, t, n, r) {
        var i, o = 1, s = 20, a = r ? function() {
            return r.cur()
        }
        : function() {
            return ae.css(e, t, "")
        }
        , l = a(), u = n && n[3] || (ae.cssNumber[t] ? "" : "px"), c = (ae.cssNumber[t] || "px" !== u && +l) && Re.exec(ae.css(e, t));
        if (c && c[3] !== u) {
            u = u || c[3],
            n = n || [],
            c = +l || 1;
            do {
                c /= o = o || ".5",
                ae.style(e, t, c + u)
            } while (o !== (o = a() / l) && 1 !== o && --s)
        }
        return n && (c = +c || +l || 0,
        i = n[1] ? c + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = u,
        r.start = c,
        r.end = i)),
        i
    }
    function f(e) {
        var t, n = e.ownerDocument, r = e.nodeName, i = Ne[r];
        return i || (t = n.body.appendChild(n.createElement(r)),
        i = ae.css(t, "display"),
        t.parentNode.removeChild(t),
        "none" === i && (i = "block"),
        Ne[r] = i,
        i)
    }
    function g(e, t) {
        for (var n, r, i = [], o = 0, s = e.length; o < s; o++)
            (r = e[o]).style && (n = r.style.display,
            t ? ("none" === n && (i[o] = Pe.get(r, "display") || null,
            i[o] || (r.style.display = "")),
            "" === r.style.display && ke(r) && (i[o] = f(r))) : "none" !== n && (i[o] = "none",
            Pe.set(r, "display", n)));
        for (o = 0; o < s; o++)
            null != i[o] && (e[o].style.display = i[o]);
        return e
    }
    function m(e, t) {
        var n;
        return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
        void 0 === t || t && i(e, t) ? ae.merge([e], n) : n
    }
    function v(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            Pe.set(e[n], "globalEval", !t || Pe.get(t[n], "globalEval"))
    }
    function y(e, t, n, r, i) {
        for (var o, s, a, l, u, c, h = t.createDocumentFragment(), d = [], p = 0, f = e.length; p < f; p++)
            if ((o = e[p]) || 0 === o)
                if ("object" === ae.type(o))
                    ae.merge(d, o.nodeType ? [o] : o);
                else if (Ge.test(o)) {
                    for (s = s || h.appendChild(t.createElement("div")),
                    a = (Fe.exec(o) || ["", ""])[1].toLowerCase(),
                    l = je[a] || je._default,
                    s.innerHTML = l[1] + ae.htmlPrefilter(o) + l[2],
                    c = l[0]; c--; )
                        s = s.lastChild;
                    ae.merge(d, s.childNodes),
                    (s = h.firstChild).textContent = ""
                } else
                    d.push(t.createTextNode(o));
        for (h.textContent = "",
        p = 0; o = d[p++]; )
            if (r && ae.inArray(o, r) > -1)
                i && i.push(o);
            else if (u = ae.contains(o.ownerDocument, o),
            s = m(h.appendChild(o), "script"),
            u && v(s),
            n)
                for (c = 0; o = s[c++]; )
                    Be.test(o.type || "") && n.push(o);
        return h
    }
    function b() {
        return !0
    }
    function _() {
        return !1
    }
    function x() {
        try {
            return $.activeElement
        } catch (e) {}
    }
    function w(e, t, n, r, i, o) {
        var s, a;
        if ("object" == typeof t) {
            "string" != typeof n && (r = r || n,
            n = void 0);
            for (a in t)
                w(e, a, n, r, t[a], o);
            return e
        }
        if (null == r && null == i ? (i = n,
        r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
        r = void 0) : (i = r,
        r = n,
        n = void 0)),
        !1 === i)
            i = _;
        else if (!i)
            return e;
        return 1 === o && (s = i,
        (i = function(e) {
            return ae().off(e),
            s.apply(this, arguments)
        }
        ).guid = s.guid || (s.guid = ae.guid++)),
        e.each(function() {
            ae.event.add(this, t, i, r, n)
        })
    }
    function T(e, t) {
        return i(e, "table") && i(11 !== t.nodeType ? t : t.firstChild, "tr") ? ae(">tbody", e)[0] || e : e
    }
    function E(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function S(e) {
        var t = $e.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"),
        e
    }
    function I(e, t) {
        var n, r, i, o, s, a, l, u;
        if (1 === t.nodeType) {
            if (Pe.hasData(e) && (o = Pe.access(e),
            s = Pe.set(t, o),
            u = o.events)) {
                delete s.handle,
                s.events = {};
                for (i in u)
                    for (n = 0,
                    r = u[i].length; n < r; n++)
                        ae.event.add(t, i, u[i][n])
            }
            Me.hasData(e) && (a = Me.access(e),
            l = ae.extend({}, a),
            Me.set(t, l))
        }
    }
    function P(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && Ue.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
    }
    function M(e, t, r, i) {
        t = J.apply([], t);
        var o, s, a, l, u, c, h = 0, d = e.length, p = d - 1, f = t[0], g = ae.isFunction(f);
        if (g || d > 1 && "string" == typeof f && !se.checkClone && qe.test(f))
            return e.each(function(n) {
                var o = e.eq(n);
                g && (t[0] = f.call(this, n, o.html())),
                M(o, t, r, i)
            });
        if (d && (o = y(t, e[0].ownerDocument, !1, e, i),
        s = o.firstChild,
        1 === o.childNodes.length && (o = s),
        s || i)) {
            for (l = (a = ae.map(m(o, "script"), E)).length; h < d; h++)
                u = o,
                h !== p && (u = ae.clone(u, !0, !0),
                l && ae.merge(a, m(u, "script"))),
                r.call(e[h], u, h);
            if (l)
                for (c = a[a.length - 1].ownerDocument,
                ae.map(a, S),
                h = 0; h < l; h++)
                    u = a[h],
                    Be.test(u.type || "") && !Pe.access(u, "globalEval") && ae.contains(c, u) && (u.src ? ae._evalUrl && ae._evalUrl(u.src) : n(u.textContent.replace(Ke, ""), c))
        }
        return e
    }
    function A(e, t, n) {
        for (var r, i = t ? ae.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || ae.cleanData(m(r)),
            r.parentNode && (n && ae.contains(r.ownerDocument, r) && v(m(r, "script")),
            r.parentNode.removeChild(r));
        return e
    }
    function O(e, t, n) {
        var r, i, o, s, a = e.style;
        return (n = n || Qe(e)) && ("" !== (s = n.getPropertyValue(t) || n[t]) || ae.contains(e.ownerDocument, e) || (s = ae.style(e, t)),
        !se.pixelMarginRight() && Je.test(s) && Ze.test(t) && (r = a.width,
        i = a.minWidth,
        o = a.maxWidth,
        a.minWidth = a.maxWidth = a.width = s,
        s = n.width,
        a.width = r,
        a.minWidth = i,
        a.maxWidth = o)),
        void 0 !== s ? s + "" : s
    }
    function C(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    function R(e) {
        var t = ae.cssProps[e];
        return t || (t = ae.cssProps[e] = function(e) {
            if (e in ot)
                return e;
            for (var t = e[0].toUpperCase() + e.slice(1), n = it.length; n--; )
                if ((e = it[n] + t)in ot)
                    return e
        }(e) || e),
        t
    }
    function D(e, t, n) {
        var r = Re.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function k(e, t, n, r, i) {
        var o, s = 0;
        for (o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0; o < 4; o += 2)
            "margin" === n && (s += ae.css(e, n + De[o], !0, i)),
            r ? ("content" === n && (s -= ae.css(e, "padding" + De[o], !0, i)),
            "margin" !== n && (s -= ae.css(e, "border" + De[o] + "Width", !0, i))) : (s += ae.css(e, "padding" + De[o], !0, i),
            "padding" !== n && (s += ae.css(e, "border" + De[o] + "Width", !0, i)));
        return s
    }
    function L(e, t, n) {
        var r, i = Qe(e), o = O(e, t, i), s = "border-box" === ae.css(e, "boxSizing", !1, i);
        return Je.test(o) ? o : (r = s && (se.boxSizingReliable() || o === e.style[t]),
        "auto" === o && (o = e["offset" + t[0].toUpperCase() + t.slice(1)]),
        (o = parseFloat(o) || 0) + k(e, t, n || (s ? "border" : "content"), r, i) + "px")
    }
    function N(e, t, n, r, i) {
        return new N.prototype.init(e,t,n,r,i)
    }
    function U() {
        at && (!1 === $.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(U) : e.setTimeout(U, ae.fx.interval),
        ae.fx.tick())
    }
    function F() {
        return e.setTimeout(function() {
            st = void 0
        }),
        st = ae.now()
    }
    function B(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = De[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function j(e, t, n) {
        for (var r, i = (G.tweeners[t] || []).concat(G.tweeners["*"]), o = 0, s = i.length; o < s; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function G(e, t, n) {
        var r, i, o = 0, s = G.prefilters.length, a = ae.Deferred().always(function() {
            delete l.elem
        }), l = function() {
            if (i)
                return !1;
            for (var t = st || F(), n = Math.max(0, u.startTime + u.duration - t), r = 1 - (n / u.duration || 0), o = 0, s = u.tweens.length; o < s; o++)
                u.tweens[o].run(r);
            return a.notifyWith(e, [u, r, n]),
            r < 1 && s ? n : (s || a.notifyWith(e, [u, 1, 0]),
            a.resolveWith(e, [u]),
            !1)
        }, u = a.promise({
            elem: e,
            props: ae.extend({}, t),
            opts: ae.extend(!0, {
                specialEasing: {},
                easing: ae.easing._default
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: st || F(),
            duration: n.duration,
            tweens: [],
            createTween: function(t, n) {
                var r = ae.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                return u.tweens.push(r),
                r
            },
            stop: function(t) {
                var n = 0
                  , r = t ? u.tweens.length : 0;
                if (i)
                    return this;
                for (i = !0; n < r; n++)
                    u.tweens[n].run(1);
                return t ? (a.notifyWith(e, [u, 1, 0]),
                a.resolveWith(e, [u, t])) : a.rejectWith(e, [u, t]),
                this
            }
        }), c = u.props;
        for (!function(e, t) {
            var n, r, i, o, s;
            for (n in e)
                if (r = ae.camelCase(n),
                i = t[r],
                o = e[n],
                Array.isArray(o) && (i = o[1],
                o = e[n] = o[0]),
                n !== r && (e[r] = o,
                delete e[n]),
                (s = ae.cssHooks[r]) && "expand"in s) {
                    o = s.expand(o),
                    delete e[r];
                    for (n in o)
                        n in e || (e[n] = o[n],
                        t[n] = i)
                } else
                    t[r] = i
        }(c, u.opts.specialEasing); o < s; o++)
            if (r = G.prefilters[o].call(u, e, c, u.opts))
                return ae.isFunction(r.stop) && (ae._queueHooks(u.elem, u.opts.queue).stop = ae.proxy(r.stop, r)),
                r;
        return ae.map(c, j, u),
        ae.isFunction(u.opts.start) && u.opts.start.call(e, u),
        u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always),
        ae.fx.timer(ae.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })),
        u
    }
    function X(e) {
        return (e.match(we) || []).join(" ")
    }
    function H(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function Y(e, t, n, r) {
        var i;
        if (Array.isArray(t))
            ae.each(t, function(t, i) {
                n || bt.test(e) ? r(e, i) : Y(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
            });
        else if (n || "object" !== ae.type(t))
            r(e, t);
        else
            for (i in t)
                Y(e + "[" + i + "]", t[i], n, r)
    }
    function W(e) {
        return function(t, n) {
            "string" != typeof t && (n = t,
            t = "*");
            var r, i = 0, o = t.toLowerCase().match(we) || [];
            if (ae.isFunction(n))
                for (; r = o[i++]; )
                    "+" === r[0] ? (r = r.slice(1) || "*",
                    (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }
    function V(e, t, n, r) {
        function i(a) {
            var l;
            return o[a] = !0,
            ae.each(e[a] || [], function(e, a) {
                var u = a(t, n, r);
                return "string" != typeof u || s || o[u] ? s ? !(l = u) : void 0 : (t.dataTypes.unshift(u),
                i(u),
                !1)
            }),
            l
        }
        var o = {}
          , s = e === Ot;
        return i(t.dataTypes[0]) || !o["*"] && i("*")
    }
    function z(e, t) {
        var n, r, i = ae.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && ae.extend(!0, e, r),
        e
    }
    var q = []
      , $ = e.document
      , K = Object.getPrototypeOf
      , Z = q.slice
      , J = q.concat
      , Q = q.push
      , ee = q.indexOf
      , te = {}
      , ne = te.toString
      , re = te.hasOwnProperty
      , ie = re.toString
      , oe = ie.call(Object)
      , se = {}
      , ae = function(e, t) {
        return new ae.fn.init(e,t)
    }
      , le = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , ue = /^-ms-/
      , ce = /-([a-z])/g
      , he = function(e, t) {
        return t.toUpperCase()
    };
    ae.fn = ae.prototype = {
        jquery: "3.2.1",
        constructor: ae,
        length: 0,
        toArray: function() {
            return Z.call(this)
        },
        get: function(e) {
            return null == e ? Z.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = ae.merge(this.constructor(), e);
            return t.prevObject = this,
            t
        },
        each: function(e) {
            return ae.each(this, e)
        },
        map: function(e) {
            return this.pushStack(ae.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(Z.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: Q,
        sort: q.sort,
        splice: q.splice
    },
    ae.extend = ae.fn.extend = function() {
        var e, t, n, r, i, o, s = arguments[0] || {}, a = 1, l = arguments.length, u = !1;
        for ("boolean" == typeof s && (u = s,
        s = arguments[a] || {},
        a++),
        "object" == typeof s || ae.isFunction(s) || (s = {}),
        a === l && (s = this,
        a--); a < l; a++)
            if (null != (e = arguments[a]))
                for (t in e)
                    n = s[t],
                    s !== (r = e[t]) && (u && r && (ae.isPlainObject(r) || (i = Array.isArray(r))) ? (i ? (i = !1,
                    o = n && Array.isArray(n) ? n : []) : o = n && ae.isPlainObject(n) ? n : {},
                    s[t] = ae.extend(u, o, r)) : void 0 !== r && (s[t] = r));
        return s
    }
    ,
    ae.extend({
        expando: "jQuery" + ("3.2.1" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === ae.type(e)
        },
        isWindow: function(e) {
            return null != e && e === e.window
        },
        isNumeric: function(e) {
            var t = ae.type(e);
            return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
        },
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== ne.call(e)) && (!(t = K(e)) || "function" == typeof (n = re.call(t, "constructor") && t.constructor) && ie.call(n) === oe)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? te[ne.call(e)] || "object" : typeof e
        },
        globalEval: function(e) {
            n(e)
        },
        camelCase: function(e) {
            return e.replace(ue, "ms-").replace(ce, he)
        },
        each: function(e, t) {
            var n, i = 0;
            if (r(e))
                for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++)
                    ;
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i]))
                        break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(le, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (r(Object(e)) ? ae.merge(n, "string" == typeof e ? [e] : e) : Q.call(n, e)),
            n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : ee.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, s = !n; i < o; i++)
                !t(e[i], i) !== s && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var i, o, s = 0, a = [];
            if (r(e))
                for (i = e.length; s < i; s++)
                    null != (o = t(e[s], s, n)) && a.push(o);
            else
                for (s in e)
                    null != (o = t(e[s], s, n)) && a.push(o);
            return J.apply([], a)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, i;
            if ("string" == typeof t && (n = e[t],
            t = e,
            e = n),
            ae.isFunction(e))
                return r = Z.call(arguments, 2),
                i = function() {
                    return e.apply(t || this, r.concat(Z.call(arguments)))
                }
                ,
                i.guid = e.guid = e.guid || ae.guid++,
                i
        },
        now: Date.now,
        support: se
    }),
    "function" == typeof Symbol && (ae.fn[Symbol.iterator] = q[Symbol.iterator]),
    ae.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        te["[object " + t + "]"] = t.toLowerCase()
    });
    var de = function(e) {
        function t(e, t, n, r) {
            var i, o, s, a, l, u, c, d = t && t.ownerDocument, f = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== f && 9 !== f && 11 !== f)
                return n;
            if (!r && ((t ? t.ownerDocument || t : B) !== C && O(t),
            t = t || C,
            D)) {
                if (11 !== f && (l = ge.exec(e)))
                    if (i = l[1]) {
                        if (9 === f) {
                            if (!(s = t.getElementById(i)))
                                return n;
                            if (s.id === i)
                                return n.push(s),
                                n
                        } else if (d && (s = d.getElementById(i)) && U(t, s) && s.id === i)
                            return n.push(s),
                            n
                    } else {
                        if (l[2])
                            return K.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((i = l[3]) && _.getElementsByClassName && t.getElementsByClassName)
                            return K.apply(n, t.getElementsByClassName(i)),
                            n
                    }
                if (_.qsa && !Y[e + " "] && (!k || !k.test(e))) {
                    if (1 !== f)
                        d = t,
                        c = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((a = t.getAttribute("id")) ? a = a.replace(be, _e) : t.setAttribute("id", a = F),
                        o = (u = E(e)).length; o--; )
                            u[o] = "#" + a + " " + p(u[o]);
                        c = u.join(","),
                        d = me.test(e) && h(t.parentNode) || t
                    }
                    if (c)
                        try {
                            return K.apply(n, d.querySelectorAll(c)),
                            n
                        } catch (e) {} finally {
                            a === F && t.removeAttribute("id")
                        }
                }
            }
            return I(e.replace(oe, "$1"), t, n, r)
        }
        function n() {
            function e(n, r) {
                return t.push(n + " ") > x.cacheLength && delete e[t.shift()],
                e[n + " "] = r
            }
            var t = [];
            return e
        }
        function r(e) {
            return e[F] = !0,
            e
        }
        function i(e) {
            var t = C.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function o(e, t) {
            for (var n = e.split("|"), r = n.length; r--; )
                x.attrHandle[n[r]] = t
        }
        function s(e, t) {
            var n = t && e
              , r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r)
                return r;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function a(e) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }
        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }
        function u(e) {
            return function(t) {
                return "form"in t ? t.parentNode && !1 === t.disabled ? "label"in t ? "label"in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && we(t) === e : t.disabled === e : "label"in t && t.disabled === e
            }
        }
        function c(e) {
            return r(function(t) {
                return t = +t,
                r(function(n, r) {
                    for (var i, o = e([], n.length, t), s = o.length; s--; )
                        n[i = o[s]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }
        function h(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        function d() {}
        function p(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function f(e, t, n) {
            var r = t.dir
              , i = t.next
              , o = i || r
              , s = n && "parentNode" === o
              , a = G++;
            return t.first ? function(t, n, i) {
                for (; t = t[r]; )
                    if (1 === t.nodeType || s)
                        return e(t, n, i);
                return !1
            }
            : function(t, n, l) {
                var u, c, h, d = [j, a];
                if (l) {
                    for (; t = t[r]; )
                        if ((1 === t.nodeType || s) && e(t, n, l))
                            return !0
                } else
                    for (; t = t[r]; )
                        if (1 === t.nodeType || s)
                            if (h = t[F] || (t[F] = {}),
                            c = h[t.uniqueID] || (h[t.uniqueID] = {}),
                            i && i === t.nodeName.toLowerCase())
                                t = t[r] || t;
                            else {
                                if ((u = c[o]) && u[0] === j && u[1] === a)
                                    return d[2] = u[2];
                                if (c[o] = d,
                                d[2] = e(t, n, l))
                                    return !0
                            }
                return !1
            }
        }
        function g(e) {
            return e.length > 1 ? function(t, n, r) {
                for (var i = e.length; i--; )
                    if (!e[i](t, n, r))
                        return !1;
                return !0
            }
            : e[0]
        }
        function m(e, t, n, r, i) {
            for (var o, s = [], a = 0, l = e.length, u = null != t; a < l; a++)
                (o = e[a]) && (n && !n(o, r, i) || (s.push(o),
                u && t.push(a)));
            return s
        }
        function v(e, n, i, o, s, a) {
            return o && !o[F] && (o = v(o)),
            s && !s[F] && (s = v(s, a)),
            r(function(r, a, l, u) {
                var c, h, d, p = [], f = [], g = a.length, v = r || function(e, n, r) {
                    for (var i = 0, o = n.length; i < o; i++)
                        t(e, n[i], r);
                    return r
                }(n || "*", l.nodeType ? [l] : l, []), y = !e || !r && n ? v : m(v, p, e, l, u), b = i ? s || (r ? e : g || o) ? [] : a : y;
                if (i && i(y, b, l, u),
                o)
                    for (c = m(b, f),
                    o(c, [], l, u),
                    h = c.length; h--; )
                        (d = c[h]) && (b[f[h]] = !(y[f[h]] = d));
                if (r) {
                    if (s || e) {
                        if (s) {
                            for (c = [],
                            h = b.length; h--; )
                                (d = b[h]) && c.push(y[h] = d);
                            s(null, b = [], c, u)
                        }
                        for (h = b.length; h--; )
                            (d = b[h]) && (c = s ? J(r, d) : p[h]) > -1 && (r[c] = !(a[c] = d))
                    }
                } else
                    b = m(b === a ? b.splice(g, b.length) : b),
                    s ? s(null, a, b, u) : K.apply(a, b)
            })
        }
        function y(e) {
            for (var t, n, r, i = e.length, o = x.relative[e[0].type], s = o || x.relative[" "], a = o ? 1 : 0, l = f(function(e) {
                return e === t
            }, s, !0), u = f(function(e) {
                return J(t, e) > -1
            }, s, !0), c = [function(e, n, r) {
                var i = !o && (r || n !== P) || ((t = n).nodeType ? l(e, n, r) : u(e, n, r));
                return t = null,
                i
            }
            ]; a < i; a++)
                if (n = x.relative[e[a].type])
                    c = [f(g(c), n)];
                else {
                    if ((n = x.filter[e[a].type].apply(null, e[a].matches))[F]) {
                        for (r = ++a; r < i && !x.relative[e[r].type]; r++)
                            ;
                        return v(a > 1 && g(c), a > 1 && p(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(oe, "$1"), n, a < r && y(e.slice(a, r)), r < i && y(e = e.slice(r)), r < i && p(e))
                    }
                    c.push(n)
                }
            return g(c)
        }
        var b, _, x, w, T, E, S, I, P, M, A, O, C, R, D, k, L, N, U, F = "sizzle" + 1 * new Date, B = e.document, j = 0, G = 0, X = n(), H = n(), Y = n(), W = function(e, t) {
            return e === t && (A = !0),
            0
        }, V = {}.hasOwnProperty, z = [], q = z.pop, $ = z.push, K = z.push, Z = z.slice, J = function(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, Q = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ee = "[\\x20\\t\\r\\n\\f]", te = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+", ne = "\\[" + ee + "*(" + te + ")(?:" + ee + "*([*^$|!~]?=)" + ee + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + te + "))|)" + ee + "*\\]", re = ":(" + te + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ne + ")*)|.*)\\)|)", ie = new RegExp(ee + "+","g"), oe = new RegExp("^" + ee + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ee + "+$","g"), se = new RegExp("^" + ee + "*," + ee + "*"), ae = new RegExp("^" + ee + "*([>+~]|" + ee + ")" + ee + "*"), le = new RegExp("=" + ee + "*([^\\]'\"]*?)" + ee + "*\\]","g"), ue = new RegExp(re), ce = new RegExp("^" + te + "$"), he = {
            ID: new RegExp("^#(" + te + ")"),
            CLASS: new RegExp("^\\.(" + te + ")"),
            TAG: new RegExp("^(" + te + "|[*])"),
            ATTR: new RegExp("^" + ne),
            PSEUDO: new RegExp("^" + re),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ee + "*(even|odd|(([+-]|)(\\d*)n|)" + ee + "*(?:([+-]|)" + ee + "*(\\d+)|))" + ee + "*\\)|)","i"),
            bool: new RegExp("^(?:" + Q + ")$","i"),
            needsContext: new RegExp("^" + ee + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ee + "*((?:-\\d)?\\d*)" + ee + "*\\)|)(?=[^-]|$)","i")
        }, de = /^(?:input|select|textarea|button)$/i, pe = /^h\d$/i, fe = /^[^{]+\{\s*\[native \w/, ge = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, me = /[+~]/, ve = new RegExp("\\\\([\\da-f]{1,6}" + ee + "?|(" + ee + ")|.)","ig"), ye = function(e, t, n) {
            var r = "0x" + t - 65536;
            return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
        }, be = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, _e = function(e, t) {
            return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }, xe = function() {
            O()
        }, we = f(function(e) {
            return !0 === e.disabled && ("form"in e || "label"in e)
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            K.apply(z = Z.call(B.childNodes), B.childNodes),
            z[B.childNodes.length].nodeType
        } catch (e) {
            K = {
                apply: z.length ? function(e, t) {
                    $.apply(e, Z.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        _ = t.support = {},
        T = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return !!t && "HTML" !== t.nodeName
        }
        ,
        O = t.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : B;
            return r !== C && 9 === r.nodeType && r.documentElement ? (C = r,
            R = C.documentElement,
            D = !T(C),
            B !== C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", xe, !1) : n.attachEvent && n.attachEvent("onunload", xe)),
            _.attributes = i(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            _.getElementsByTagName = i(function(e) {
                return e.appendChild(C.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            _.getElementsByClassName = fe.test(C.getElementsByClassName),
            _.getById = i(function(e) {
                return R.appendChild(e).id = F,
                !C.getElementsByName || !C.getElementsByName(F).length
            }),
            _.getById ? (x.filter.ID = function(e) {
                var t = e.replace(ve, ye);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            x.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && D) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }
            ) : (x.filter.ID = function(e) {
                var t = e.replace(ve, ye);
                return function(e) {
                    var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }
            ,
            x.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && D) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                        for (i = t.getElementsByName(e),
                        r = 0; o = i[r++]; )
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                                return [o]
                    }
                    return []
                }
            }
            ),
            x.find.TAG = _.getElementsByTagName ? function(e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : _.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[i++]; )
                        1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }
            ,
            x.find.CLASS = _.getElementsByClassName && function(e, t) {
                if (void 0 !== t.getElementsByClassName && D)
                    return t.getElementsByClassName(e)
            }
            ,
            L = [],
            k = [],
            (_.qsa = fe.test(C.querySelectorAll)) && (i(function(e) {
                R.appendChild(e).innerHTML = "<a id='" + F + "'></a><select id='" + F + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && k.push("[*^$]=" + ee + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || k.push("\\[" + ee + "*(?:value|" + Q + ")"),
                e.querySelectorAll("[id~=" + F + "-]").length || k.push("~="),
                e.querySelectorAll(":checked").length || k.push(":checked"),
                e.querySelectorAll("a#" + F + "+*").length || k.push(".#.+[+~]")
            }),
            i(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = C.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && k.push("name" + ee + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && k.push(":enabled", ":disabled"),
                R.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && k.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                k.push(",.*:")
            })),
            (_.matchesSelector = fe.test(N = R.matches || R.webkitMatchesSelector || R.mozMatchesSelector || R.oMatchesSelector || R.msMatchesSelector)) && i(function(e) {
                _.disconnectedMatch = N.call(e, "*"),
                N.call(e, "[s!='']:x"),
                L.push("!=", re)
            }),
            k = k.length && new RegExp(k.join("|")),
            L = L.length && new RegExp(L.join("|")),
            t = fe.test(R.compareDocumentPosition),
            U = t || fe.test(R.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            W = t ? function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !_.sortDetached && t.compareDocumentPosition(e) === n ? e === C || e.ownerDocument === B && U(B, e) ? -1 : t === C || t.ownerDocument === B && U(B, t) ? 1 : M ? J(M, e) - J(M, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], l = [t];
                if (!i || !o)
                    return e === C ? -1 : t === C ? 1 : i ? -1 : o ? 1 : M ? J(M, e) - J(M, t) : 0;
                if (i === o)
                    return s(e, t);
                for (n = e; n = n.parentNode; )
                    a.unshift(n);
                for (n = t; n = n.parentNode; )
                    l.unshift(n);
                for (; a[r] === l[r]; )
                    r++;
                return r ? s(a[r], l[r]) : a[r] === B ? -1 : l[r] === B ? 1 : 0
            }
            ,
            C) : C
        }
        ,
        t.matches = function(e, n) {
            return t(e, null, null, n)
        }
        ,
        t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== C && O(e),
            n = n.replace(le, "='$1']"),
            _.matchesSelector && D && !Y[n + " "] && (!L || !L.test(n)) && (!k || !k.test(n)))
                try {
                    var r = N.call(e, n);
                    if (r || _.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return r
                } catch (e) {}
            return t(n, C, null, [e]).length > 0
        }
        ,
        t.contains = function(e, t) {
            return (e.ownerDocument || e) !== C && O(e),
            U(e, t)
        }
        ,
        t.attr = function(e, t) {
            (e.ownerDocument || e) !== C && O(e);
            var n = x.attrHandle[t.toLowerCase()]
              , r = n && V.call(x.attrHandle, t.toLowerCase()) ? n(e, t, !D) : void 0;
            return void 0 !== r ? r : _.attributes || !D ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }
        ,
        t.escape = function(e) {
            return (e + "").replace(be, _e)
        }
        ,
        t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        t.uniqueSort = function(e) {
            var t, n = [], r = 0, i = 0;
            if (A = !_.detectDuplicates,
            M = !_.sortStable && e.slice(0),
            e.sort(W),
            A) {
                for (; t = e[i++]; )
                    t === e[i] && (r = n.push(i));
                for (; r--; )
                    e.splice(n[r], 1)
            }
            return M = null,
            e
        }
        ,
        w = t.getText = function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += w(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                for (; t = e[r++]; )
                    n += w(t);
            return n
        }
        ,
        (x = t.selectors = {
            cacheLength: 50,
            createPseudo: r,
            match: he,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(ve, ye),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(ve, ye),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && ue.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(ve, ye).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = X[e + " "];
                    return t || (t = new RegExp("(^|" + ee + ")" + e + "(" + ee + "|$)")) && X(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, r) {
                    return function(i) {
                        var o = t.attr(i, e);
                        return null == o ? "!=" === n : !n || (o += "",
                        "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(ie, " ") + " ").indexOf(r) > -1 : "|=" === n && (o === r || o.slice(0, r.length + 1) === r + "-"))
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3)
                      , s = "last" !== e.slice(-4)
                      , a = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    }
                    : function(t, n, l) {
                        var u, c, h, d, p, f, g = o !== s ? "nextSibling" : "previousSibling", m = t.parentNode, v = a && t.nodeName.toLowerCase(), y = !l && !a, b = !1;
                        if (m) {
                            if (o) {
                                for (; g; ) {
                                    for (d = t; d = d[g]; )
                                        if (a ? d.nodeName.toLowerCase() === v : 1 === d.nodeType)
                                            return !1;
                                    f = g = "only" === e && !f && "nextSibling"
                                }
                                return !0
                            }
                            if (f = [s ? m.firstChild : m.lastChild],
                            s && y) {
                                for (b = (p = (u = (c = (h = (d = m)[F] || (d[F] = {}))[d.uniqueID] || (h[d.uniqueID] = {}))[e] || [])[0] === j && u[1]) && u[2],
                                d = p && m.childNodes[p]; d = ++p && d && d[g] || (b = p = 0) || f.pop(); )
                                    if (1 === d.nodeType && ++b && d === t) {
                                        c[e] = [j, p, b];
                                        break
                                    }
                            } else if (y && (b = p = (u = (c = (h = (d = t)[F] || (d[F] = {}))[d.uniqueID] || (h[d.uniqueID] = {}))[e] || [])[0] === j && u[1]),
                            !1 === b)
                                for (; (d = ++p && d && d[g] || (b = p = 0) || f.pop()) && ((a ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++b || (y && ((c = (h = d[F] || (d[F] = {}))[d.uniqueID] || (h[d.uniqueID] = {}))[e] = [j, b]),
                                d !== t)); )
                                    ;
                            return (b -= i) === r || b % r == 0 && b / r >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var i, o = x.pseudos[e] || x.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[F] ? o(n) : o.length > 1 ? (i = [e, e, "", n],
                    x.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                        for (var r, i = o(e, n), s = i.length; s--; )
                            e[r = J(e, i[s])] = !(t[r] = i[s])
                    }) : function(e) {
                        return o(e, 0, i)
                    }
                    ) : o
                }
            },
            pseudos: {
                not: r(function(e) {
                    var t = []
                      , n = []
                      , i = S(e.replace(oe, "$1"));
                    return i[F] ? r(function(e, t, n, r) {
                        for (var o, s = i(e, null, r, []), a = e.length; a--; )
                            (o = s[a]) && (e[a] = !(t[a] = o))
                    }) : function(e, r, o) {
                        return t[0] = e,
                        i(t, null, o, n),
                        t[0] = null,
                        !n.pop()
                    }
                }),
                has: r(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: r(function(e) {
                    return e = e.replace(ve, ye),
                    function(t) {
                        return (t.textContent || t.innerText || w(t)).indexOf(e) > -1
                    }
                }),
                lang: r(function(e) {
                    return ce.test(e || "") || t.error("unsupported lang: " + e),
                    e = e.replace(ve, ye).toLowerCase(),
                    function(t) {
                        var n;
                        do {
                            if (n = D ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                        } while ((t = t.parentNode) && 1 === t.nodeType);return !1
                    }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === R
                },
                focus: function(e) {
                    return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: u(!1),
                disabled: u(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !x.pseudos.empty(e)
                },
                header: function(e) {
                    return pe.test(e.nodeName)
                },
                input: function(e) {
                    return de.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: c(function() {
                    return [0]
                }),
                last: c(function(e, t) {
                    return [t - 1]
                }),
                eq: c(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: c(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: c(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: c(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; --r >= 0; )
                        e.push(r);
                    return e
                }),
                gt: c(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = x.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            x.pseudos[b] = a(b);
        for (b in {
            submit: !0,
            reset: !0
        })
            x.pseudos[b] = l(b);
        return d.prototype = x.filters = x.pseudos,
        x.setFilters = new d,
        E = t.tokenize = function(e, n) {
            var r, i, o, s, a, l, u, c = H[e + " "];
            if (c)
                return n ? 0 : c.slice(0);
            for (a = e,
            l = [],
            u = x.preFilter; a; ) {
                r && !(i = se.exec(a)) || (i && (a = a.slice(i[0].length) || a),
                l.push(o = [])),
                r = !1,
                (i = ae.exec(a)) && (r = i.shift(),
                o.push({
                    value: r,
                    type: i[0].replace(oe, " ")
                }),
                a = a.slice(r.length));
                for (s in x.filter)
                    !(i = he[s].exec(a)) || u[s] && !(i = u[s](i)) || (r = i.shift(),
                    o.push({
                        value: r,
                        type: s,
                        matches: i
                    }),
                    a = a.slice(r.length));
                if (!r)
                    break
            }
            return n ? a.length : a ? t.error(e) : H(e, l).slice(0)
        }
        ,
        S = t.compile = function(e, n) {
            var i, o = [], s = [], a = Y[e + " "];
            if (!a) {
                for (n || (n = E(e)),
                i = n.length; i--; )
                    (a = y(n[i]))[F] ? o.push(a) : s.push(a);
                (a = Y(e, function(e, n) {
                    var i = n.length > 0
                      , o = e.length > 0
                      , s = function(r, s, a, l, u) {
                        var c, h, d, p = 0, f = "0", g = r && [], v = [], y = P, b = r || o && x.find.TAG("*", u), _ = j += null == y ? 1 : Math.random() || .1, w = b.length;
                        for (u && (P = s === C || s || u); f !== w && null != (c = b[f]); f++) {
                            if (o && c) {
                                for (h = 0,
                                s || c.ownerDocument === C || (O(c),
                                a = !D); d = e[h++]; )
                                    if (d(c, s || C, a)) {
                                        l.push(c);
                                        break
                                    }
                                u && (j = _)
                            }
                            i && ((c = !d && c) && p--,
                            r && g.push(c))
                        }
                        if (p += f,
                        i && f !== p) {
                            for (h = 0; d = n[h++]; )
                                d(g, v, s, a);
                            if (r) {
                                if (p > 0)
                                    for (; f--; )
                                        g[f] || v[f] || (v[f] = q.call(l));
                                v = m(v)
                            }
                            K.apply(l, v),
                            u && !r && v.length > 0 && p + n.length > 1 && t.uniqueSort(l)
                        }
                        return u && (j = _,
                        P = y),
                        g
                    };
                    return i ? r(s) : s
                }(s, o))).selector = e
            }
            return a
        }
        ,
        I = t.select = function(e, t, n, r) {
            var i, o, s, a, l, u = "function" == typeof e && e, c = !r && E(e = u.selector || e);
            if (n = n || [],
            1 === c.length) {
                if ((o = c[0] = c[0].slice(0)).length > 2 && "ID" === (s = o[0]).type && 9 === t.nodeType && D && x.relative[o[1].type]) {
                    if (!(t = (x.find.ID(s.matches[0].replace(ve, ye), t) || [])[0]))
                        return n;
                    u && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                for (i = he.needsContext.test(e) ? 0 : o.length; i-- && (s = o[i],
                !x.relative[a = s.type]); )
                    if ((l = x.find[a]) && (r = l(s.matches[0].replace(ve, ye), me.test(o[0].type) && h(t.parentNode) || t))) {
                        if (o.splice(i, 1),
                        !(e = r.length && p(o)))
                            return K.apply(n, r),
                            n;
                        break
                    }
            }
            return (u || S(e, c))(r, t, !D, n, !t || me.test(e) && h(t.parentNode) || t),
            n
        }
        ,
        _.sortStable = F.split("").sort(W).join("") === F,
        _.detectDuplicates = !!A,
        O(),
        _.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(C.createElement("fieldset"))
        }),
        i(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        _.attributes && i(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        i(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(Q, function(e, t, n) {
            var r;
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
        t
    }(e);
    ae.find = de,
    ae.expr = de.selectors,
    ae.expr[":"] = ae.expr.pseudos,
    ae.uniqueSort = ae.unique = de.uniqueSort,
    ae.text = de.getText,
    ae.isXMLDoc = de.isXML,
    ae.contains = de.contains,
    ae.escapeSelector = de.escape;
    var pe = function(e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (i && ae(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
      , fe = function(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
      , ge = ae.expr.match.needsContext
      , me = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i
      , ve = /^.[^:#\[\.,]*$/;
    ae.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? ae.find.matchesSelector(r, e) ? [r] : [] : ae.find.matches(e, ae.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    ae.fn.extend({
        find: function(e) {
            var t, n, r = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(ae(e).filter(function() {
                    for (t = 0; t < r; t++)
                        if (ae.contains(i[t], this))
                            return !0
                }));
            for (n = this.pushStack([]),
            t = 0; t < r; t++)
                ae.find(e, i[t], n);
            return r > 1 ? ae.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(o(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(o(this, e || [], !0))
        },
        is: function(e) {
            return !!o(this, "string" == typeof e && ge.test(e) ? ae(e) : e || [], !1).length
        }
    });
    var ye, be = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (ae.fn.init = function(e, t, n) {
        var r, i;
        if (!e)
            return this;
        if (n = n || ye,
        "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : be.exec(e)) || !r[1] && t)
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof ae ? t[0] : t,
                ae.merge(this, ae.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : $, !0)),
                me.test(r[1]) && ae.isPlainObject(t))
                    for (r in t)
                        ae.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = $.getElementById(r[2])) && (this[0] = i,
            this.length = 1),
            this
        }
        return e.nodeType ? (this[0] = e,
        this.length = 1,
        this) : ae.isFunction(e) ? void 0 !== n.ready ? n.ready(e) : e(ae) : ae.makeArray(e, this)
    }
    ).prototype = ae.fn,
    ye = ae($);
    var _e = /^(?:parents|prev(?:Until|All))/
      , xe = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    ae.fn.extend({
        has: function(e) {
            var t = ae(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (ae.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, o = [], s = "string" != typeof e && ae(e);
            if (!ge.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && ae.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(o.length > 1 ? ae.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? ee.call(ae(e), this[0]) : ee.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(ae.uniqueSort(ae.merge(this.get(), ae(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    ae.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return pe(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return pe(e, "parentNode", n)
        },
        next: function(e) {
            return s(e, "nextSibling")
        },
        prev: function(e) {
            return s(e, "previousSibling")
        },
        nextAll: function(e) {
            return pe(e, "nextSibling")
        },
        prevAll: function(e) {
            return pe(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return pe(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return pe(e, "previousSibling", n)
        },
        siblings: function(e) {
            return fe((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return fe(e.firstChild)
        },
        contents: function(e) {
            return i(e, "iframe") ? e.contentDocument : (i(e, "template") && (e = e.content || e),
            ae.merge([], e.childNodes))
        }
    }, function(e, t) {
        ae.fn[e] = function(n, r) {
            var i = ae.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n),
            r && "string" == typeof r && (i = ae.filter(r, i)),
            this.length > 1 && (xe[e] || ae.uniqueSort(i),
            _e.test(e) && i.reverse()),
            this.pushStack(i)
        }
    });
    var we = /[^\x20\t\r\n\f]+/g;
    ae.Callbacks = function(e) {
        e = "string" == typeof e ? function(e) {
            var t = {};
            return ae.each(e.match(we) || [], function(e, n) {
                t[n] = !0
            }),
            t
        }(e) : ae.extend({}, e);
        var t, n, r, i, o = [], s = [], a = -1, l = function() {
            for (i = i || e.once,
            r = t = !0; s.length; a = -1)
                for (n = s.shift(); ++a < o.length; )
                    !1 === o[a].apply(n[0], n[1]) && e.stopOnFalse && (a = o.length,
                    n = !1);
            e.memory || (n = !1),
            t = !1,
            i && (o = n ? [] : "")
        }, u = {
            add: function() {
                return o && (n && !t && (a = o.length - 1,
                s.push(n)),
                function t(n) {
                    ae.each(n, function(n, r) {
                        ae.isFunction(r) ? e.unique && u.has(r) || o.push(r) : r && r.length && "string" !== ae.type(r) && t(r)
                    })
                }(arguments),
                n && !t && l()),
                this
            },
            remove: function() {
                return ae.each(arguments, function(e, t) {
                    for (var n; (n = ae.inArray(t, o, n)) > -1; )
                        o.splice(n, 1),
                        n <= a && a--
                }),
                this
            },
            has: function(e) {
                return e ? ae.inArray(e, o) > -1 : o.length > 0
            },
            empty: function() {
                return o && (o = []),
                this
            },
            disable: function() {
                return i = s = [],
                o = n = "",
                this
            },
            disabled: function() {
                return !o
            },
            lock: function() {
                return i = s = [],
                n || t || (o = n = ""),
                this
            },
            locked: function() {
                return !!i
            },
            fireWith: function(e, n) {
                return i || (n = [e, (n = n || []).slice ? n.slice() : n],
                s.push(n),
                t || l()),
                this
            },
            fire: function() {
                return u.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!r
            }
        };
        return u
    }
    ,
    ae.extend({
        Deferred: function(t) {
            var n = [["notify", "progress", ae.Callbacks("memory"), ae.Callbacks("memory"), 2], ["resolve", "done", ae.Callbacks("once memory"), ae.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", ae.Callbacks("once memory"), ae.Callbacks("once memory"), 1, "rejected"]]
              , r = "pending"
              , i = {
                state: function() {
                    return r
                },
                always: function() {
                    return o.done(arguments).fail(arguments),
                    this
                },
                catch: function(e) {
                    return i.then(null, e)
                },
                pipe: function() {
                    var e = arguments;
                    return ae.Deferred(function(t) {
                        ae.each(n, function(n, r) {
                            var i = ae.isFunction(e[r[4]]) && e[r[4]];
                            o[r[1]](function() {
                                var e = i && i.apply(this, arguments);
                                e && ae.isFunction(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + "With"](this, i ? [e] : arguments)
                            })
                        }),
                        e = null
                    }).promise()
                },
                then: function(t, r, i) {
                    function o(t, n, r, i) {
                        return function() {
                            var u = this
                              , c = arguments
                              , h = function() {
                                var e, h;
                                if (!(t < s)) {
                                    if ((e = r.apply(u, c)) === n.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    h = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    ae.isFunction(h) ? i ? h.call(e, o(s, n, a, i), o(s, n, l, i)) : (s++,
                                    h.call(e, o(s, n, a, i), o(s, n, l, i), o(s, n, a, n.notifyWith))) : (r !== a && (u = void 0,
                                    c = [e]),
                                    (i || n.resolveWith)(u, c))
                                }
                            }
                              , d = i ? h : function() {
                                try {
                                    h()
                                } catch (e) {
                                    ae.Deferred.exceptionHook && ae.Deferred.exceptionHook(e, d.stackTrace),
                                    t + 1 >= s && (r !== l && (u = void 0,
                                    c = [e]),
                                    n.rejectWith(u, c))
                                }
                            }
                            ;
                            t ? d() : (ae.Deferred.getStackHook && (d.stackTrace = ae.Deferred.getStackHook()),
                            e.setTimeout(d))
                        }
                    }
                    var s = 0;
                    return ae.Deferred(function(e) {
                        n[0][3].add(o(0, e, ae.isFunction(i) ? i : a, e.notifyWith)),
                        n[1][3].add(o(0, e, ae.isFunction(t) ? t : a)),
                        n[2][3].add(o(0, e, ae.isFunction(r) ? r : l))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? ae.extend(e, i) : i
                }
            }
              , o = {};
            return ae.each(n, function(e, t) {
                var s = t[2]
                  , a = t[5];
                i[t[1]] = s.add,
                a && s.add(function() {
                    r = a
                }, n[3 - e][2].disable, n[0][2].lock),
                s.add(t[3].fire),
                o[t[0]] = function() {
                    return o[t[0] + "With"](this === o ? void 0 : this, arguments),
                    this
                }
                ,
                o[t[0] + "With"] = s.fireWith
            }),
            i.promise(o),
            t && t.call(o, o),
            o
        },
        when: function(e) {
            var t = arguments.length
              , n = t
              , r = Array(n)
              , i = Z.call(arguments)
              , o = ae.Deferred()
              , s = function(e) {
                return function(n) {
                    r[e] = this,
                    i[e] = arguments.length > 1 ? Z.call(arguments) : n,
                    --t || o.resolveWith(r, i)
                }
            };
            if (t <= 1 && (u(e, o.done(s(n)).resolve, o.reject, !t),
            "pending" === o.state() || ae.isFunction(i[n] && i[n].then)))
                return o.then();
            for (; n--; )
                u(i[n], s(n), o.reject);
            return o.promise()
        }
    });
    var Te = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    ae.Deferred.exceptionHook = function(t, n) {
        e.console && e.console.warn && t && Te.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }
    ,
    ae.readyException = function(t) {
        e.setTimeout(function() {
            throw t
        })
    }
    ;
    var Ee = ae.Deferred();
    ae.fn.ready = function(e) {
        return Ee.then(e).catch(function(e) {
            ae.readyException(e)
        }),
        this
    }
    ,
    ae.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --ae.readyWait : ae.isReady) || (ae.isReady = !0,
            !0 !== e && --ae.readyWait > 0 || Ee.resolveWith($, [ae]))
        }
    }),
    ae.ready.then = Ee.then,
    "complete" === $.readyState || "loading" !== $.readyState && !$.documentElement.doScroll ? e.setTimeout(ae.ready) : ($.addEventListener("DOMContentLoaded", c),
    e.addEventListener("load", c));
    var Se = function(e, t, n, r, i, o, s) {
        var a = 0
          , l = e.length
          , u = null == n;
        if ("object" === ae.type(n)) {
            i = !0;
            for (a in n)
                Se(e, t, a, n[a], !0, o, s)
        } else if (void 0 !== r && (i = !0,
        ae.isFunction(r) || (s = !0),
        u && (s ? (t.call(e, r),
        t = null) : (u = t,
        t = function(e, t, n) {
            return u.call(ae(e), n)
        }
        )),
        t))
            for (; a < l; a++)
                t(e[a], n, s ? r : r.call(e[a], a, t(e[a], n)));
        return i ? e : u ? t.call(e) : l ? t(e[0], n) : o
    }
      , Ie = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    h.uid = 1,
    h.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            Ie(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t)
                i[ae.camelCase(t)] = n;
            else
                for (r in t)
                    i[ae.camelCase(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][ae.camelCase(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(ae.camelCase) : (t = ae.camelCase(t))in r ? [t] : t.match(we) || []).length;
                    for (; n--; )
                        delete r[t[n]]
                }
                (void 0 === t || ae.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !ae.isEmptyObject(t)
        }
    };
    var Pe = new h
      , Me = new h
      , Ae = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Oe = /[A-Z]/g;
    ae.extend({
        hasData: function(e) {
            return Me.hasData(e) || Pe.hasData(e)
        },
        data: function(e, t, n) {
            return Me.access(e, t, n)
        },
        removeData: function(e, t) {
            Me.remove(e, t)
        },
        _data: function(e, t, n) {
            return Pe.access(e, t, n)
        },
        _removeData: function(e, t) {
            Pe.remove(e, t)
        }
    }),
    ae.fn.extend({
        data: function(e, t) {
            var n, r, i, o = this[0], s = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (i = Me.get(o),
                1 === o.nodeType && !Pe.get(o, "hasDataAttrs"))) {
                    for (n = s.length; n--; )
                        s[n] && 0 === (r = s[n].name).indexOf("data-") && (r = ae.camelCase(r.slice(5)),
                        d(o, r, i[r]));
                    Pe.set(o, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each(function() {
                Me.set(this, e)
            }) : Se(this, function(t) {
                var n;
                if (o && void 0 === t) {
                    if (void 0 !== (n = Me.get(o, e)))
                        return n;
                    if (void 0 !== (n = d(o, e)))
                        return n
                } else
                    this.each(function() {
                        Me.set(this, e, t)
                    })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                Me.remove(this, e)
            })
        }
    }),
    ae.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue",
                r = Pe.get(e, t),
                n && (!r || Array.isArray(n) ? r = Pe.access(e, t, ae.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = ae.queue(e, t)
              , r = n.length
              , i = n.shift()
              , o = ae._queueHooks(e, t)
              , s = function() {
                ae.dequeue(e, t)
            };
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(e, s, o)),
            !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Pe.get(e, n) || Pe.access(e, n, {
                empty: ae.Callbacks("once memory").add(function() {
                    Pe.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    ae.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e,
            e = "fx",
            n--),
            arguments.length < n ? ae.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = ae.queue(this, e, t);
                ae._queueHooks(this, e),
                "fx" === e && "inprogress" !== n[0] && ae.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                ae.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1, i = ae.Deferred(), o = this, s = this.length, a = function() {
                --r || i.resolveWith(o, [o])
            };
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; s--; )
                (n = Pe.get(o[s], e + "queueHooks")) && n.empty && (r++,
                n.empty.add(a));
            return a(),
            i.promise(t)
        }
    });
    var Ce = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , Re = new RegExp("^(?:([+-])=|)(" + Ce + ")([a-z%]*)$","i")
      , De = ["Top", "Right", "Bottom", "Left"]
      , ke = function(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && ae.contains(e.ownerDocument, e) && "none" === ae.css(e, "display")
    }
      , Le = function(e, t, n, r) {
        var i, o, s = {};
        for (o in t)
            s[o] = e.style[o],
            e.style[o] = t[o];
        i = n.apply(e, r || []);
        for (o in t)
            e.style[o] = s[o];
        return i
    }
      , Ne = {};
    ae.fn.extend({
        show: function() {
            return g(this, !0)
        },
        hide: function() {
            return g(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                ke(this) ? ae(this).show() : ae(this).hide()
            })
        }
    });
    var Ue = /^(?:checkbox|radio)$/i
      , Fe = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i
      , Be = /^$|\/(?:java|ecma)script/i
      , je = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    je.optgroup = je.option,
    je.tbody = je.tfoot = je.colgroup = je.caption = je.thead,
    je.th = je.td;
    var Ge = /<|&#?\w+;/;
    !function() {
        var e = $.createDocumentFragment().appendChild($.createElement("div"))
          , t = $.createElement("input");
        t.setAttribute("type", "radio"),
        t.setAttribute("checked", "checked"),
        t.setAttribute("name", "t"),
        e.appendChild(t),
        se.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked,
        e.innerHTML = "<textarea>x</textarea>",
        se.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
    }();
    var Xe = $.documentElement
      , He = /^key/
      , Ye = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , We = /^([^.]*)(?:\.(.+)|)/;
    ae.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var o, s, a, l, u, c, h, d, p, f, g, m = Pe.get(e);
            if (m)
                for (n.handler && (n = (o = n).handler,
                i = o.selector),
                i && ae.find.matchesSelector(Xe, i),
                n.guid || (n.guid = ae.guid++),
                (l = m.events) || (l = m.events = {}),
                (s = m.handle) || (s = m.handle = function(t) {
                    return void 0 !== ae && ae.event.triggered !== t.type ? ae.event.dispatch.apply(e, arguments) : void 0
                }
                ),
                u = (t = (t || "").match(we) || [""]).length; u--; )
                    p = g = (a = We.exec(t[u]) || [])[1],
                    f = (a[2] || "").split(".").sort(),
                    p && (h = ae.event.special[p] || {},
                    p = (i ? h.delegateType : h.bindType) || p,
                    h = ae.event.special[p] || {},
                    c = ae.extend({
                        type: p,
                        origType: g,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && ae.expr.match.needsContext.test(i),
                        namespace: f.join(".")
                    }, o),
                    (d = l[p]) || ((d = l[p] = []).delegateCount = 0,
                    h.setup && !1 !== h.setup.call(e, r, f, s) || e.addEventListener && e.addEventListener(p, s)),
                    h.add && (h.add.call(e, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                    i ? d.splice(d.delegateCount++, 0, c) : d.push(c),
                    ae.event.global[p] = !0)
        },
        remove: function(e, t, n, r, i) {
            var o, s, a, l, u, c, h, d, p, f, g, m = Pe.hasData(e) && Pe.get(e);
            if (m && (l = m.events)) {
                for (u = (t = (t || "").match(we) || [""]).length; u--; )
                    if (a = We.exec(t[u]) || [],
                    p = g = a[1],
                    f = (a[2] || "").split(".").sort(),
                    p) {
                        for (h = ae.event.special[p] || {},
                        d = l[p = (r ? h.delegateType : h.bindType) || p] || [],
                        a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        s = o = d.length; o--; )
                            c = d[o],
                            !i && g !== c.origType || n && n.guid !== c.guid || a && !a.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (d.splice(o, 1),
                            c.selector && d.delegateCount--,
                            h.remove && h.remove.call(e, c));
                        s && !d.length && (h.teardown && !1 !== h.teardown.call(e, f, m.handle) || ae.removeEvent(e, p, m.handle),
                        delete l[p])
                    } else
                        for (p in l)
                            ae.event.remove(e, p + t[u], n, r, !0);
                ae.isEmptyObject(l) && Pe.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, s, a = ae.event.fix(e), l = new Array(arguments.length), u = (Pe.get(this, "events") || {})[a.type] || [], c = ae.event.special[a.type] || {};
            for (l[0] = a,
            t = 1; t < arguments.length; t++)
                l[t] = arguments[t];
            if (a.delegateTarget = this,
            !c.preDispatch || !1 !== c.preDispatch.call(this, a)) {
                for (s = ae.event.handlers.call(this, a, u),
                t = 0; (i = s[t++]) && !a.isPropagationStopped(); )
                    for (a.currentTarget = i.elem,
                    n = 0; (o = i.handlers[n++]) && !a.isImmediatePropagationStopped(); )
                        a.rnamespace && !a.rnamespace.test(o.namespace) || (a.handleObj = o,
                        a.data = o.data,
                        void 0 !== (r = ((ae.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, l)) && !1 === (a.result = r) && (a.preventDefault(),
                        a.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, a),
                a.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, s, a = [], l = t.delegateCount, u = e.target;
            if (l && u.nodeType && !("click" === e.type && e.button >= 1))
                for (; u !== this; u = u.parentNode || this)
                    if (1 === u.nodeType && ("click" !== e.type || !0 !== u.disabled)) {
                        for (o = [],
                        s = {},
                        n = 0; n < l; n++)
                            void 0 === s[i = (r = t[n]).selector + " "] && (s[i] = r.needsContext ? ae(i, this).index(u) > -1 : ae.find(i, this, null, [u]).length),
                            s[i] && o.push(r);
                        o.length && a.push({
                            elem: u,
                            handlers: o
                        })
                    }
            return u = this,
            l < t.length && a.push({
                elem: u,
                handlers: t.slice(l)
            }),
            a
        },
        addProp: function(e, t) {
            Object.defineProperty(ae.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: ae.isFunction(t) ? function() {
                    if (this.originalEvent)
                        return t(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[e]
                }
                ,
                set: function(t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(e) {
            return e[ae.expando] ? e : new ae.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== x() && this.focus)
                        return this.focus(),
                        !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === x() && this.blur)
                        return this.blur(),
                        !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if ("checkbox" === this.type && this.click && i(this, "input"))
                        return this.click(),
                        !1
                },
                _default: function(e) {
                    return i(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    ae.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    ae.Event = function(e, t) {
        if (!(this instanceof ae.Event))
            return new ae.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? b : _,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && ae.extend(this, t),
        this.timeStamp = e && e.timeStamp || ae.now(),
        this[ae.expando] = !0
    }
    ,
    ae.Event.prototype = {
        constructor: ae.Event,
        isDefaultPrevented: _,
        isPropagationStopped: _,
        isImmediatePropagationStopped: _,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = b,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = b,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = b,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    ae.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && He.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ye.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, ae.event.addProp),
    ae.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        ae.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, r = e.relatedTarget, i = e.handleObj;
                return r && (r === this || ae.contains(this, r)) || (e.type = i.origType,
                n = i.handler.apply(this, arguments),
                e.type = t),
                n
            }
        }
    }),
    ae.fn.extend({
        on: function(e, t, n, r) {
            return w(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return w(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj,
                ae(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                this;
            if ("object" == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t,
            t = void 0),
            !1 === n && (n = _),
            this.each(function() {
                ae.event.remove(this, e, n, t)
            })
        }
    });
    var Ve = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi
      , ze = /<script|<style|<link/i
      , qe = /checked\s*(?:[^=]|=\s*.checked.)/i
      , $e = /^true\/(.*)/
      , Ke = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    ae.extend({
        htmlPrefilter: function(e) {
            return e.replace(Ve, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var r, i, o, s, a = e.cloneNode(!0), l = ae.contains(e.ownerDocument, e);
            if (!(se.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ae.isXMLDoc(e)))
                for (s = m(a),
                r = 0,
                i = (o = m(e)).length; r < i; r++)
                    P(o[r], s[r]);
            if (t)
                if (n)
                    for (o = o || m(e),
                    s = s || m(a),
                    r = 0,
                    i = o.length; r < i; r++)
                        I(o[r], s[r]);
                else
                    I(e, a);
            return (s = m(a, "script")).length > 0 && v(s, !l && m(e, "script")),
            a
        },
        cleanData: function(e) {
            for (var t, n, r, i = ae.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (Ie(n)) {
                    if (t = n[Pe.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? ae.event.remove(n, r) : ae.removeEvent(n, r, t.handle);
                        n[Pe.expando] = void 0
                    }
                    n[Me.expando] && (n[Me.expando] = void 0)
                }
        }
    }),
    ae.fn.extend({
        detach: function(e) {
            return A(this, e, !0)
        },
        remove: function(e) {
            return A(this, e)
        },
        text: function(e) {
            return Se(this, function(e) {
                return void 0 === e ? ae.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return M(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    T(this, e).appendChild(e)
                }
            })
        },
        prepend: function() {
            return M(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = T(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return M(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return M(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (ae.cleanData(m(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return ae.clone(this, e, t)
            })
        },
        html: function(e) {
            return Se(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !ze.test(e) && !je[(Fe.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = ae.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (ae.cleanData(m(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return M(this, arguments, function(t) {
                var n = this.parentNode;
                ae.inArray(this, e) < 0 && (ae.cleanData(m(this)),
                n && n.replaceChild(t, this))
            }, e)
        }
    }),
    ae.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        ae.fn[e] = function(e) {
            for (var n, r = [], i = ae(e), o = i.length - 1, s = 0; s <= o; s++)
                n = s === o ? this : this.clone(!0),
                ae(i[s])[t](n),
                Q.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var Ze = /^margin/
      , Je = new RegExp("^(" + Ce + ")(?!px)[a-z%]+$","i")
      , Qe = function(t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e),
        n.getComputedStyle(t)
    };
    !function() {
        function t() {
            if (a) {
                a.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",
                a.innerHTML = "",
                Xe.appendChild(s);
                var t = e.getComputedStyle(a);
                n = "1%" !== t.top,
                o = "2px" === t.marginLeft,
                r = "4px" === t.width,
                a.style.marginRight = "50%",
                i = "4px" === t.marginRight,
                Xe.removeChild(s),
                a = null
            }
        }
        var n, r, i, o, s = $.createElement("div"), a = $.createElement("div");
        a.style && (a.style.backgroundClip = "content-box",
        a.cloneNode(!0).style.backgroundClip = "",
        se.clearCloneStyle = "content-box" === a.style.backgroundClip,
        s.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",
        s.appendChild(a),
        ae.extend(se, {
            pixelPosition: function() {
                return t(),
                n
            },
            boxSizingReliable: function() {
                return t(),
                r
            },
            pixelMarginRight: function() {
                return t(),
                i
            },
            reliableMarginLeft: function() {
                return t(),
                o
            }
        }))
    }();
    var et = /^(none|table(?!-c[ea]).+)/
      , tt = /^--/
      , nt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , rt = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , it = ["Webkit", "Moz", "ms"]
      , ot = $.createElement("div").style;
    ae.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = O(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: "cssFloat"
        },
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, s, a = ae.camelCase(t), l = tt.test(t), u = e.style;
                if (l || (t = R(a)),
                s = ae.cssHooks[t] || ae.cssHooks[a],
                void 0 === n)
                    return s && "get"in s && void 0 !== (i = s.get(e, !1, r)) ? i : u[t];
                "string" == (o = typeof n) && (i = Re.exec(n)) && i[1] && (n = p(e, t, i),
                o = "number"),
                null != n && n == n && ("number" === o && (n += i && i[3] || (ae.cssNumber[a] ? "" : "px")),
                se.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"),
                s && "set"in s && void 0 === (n = s.set(e, n, r)) || (l ? u.setProperty(t, n) : u[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, o, s, a = ae.camelCase(t);
            return tt.test(t) || (t = R(a)),
            (s = ae.cssHooks[t] || ae.cssHooks[a]) && "get"in s && (i = s.get(e, !0, n)),
            void 0 === i && (i = O(e, t, r)),
            "normal" === i && t in rt && (i = rt[t]),
            "" === n || n ? (o = parseFloat(i),
            !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }),
    ae.each(["height", "width"], function(e, t) {
        ae.cssHooks[t] = {
            get: function(e, n, r) {
                if (n)
                    return !et.test(ae.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? L(e, t, r) : Le(e, nt, function() {
                        return L(e, t, r)
                    })
            },
            set: function(e, n, r) {
                var i, o = r && Qe(e), s = r && k(e, t, r, "border-box" === ae.css(e, "boxSizing", !1, o), o);
                return s && (i = Re.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n,
                n = ae.css(e, t)),
                D(0, n, s)
            }
        }
    }),
    ae.cssHooks.marginLeft = C(se.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(O(e, "marginLeft")) || e.getBoundingClientRect().left - Le(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    ae.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        ae.cssHooks[e + t] = {
            expand: function(n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++)
                    i[e + De[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        },
        Ze.test(e) || (ae.cssHooks[e + t].set = D)
    }),
    ae.fn.extend({
        css: function(e, t) {
            return Se(this, function(e, t, n) {
                var r, i, o = {}, s = 0;
                if (Array.isArray(t)) {
                    for (r = Qe(e),
                    i = t.length; s < i; s++)
                        o[t[s]] = ae.css(e, t[s], !1, r);
                    return o
                }
                return void 0 !== n ? ae.style(e, t, n) : ae.css(e, t)
            }, e, t, arguments.length > 1)
        }
    }),
    ae.Tween = N,
    (N.prototype = {
        constructor: N,
        init: function(e, t, n, r, i, o) {
            this.elem = e,
            this.prop = n,
            this.easing = i || ae.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = o || (ae.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = N.propHooks[this.prop];
            return e && e.get ? e.get(this) : N.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = N.propHooks[this.prop];
            return this.options.duration ? this.pos = t = ae.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : N.propHooks._default.set(this),
            this
        }
    }).init.prototype = N.prototype,
    (N.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = ae.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                ae.fx.step[e.prop] ? ae.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[ae.cssProps[e.prop]] && !ae.cssHooks[e.prop] ? e.elem[e.prop] = e.now : ae.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = N.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    ae.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    ae.fx = N.prototype.init,
    ae.fx.step = {};
    var st, at, lt = /^(?:toggle|show|hide)$/, ut = /queueHooks$/;
    ae.Animation = ae.extend(G, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return p(n.elem, e, Re.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            ae.isFunction(e) ? (t = e,
            e = ["*"]) : e = e.match(we);
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r],
                G.tweeners[n] = G.tweeners[n] || [],
                G.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r, i, o, s, a, l, u, c, h = "width"in t || "height"in t, d = this, p = {}, f = e.style, m = e.nodeType && ke(e), v = Pe.get(e, "fxshow");
            n.queue || (null == (s = ae._queueHooks(e, "fx")).unqueued && (s.unqueued = 0,
            a = s.empty.fire,
            s.empty.fire = function() {
                s.unqueued || a()
            }
            ),
            s.unqueued++,
            d.always(function() {
                d.always(function() {
                    s.unqueued--,
                    ae.queue(e, "fx").length || s.empty.fire()
                })
            }));
            for (r in t)
                if (i = t[r],
                lt.test(i)) {
                    if (delete t[r],
                    o = o || "toggle" === i,
                    i === (m ? "hide" : "show")) {
                        if ("show" !== i || !v || void 0 === v[r])
                            continue;
                        m = !0
                    }
                    p[r] = v && v[r] || ae.style(e, r)
                }
            if ((l = !ae.isEmptyObject(t)) || !ae.isEmptyObject(p)) {
                h && 1 === e.nodeType && (n.overflow = [f.overflow, f.overflowX, f.overflowY],
                null == (u = v && v.display) && (u = Pe.get(e, "display")),
                "none" === (c = ae.css(e, "display")) && (u ? c = u : (g([e], !0),
                u = e.style.display || u,
                c = ae.css(e, "display"),
                g([e]))),
                ("inline" === c || "inline-block" === c && null != u) && "none" === ae.css(e, "float") && (l || (d.done(function() {
                    f.display = u
                }),
                null == u && (c = f.display,
                u = "none" === c ? "" : c)),
                f.display = "inline-block")),
                n.overflow && (f.overflow = "hidden",
                d.always(function() {
                    f.overflow = n.overflow[0],
                    f.overflowX = n.overflow[1],
                    f.overflowY = n.overflow[2]
                })),
                l = !1;
                for (r in p)
                    l || (v ? "hidden"in v && (m = v.hidden) : v = Pe.access(e, "fxshow", {
                        display: u
                    }),
                    o && (v.hidden = !m),
                    m && g([e], !0),
                    d.done(function() {
                        m || g([e]),
                        Pe.remove(e, "fxshow");
                        for (r in p)
                            ae.style(e, r, p[r])
                    })),
                    l = j(m ? v[r] : 0, r, d),
                    r in v || (v[r] = l.start,
                    m && (l.end = l.start,
                    l.start = 0))
            }
        }
        ],
        prefilter: function(e, t) {
            t ? G.prefilters.unshift(e) : G.prefilters.push(e)
        }
    }),
    ae.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? ae.extend({}, e) : {
            complete: n || !n && t || ae.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !ae.isFunction(t) && t
        };
        return ae.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in ae.fx.speeds ? r.duration = ae.fx.speeds[r.duration] : r.duration = ae.fx.speeds._default),
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            ae.isFunction(r.old) && r.old.call(this),
            r.queue && ae.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    ae.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(ke).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = ae.isEmptyObject(e)
              , o = ae.speed(t, n, r)
              , s = function() {
                var t = G(this, ae.extend({}, e), o);
                (i || Pe.get(this, "finish")) && t.stop(!0)
            };
            return s.finish = s,
            i || !1 === o.queue ? this.each(s) : this.queue(o.queue, s)
        },
        stop: function(e, t, n) {
            var r = function(e) {
                var t = e.stop;
                delete e.stop,
                t(n)
            };
            return "string" != typeof e && (n = t,
            t = e,
            e = void 0),
            t && !1 !== e && this.queue(e || "fx", []),
            this.each(function() {
                var t = !0
                  , i = null != e && e + "queueHooks"
                  , o = ae.timers
                  , s = Pe.get(this);
                if (i)
                    s[i] && s[i].stop && r(s[i]);
                else
                    for (i in s)
                        s[i] && s[i].stop && ut.test(i) && r(s[i]);
                for (i = o.length; i--; )
                    o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n),
                    t = !1,
                    o.splice(i, 1));
                !t && n || ae.dequeue(this, e)
            })
        },
        finish: function(e) {
            return !1 !== e && (e = e || "fx"),
            this.each(function() {
                var t, n = Pe.get(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = ae.timers, s = r ? r.length : 0;
                for (n.finish = !0,
                ae.queue(this, e, []),
                i && i.stop && i.stop.call(this, !0),
                t = o.length; t--; )
                    o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0),
                    o.splice(t, 1));
                for (t = 0; t < s; t++)
                    r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }),
    ae.each(["toggle", "show", "hide"], function(e, t) {
        var n = ae.fn[t];
        ae.fn[t] = function(e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(B(t, !0), e, r, i)
        }
    }),
    ae.each({
        slideDown: B("show"),
        slideUp: B("hide"),
        slideToggle: B("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        ae.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }),
    ae.timers = [],
    ae.fx.tick = function() {
        var e, t = 0, n = ae.timers;
        for (st = ae.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || ae.fx.stop(),
        st = void 0
    }
    ,
    ae.fx.timer = function(e) {
        ae.timers.push(e),
        ae.fx.start()
    }
    ,
    ae.fx.interval = 13,
    ae.fx.start = function() {
        at || (at = !0,
        U())
    }
    ,
    ae.fx.stop = function() {
        at = null
    }
    ,
    ae.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    ae.fn.delay = function(t, n) {
        return t = ae.fx ? ae.fx.speeds[t] || t : t,
        n = n || "fx",
        this.queue(n, function(n, r) {
            var i = e.setTimeout(n, t);
            r.stop = function() {
                e.clearTimeout(i)
            }
        })
    }
    ,
    function() {
        var e = $.createElement("input")
          , t = $.createElement("select").appendChild($.createElement("option"));
        e.type = "checkbox",
        se.checkOn = "" !== e.value,
        se.optSelected = t.selected,
        (e = $.createElement("input")).value = "t",
        e.type = "radio",
        se.radioValue = "t" === e.value
    }();
    var ct, ht = ae.expr.attrHandle;
    ae.fn.extend({
        attr: function(e, t) {
            return Se(this, ae.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                ae.removeAttr(this, e)
            })
        }
    }),
    ae.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return void 0 === e.getAttribute ? ae.prop(e, t, n) : (1 === o && ae.isXMLDoc(e) || (i = ae.attrHooks[t.toLowerCase()] || (ae.expr.match.bool.test(t) ? ct : void 0)),
                void 0 !== n ? null === n ? void ae.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : null == (r = ae.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!se.radioValue && "radio" === t && i(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0, i = t && t.match(we);
            if (i && 1 === e.nodeType)
                for (; n = i[r++]; )
                    e.removeAttribute(n)
        }
    }),
    ct = {
        set: function(e, t, n) {
            return !1 === t ? ae.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    ae.each(ae.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = ht[t] || ae.find.attr;
        ht[t] = function(e, t, r) {
            var i, o, s = t.toLowerCase();
            return r || (o = ht[s],
            ht[s] = i,
            i = null != n(e, t, r) ? s : null,
            ht[s] = o),
            i
        }
    });
    var dt = /^(?:input|select|textarea|button)$/i
      , pt = /^(?:a|area)$/i;
    ae.fn.extend({
        prop: function(e, t) {
            return Se(this, ae.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[ae.propFix[e] || e]
            })
        }
    }),
    ae.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return 1 === o && ae.isXMLDoc(e) || (t = ae.propFix[t] || t,
                i = ae.propHooks[t]),
                void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = ae.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : dt.test(e.nodeName) || pt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }),
    se.optSelected || (ae.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
    ae.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        ae.propFix[this.toLowerCase()] = this
    }),
    ae.fn.extend({
        addClass: function(e) {
            var t, n, r, i, o, s, a, l = 0;
            if (ae.isFunction(e))
                return this.each(function(t) {
                    ae(this).addClass(e.call(this, t, H(this)))
                });
            if ("string" == typeof e && e)
                for (t = e.match(we) || []; n = this[l++]; )
                    if (i = H(n),
                    r = 1 === n.nodeType && " " + X(i) + " ") {
                        for (s = 0; o = t[s++]; )
                            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (a = X(r)) && n.setAttribute("class", a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, r, i, o, s, a, l = 0;
            if (ae.isFunction(e))
                return this.each(function(t) {
                    ae(this).removeClass(e.call(this, t, H(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ("string" == typeof e && e)
                for (t = e.match(we) || []; n = this[l++]; )
                    if (i = H(n),
                    r = 1 === n.nodeType && " " + X(i) + " ") {
                        for (s = 0; o = t[s++]; )
                            for (; r.indexOf(" " + o + " ") > -1; )
                                r = r.replace(" " + o + " ", " ");
                        i !== (a = X(r)) && n.setAttribute("class", a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : ae.isFunction(e) ? this.each(function(n) {
                ae(this).toggleClass(e.call(this, n, H(this), t), t)
            }) : this.each(function() {
                var t, r, i, o;
                if ("string" === n)
                    for (r = 0,
                    i = ae(this),
                    o = e.match(we) || []; t = o[r++]; )
                        i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                else
                    void 0 !== e && "boolean" !== n || ((t = H(this)) && Pe.set(this, "__className__", t),
                    this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Pe.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            for (t = " " + e + " "; n = this[r++]; )
                if (1 === n.nodeType && (" " + X(H(n)) + " ").indexOf(t) > -1)
                    return !0;
            return !1
        }
    });
    var ft = /\r/g;
    ae.fn.extend({
        val: function(e) {
            var t, n, r, i = this[0];
            if (arguments.length)
                return r = ae.isFunction(e),
                this.each(function(n) {
                    var i;
                    1 === this.nodeType && (null == (i = r ? e.call(this, n, ae(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = ae.map(i, function(e) {
                        return null == e ? "" : e + ""
                    })),
                    (t = ae.valHooks[this.type] || ae.valHooks[this.nodeName.toLowerCase()]) && "set"in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                });
            if (i)
                return (t = ae.valHooks[i.type] || ae.valHooks[i.nodeName.toLowerCase()]) && "get"in t && void 0 !== (n = t.get(i, "value")) ? n : "string" == typeof (n = i.value) ? n.replace(ft, "") : null == n ? "" : n
        }
    }),
    ae.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = ae.find.attr(e, "value");
                    return null != t ? t : X(ae.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, o = e.options, s = e.selectedIndex, a = "select-one" === e.type, l = a ? null : [], u = a ? s + 1 : o.length;
                    for (r = s < 0 ? u : a ? s : 0; r < u; r++)
                        if (((n = o[r]).selected || r === s) && !n.disabled && (!n.parentNode.disabled || !i(n.parentNode, "optgroup"))) {
                            if (t = ae(n).val(),
                            a)
                                return t;
                            l.push(t)
                        }
                    return l
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = ae.makeArray(t), s = i.length; s--; )
                        ((r = i[s]).selected = ae.inArray(ae.valHooks.option.get(r), o) > -1) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    ae.each(["radio", "checkbox"], function() {
        ae.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = ae.inArray(ae(e).val(), t) > -1
            }
        },
        se.checkOn || (ae.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    });
    var gt = /^(?:focusinfocus|focusoutblur)$/;
    ae.extend(ae.event, {
        trigger: function(t, n, r, i) {
            var o, s, a, l, u, c, h, d = [r || $], p = re.call(t, "type") ? t.type : t, f = re.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = a = r = r || $,
            3 !== r.nodeType && 8 !== r.nodeType && !gt.test(p + ae.event.triggered) && (p.indexOf(".") > -1 && (p = (f = p.split(".")).shift(),
            f.sort()),
            u = p.indexOf(":") < 0 && "on" + p,
            t = t[ae.expando] ? t : new ae.Event(p,"object" == typeof t && t),
            t.isTrigger = i ? 2 : 3,
            t.namespace = f.join("."),
            t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            t.result = void 0,
            t.target || (t.target = r),
            n = null == n ? [t] : ae.makeArray(n, [t]),
            h = ae.event.special[p] || {},
            i || !h.trigger || !1 !== h.trigger.apply(r, n))) {
                if (!i && !h.noBubble && !ae.isWindow(r)) {
                    for (l = h.delegateType || p,
                    gt.test(l + p) || (s = s.parentNode); s; s = s.parentNode)
                        d.push(s),
                        a = s;
                    a === (r.ownerDocument || $) && d.push(a.defaultView || a.parentWindow || e)
                }
                for (o = 0; (s = d[o++]) && !t.isPropagationStopped(); )
                    t.type = o > 1 ? l : h.bindType || p,
                    (c = (Pe.get(s, "events") || {})[t.type] && Pe.get(s, "handle")) && c.apply(s, n),
                    (c = u && s[u]) && c.apply && Ie(s) && (t.result = c.apply(s, n),
                    !1 === t.result && t.preventDefault());
                return t.type = p,
                i || t.isDefaultPrevented() || h._default && !1 !== h._default.apply(d.pop(), n) || !Ie(r) || u && ae.isFunction(r[p]) && !ae.isWindow(r) && ((a = r[u]) && (r[u] = null),
                ae.event.triggered = p,
                r[p](),
                ae.event.triggered = void 0,
                a && (r[u] = a)),
                t.result
            }
        },
        simulate: function(e, t, n) {
            var r = ae.extend(new ae.Event, n, {
                type: e,
                isSimulated: !0
            });
            ae.event.trigger(r, null, t)
        }
    }),
    ae.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                ae.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return ae.event.trigger(e, t, n, !0)
        }
    }),
    ae.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
        ae.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }),
    ae.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    se.focusin = "onfocusin"in e,
    se.focusin || ae.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            ae.event.simulate(t, e.target, ae.event.fix(e))
        };
        ae.event.special[t] = {
            setup: function() {
                var r = this.ownerDocument || this
                  , i = Pe.access(r, t);
                i || r.addEventListener(e, n, !0),
                Pe.access(r, t, (i || 0) + 1)
            },
            teardown: function() {
                var r = this.ownerDocument || this
                  , i = Pe.access(r, t) - 1;
                i ? Pe.access(r, t, i) : (r.removeEventListener(e, n, !0),
                Pe.remove(r, t))
            }
        }
    });
    var mt = e.location
      , vt = ae.now()
      , yt = /\?/;
    ae.parseXML = function(t) {
        var n;
        if (!t || "string" != typeof t)
            return null;
        try {
            n = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (e) {
            n = void 0
        }
        return n && !n.getElementsByTagName("parsererror").length || ae.error("Invalid XML: " + t),
        n
    }
    ;
    var bt = /\[\]$/
      , _t = /\r?\n/g
      , xt = /^(?:submit|button|image|reset|file)$/i
      , wt = /^(?:input|select|textarea|keygen)/i;
    ae.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            var n = ae.isFunction(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
        };
        if (Array.isArray(e) || e.jquery && !ae.isPlainObject(e))
            ae.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                Y(n, e[n], t, i);
        return r.join("&")
    }
    ,
    ae.fn.extend({
        serialize: function() {
            return ae.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = ae.prop(this, "elements");
                return e ? ae.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !ae(this).is(":disabled") && wt.test(this.nodeName) && !xt.test(e) && (this.checked || !Ue.test(e))
            }).map(function(e, t) {
                var n = ae(this).val();
                return null == n ? null : Array.isArray(n) ? ae.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(_t, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(_t, "\r\n")
                }
            }).get()
        }
    });
    var Tt = /%20/g
      , Et = /#.*$/
      , St = /([?&])_=[^&]*/
      , It = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Pt = /^(?:GET|HEAD)$/
      , Mt = /^\/\//
      , At = {}
      , Ot = {}
      , Ct = "*/".concat("*")
      , Rt = $.createElement("a");
    Rt.href = mt.href,
    ae.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: mt.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(mt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Ct,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": ae.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? z(z(e, ae.ajaxSettings), t) : z(ae.ajaxSettings, e)
        },
        ajaxPrefilter: W(At),
        ajaxTransport: W(Ot),
        ajax: function(t, n) {
            function r(t, n, r, a) {
                var u, d, p, _, x, w = n;
                c || (c = !0,
                l && e.clearTimeout(l),
                i = void 0,
                s = a || "",
                T.readyState = t > 0 ? 4 : 0,
                u = t >= 200 && t < 300 || 304 === t,
                r && (_ = function(e, t, n) {
                    for (var r, i, o, s, a = e.contents, l = e.dataTypes; "*" === l[0]; )
                        l.shift(),
                        void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in a)
                            if (a[i] && a[i].test(r)) {
                                l.unshift(i);
                                break
                            }
                    if (l[0]in n)
                        o = l[0];
                    else {
                        for (i in n) {
                            if (!l[0] || e.converters[i + " " + l[0]]) {
                                o = i;
                                break
                            }
                            s || (s = i)
                        }
                        o = o || s
                    }
                    if (o)
                        return o !== l[0] && l.unshift(o),
                        n[o]
                }(f, T, r)),
                _ = function(e, t, n, r) {
                    var i, o, s, a, l, u = {}, c = e.dataTypes.slice();
                    if (c[1])
                        for (s in e.converters)
                            u[s.toLowerCase()] = e.converters[s];
                    for (o = c.shift(); o; )
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                        !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        l = o,
                        o = c.shift())
                            if ("*" === o)
                                o = l;
                            else if ("*" !== l && l !== o) {
                                if (!(s = u[l + " " + o] || u["* " + o]))
                                    for (i in u)
                                        if ((a = i.split(" "))[1] === o && (s = u[l + " " + a[0]] || u["* " + a[0]])) {
                                            !0 === s ? s = u[i] : !0 !== u[i] && (o = a[0],
                                            c.unshift(a[1]));
                                            break
                                        }
                                if (!0 !== s)
                                    if (s && e.throws)
                                        t = s(t);
                                    else
                                        try {
                                            t = s(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: s ? e : "No conversion from " + l + " to " + o
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(f, _, T, u),
                u ? (f.ifModified && ((x = T.getResponseHeader("Last-Modified")) && (ae.lastModified[o] = x),
                (x = T.getResponseHeader("etag")) && (ae.etag[o] = x)),
                204 === t || "HEAD" === f.type ? w = "nocontent" : 304 === t ? w = "notmodified" : (w = _.state,
                d = _.data,
                u = !(p = _.error))) : (p = w,
                !t && w || (w = "error",
                t < 0 && (t = 0))),
                T.status = t,
                T.statusText = (n || w) + "",
                u ? v.resolveWith(g, [d, w, T]) : v.rejectWith(g, [T, w, p]),
                T.statusCode(b),
                b = void 0,
                h && m.trigger(u ? "ajaxSuccess" : "ajaxError", [T, f, u ? d : p]),
                y.fireWith(g, [T, w]),
                h && (m.trigger("ajaxComplete", [T, f]),
                --ae.active || ae.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t,
            t = void 0),
            n = n || {};
            var i, o, s, a, l, u, c, h, d, p, f = ae.ajaxSetup({}, n), g = f.context || f, m = f.context && (g.nodeType || g.jquery) ? ae(g) : ae.event, v = ae.Deferred(), y = ae.Callbacks("once memory"), b = f.statusCode || {}, _ = {}, x = {}, w = "canceled", T = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (c) {
                        if (!a)
                            for (a = {}; t = It.exec(s); )
                                a[t[1].toLowerCase()] = t[2];
                        t = a[e.toLowerCase()]
                    }
                    return null == t ? null : t
                },
                getAllResponseHeaders: function() {
                    return c ? s : null
                },
                setRequestHeader: function(e, t) {
                    return null == c && (e = x[e.toLowerCase()] = x[e.toLowerCase()] || e,
                    _[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == c && (f.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (c)
                            T.always(e[T.status]);
                        else
                            for (t in e)
                                b[t] = [b[t], e[t]];
                    return this
                },
                abort: function(e) {
                    var t = e || w;
                    return i && i.abort(t),
                    r(0, t),
                    this
                }
            };
            if (v.promise(T),
            f.url = ((t || f.url || mt.href) + "").replace(Mt, mt.protocol + "//"),
            f.type = n.method || n.type || f.method || f.type,
            f.dataTypes = (f.dataType || "*").toLowerCase().match(we) || [""],
            null == f.crossDomain) {
                u = $.createElement("a");
                try {
                    u.href = f.url,
                    u.href = u.href,
                    f.crossDomain = Rt.protocol + "//" + Rt.host != u.protocol + "//" + u.host
                } catch (e) {
                    f.crossDomain = !0
                }
            }
            if (f.data && f.processData && "string" != typeof f.data && (f.data = ae.param(f.data, f.traditional)),
            V(At, f, n, T),
            c)
                return T;
            (h = ae.event && f.global) && 0 == ae.active++ && ae.event.trigger("ajaxStart"),
            f.type = f.type.toUpperCase(),
            f.hasContent = !Pt.test(f.type),
            o = f.url.replace(Et, ""),
            f.hasContent ? f.data && f.processData && 0 === (f.contentType || "").indexOf("application/x-www-form-urlencoded") && (f.data = f.data.replace(Tt, "+")) : (p = f.url.slice(o.length),
            f.data && (o += (yt.test(o) ? "&" : "?") + f.data,
            delete f.data),
            !1 === f.cache && (o = o.replace(St, "$1"),
            p = (yt.test(o) ? "&" : "?") + "_=" + vt++ + p),
            f.url = o + p),
            f.ifModified && (ae.lastModified[o] && T.setRequestHeader("If-Modified-Since", ae.lastModified[o]),
            ae.etag[o] && T.setRequestHeader("If-None-Match", ae.etag[o])),
            (f.data && f.hasContent && !1 !== f.contentType || n.contentType) && T.setRequestHeader("Content-Type", f.contentType),
            T.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + Ct + "; q=0.01" : "") : f.accepts["*"]);
            for (d in f.headers)
                T.setRequestHeader(d, f.headers[d]);
            if (f.beforeSend && (!1 === f.beforeSend.call(g, T, f) || c))
                return T.abort();
            if (w = "abort",
            y.add(f.complete),
            T.done(f.success),
            T.fail(f.error),
            i = V(Ot, f, n, T)) {
                if (T.readyState = 1,
                h && m.trigger("ajaxSend", [T, f]),
                c)
                    return T;
                f.async && f.timeout > 0 && (l = e.setTimeout(function() {
                    T.abort("timeout")
                }, f.timeout));
                try {
                    c = !1,
                    i.send(_, r)
                } catch (e) {
                    if (c)
                        throw e;
                    r(-1, e)
                }
            } else
                r(-1, "No Transport");
            return T
        },
        getJSON: function(e, t, n) {
            return ae.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return ae.get(e, void 0, t, "script")
        }
    }),
    ae.each(["get", "post"], function(e, t) {
        ae[t] = function(e, n, r, i) {
            return ae.isFunction(n) && (i = i || r,
            r = n,
            n = void 0),
            ae.ajax(ae.extend({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            }, ae.isPlainObject(e) && e))
        }
    }),
    ae._evalUrl = function(e) {
        return ae.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            throws: !0
        })
    }
    ,
    ae.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (ae.isFunction(e) && (e = e.call(this[0])),
            t = ae(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(e) {
            return ae.isFunction(e) ? this.each(function(t) {
                ae(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = ae(this)
                  , n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = ae.isFunction(e);
            return this.each(function(n) {
                ae(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                ae(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    ae.expr.pseudos.hidden = function(e) {
        return !ae.expr.pseudos.visible(e)
    }
    ,
    ae.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    ae.ajaxSettings.xhr = function() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var Dt = {
        0: 200,
        1223: 204
    }
      , kt = ae.ajaxSettings.xhr();
    se.cors = !!kt && "withCredentials"in kt,
    se.ajax = kt = !!kt,
    ae.ajaxTransport(function(t) {
        var n, r;
        if (se.cors || kt && !t.crossDomain)
            return {
                send: function(i, o) {
                    var s, a = t.xhr();
                    if (a.open(t.type, t.url, t.async, t.username, t.password),
                    t.xhrFields)
                        for (s in t.xhrFields)
                            a[s] = t.xhrFields[s];
                    t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType),
                    t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                    for (s in i)
                        a.setRequestHeader(s, i[s]);
                    n = function(e) {
                        return function() {
                            n && (n = r = a.onload = a.onerror = a.onabort = a.onreadystatechange = null,
                            "abort" === e ? a.abort() : "error" === e ? "number" != typeof a.status ? o(0, "error") : o(a.status, a.statusText) : o(Dt[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                                binary: a.response
                            } : {
                                text: a.responseText
                            }, a.getAllResponseHeaders()))
                        }
                    }
                    ,
                    a.onload = n(),
                    r = a.onerror = n("error"),
                    void 0 !== a.onabort ? a.onabort = r : a.onreadystatechange = function() {
                        4 === a.readyState && e.setTimeout(function() {
                            n && r()
                        })
                    }
                    ,
                    n = n("abort");
                    try {
                        a.send(t.hasContent && t.data || null)
                    } catch (e) {
                        if (n)
                            throw e
                    }
                },
                abort: function() {
                    n && n()
                }
            }
    }),
    ae.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    ae.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return ae.globalEval(e),
                e
            }
        }
    }),
    ae.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    ae.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n;
            return {
                send: function(r, i) {
                    t = ae("<script>").prop({
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", n = function(e) {
                        t.remove(),
                        n = null,
                        e && i("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    $.head.appendChild(t[0])
                },
                abort: function() {
                    n && n()
                }
            }
        }
    });
    var Lt = []
      , Nt = /(=)\?(?=&|$)|\?\?/;
    ae.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Lt.pop() || ae.expando + "_" + vt++;
            return this[e] = !0,
            e
        }
    }),
    ae.ajaxPrefilter("json jsonp", function(t, n, r) {
        var i, o, s, a = !1 !== t.jsonp && (Nt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Nt.test(t.data) && "data");
        if (a || "jsonp" === t.dataTypes[0])
            return i = t.jsonpCallback = ae.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
            a ? t[a] = t[a].replace(Nt, "$1" + i) : !1 !== t.jsonp && (t.url += (yt.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
            t.converters["script json"] = function() {
                return s || ae.error(i + " was not called"),
                s[0]
            }
            ,
            t.dataTypes[0] = "json",
            o = e[i],
            e[i] = function() {
                s = arguments
            }
            ,
            r.always(function() {
                void 0 === o ? ae(e).removeProp(i) : e[i] = o,
                t[i] && (t.jsonpCallback = n.jsonpCallback,
                Lt.push(i)),
                s && ae.isFunction(o) && o(s[0]),
                s = o = void 0
            }),
            "script"
    }),
    se.createHTMLDocument = function() {
        var e = $.implementation.createHTMLDocument("").body;
        return e.innerHTML = "<form></form><form></form>",
        2 === e.childNodes.length
    }(),
    ae.parseHTML = function(e, t, n) {
        if ("string" != typeof e)
            return [];
        "boolean" == typeof t && (n = t,
        t = !1);
        var r, i, o;
        return t || (se.createHTMLDocument ? ((r = (t = $.implementation.createHTMLDocument("")).createElement("base")).href = $.location.href,
        t.head.appendChild(r)) : t = $),
        i = me.exec(e),
        o = !n && [],
        i ? [t.createElement(i[1])] : (i = y([e], t, o),
        o && o.length && ae(o).remove(),
        ae.merge([], i.childNodes))
    }
    ,
    ae.fn.load = function(e, t, n) {
        var r, i, o, s = this, a = e.indexOf(" ");
        return a > -1 && (r = X(e.slice(a)),
        e = e.slice(0, a)),
        ae.isFunction(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (i = "POST"),
        s.length > 0 && ae.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            s.html(r ? ae("<div>").append(ae.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            s.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    ae.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        ae.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    ae.expr.pseudos.animated = function(e) {
        return ae.grep(ae.timers, function(t) {
            return e === t.elem
        }).length
    }
    ,
    ae.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, s, a, l, u = ae.css(e, "position"), c = ae(e), h = {};
            "static" === u && (e.style.position = "relative"),
            a = c.offset(),
            o = ae.css(e, "top"),
            l = ae.css(e, "left"),
            ("absolute" === u || "fixed" === u) && (o + l).indexOf("auto") > -1 ? (s = (r = c.position()).top,
            i = r.left) : (s = parseFloat(o) || 0,
            i = parseFloat(l) || 0),
            ae.isFunction(t) && (t = t.call(e, n, ae.extend({}, a))),
            null != t.top && (h.top = t.top - a.top + s),
            null != t.left && (h.left = t.left - a.left + i),
            "using"in t ? t.using.call(e, h) : c.css(h)
        }
    },
    ae.fn.extend({
        offset: function(e) {
            if (arguments.length)
                return void 0 === e ? this : this.each(function(t) {
                    ae.offset.setOffset(this, e, t)
                });
            var t, n, r, i, o = this[0];
            if (o)
                return o.getClientRects().length ? (r = o.getBoundingClientRect(),
                t = o.ownerDocument,
                n = t.documentElement,
                i = t.defaultView,
                {
                    top: r.top + i.pageYOffset - n.clientTop,
                    left: r.left + i.pageXOffset - n.clientLeft
                }) : {
                    top: 0,
                    left: 0
                }
        },
        position: function() {
            if (this[0]) {
                var e, t, n = this[0], r = {
                    top: 0,
                    left: 0
                };
                return "fixed" === ae.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(),
                t = this.offset(),
                i(e[0], "html") || (r = e.offset()),
                r = {
                    top: r.top + ae.css(e[0], "borderTopWidth", !0),
                    left: r.left + ae.css(e[0], "borderLeftWidth", !0)
                }),
                {
                    top: t.top - r.top - ae.css(n, "marginTop", !0),
                    left: t.left - r.left - ae.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === ae.css(e, "position"); )
                    e = e.offsetParent;
                return e || Xe
            })
        }
    }),
    ae.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = "pageYOffset" === t;
        ae.fn[e] = function(r) {
            return Se(this, function(e, r, i) {
                var o;
                if (ae.isWindow(e) ? o = e : 9 === e.nodeType && (o = e.defaultView),
                void 0 === i)
                    return o ? o[t] : e[r];
                o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i
            }, e, r, arguments.length)
        }
    }),
    ae.each(["top", "left"], function(e, t) {
        ae.cssHooks[t] = C(se.pixelPosition, function(e, n) {
            if (n)
                return n = O(e, t),
                Je.test(n) ? ae(e).position()[t] + "px" : n
        })
    }),
    ae.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        ae.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, r) {
            ae.fn[r] = function(i, o) {
                var s = arguments.length && (n || "boolean" != typeof i)
                  , a = n || (!0 === i || !0 === o ? "margin" : "border");
                return Se(this, function(t, n, i) {
                    var o;
                    return ae.isWindow(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement,
                    Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? ae.css(t, n, a) : ae.style(t, n, i, a)
                }, t, s ? i : void 0, s)
            }
        })
    }),
    ae.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }),
    ae.holdReady = function(e) {
        e ? ae.readyWait++ : ae.ready(!0)
    }
    ,
    ae.isArray = Array.isArray,
    ae.parseJSON = JSON.parse,
    ae.nodeName = i,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return ae
    });
    var Ut = e.jQuery
      , Ft = e.$;
    return ae.noConflict = function(t) {
        return e.$ === ae && (e.$ = Ft),
        t && e.jQuery === ae && (e.jQuery = Ut),
        ae
    }
    ,
    t || (e.jQuery = e.$ = ae),
    ae
})
