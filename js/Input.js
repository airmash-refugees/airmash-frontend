(function() {
    var e = {}
      , t = {}
      , n = {}
      , r = null
      , i = 0
      , o = 2 * Math.PI
      , s = null
      , a = false
      , l = {}
      , u = false
      , c = null
      , h = 0
      , d = {
        LEFT: ["LEFT", "A"],
        RIGHT: ["RIGHT", "D"],
        UP: ["UP", "W"],
        DOWN: ["DOWN", "S"],
        STRAFELEFT: ["Q"],
        STRAFERIGHT: ["E"],
        FIRE: ["SPACE"],
        SPECIAL: ["CTRL", "SHIFT"],
        SHOWSCORE: ["TAB"],
        MAINMENU: ["F1"],
        SHOWGAMES: ["F2"],
        FULLSCREEN: ["F"],
        MINIMIZECHAT: ["PGDOWN"],
        MAXIMIZECHAT: ["PGUP"],
        SAY: ["GRAVE"],
        TEAM: ["T"],
        REPLY: ["R"],
        SPECTATE: ["V"],
        UPGRADE1: ["1"],
        UPGRADE2: ["2"],
        UPGRADE3: ["3"],
        UPGRADE4: ["4"],
        SOUND: ["G"],
        HELP: ["H"],
        INVITE: ["I"],
        MOUSEMODE: ["M"]
    }
      , p = {}
      , f = {
        LEFT: true,
        RIGHT: true,
        UP: true,
        DOWN: true,
        FIRE: true,
        SPECIAL: true,
        STRAFELEFT: true,
        STRAFERIGHT: true
    }
      , g = {}
      , m = {
        MAINMENU: true,
        FULLSCREEN: true,
        INVITE: true,
        SOUND: true,
        SHOWSCORE: true,
        SHOWGAMES: true,
        HELP: true
    }
      , v = [["Forward", "UP"], ["Backward", "DOWN"], ["Turn Left", "LEFT"], ["Turn Right", "RIGHT"], ["Fire", "FIRE"], ["Special", "SPECIAL"], ["Strafe Left", "STRAFELEFT"], ["Strafe Right", "STRAFERIGHT"], [""], ["Spectate", "SPECTATE"], ["Upgrade Speed", "UPGRADE1"], ["Upgrade Defense", "UPGRADE2"], ["Upgrade Energy", "UPGRADE3"], ["Upgrade Missiles", "UPGRADE4"], ["Scoreboard", "SHOWSCORE"], ["Main Menu", "MAINMENU"], ["Show Games", "SHOWGAMES"], ["Fullscreen", "FULLSCREEN"], ["Maximize Chat", "MAXIMIZECHAT"], ["Minimize Chat", "MINIMIZECHAT"], [""], ["In-game Say", "SAY"], ["Team Chat", "TEAM"], ["Reply", "REPLY"], ["Toggle Sound", "SOUND"], ["Help", "HELP"], ["Invite Friends", "INVITE"], ["Mouse Mode", "MOUSEMODE"]]
      , y = {}
      , b = {
        BACKSPACE: 8,
        TAB: 9,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS: 20,
        SPACE: 32,
        PGUP: 33,
        PGDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        INSERT: 45,
        DELETE: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        WINDOWL: 91,
        WINDOWR: 92,
        SELECT: 93,
        NUMPAD0: 96,
        NUMPAD1: 97,
        NUMPAD2: 98,
        NUMPAD3: 99,
        NUMPAD4: 100,
        NUMPAD5: 101,
        NUMPAD6: 102,
        NUMPAD7: 103,
        NUMPAD8: 104,
        NUMPAD9: 105,
        "*": 106,
        "+": 107,
        "-": 109,
        DECIMAL: 110,
        "/": 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUMLOCK: 144,
        SCROLL: 145,
        ":": 186,
        "=": 187,
        ",": 188,
        "-": 189,
        ".": 190,
        "/": 191,
        GRAVE: 192,
        "[": 219,
        "\\": 220,
        "]": 221,
        QUOTE: 222
    }
      , _ = ["UP", "DOWN", "LEFT", "RIGHT", "FIRE", "SPECIAL"]
      , x = ["UP", "DOWN", "LEFT", "RIGHT", "FIRE", "SPECIAL"];
    Input.setup = function() {
        for (var e in b)
            y[b[e]] = e;
        p = JSON.parse(JSON.stringify(d)),
        I(),
        M(true),
        $(window).on("keydown", w),
        $(window).on("keyup", T),
        $(window).on("gamepadconnected", function(e) {
            UI.showMessage("alert", '<span class="info">GAMEPAD CONNECTED</span>' + UI.escapeHTML(e.originalEvent.gamepad.id), 3e3),
            a = true,
            S()
        }),
        $(window).on("gamepaddisconnected", function(e) {
            UI.showMessage("alert", '<span class="info">GAMEPAD DISCONNECTED</span>' + UI.escapeHTML(e.originalEvent.gamepad.id), 3e3),
            a = false,
            S()
        })
    }
    ;
    var w = function(r) {
        if (game.state == Network.STATE.PLAYING || game.state == Network.STATE.CONNECTING) {
            var i = r.which;
            if (72 != i && UI.hideHelp(),
            null != c && P(i))
                r.preventDefault();
            else {
                var o = Input.getBind(i);
                if (!E(i))
                    return null == f[o] ? (n[i] || (n[i] = true,
                    UI.controlKey(i, o, true)),
                    r.preventDefault(),
                    false) : (e[o] || (e[o] = true,
                    C(o)),
                    t[i] || (t[i] = true),
                    r.preventDefault(),
                    false)
            }
        }
    }
      , T = function(r) {
        if (game.state == Network.STATE.PLAYING || game.state == Network.STATE.CONNECTING) {
            var i = r.which
              , o = Input.getBind(i);
            if (null == f[o] && n[i] && (n[i] = false),
            !E(i))
                return e[o] && (e[o] = false,
                R(o)),
                t[i] && (t[i] = false),
                r.preventDefault(),
                false
        }
    }
      , E = function(e, t) {
        return !!UI.chatBoxOpen() && (9 != e && 27 != e && 13 != e && 38 != e && 40 != e && 37 != e && 39 != e && 112 != e && 113 != e && 114 != e && 115 != e && 116 != e && 117 != e && 118 != e && 119 != e && 120 != e && 121 != e && 122 != e && 123 != e)
    }
      , S = function() {
        l = {
            forward: true,
            left: false,
            right: false,
            up: false,
            down: false,
            fire: false,
            special: false,
            angle: 0,
            force: 0
        }
    };
    Input.toggleKeybinds = function() {
        u ? Input.closeKeybinds() : Input.openKeybinds()
    }
    ,
    Input.getBind = function(e) {
        var t = g[e];
        return null == t ? null : t
    }
    ,
    Input.bindKey = function(e, t, n) {
        null == c && (c = t,
        h = n,
        $(e.target).html("press key"))
    }
    ,
    Input.closeBind = function() {
        null != c && (M(),
        c = null)
    }
    ,
    Input.resetBinds = function() {
        d = JSON.parse(JSON.stringify(p)),
        Tools.removeSetting("keybinds"),
        c = null,
        M()
    }
    ;
    var I = function() {
        if (null != config.settings.keybinds)
            for (var e in config.settings.keybinds)
                d[e] = JSON.parse(JSON.stringify(config.settings.keybinds[e]))
    }
      , P = function(e) {
        var t = y[e];
        if (27 == e && (t = ""),
        null != t) {
            for (var n in d)
                d[n][0] == t && (d[n][0] = ""),
                d[n].length > 1 && d[n][1] == t && (d[n][1] = "");
            d[c][h] = t;
            for (n in d)
                d[n].length > 1 && "" == d[n][0] && "" != d[n][1] && (d[n] = [d[n][1]]),
                2 == d[n].length && "" === d[n][1] && d[n].splice(-1, 1);
            return M(),
            function() {
                var e = {}
                  , t = "";
                for (var n in d)
                    null != p[n] && (t = JSON.stringify(d[n])) !== JSON.stringify(p[n]) && (e[n] = JSON.parse(t));
                Object.keys(e).length > 0 ? Tools.setSettings({
                    keybinds: e
                }) : Tools.removeSetting("keybinds")
            }(),
            c = null,
            true
        }
        return false
    }
      , M = function(e) {
        var t = ""
          , n = ""
          , r = ""
          , i = null;
        t += '<div class="left-binds">';
        for (var o = 0; o < v.length; o++)
            null != v[o][0] && ("" != v[o][0] ? (null == (i = d[v[o][1]]) ? (n = "&nbsp;",
            r = "&nbsp;") : ("" == (n = i[0]) && (n = "&nbsp;"),
            "" == (r = 1 == i.length ? "" : i[1]) && (r = "&nbsp;")),
            t += '<div class="item"><div class="name">' + v[o][0] + '</div><div class="bind' + ("&nbsp;" == n ? " blank" : "") + '" onclick="Input.bindKey(event,\'' + v[o][1] + "',0)\">" + n + '</div><div class="bind' + ("&nbsp;" == r ? " blank" : "") + '" onclick="Input.bindKey(event,\'' + v[o][1] + "',1)\">" + r + "</div></div>",
            13 == o && (t += '</div><div class="right-binds">')) : t += '<div class="item empty"></div>');
        t += "</div>",
        null == e && $("#keybinds-list").html(t),
        g = {};
        o = 0;
        var s = 0;
        for (var a in d) {
            for (o = 0; o < d[a].length; o++)
                null != (s = b[d[a][o]]) && (g[s] = a);
            null != m[a] && $("#keybind-" + a.toLowerCase()).html("" == d[a] ? "&nbsp;" : "(" + d[a] + ")")
        }
    };
    Input.openKeybinds = function() {
        config.mobile || u || (UI.closeAllPanels("keybinds"),
        M(),
        UI.showPanel("#keybinds"),
        u = true)
    }
    ,
    Input.closeKeybinds = function() {
        u && (UI.hidePanel("#keybinds", u),
        u = false,
        c = null)
    }
    ,
    Input.update = function() {
        if (a && null != navigator.getGamepads) {
            var e = navigator.getGamepads();
            if (null != e && null != e.length && 0 != e.length && null != e[0]) {
                var t = e[0];
                if (!(t.buttons.length < 16)) {
                    var n = t.buttons[12].pressed
                      , r = t.buttons[13].pressed
                      , i = t.buttons[15].pressed
                      , s = t.buttons[14].pressed
                      , u = t.buttons[0].pressed || t.buttons[2].pressed
                      , c = t.buttons[1].pressed || t.buttons[3].pressed;
                    l.up != n && (A("UP", n),
                    l.up = n),
                    l.down != r && (A("DOWN", r),
                    l.down = r),
                    l.right != i && (A("RIGHT", i),
                    l.right = i),
                    l.left != s && (A("LEFT", s),
                    l.left = s),
                    l.fire != u && (A("FIRE", u),
                    l.fire = u),
                    l.special != c && (A("SPECIAL", c),
                    l.special = c);
                    var h = new Vector(t.axes[1],t.axes[0])
                      , d = h.length()
                      , p = -h.angle() + Math.PI / 2
                      , f = p = (p % o + o) % o;
                    d > .2 ? (l.forward = true,
                    O(f, d)) : (l.forward && !n && A("UP", false),
                    l.forward = false)
                }
            } else
                a = false
        }
    }
    ,
    Input.unpressKey = function(e) {
        delete n[e]
    }
    ,
    Input.keyState = function(t) {
        return e[t]
    }
    ,
    Input.clearKeys = function(n) {
        if (game.state === Network.STATE.PLAYING) {
            for (var r of _)
                if (e[r]) {
                    if (n && (t[38] || t[40] || t[37] || t[39]))
                        continue;
                    e[r] = false,
                    R(r)
                }
            for (var i in t)
                (!n || 38 != i && 40 != i && 37 != i && 39 != i) && (t[i] = false)
        }
    }
    ,
    Input.touchCloseAll = function() {
        game.state == Network.STATE.LOGIN ? (Games.closeDropdowns(),
        UI.closeLogin()) : game.state == Network.STATE.PLAYING && (UI.closeAllPanels(),
        UI.closeTooltip())
    }
    ,
    Input.addTouchRejection = function(e) {
        $(e).on("touchstart", function(e) {
            e.stopPropagation()
        }),
        $(e).on("touchmove", function(e) {
            e.preventDefault(),
            e.stopPropagation()
        })
    }
    ,
    Input.setupLogin = function() {
        $(window).on("touchstart", function(e) {
            Input.touchCloseAll(),
            e.preventDefault()
        }),
        Input.addTouchRejection("#logon,#big-message,#loginselector")
    }
    ,
    Input.setupTouch = function() {
        $(window).on("touchcancel", function(e) {
            null != s && s.processOnEnd(e)
        });
        Input.addTouchRejection("#settings,#sidebar,#roomnamecontainer,#menu,#gameselector,#mainmenu,#scoredetailed,#invitefriends,#msg-alert,#msg-information");
        $("body").append('<div id="touch-joystick"></div><div id="touch-fire"><div class="circle"></div></div><div id="touch-special"><div class="circle"></div></div>'),
        $("#touch-fire").on("touchstart", function(e) {
            A("FIRE", true),
            $("#touch-fire > .circle").css({
                "background-color": "rgba(255, 255, 255, 0.5)"
            }),
            e.preventDefault()
        }),
        $("#touch-fire").on("touchend", function(e) {
            A("FIRE", false),
            $("#touch-fire > .circle").css({
                "background-color": "rgba(255, 255, 255, 0.2)"
            }),
            e.preventDefault()
        }),
        $("#touch-special").on("touchstart", function(e) {
            A("SPECIAL", true),
            $("#touch-special > .circle").css({
                "background-color": "rgba(255, 255, 255, 0.5)"
            }),
            e.preventDefault()
        }),
        $("#touch-special").on("touchend", function(e) {
            A("SPECIAL", false),
            $("#touch-special > .circle").css({
                "background-color": "rgba(255, 255, 255, 0.2)"
            }),
            e.preventDefault()
        });
        var e = {
            zone: $("#touch-joystick")[0],
            mode: "static",
            position: {
                bottom: "50%",
                left: "50%"
            }
        };
        (s = nipplejs.create(e)).on("end", Input.touchEnd),
        s.on("move", Input.touchMove)
    }
    ,
    Input.toggleMouse = function(e) {
        if (!config.mobile)
            if ($(window).off("mousedown"),
            $(window).off("mouseup"),
            config.mouse = !config.mouse,
            config.mouse) {
                if ($(window).on("mousedown", Input.mouseDown),
                $(window).on("mouseup", Input.mouseUp),
                e)
                    return;
                UI.showMessage("alert", '<span class="info">MOUSE MODE</span>Enabled<div class="mousemode"><span class="info">LEFT CLICK</span>Fire&nbsp;&nbsp;&nbsp;<span class="info">RIGHT CLICK</span>Special&nbsp;&nbsp;&nbsp;<span class="info">WASD</span>Move</div>', 7e3),
                Tools.setSettings({
                    mousemode: true
                })
            } else
                UI.showMessage("alert", '<span class="info">MOUSE MODE</span>Disabled', 3e3),
                Tools.removeSetting("mousemode")
    }
    ,
    Input.mouseDown = function(e) {
        var t = e.originalEvent;
        if ((0 == t.button || 2 == t.button) && null != t.target.tagName && "canvas" == t.target.tagName.toLowerCase()) {
            var n = 0 == t.button ? "FIRE" : "SPECIAL";
            A(n, true),
            e.preventDefault()
        }
    }
    ,
    Input.mouseUp = function(e) {
        var t = e.originalEvent;
        if (0 == t.button || 2 == t.button)
            if (null != t.target.tagName && "canvas" == t.target.tagName.toLowerCase()) {
                var n = 0 == t.button ? "FIRE" : "SPECIAL";
                A(n, false),
                e.preventDefault()
            } else
                A("FIRE", false),
                A("SPECIAL", false)
    }
    ;
    var A = function(t, n) {
        (e[t] == !n || n && null == e[t]) && (Network.sendKey(t, n),
        e[t] = n)
    }
      , O = function(e, t) {
        var n = Players.getMe();
        if (null != n) {
            var o = e - n.rot;
            o > Math.PI && (o -= 2 * Math.PI),
            o < -Math.PI && (o += 2 * Math.PI);
            var s = Math.round(Math.abs(o) / (60 * config.ships[n.type].turnFactor) * 1e3);
            if (!((s -= Math.round(game.ping)) < 10 || game.time - i < 100)) {
                null != r && clearTimeout(r),
                i = game.time;
                var a = o > 0 ? "RIGHT" : "LEFT"
                  , l = o <= 0 ? "RIGHT" : "LEFT";
                A("UP", !(null != t && t < .5)),
                A(a, true),
                A(l, false),
                r = setTimeout(function() {
                    A(a, false)
                }, s)
            }
        }
    };
    Input.touchMove = function(e, t) {
        var n = -t.angle.radian + Math.PI / 2
          , r = n = (n % o + o) % o;
        O(r, t.force)
    }
    ,
    Input.touchEnd = function(e, t) {
        A("UP", false),
        A("LEFT", false),
        A("RIGHT", false)
    }
    ,
    Input.gameFocus = function() {
        game.focus = true
    }
    ,
    Input.gameBlur = function() {
        game.focus = false,
        Input.clearKeys()
    }
    ;
    var C = function(e) {
        if (3 == game.myType && ("STRAFELEFT" === e || "STRAFERIGHT" === e))
            return C("SPECIAL"),
            void C("STRAFELEFT" === e ? "LEFT" : "RIGHT");
        -1 !== x.indexOf(e) && Network.sendKey(e, true)
    }
      , R = function(t) {
        if (3 != game.myType || "STRAFELEFT" !== t && "STRAFERIGHT" !== t)
            -1 !== _.indexOf(t) && Network.sendKey(t, false);
        else {
            R("STRAFELEFT" === t ? "LEFT" : "RIGHT");
            e["STRAFERIGHT" === t ? "STRAFELEFT" : "STRAFERIGHT"] || R("SPECIAL")
        }
    }
})();
