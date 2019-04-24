"use strict";
!function e(t, n, r) {
    function i(s, a) {
        if (!n[s]) {
            if (!t[s]) {
                var l = "function" == typeof require && require;
                if (!a && l)
                    return l(s, !0);
                if (o)
                    return o(s, !0);
                var u = new Error("Cannot find module '" + s + "'");
                throw u.code = "MODULE_NOT_FOUND",
                u
            }
            var c = n[s] = {
                exports: {}
            };
            t[s][0].call(c.exports, function(e) {
                var n = t[s][1][e];
                return i(n || e)
            }, c, c.exports, e, t, n, r)
        }
        return n[s].exports
    }
    for (var o = "function" == typeof require && require, s = 0; s < r.length; s++)
        i(r[s]);
    return i
}({
    1: [function(e, t, n) {
        function r(e) {
            e.fn.perfectScrollbar = function(e) {
                return this.each(function() {
                    if ("object" == typeof e || void 0 === e) {
                        var t = e;
                        o.get(this) || i.initialize(this, t)
                    } else {
                        var n = e;
                        "update" === n ? i.update(this) : "destroy" === n && i.destroy(this)
                    }
                })
            }
        }
        var i = e("../main")
          , o = e("../plugin/instances");
        if ("function" == typeof define && define.amd)
            define(["jquery"], r);
        else {
            var s = window.jQuery ? window.jQuery : window.$;
            void 0 !== s && r(s)
        }
        t.exports = r
    }
    , {
        "../main": 6,
        "../plugin/instances": 17
    }],
    2: [function(e, t, n) {
        var r = {};
        r.create = function(e, t) {
            var n = document.createElement(e);
            return n.className = t,
            n
        }
        ,
        r.appendTo = function(e, t) {
            return t.appendChild(e),
            e
        }
        ,
        r.css = function(e, t, n) {
            return "object" == typeof t ? function(e, t) {
                for (var n in t) {
                    var r = t[n];
                    "number" == typeof r && (r = r.toString() + "px"),
                    e.style[n] = r
                }
                return e
            }(e, t) : void 0 === n ? function(e, t) {
                return window.getComputedStyle(e)[t]
            }(e, t) : function(e, t, n) {
                return "number" == typeof n && (n = n.toString() + "px"),
                e.style[t] = n,
                e
            }(e, t, n)
        }
        ,
        r.matches = function(e, t) {
            return void 0 !== e.matches ? e.matches(t) : e.msMatchesSelector(t)
        }
        ,
        r.remove = function(e) {
            void 0 !== e.remove ? e.remove() : e.parentNode && e.parentNode.removeChild(e)
        }
        ,
        r.queryChildren = function(e, t) {
            return Array.prototype.filter.call(e.childNodes, function(e) {
                return r.matches(e, t)
            })
        }
        ,
        t.exports = r
    }
    , {}],
    3: [function(e, t, n) {
        var r = function(e) {
            this.element = e,
            this.events = {}
        };
        r.prototype.bind = function(e, t) {
            void 0 === this.events[e] && (this.events[e] = []),
            this.events[e].push(t),
            this.element.addEventListener(e, t, !1)
        }
        ,
        r.prototype.unbind = function(e, t) {
            var n = void 0 !== t;
            this.events[e] = this.events[e].filter(function(r) {
                return !(!n || r === t) || (this.element.removeEventListener(e, r, !1),
                !1)
            }, this)
        }
        ,
        r.prototype.unbindAll = function() {
            for (var e in this.events)
                this.unbind(e)
        }
        ;
        var i = function() {
            this.eventElements = []
        };
        i.prototype.eventElement = function(e) {
            var t = this.eventElements.filter(function(t) {
                return t.element === e
            })[0];
            return void 0 === t && (t = new r(e),
            this.eventElements.push(t)),
            t
        }
        ,
        i.prototype.bind = function(e, t, n) {
            this.eventElement(e).bind(t, n)
        }
        ,
        i.prototype.unbind = function(e, t, n) {
            this.eventElement(e).unbind(t, n)
        }
        ,
        i.prototype.unbindAll = function() {
            for (var e = 0; e < this.eventElements.length; e++)
                this.eventElements[e].unbindAll()
        }
        ,
        i.prototype.once = function(e, t, n) {
            var r = this.eventElement(e)
              , i = function(e) {
                r.unbind(t, i),
                n(e)
            };
            r.bind(t, i)
        }
        ,
        t.exports = i
    }
    , {}],
    4: [function(e, t, n) {
        t.exports = function() {
            function e() {
                return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
            }
            return function() {
                return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
            }
        }()
    }
    , {}],
    5: [function(e, t, n) {
        function r(e) {
            var t;
            return t = void 0 === e ? ["ps--x", "ps--y"] : ["ps--" + e],
            ["ps--in-scrolling"].concat(t)
        }
        var i = e("./dom")
          , o = n.toInt = function(e) {
            return parseInt(e, 10) || 0
        }
        ;
        n.isEditable = function(e) {
            return i.matches(e, "input,[contenteditable]") || i.matches(e, "select,[contenteditable]") || i.matches(e, "textarea,[contenteditable]") || i.matches(e, "button,[contenteditable]")
        }
        ,
        n.removePsClasses = function(e) {
            for (var t = 0; t < e.classList.length; t++) {
                var n = e.classList[t];
                0 === n.indexOf("ps-") && e.classList.remove(n)
            }
        }
        ,
        n.outerWidth = function(e) {
            return o(i.css(e, "width")) + o(i.css(e, "paddingLeft")) + o(i.css(e, "paddingRight")) + o(i.css(e, "borderLeftWidth")) + o(i.css(e, "borderRightWidth"))
        }
        ,
        n.startScrolling = function(e, t) {
            for (var n = r(t), i = 0; i < n.length; i++)
                e.classList.add(n[i])
        }
        ,
        n.stopScrolling = function(e, t) {
            for (var n = r(t), i = 0; i < n.length; i++)
                e.classList.remove(n[i])
        }
        ,
        n.env = {
            isWebKit: "undefined" != typeof document && "WebkitAppearance"in document.documentElement.style,
            supportsTouch: "undefined" != typeof window && ("ontouchstart"in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            supportsIePointer: "undefined" != typeof window && null !== window.navigator.msMaxTouchPoints
        }
    }
    , {
        "./dom": 2
    }],
    6: [function(e, t, n) {
        var r = e("./plugin/destroy")
          , i = e("./plugin/initialize")
          , o = e("./plugin/update");
        t.exports = {
            initialize: i,
            update: o,
            destroy: r
        }
    }
    , {
        "./plugin/destroy": 8,
        "./plugin/initialize": 16,
        "./plugin/update": 20
    }],
    7: [function(e, t, n) {
        t.exports = function() {
            return {
                handlers: ["click-rail", "drag-scrollbar", "keyboard", "wheel", "touch"],
                maxScrollbarLength: null,
                minScrollbarLength: null,
                scrollXMarginOffset: 0,
                scrollYMarginOffset: 0,
                suppressScrollX: !1,
                suppressScrollY: !1,
                swipePropagation: !0,
                swipeEasing: !0,
                useBothWheelAxes: !1,
                wheelPropagation: !1,
                wheelSpeed: 1,
                theme: "default"
            }
        }
    }
    , {}],
    8: [function(e, t, n) {
        var r = e("../lib/helper")
          , i = e("../lib/dom")
          , o = e("./instances");
        t.exports = function(e) {
            var t = o.get(e);
            t && (t.event.unbindAll(),
            i.remove(t.scrollbarX),
            i.remove(t.scrollbarY),
            i.remove(t.scrollbarXRail),
            i.remove(t.scrollbarYRail),
            r.removePsClasses(e),
            o.remove(e))
        }
    }
    , {
        "../lib/dom": 2,
        "../lib/helper": 5,
        "./instances": 17
    }],
    9: [function(e, t, n) {
        var r = e("../instances")
          , i = e("../update-geometry")
          , o = e("../update-scroll");
        t.exports = function(e) {
            !function(e, t) {
                function n(e) {
                    return e.getBoundingClientRect()
                }
                var r = function(e) {
                    e.stopPropagation()
                };
                t.event.bind(t.scrollbarY, "click", r),
                t.event.bind(t.scrollbarYRail, "click", function(r) {
                    var s = r.pageY - window.pageYOffset - n(t.scrollbarYRail).top > t.scrollbarYTop ? 1 : -1;
                    o(e, "top", e.scrollTop + s * t.containerHeight),
                    i(e),
                    r.stopPropagation()
                }),
                t.event.bind(t.scrollbarX, "click", r),
                t.event.bind(t.scrollbarXRail, "click", function(r) {
                    var s = r.pageX - window.pageXOffset - n(t.scrollbarXRail).left > t.scrollbarXLeft ? 1 : -1;
                    o(e, "left", e.scrollLeft + s * t.containerWidth),
                    i(e),
                    r.stopPropagation()
                })
            }(e, r.get(e))
        }
    }
    , {
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    10: [function(e, t, n) {
        function r(e, t) {
            var n = null
              , r = null
              , i = function(i) {
                !function(r) {
                    var i = n + r * t.railXRatio
                      , s = Math.max(0, t.scrollbarXRail.getBoundingClientRect().left) + t.railXRatio * (t.railXWidth - t.scrollbarXWidth);
                    t.scrollbarXLeft = i < 0 ? 0 : i > s ? s : i;
                    var a = o.toInt(t.scrollbarXLeft * (t.contentWidth - t.containerWidth) / (t.containerWidth - t.railXRatio * t.scrollbarXWidth)) - t.negativeScrollAdjustment;
                    u(e, "left", a)
                }(i.pageX - r),
                l(e),
                i.stopPropagation(),
                i.preventDefault()
            }
              , a = function() {
                o.stopScrolling(e, "x"),
                t.event.unbind(t.ownerDocument, "mousemove", i)
            };
            t.event.bind(t.scrollbarX, "mousedown", function(l) {
                r = l.pageX,
                n = o.toInt(s.css(t.scrollbarX, "left")) * t.railXRatio,
                o.startScrolling(e, "x"),
                t.event.bind(t.ownerDocument, "mousemove", i),
                t.event.once(t.ownerDocument, "mouseup", a),
                l.stopPropagation(),
                l.preventDefault()
            })
        }
        function i(e, t) {
            var n = null
              , r = null
              , i = function(i) {
                !function(r) {
                    var i = n + r * t.railYRatio
                      , s = Math.max(0, t.scrollbarYRail.getBoundingClientRect().top) + t.railYRatio * (t.railYHeight - t.scrollbarYHeight);
                    t.scrollbarYTop = i < 0 ? 0 : i > s ? s : i;
                    var a = o.toInt(t.scrollbarYTop * (t.contentHeight - t.containerHeight) / (t.containerHeight - t.railYRatio * t.scrollbarYHeight));
                    u(e, "top", a)
                }(i.pageY - r),
                l(e),
                i.stopPropagation(),
                i.preventDefault()
            }
              , a = function() {
                o.stopScrolling(e, "y"),
                t.event.unbind(t.ownerDocument, "mousemove", i)
            };
            t.event.bind(t.scrollbarY, "mousedown", function(l) {
                r = l.pageY,
                n = o.toInt(s.css(t.scrollbarY, "top")) * t.railYRatio,
                o.startScrolling(e, "y"),
                t.event.bind(t.ownerDocument, "mousemove", i),
                t.event.once(t.ownerDocument, "mouseup", a),
                l.stopPropagation(),
                l.preventDefault()
            })
        }
        var o = e("../../lib/helper")
          , s = e("../../lib/dom")
          , a = e("../instances")
          , l = e("../update-geometry")
          , u = e("../update-scroll");
        t.exports = function(e) {
            var t = a.get(e);
            r(e, t),
            i(e, t)
        }
    }
    , {
        "../../lib/dom": 2,
        "../../lib/helper": 5,
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    11: [function(e, t, n) {
        function r(e, t) {
            var n = !1;
            t.event.bind(e, "mouseenter", function() {
                n = !0
            }),
            t.event.bind(e, "mouseleave", function() {
                n = !1
            });
            var r = !1;
            t.event.bind(t.ownerDocument, "keydown", function(s) {
                if (!(s.isDefaultPrevented && s.isDefaultPrevented() || s.defaultPrevented)) {
                    var u = o.matches(t.scrollbarX, ":focus") || o.matches(t.scrollbarY, ":focus");
                    if (n || u) {
                        var c = document.activeElement ? document.activeElement : t.ownerDocument.activeElement;
                        if (c) {
                            if ("IFRAME" === c.tagName)
                                c = c.contentDocument.activeElement;
                            else
                                for (; c.shadowRoot; )
                                    c = c.shadowRoot.activeElement;
                            if (i.isEditable(c))
                                return
                        }
                        var h = 0
                          , d = 0;
                        switch (s.which) {
                        case 37:
                            h = s.metaKey ? -t.contentWidth : s.altKey ? -t.containerWidth : -30;
                            break;
                        case 38:
                            d = s.metaKey ? t.contentHeight : s.altKey ? t.containerHeight : 30;
                            break;
                        case 39:
                            h = s.metaKey ? t.contentWidth : s.altKey ? t.containerWidth : 30;
                            break;
                        case 40:
                            d = s.metaKey ? -t.contentHeight : s.altKey ? -t.containerHeight : -30;
                            break;
                        case 33:
                            d = 90;
                            break;
                        case 32:
                            d = s.shiftKey ? 90 : -90;
                            break;
                        case 34:
                            d = -90;
                            break;
                        case 35:
                            d = s.ctrlKey ? -t.contentHeight : -t.containerHeight;
                            break;
                        case 36:
                            d = s.ctrlKey ? e.scrollTop : t.containerHeight;
                            break;
                        default:
                            return
                        }
                        l(e, "top", e.scrollTop - d),
                        l(e, "left", e.scrollLeft + h),
                        a(e),
                        (r = function(n, r) {
                            var i = e.scrollTop;
                            if (0 === n) {
                                if (!t.scrollbarYActive)
                                    return !1;
                                if (0 === i && r > 0 || i >= t.contentHeight - t.containerHeight && r < 0)
                                    return !t.settings.wheelPropagation
                            }
                            var o = e.scrollLeft;
                            if (0 === r) {
                                if (!t.scrollbarXActive)
                                    return !1;
                                if (0 === o && n < 0 || o >= t.contentWidth - t.containerWidth && n > 0)
                                    return !t.settings.wheelPropagation
                            }
                            return !0
                        }(h, d)) && s.preventDefault()
                    }
                }
            })
        }
        var i = e("../../lib/helper")
          , o = e("../../lib/dom")
          , s = e("../instances")
          , a = e("../update-geometry")
          , l = e("../update-scroll");
        t.exports = function(e) {
            r(e, s.get(e))
        }
    }
    , {
        "../../lib/dom": 2,
        "../../lib/helper": 5,
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    12: [function(e, t, n) {
        function r(e, t) {
            function n(n) {
                var i = function(e) {
                    var t = e.deltaX
                      , n = -1 * e.deltaY;
                    return void 0 !== t && void 0 !== n || (t = -1 * e.wheelDeltaX / 6,
                    n = e.wheelDeltaY / 6),
                    e.deltaMode && 1 === e.deltaMode && (t *= 10,
                    n *= 10),
                    t != t && n != n && (t = 0,
                    n = e.wheelDelta),
                    e.shiftKey ? [-n, -t] : [t, n]
                }(n)
                  , a = i[0]
                  , l = i[1];
                (function(t, n) {
                    var r = e.querySelector("textarea:hover, select[multiple]:hover, .ps-child:hover");
                    if (r) {
                        var i = window.getComputedStyle(r);
                        if (![i.overflow, i.overflowX, i.overflowY].join("").match(/(scroll|auto)/))
                            return !1;
                        var o = r.scrollHeight - r.clientHeight;
                        if (o > 0 && !(0 === r.scrollTop && n > 0 || r.scrollTop === o && n < 0))
                            return !0;
                        var s = r.scrollLeft - r.clientWidth;
                        if (s > 0 && !(0 === r.scrollLeft && t < 0 || r.scrollLeft === s && t > 0))
                            return !0
                    }
                    return !1
                }
                )(a, l) || (r = !1,
                t.settings.useBothWheelAxes ? t.scrollbarYActive && !t.scrollbarXActive ? (l ? s(e, "top", e.scrollTop - l * t.settings.wheelSpeed) : s(e, "top", e.scrollTop + a * t.settings.wheelSpeed),
                r = !0) : t.scrollbarXActive && !t.scrollbarYActive && (a ? s(e, "left", e.scrollLeft + a * t.settings.wheelSpeed) : s(e, "left", e.scrollLeft - l * t.settings.wheelSpeed),
                r = !0) : (s(e, "top", e.scrollTop - l * t.settings.wheelSpeed),
                s(e, "left", e.scrollLeft + a * t.settings.wheelSpeed)),
                o(e),
                (r = r || function(n, r) {
                    var i = e.scrollTop;
                    if (0 === n) {
                        if (!t.scrollbarYActive)
                            return !1;
                        if (0 === i && r > 0 || i >= t.contentHeight - t.containerHeight && r < 0)
                            return !t.settings.wheelPropagation
                    }
                    var o = e.scrollLeft;
                    if (0 === r) {
                        if (!t.scrollbarXActive)
                            return !1;
                        if (0 === o && n < 0 || o >= t.contentWidth - t.containerWidth && n > 0)
                            return !t.settings.wheelPropagation
                    }
                    return !0
                }(a, l)) && (n.stopPropagation(),
                n.preventDefault()))
            }
            var r = !1;
            void 0 !== window.onwheel ? t.event.bind(e, "wheel", n) : void 0 !== window.onmousewheel && t.event.bind(e, "mousewheel", n)
        }
        var i = e("../instances")
          , o = e("../update-geometry")
          , s = e("../update-scroll");
        t.exports = function(e) {
            r(e, i.get(e))
        }
    }
    , {
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    13: [function(e, t, n) {
        var r = e("../instances")
          , i = e("../update-geometry");
        t.exports = function(e) {
            !function(e, t) {
                t.event.bind(e, "scroll", function() {
                    i(e)
                })
            }(e, r.get(e))
        }
    }
    , {
        "../instances": 17,
        "../update-geometry": 18
    }],
    14: [function(e, t, n) {
        function r(e, t) {
            function n() {
                r && (clearInterval(r),
                r = null),
                i.stopScrolling(e)
            }
            var r = null
              , l = {
                top: 0,
                left: 0
            }
              , u = !1;
            t.event.bind(t.ownerDocument, "selectionchange", function() {
                e.contains(function() {
                    var e = window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : "";
                    return 0 === e.toString().length ? null : e.getRangeAt(0).commonAncestorContainer
                }()) ? u = !0 : (u = !1,
                n())
            }),
            t.event.bind(window, "mouseup", function() {
                u && (u = !1,
                n())
            }),
            t.event.bind(window, "keyup", function() {
                u && (u = !1,
                n())
            }),
            t.event.bind(window, "mousemove", function(t) {
                if (u) {
                    var c = {
                        x: t.pageX,
                        y: t.pageY
                    }
                      , h = {
                        left: e.offsetLeft,
                        right: e.offsetLeft + e.offsetWidth,
                        top: e.offsetTop,
                        bottom: e.offsetTop + e.offsetHeight
                    };
                    c.x < h.left + 3 ? (l.left = -5,
                    i.startScrolling(e, "x")) : c.x > h.right - 3 ? (l.left = 5,
                    i.startScrolling(e, "x")) : l.left = 0,
                    c.y < h.top + 3 ? (l.top = h.top + 3 - c.y < 5 ? -5 : -20,
                    i.startScrolling(e, "y")) : c.y > h.bottom - 3 ? (l.top = c.y - h.bottom + 3 < 5 ? 5 : 20,
                    i.startScrolling(e, "y")) : l.top = 0,
                    0 === l.top && 0 === l.left ? n() : r || (r = setInterval(function() {
                        o.get(e) ? (a(e, "top", e.scrollTop + l.top),
                        a(e, "left", e.scrollLeft + l.left),
                        s(e)) : clearInterval(r)
                    }, 50))
                }
            })
        }
        var i = e("../../lib/helper")
          , o = e("../instances")
          , s = e("../update-geometry")
          , a = e("../update-scroll");
        t.exports = function(e) {
            r(e, o.get(e))
        }
    }
    , {
        "../../lib/helper": 5,
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    15: [function(e, t, n) {
        function r(e, t, n, r) {
            function i(t, n) {
                a(e, "top", e.scrollTop - n),
                a(e, "left", e.scrollLeft - t),
                s(e)
            }
            function l() {
                b = !0
            }
            function u() {
                b = !1
            }
            function c(e) {
                return e.targetTouches ? e.targetTouches[0] : e
            }
            function h(e) {
                return (!e.pointerType || "pen" !== e.pointerType || 0 !== e.buttons) && (!(!e.targetTouches || 1 !== e.targetTouches.length) || !(!e.pointerType || "mouse" === e.pointerType || e.pointerType === e.MSPOINTER_TYPE_MOUSE))
            }
            function d(e) {
                if (h(e)) {
                    _ = !0;
                    var t = c(e);
                    g.pageX = t.pageX,
                    g.pageY = t.pageY,
                    m = (new Date).getTime(),
                    null !== y && clearInterval(y),
                    e.stopPropagation()
                }
            }
            function p(n) {
                if (!_ && t.settings.swipePropagation && d(n),
                !b && _ && h(n)) {
                    var r = c(n)
                      , o = {
                        pageX: r.pageX,
                        pageY: r.pageY
                    }
                      , s = o.pageX - g.pageX
                      , a = o.pageY - g.pageY;
                    i(s, a),
                    g = o;
                    var l = (new Date).getTime()
                      , u = l - m;
                    u > 0 && (v.x = s / u,
                    v.y = a / u,
                    m = l),
                    function(n, r) {
                        var i = e.scrollTop
                          , o = e.scrollLeft
                          , s = Math.abs(n)
                          , a = Math.abs(r);
                        if (a > s) {
                            if (r < 0 && i === t.contentHeight - t.containerHeight || r > 0 && 0 === i)
                                return !t.settings.swipePropagation
                        } else if (s > a && (n < 0 && o === t.contentWidth - t.containerWidth || n > 0 && 0 === o))
                            return !t.settings.swipePropagation;
                        return !0
                    }(s, a) && (n.stopPropagation(),
                    n.preventDefault())
                }
            }
            function f() {
                !b && _ && (_ = !1,
                t.settings.swipeEasing && (clearInterval(y),
                y = setInterval(function() {
                    o.get(e) && (v.x || v.y) ? Math.abs(v.x) < .01 && Math.abs(v.y) < .01 ? clearInterval(y) : (i(30 * v.x, 30 * v.y),
                    v.x *= .8,
                    v.y *= .8) : clearInterval(y)
                }, 10)))
            }
            var g = {}
              , m = 0
              , v = {}
              , y = null
              , b = !1
              , _ = !1;
            n ? (t.event.bind(window, "touchstart", l),
            t.event.bind(window, "touchend", u),
            t.event.bind(e, "touchstart", d),
            t.event.bind(e, "touchmove", p),
            t.event.bind(e, "touchend", f)) : r && (window.PointerEvent ? (t.event.bind(window, "pointerdown", l),
            t.event.bind(window, "pointerup", u),
            t.event.bind(e, "pointerdown", d),
            t.event.bind(e, "pointermove", p),
            t.event.bind(e, "pointerup", f)) : window.MSPointerEvent && (t.event.bind(window, "MSPointerDown", l),
            t.event.bind(window, "MSPointerUp", u),
            t.event.bind(e, "MSPointerDown", d),
            t.event.bind(e, "MSPointerMove", p),
            t.event.bind(e, "MSPointerUp", f)))
        }
        var i = e("../../lib/helper")
          , o = e("../instances")
          , s = e("../update-geometry")
          , a = e("../update-scroll");
        t.exports = function(e) {
            if (i.env.supportsTouch || i.env.supportsIePointer) {
                r(e, o.get(e), i.env.supportsTouch, i.env.supportsIePointer)
            }
        }
    }
    , {
        "../../lib/helper": 5,
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    16: [function(e, t, n) {
        var r = e("./instances")
          , i = e("./update-geometry")
          , o = {
            "click-rail": e("./handler/click-rail"),
            "drag-scrollbar": e("./handler/drag-scrollbar"),
            keyboard: e("./handler/keyboard"),
            wheel: e("./handler/mouse-wheel"),
            touch: e("./handler/touch"),
            selection: e("./handler/selection")
        }
          , s = e("./handler/native-scroll");
        t.exports = function(e, t) {
            e.classList.add("ps");
            var n = r.add(e, "object" == typeof t ? t : {});
            e.classList.add("ps--theme_" + n.settings.theme),
            n.settings.handlers.forEach(function(t) {
                o[t](e)
            }),
            s(e),
            i(e)
        }
    }
    , {
        "./handler/click-rail": 9,
        "./handler/drag-scrollbar": 10,
        "./handler/keyboard": 11,
        "./handler/mouse-wheel": 12,
        "./handler/native-scroll": 13,
        "./handler/selection": 14,
        "./handler/touch": 15,
        "./instances": 17,
        "./update-geometry": 18
    }],
    17: [function(e, t, n) {
        function r(e) {
            return e.getAttribute("data-ps-id")
        }
        var i = e("../lib/helper")
          , o = e("./default-setting")
          , s = e("../lib/dom")
          , a = e("../lib/event-manager")
          , l = e("../lib/guid")
          , u = {};
        n.add = function(e, t) {
            var n = l();
            return function(e, t) {
                e.setAttribute("data-ps-id", t)
            }(e, n),
            u[n] = new function(e, t) {
                function n() {
                    e.classList.add("ps--focus")
                }
                function r() {
                    e.classList.remove("ps--focus")
                }
                this.settings = o();
                for (var l in t)
                    this.settings[l] = t[l];
                this.containerWidth = null,
                this.containerHeight = null,
                this.contentWidth = null,
                this.contentHeight = null,
                this.isRtl = "rtl" === s.css(e, "direction"),
                this.isNegativeScroll = function() {
                    var t = e.scrollLeft
                      , n = null;
                    return e.scrollLeft = -1,
                    n = e.scrollLeft < 0,
                    e.scrollLeft = t,
                    n
                }(),
                this.negativeScrollAdjustment = this.isNegativeScroll ? e.scrollWidth - e.clientWidth : 0,
                this.event = new a,
                this.ownerDocument = e.ownerDocument || document,
                this.scrollbarXRail = s.appendTo(s.create("div", "ps__scrollbar-x-rail"), e),
                this.scrollbarX = s.appendTo(s.create("div", "ps__scrollbar-x"), this.scrollbarXRail),
                this.scrollbarX.setAttribute("tabindex", 0),
                this.event.bind(this.scrollbarX, "focus", n),
                this.event.bind(this.scrollbarX, "blur", r),
                this.scrollbarXActive = null,
                this.scrollbarXWidth = null,
                this.scrollbarXLeft = null,
                this.scrollbarXBottom = i.toInt(s.css(this.scrollbarXRail, "bottom")),
                this.isScrollbarXUsingBottom = this.scrollbarXBottom == this.scrollbarXBottom,
                this.scrollbarXTop = this.isScrollbarXUsingBottom ? null : i.toInt(s.css(this.scrollbarXRail, "top")),
                this.railBorderXWidth = i.toInt(s.css(this.scrollbarXRail, "borderLeftWidth")) + i.toInt(s.css(this.scrollbarXRail, "borderRightWidth")),
                s.css(this.scrollbarXRail, "display", "block"),
                this.railXMarginWidth = i.toInt(s.css(this.scrollbarXRail, "marginLeft")) + i.toInt(s.css(this.scrollbarXRail, "marginRight")),
                s.css(this.scrollbarXRail, "display", ""),
                this.railXWidth = null,
                this.railXRatio = null,
                this.scrollbarYRail = s.appendTo(s.create("div", "ps__scrollbar-y-rail"), e),
                this.scrollbarY = s.appendTo(s.create("div", "ps__scrollbar-y"), this.scrollbarYRail),
                this.scrollbarY.setAttribute("tabindex", 0),
                this.event.bind(this.scrollbarY, "focus", n),
                this.event.bind(this.scrollbarY, "blur", r),
                this.scrollbarYActive = null,
                this.scrollbarYHeight = null,
                this.scrollbarYTop = null,
                this.scrollbarYRight = i.toInt(s.css(this.scrollbarYRail, "right")),
                this.isScrollbarYUsingRight = this.scrollbarYRight == this.scrollbarYRight,
                this.scrollbarYLeft = this.isScrollbarYUsingRight ? null : i.toInt(s.css(this.scrollbarYRail, "left")),
                this.scrollbarYOuterWidth = this.isRtl ? i.outerWidth(this.scrollbarY) : null,
                this.railBorderYWidth = i.toInt(s.css(this.scrollbarYRail, "borderTopWidth")) + i.toInt(s.css(this.scrollbarYRail, "borderBottomWidth")),
                s.css(this.scrollbarYRail, "display", "block"),
                this.railYMarginHeight = i.toInt(s.css(this.scrollbarYRail, "marginTop")) + i.toInt(s.css(this.scrollbarYRail, "marginBottom")),
                s.css(this.scrollbarYRail, "display", ""),
                this.railYHeight = null,
                this.railYRatio = null
            }
            (e,t),
            u[n]
        }
        ,
        n.remove = function(e) {
            delete u[r(e)],
            function(e) {
                e.removeAttribute("data-ps-id")
            }(e)
        }
        ,
        n.get = function(e) {
            return u[r(e)]
        }
    }
    , {
        "../lib/dom": 2,
        "../lib/event-manager": 3,
        "../lib/guid": 4,
        "../lib/helper": 5,
        "./default-setting": 7
    }],
    18: [function(e, t, n) {
        function r(e, t) {
            return e.settings.minScrollbarLength && (t = Math.max(t, e.settings.minScrollbarLength)),
            e.settings.maxScrollbarLength && (t = Math.min(t, e.settings.maxScrollbarLength)),
            t
        }
        var i = e("../lib/helper")
          , o = e("../lib/dom")
          , s = e("./instances")
          , a = e("./update-scroll");
        t.exports = function(e) {
            var t = s.get(e);
            t.containerWidth = e.clientWidth,
            t.containerHeight = e.clientHeight,
            t.contentWidth = e.scrollWidth,
            t.contentHeight = e.scrollHeight;
            var n;
            e.contains(t.scrollbarXRail) || ((n = o.queryChildren(e, ".ps__scrollbar-x-rail")).length > 0 && n.forEach(function(e) {
                o.remove(e)
            }),
            o.appendTo(t.scrollbarXRail, e)),
            e.contains(t.scrollbarYRail) || ((n = o.queryChildren(e, ".ps__scrollbar-y-rail")).length > 0 && n.forEach(function(e) {
                o.remove(e)
            }),
            o.appendTo(t.scrollbarYRail, e)),
            !t.settings.suppressScrollX && t.containerWidth + t.settings.scrollXMarginOffset < t.contentWidth ? (t.scrollbarXActive = !0,
            t.railXWidth = t.containerWidth - t.railXMarginWidth,
            t.railXRatio = t.containerWidth / t.railXWidth,
            t.scrollbarXWidth = r(t, i.toInt(t.railXWidth * t.containerWidth / t.contentWidth)),
            t.scrollbarXLeft = i.toInt((t.negativeScrollAdjustment + e.scrollLeft) * (t.railXWidth - t.scrollbarXWidth) / (t.contentWidth - t.containerWidth))) : t.scrollbarXActive = !1,
            !t.settings.suppressScrollY && t.containerHeight + t.settings.scrollYMarginOffset < t.contentHeight ? (t.scrollbarYActive = !0,
            t.railYHeight = t.containerHeight - t.railYMarginHeight,
            t.railYRatio = t.containerHeight / t.railYHeight,
            t.scrollbarYHeight = r(t, i.toInt(t.railYHeight * t.containerHeight / t.contentHeight)),
            t.scrollbarYTop = i.toInt(e.scrollTop * (t.railYHeight - t.scrollbarYHeight) / (t.contentHeight - t.containerHeight))) : t.scrollbarYActive = !1,
            t.scrollbarXLeft >= t.railXWidth - t.scrollbarXWidth && (t.scrollbarXLeft = t.railXWidth - t.scrollbarXWidth),
            t.scrollbarYTop >= t.railYHeight - t.scrollbarYHeight && (t.scrollbarYTop = t.railYHeight - t.scrollbarYHeight),
            function(e, t) {
                var n = {
                    width: t.railXWidth
                };
                t.isRtl ? n.left = t.negativeScrollAdjustment + e.scrollLeft + t.containerWidth - t.contentWidth : n.left = e.scrollLeft,
                t.isScrollbarXUsingBottom ? n.bottom = t.scrollbarXBottom - e.scrollTop : n.top = t.scrollbarXTop + e.scrollTop,
                o.css(t.scrollbarXRail, n);
                var r = {
                    top: e.scrollTop,
                    height: t.railYHeight
                };
                t.isScrollbarYUsingRight ? t.isRtl ? r.right = t.contentWidth - (t.negativeScrollAdjustment + e.scrollLeft) - t.scrollbarYRight - t.scrollbarYOuterWidth : r.right = t.scrollbarYRight - e.scrollLeft : t.isRtl ? r.left = t.negativeScrollAdjustment + e.scrollLeft + 2 * t.containerWidth - t.contentWidth - t.scrollbarYLeft - t.scrollbarYOuterWidth : r.left = t.scrollbarYLeft + e.scrollLeft,
                o.css(t.scrollbarYRail, r),
                o.css(t.scrollbarX, {
                    left: t.scrollbarXLeft,
                    width: t.scrollbarXWidth - t.railBorderXWidth
                }),
                o.css(t.scrollbarY, {
                    top: t.scrollbarYTop,
                    height: t.scrollbarYHeight - t.railBorderYWidth
                })
            }(e, t),
            t.scrollbarXActive ? e.classList.add("ps--active-x") : (e.classList.remove("ps--active-x"),
            t.scrollbarXWidth = 0,
            t.scrollbarXLeft = 0,
            a(e, "left", 0)),
            t.scrollbarYActive ? e.classList.add("ps--active-y") : (e.classList.remove("ps--active-y"),
            t.scrollbarYHeight = 0,
            t.scrollbarYTop = 0,
            a(e, "top", 0))
        }
    }
    , {
        "../lib/dom": 2,
        "../lib/helper": 5,
        "./instances": 17,
        "./update-scroll": 19
    }],
    19: [function(e, t, n) {
        var r = e("./instances")
          , i = function(e) {
            var t = document.createEvent("Event");
            return t.initEvent(e, !0, !0),
            t
        };
        t.exports = function(e, t, n) {
            if (void 0 === e)
                throw "You must provide an element to the update-scroll function";
            if (void 0 === t)
                throw "You must provide an axis to the update-scroll function";
            if (void 0 === n)
                throw "You must provide a value to the update-scroll function";
            "top" === t && n <= 0 && (e.scrollTop = n = 0,
            e.dispatchEvent(i("ps-y-reach-start"))),
            "left" === t && n <= 0 && (e.scrollLeft = n = 0,
            e.dispatchEvent(i("ps-x-reach-start")));
            var o = r.get(e);
            "top" === t && n >= o.contentHeight - o.containerHeight && ((n = o.contentHeight - o.containerHeight) - e.scrollTop <= 2 ? n = e.scrollTop : e.scrollTop = n,
            e.dispatchEvent(i("ps-y-reach-end"))),
            "left" === t && n >= o.contentWidth - o.containerWidth && ((n = o.contentWidth - o.containerWidth) - e.scrollLeft <= 2 ? n = e.scrollLeft : e.scrollLeft = n,
            e.dispatchEvent(i("ps-x-reach-end"))),
            void 0 === o.lastTop && (o.lastTop = e.scrollTop),
            void 0 === o.lastLeft && (o.lastLeft = e.scrollLeft),
            "top" === t && n < o.lastTop && e.dispatchEvent(i("ps-scroll-up")),
            "top" === t && n > o.lastTop && e.dispatchEvent(i("ps-scroll-down")),
            "left" === t && n < o.lastLeft && e.dispatchEvent(i("ps-scroll-left")),
            "left" === t && n > o.lastLeft && e.dispatchEvent(i("ps-scroll-right")),
            "top" === t && n !== o.lastTop && (e.scrollTop = o.lastTop = n,
            e.dispatchEvent(i("ps-scroll-y"))),
            "left" === t && n !== o.lastLeft && (e.scrollLeft = o.lastLeft = n,
            e.dispatchEvent(i("ps-scroll-x")))
        }
    }
    , {
        "./instances": 17
    }],
    20: [function(e, t, n) {
        var r = e("../lib/helper")
          , i = e("../lib/dom")
          , o = e("./instances")
          , s = e("./update-geometry")
          , a = e("./update-scroll");
        t.exports = function(e) {
            var t = o.get(e);
            t && (t.negativeScrollAdjustment = t.isNegativeScroll ? e.scrollWidth - e.clientWidth : 0,
            i.css(t.scrollbarXRail, "display", "block"),
            i.css(t.scrollbarYRail, "display", "block"),
            t.railXMarginWidth = r.toInt(i.css(t.scrollbarXRail, "marginLeft")) + r.toInt(i.css(t.scrollbarXRail, "marginRight")),
            t.railYMarginHeight = r.toInt(i.css(t.scrollbarYRail, "marginTop")) + r.toInt(i.css(t.scrollbarYRail, "marginBottom")),
            i.css(t.scrollbarXRail, "display", "none"),
            i.css(t.scrollbarYRail, "display", "none"),
            s(e),
            a(e, "top", e.scrollTop),
            a(e, "left", e.scrollLeft),
            i.css(t.scrollbarXRail, "display", ""),
            i.css(t.scrollbarYRail, "display", ""))
        }
    }
    , {
        "../lib/dom": 2,
        "../lib/helper": 5,
        "./instances": 17,
        "./update-geometry": 18,
        "./update-scroll": 19
    }]
}, {}, [1]);
