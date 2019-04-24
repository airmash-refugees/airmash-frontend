(function() {
    var e = !1
      , t = !1
      , n = !1
      , r = ["", "Free For All", "Capture The Flag", "Battle Royale"]
      , i = ["", "ffa", "ctf", "br"]
      , o = 0
      , s = {}
      , a = 0
      , l = null
      , u = null
      , c = !1
      , h = !1
      , d = null
      , p = []
      , f = !1
      , g = {}
      , m = {}
      , v = null
      , y = !1
      , b = {
        radius: 0,
        pos: Vector.zero(),
        speed: 0
    }
      , _ = {
        2: "Custom country flags",
        3: "Emotes",
        4: "Flag Pack #1"
    };
    Games.setup = function() {
        $("#playregion").on("click", function(e) {
            Games.updateRegion(!0, e)
        }),
        $("#playtype").on("click", function(e) {
            Games.updateType(!0, e)
        }),
        $("#open-menu").on("click", function(e) {
            Games.popGames(),
            e.stopPropagation()
        }),
        $("#gameselector").on("click", function(e) {
            e.stopPropagation()
        }),
        $("#invite-copy").on("click", Games.copyInviteLink),
        $("#loginbutton").on("click", function(e) {
            UI.openLogin(),
            e.stopPropagation()
        }),
        $("#login-facebook").on("click", function() {
            Games.popupLogin(1)
        }),
        $("#login-google").on("click", function() {
            Games.popupLogin(2)
        }),
        $("#login-twitter").on("click", function() {
            Games.popupLogin(3)
        }),
        $("#login-reddit").on("click", function() {
            Games.popupLogin(4)
        }),
        $("#login-twitch").on("click", function() {
            Games.popupLogin(5)
        }),
        $("#loginselector").on("click", function(e) {
            e.stopPropagation()
        }),
        $("#gotomainpage").on("click", Games.redirRoot),
        $("#lifetime-signin").on("click", Games.redirRoot),
        null != config.settings.session ? Games.playerAuth() : Games.playerGuest(),
        w(function() {
            if (h = !0,
            T(),
            DEVELOPMENT && "#tony" == window.location.hash)
                return game.playRegion = "eu",
                game.playRoom = "ffa1",
                game.playInvited = !0,
                game.myOriginalName = window.location.hash.substr(1),
                void Games.start(game.myOriginalName, !0);
            f || (I(),
            Games.updateRegion(!1),
            Games.updateType(!1),
            C())
        }, !0)
    }
    ,
    Games.popupLogin = function(e) {
        x("/auth_" + ["", "facebook", "google", "twitter", "reddit", "twitch"][e], "Login", 4 == e ? 900 : 500, 500)
    }
    ;
    var x = function(e, t, n, r) {
        var i = void 0 != window.screenLeft ? window.screenLeft : window.screenX
          , o = void 0 != window.screenTop ? window.screenTop : window.screenY
          , s = (window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width) / 2 - n / 2 + i
          , a = (window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height) / 2 - r / 2 + o;
        window.open(e, t, "width=" + n + ", height=" + r + ", top=" + a + ", left=" + s)
    };
    window.loginSuccess = function(e) {
        config.settings.session = e,
        Tools.setSettings({
            session: e
        }),
        Tools.removeSetting("flag"),
        Games.playerAuth(),
        UI.closeLogin()
    }
    ,
    window.loginFailure = function() {}
    ,
    Games.playerGuest = function() {
        UI.show("#playbutton", !0),
        UI.show("#loginbutton", !0)
    }
    ,
    Games.playerAuth = function() {
        Tools.ajaxPost("/auth", {
            session: config.settings.session
        }, function(e) {
            if (null != e) {
                game.loggedIn = !0,
                game.myUserID = e.user;
                var t = UI.escapeHTML(e.authName.substr(0, 30)) + '<span class="grey">(' + ["", "Facebook", "Google", "Twitter", "Reddit", "Twitch"][e.authType] + ")</span>"
                  , n = t + '<span class="link" onclick="Games.logout()">Logout</span>'
                  , r = "Logged in as " + t + '<span class="button" onclick="Games.logout()">LOG OUT</span>';
                null != e.name && $("#playername").val(e.name),
                $("#logout").html(n),
                $("#logout-mainmenu").html(r),
                $("#loginbutton").remove(),
                $("#lifetime-account").remove(),
                $("#playbutton").html("PLAY"),
                UI.show("#playbutton", !0)
            } else
                Games.playerGuest()
        })
    }
    ,
    Games.logout = function() {
        Tools.removeSetting("session"),
        Tools.removeSetting("name"),
        Tools.removeSetting("flag"),
        window.location = "/"
    }
    ;
    var w = function(e, t) {
        var n = "games"; // DERPS
        t && (n += "?main=1"),
        $.ajax({
            url: n,
            dataType: "json",
            cache: !1,
            success: function(n) {
                try {
                    p = JSON.parse(n.data)
                } catch (e) {
                    return
                }
                if ("xx" == game.myFlag && (game.myFlag = n.country),
                t && game.protocol != n.protocol) {
                    if ("#reload" !== window.location.hash)
                        return void Tools.ajaxPost("/clienterror", {
                            type: "protocol"
                        }, function(e) {
                            UI.showMessage("alert", '<span class="mainerror">Protocol update<br>Your client is being updated to the new version</span>', 3e4),
                            setTimeout(function() {
                                window.location = "/?" + Tools.randomID(10) + "#reload"
                            }, 5e3)
                        });
                    Tools.ajaxPost("/clienterror", {
                        type: "protocolretry"
                    })
                }
                e()
            },
            error: function() {}
        })
    }
      , T = function() {
        o = 0;
        for (var e = 0, t = 0; t < p.length; t++)
            for (var n = 0; n < p[t].games.length; n++)
                o += p[t].games[n].players,
                e++;
        if (0 == e)
            f = !0,
            UI.showMessage("alert", '<span class="mainerror">We are currently performing server maintenance<br>Please try again in a few minutes</span>', 3e4);
        else {
            var r = '<div class="item smallerpad">' + o + "</div>player" + (o > 1 ? "s" : "") + " online";
            $("#gameinfo").html(r)
        }
    }
      , E = function(e) {
        if ("closest" === e)
            return {
                name: "Closest"
            };
        for (var t = 0; t < p.length; t++)
            if (p[t].id === e)
                return p[t];
        return game.playRegion = "closest",
        {
            name: "Closest"
        }
    }
      , S = function(e, t) {
        var n = E(e);
        if (null == n)
            return null;
        if (null == n.games)
            return null;
        for (var o = 0; o < n.games.length; o++)
            if (n.games[o].id === t)
                return n.games[o];
        var s = i.indexOf(t);
        if (-1 != s)
            for (o = 0; o < n.games.length; o++)
                if (n.games[o].type == s)
                    return {
                        name: r[s]
                    };
        return null
    }
      , I = function() {
        var e = window.location.hash;
        if (history.replaceState(null, null, "/"),
        "#reload" !== e && null != e && !(e.length < 4 || e.length > 20)) {
            var t = (e = e.substr(1)).indexOf("-");
            if (-1 != t) {
                var n = e.substr(0, t)
                  , r = e.substr(t + 1);
                null != S(n, r) && (game.playRegion = n,
                game.playRoom = r,
                game.playInvited = !0)
            }
        }
    };
    Games.selectRegion = function(e, t) {
        e.stopPropagation(),
        Sound.UIClick(),
        game.playRegion = t,
        Games.updateRegion(!1),
        Games.updateType()
    }
    ,
    Games.selectGame = function(e, t) {
        e.stopPropagation(),
        Sound.UIClick(),
        game.playRoom = t,
        Games.updateType(!1)
    }
    ,
    Games.closeDropdowns = function() {
        t && Games.updateType(!1),
        e && Games.updateRegion(!1)
    }
    ,
    Games.updateRegion = function(n, r) {
        var i = ""
          , o = null;
        if (h && !f) {
            if (null != r && (r.stopPropagation(),
            e || Sound.UIClick()),
            n && UI.closeLogin(),
            null == n && (n = e),
            n) {
                t && Games.updateType(!1),
                i += '<div class="item"><div class="region header">REGION</div><div class="players header">PLAYERS</div><div class="ping header">PING</div><div class="clear"></div></div>';
                var s = "";
                null != u && (s = '<span class="autoregion">(' + p[u].name + ")</span>"),
                i += '<div class="item selectable' + ("closest" === game.playRegion ? " sel" : "") + '" onclick="Games.selectRegion(event, &quot;closest&quot;)"><div class="region chooser">Closest' + s + '</div><div class="clear"></div></div>';
                for (var a = 0; a < p.length; a++) {
                    for (var l = 0, c = 0; c < p[a].games.length; c++)
                        l += p[a].games[c].players;
                    var d;
                    d = null == p[a].ping ? "&nbsp;" : Math.round(p[a].ping) + '<span class="ms">ms</span>',
                    i += '<div class="item selectable' + (game.playRegion === p[a].id ? " sel" : "") + '" onclick="Games.selectRegion(event, &quot;' + p[a].id + '&quot;)"><div class="region chooser">' + p[a].name + '</div><div class="players number">' + l + '</div><div class="ping chooser nopadding">' + d + '</div><div class="clear"></div></div>'
                }
                i += '<div class="item"></div>',
                o = {
                    width: "240px",
                    height: "auto",
                    "z-index": "2"
                },
                $("#playregion").removeClass("hoverable")
            } else {
                i += '<div class="arrowdown"></div>',
                i += '<div class="playtop">REGION</div>';
                i += '<div class="playbottom">' + E(game.playRegion).name + "</div>",
                o = {
                    width: "130px",
                    height: "40px",
                    "z-index": "auto"
                },
                $("#playregion").addClass("hoverable")
            }
            $("#playregion").html(i),
            $("#playregion").css(o),
            e = n
        }
    }
    ;
    var P = function() {
        var e = game.playRegion;
        if ("closest" === e) {
            if (null == u)
                return null;
            e = p[u].id
        }
        return e
    }
      , M = function(e) {
        var t = '<div class="infott">';
        return 1 == e ? t += "Everyone versus everyone deathmatch. No teams." : 2 == e ? t += "Players split into 2 teams. 2 flags are placed inside each base. The objective is to move the enemy flag from their base to your base." : 3 == e && (t += "Players spawn at random locations all across the map. Destroyed players will not respawn. Last player standing wins."),
        t += '<div class="arrow"></div></div>'
    };
    Games.updateType = function(n, o) {
        var s = ""
          , a = null;
        if (h && !f) {
            if (null != o && (o.stopPropagation(),
            t || Sound.UIClick()),
            n && UI.closeLogin(),
            null == n && (n = t),
            n) {
                e && Games.updateRegion(!1),
                s += '<div class="item"><div class="gametype header">GAME</div><div class="players header">PLAYERS</div><div class="clear"></div></div>';
                if (null == (p = P()))
                    return;
                null == S(p, game.playRoom) && (game.playRoom = i[1]);
                var l, u, c = E(p).games, d = [[], [], [], [], [], [], [], [], []];
                for (l = 0; l < c.length; l++)
                    d[c[l].type].push(c[l]);
                for (l = 1; l < d.length; l++)
                    if (0 != d[l].length)
                        for (s += '<div class="item selectable' + (i[l] === game.playRoom ? " sel" : "") + '" onclick="Games.selectGame(event, &quot;' + i[l] + '&quot;)"><div class="gametype chooser">' + r[l] + '<span class="infocontainer">&nbsp;<div class="infoicon">' + M(l) + '</div></span></div><div class="clear"></div></div>',
                        u = 0; u < d[l].length; u++)
                            s += '<div class="item selectable' + (d[l][u].id === game.playRoom ? " sel" : "") + '" onclick="Games.selectGame(event, &quot;' + d[l][u].id + '&quot;)"><div class="gametype chooser">' + d[l][u].nameShort + '</div><div class="players number">' + d[l][u].players + '</div><div class="clear"></div></div>';
                s += '<div class="item"></div>',
                a = {
                    width: "240px",
                    height: "auto",
                    "z-index": "2"
                },
                $("#playtype").removeClass("hoverable")
            } else {
                s += '<div class="arrowdown"></div>',
                s += '<div class="playtop">GAME</div>';
                var p;
                if (null == (p = P()))
                    return;
                var g = S(p, game.playRoom);
                null == g ? (name = r[1],
                game.playRoom = i[1]) : name = g.name,
                s += '<div class="playbottom">' + name + "</div>",
                a = {
                    width: "190px",
                    height: "40px",
                    "z-index": "auto"
                },
                $("#playtype").addClass("hoverable")
            }
            $("#playtype").html(s),
            $("#playtype").css(a),
            t = n
        }
    }
    ,
    Games.popGames = function() {
        if (!n) {
            UI.closeAllPanels("games");
            var e = A();
            UI.hide("#menu"),
            $("#gameselector").html(e),
            UI.show("#gameselector"),
            n = !0,
            O(),
            Sound.UIClick()
        }
    }
    ;
    var A = function() {
        var e = "";
        e += '<div class="header">' + game.roomName + '<span class="region">&nbsp;&nbsp;&bull;&nbsp;&nbsp;' + game.regionName + '</span></div><div class="buttons"><div class="button" onclick="Games.redirRoot()">CHANGE REGION</div></div>';
        var t, n, i = E(game.playRegion).games, o = [[], [], [], [], [], [], [], [], []];
        for (t = 0; t < i.length; t++)
            o[i[t].type].push(i[t]);
        var s, a;
        for (t = 1; t < o.length; t++)
            if (0 != o[t].length)
                for (e += '<div class="item head"><div class="gametype chooser section">' + r[t] + '<span class="infocontainer">&nbsp;<div class="infoicon">' + M(t) + '</div></span></div><div class="clear"></div></div>',
                n = 0; n < o[t].length; n++)
                    o[t][n].id === game.playRoom ? (s = " sel",
                    a = "") : (s = " selectable",
                    a = ' onclick="Games.switchGame(&quot;' + o[t][n].id + '&quot;)"'),
                    e += '<div class="item' + s + '"' + a + '><div class="gametype chooser">' + o[t][n].nameShort + '</div><div class="players number">' + o[t][n].players + '</div><div class="clear"></div></div>';
        return e
    };
    Games.redirRoot = function() {
        game.reloading = !0,
        window.location = "/"
    }
    ;
    var O = function() {
        w(function() {
            var e = A();
            $("#gameselector").html(e)
        })
    };
    Games.closeGames = function() {
        n && (UI.hide("#gameselector"),
        UI.show("#menu"),
        n = !1,
        Sound.UIClick())
    }
    ,
    Games.toggleGames = function() {
        n ? Games.closeGames() : Games.popGames()
    }
    ,
    Games.switchGame = function(e) {
        Games.closeGames(),
        null != e && (game.playRoom = e),
        game.myScore = 0,
        game.state = Network.STATE.CONNECTING,
        Network.shutdown(),
        Particles.wipe(),
        Players.wipe(),
        Mobs.wipe(),
        UI.reconnection(),
        Games.start(game.myOriginalName)
    }
    ;
    var C = function() {
        s = {},
        a = 0;
        for (var e, t = 0; t < p.length; t++)
            e = p[t].games[Tools.randInt(0, p[t].games.length - 1)].host,
            null == s[e] && (s[e] = {
                ping: 9999,
                num: 0,
                threshold: 0,
                server: t
            });
        Games.performPing(),
        Games.performPing(),
        Games.performPing(),
        l = setInterval(Games.performPing, 300)
    };
    Games.performPing = function() {
        if (!(a > 3 || c)) {
            var e = 9999
              , t = null;
            for (var n in s)
                s[n].num < e && (e = s[n].num,
                t = n);
            if (e > 6)
                null != l && clearInterval(l);
            else {
                s[t].num++;
                var r;
                r = DEVELOPMENT ? "/ping" : "https://game-" + t + ".airma.sh/ping",
                R(t, r, function() {
                    R(t, r)
                })
            }
        }
    }
    ;
    var R = function(e, t, n) {
        if (null != s[e] && !c) {
            a++;
            var r = performance.now();
            $.ajax({
                url: t,
                dataType: "json",
                cache: !1,
                timeout: 2e3,
                success: function(t) {
                    if (!c && (a--,
                    1 == t.pong && null != s[e])) {
                        var i = performance.now() - r;
                        if (Math.abs(s[e].ping - i) < .1 * i && s[e].threshold++,
                        s[e].threshold >= 2)
                            return i < s[e].ping && (p[s[e].server].ping = i,
                            Games.findClosest(),
                            Games.updateRegion()),
                            void delete s[e];
                        i < s[e].ping && (s[e].ping = i,
                        p[s[e].server].ping = i,
                        Games.findClosest(),
                        Games.updateRegion(),
                        null != n && n())
                    }
                },
                error: function() {
                    a--
                }
            })
        }
    };
    Games.findClosest = function() {
        for (var e = 9999, t = !1, n = 0; n < p.length; n++)
            null != p[n].ping && p[n].ping < e && (e = p[n].ping,
            u = n,
            t = !0);
        t && "closest" === game.playRegion && Games.updateType()
    }
    ,
    Games.highlightInput = function(e) {
        $(e).css({
            transition: "none",
            transform: "scale(1.1)",
            "background-color": "rgb(90, 30, 30)"
        }),
        $(e).width(),
        $(e).css({
            transition: "all 0.5s ease-in-out",
            transform: "scale(1)",
            "background-color": "rgb(30, 30, 30)"
        }),
        setTimeout(function() {
            $(e).focus()
        }, 200)
    }
    ,
    Games.copyInviteLink = function() {
        D(game.inviteLink) && (UI.show("#invite-copied"),
        null != d && clearTimeout(d),
        d = setTimeout(function() {
            UI.hide("#invite-copied")
        }, 2e3))
    }
    ;
    var D = function(e) {
        var t = document.createElement("span");
        t.textContent = e,
        t.style.whiteSpace = "pre";
        var n = document.createElement("iframe");
        n.sandbox = "allow-same-origin",
        document.body.appendChild(n);
        var r = n.contentWindow;
        r.document.body.appendChild(t);
        var i = r.getSelection();
        i || (i = (r = window).getSelection(),
        document.body.appendChild(t));
        var o = r.document.createRange();
        i.removeAllRanges(),
        o.selectNode(t),
        i.addRange(o);
        var s = !1;
        try {
            s = r.document.execCommand("copy")
        } catch (e) {}
        return i.removeAllRanges(),
        t.remove(),
        n.remove(),
        s
    };
    Games.start = function(e, t) {
        if (!(f || t && game.state == Network.STATE.CONNECTING)) {
            var n = game.playRegion
              , r = P();
            if (null != r) {
                game.playRegion = r,
                null != l && clearInterval(l),
                c = !0;
                var o = game.playRoom
                  , s = i.indexOf(o);
                if (-1 != s) {
                    for (var a = E(game.playRegion).games, u = [], h = 0; h < a.length; h++)
                        a[h].type == s && u.push(a[h].id);
                    o = u[Tools.randInt(0, u.length - 1)]
                }
                var d = S(game.playRegion, o);
                game.playHost = d.host,
                game.playData = d, // DERPS
                game.playPath = d.id,
                game.regionName = E(game.playRegion).name,
                game.playRoom = o,
                game.state == Network.STATE.LOGIN && Tools.wipeReel(),
                game.state = Network.STATE.CONNECTING;
                var p = {
                    name: e
                };
                game.playInvited || (p.region = n),
                Tools.setSettings(p),
                UI.gameStart(e, t),
                t && Tools.ajaxPost("/enter", {
                    id: config.settings.id,
                    name: e,
                    game: game.playRegion + "-" + game.playRoom,
                    source: null != document.referrer ? document.referrer : "",
                    mode: config.mobile ? 1 : 0
                })
            }
        }
    }
    ,
    Games.prep = function() {
        if (Games.wipe(),
        2 == game.gameType) {
            $("#gamespecific").html('<div class="blueflag"></div><div id="blueflag-name" class="blueflag-player">&nbsp;</div><div class="redflag"></div><div id="redflag-name" class="redflag-player">&nbsp;</div>'),
            UI.show("#gamespecific"),
            g = {
                flagBlue: {
                    visible: !1,
                    playerId: null,
                    direction: 1,
                    diffX: 0,
                    momentum: 0,
                    position: Vector.zero(),
                    basePos: new Vector(-9669,-1471),
                    sprite: Textures.init("ctfFlagBlue", {
                        scale: .4,
                        visible: !1
                    }),
                    spriteShadow: Textures.init("ctfFlagShadow", {
                        scale: .4 * 1.1,
                        visible: !1
                    }),
                    minimapSprite: Textures.init("minimapFlagBlue"),
                    minimapBase: Textures.init("minimapBaseBlue")
                },
                flagRed: {
                    visible: !1,
                    playerId: null,
                    direction: 1,
                    diffX: 0,
                    momentum: 0,
                    position: Vector.zero(),
                    basePos: new Vector(8602,-944),
                    sprite: Textures.init("ctfFlagRed", {
                        scale: .4,
                        visible: !1
                    }),
                    spriteShadow: Textures.init("ctfFlagShadow", {
                        scale: .4 * 1.1,
                        visible: !1
                    }),
                    minimapSprite: Textures.init("minimapFlagRed"),
                    minimapBase: Textures.init("minimapBaseRed")
                }
            },
            Graphics.minimapMob(g.flagBlue.minimapBase, g.flagBlue.basePos.x, g.flagBlue.basePos.y),
            Graphics.minimapMob(g.flagRed.minimapBase, g.flagRed.basePos.x, g.flagRed.basePos.y)
        } else
            3 == game.gameType && ($("#gamespecific").html(""),
            UI.show("#gamespecific"))
    }
    ,
    Games.wipe = function() {
        L(),
        g.flagBlue && g.flagRed && (game.graphics.layers.flags.removeChild(g.flagBlue.sprite),
        game.graphics.layers.flags.removeChild(g.flagRed.sprite),
        game.graphics.layers.shadows.removeChild(g.flagBlue.spriteShadow),
        game.graphics.layers.shadows.removeChild(g.flagRed.spriteShadow),
        game.graphics.layers.ui3.removeChild(g.flagBlue.minimapSprite),
        game.graphics.layers.ui3.removeChild(g.flagRed.minimapSprite),
        game.graphics.layers.ui2.removeChild(g.flagBlue.minimapBase),
        game.graphics.layers.ui2.removeChild(g.flagRed.minimapBase),
        g.flagBlue.sprite.destroy(),
        g.flagRed.sprite.destroy(),
        g.flagBlue.spriteShadow.destroy(),
        g.flagRed.spriteShadow.destroy(),
        g.flagBlue.minimapSprite.destroy(),
        g.flagRed.minimapSprite.destroy(),
        g.flagBlue.minimapBase.destroy(),
        g.flagRed.minimapBase.destroy())
    }
    ,
    Games.networkFlag = function(e) {
        var t = 1 == e.flag ? g.flagBlue : g.flagRed
          , n = 1 == e.flag ? "#blueflag-name" : "#redflag-name"
          , r = 1 == e.flag ? e.blueteam : e.redteam;
        t.momentum = 0,
        t.direction = 1,
        t.sprite.scale.x = .4,
        t.sprite.rotation = 0,
        t.spriteShadow.scale.x = .4 * 1.1,
        t.spriteShadow.rotation = 0;
        var i = '<span class="rounds">' + r + '<span class="divider">/</span>3</span>';
        if (1 == e.type) {
            t.playerId = null,
            t.position.x = e.posX,
            t.position.y = e.posY,
            t.sprite.position.set(e.posX, e.posY);
            var o = Graphics.shadowCoords(new Vector(e.posX,e.posY));
            t.spriteShadow.position.set(o.x, o.y),
            Graphics.minimapMob(t.minimapSprite, e.posX, e.posY),
            $(n).html(i)
        } else {
            t.playerId = e.id;
            var s = Players.get(e.id);
            null != s && (1 == e.flag ? i = UI.escapeHTML(s.name) + i : i += UI.escapeHTML(s.name)),
            t.diffX = s.pos.x,
            $(n).html(i)
        }
        k(t, !1)
    }
    ;
    var k = function(e, t) {
        if (t && (Graphics.minimapMob(e.minimapSprite, e.position.x, e.position.y),
        Graphics.minimapMob(e.minimapBase, e.basePos.x, e.basePos.y)),
        null != e.playerId) {
            var n = Players.get(e.playerId);
            if (null != n && (n.render != e.visible && (e.visible = n.render,
            e.sprite.visible = n.render,
            e.spriteShadow.visible = n.render,
            n.render && (e.momentum = 0,
            e.direction = 1,
            e.diffX = n.pos.x)),
            n.render ? Graphics.minimapMob(e.minimapSprite, n.pos.x, n.pos.y) : Graphics.minimapMob(e.minimapSprite, n.lowResPos.x, n.lowResPos.y),
            e.visible)) {
                e.position.x = n.pos.x,
                e.position.y = n.pos.y,
                e.sprite.position.set(n.pos.x, n.pos.y);
                var r = Graphics.shadowCoords(n.pos);
                e.spriteShadow.position.set(r.x, r.y),
                e.momentum = Tools.clamp(e.momentum + (n.pos.x - e.diffX) * game.timeFactor, -40, 40);
                var i = e.momentum > 0 ? .1 : -.1;
                e.direction = Tools.clamp(e.direction - i * game.timeFactor, -.4, .4),
                e.sprite.scale.x = e.direction,
                e.spriteShadow.scale.x = 1.1 * e.direction;
                var o = .04 * -(n.pos.x - e.diffX) * game.timeFactor;
                e.sprite.rotation = o,
                e.spriteShadow.rotation = o,
                e.diffX = n.pos.x
            }
        } else {
            var s = Graphics.inScreen(e.position, 128);
            s != e.visible && (e.visible = s,
            e.sprite.visible = s,
            e.spriteShadow.visible = s)
        }
    };
    Games.spectate = function(e) {
        null == game.spectatingID && 3 != game.gameType && UI.showMessage("alert", '<span class="info">SPECTATOR MODE</span>Click on Respawn to resume playing', 4e3),
        game.spectatingID = e;
        var t = Players.get(e)
          , n = '<div id="spectator-tag" class="spectating">Spectating ' + (null == t ? "" : UI.escapeHTML(t.name)) + '</div><div class="buttons"><div onclick="Network.spectateNext()" class="changeplayer left"><div class="arrow"></div></div><div onclick="Network.spectatePrev()" class="changeplayer right"><div class="arrow"></div></div></div>';
        UI.showSpectator(n)
    }
    ,
    Games.spectatorSwitch = function(e) {
        setTimeout(function() {
            e == game.spectatingID && Network.spectateNext()
        }, 2e3)
    }
    ,
    Games.playersAlive = function(e) {
        var t = "";
        e > 1 && (t = '<div class="playersalive">' + e + " players alive</div>"),
        $("#gamespecific").html(t)
    }
    ,
    Games.showBTRWin = function(e) {
        if (!$("#custom-msg").length) {
            var t = '<div id="custom-msg" class="btrwin"><div class="trophy"></div><div class="winner"><div class="player"><span class="flag big flag-' + e.f + '"></span>' + UI.escapeHTML(e.p) + '</div></div><div class="bounty"><span class="stat">' + e.k + " KILL" + (1 == e.k ? "" : "S") + "</span>+" + e.b + " BOUNTY</div></div>";
            $("body").append(t),
            UI.showPanel("#custom-msg"),
            setTimeout(function() {
                UI.hidePanel("#custom-msg", !1, !0)
            }, 1e3 * e.t),
            Sound.gameComplete()
        }
    }
    ,
    Games.showCTFWin = function(e) {
        if (!$("#custom-msg").length) {
            var t = '<div id="custom-msg" class="ctfwin"><div class="trophy"></div><div class="winner">' + (1 == e.w ? '<div class="player blue">BLUE TEAM</div>' : '<div class="player red">RED TEAM</div>') + '</div><div class="bounty">+' + e.b + " BOUNTY</div></div>";
            $("body").append(t),
            UI.showPanel("#custom-msg"),
            setTimeout(function() {
                UI.hidePanel("#custom-msg", !1, !0)
            }, 1e3 * e.t),
            Sound.gameComplete()
        }
    }
    ,
    Games.showLevelUP = function(e) {
        $("#custom-msg").length && $("#custom-msg").remove();
        var t = ""
          , n = " lvlsmaller";
        null != _[e + ""] && (n = "",
        t = '<div class="unlocked">FEATURE UNLOCKED<br><div class="unlockedtext">' + _[e + ""] + "</div></div>");
        var r = '<div id="custom-msg" class="levelup' + n + '"><div class="leveltext">NEW LEVEL REACHED</div><div class="levelbadge"></div><div class="levelnum">' + e + "</div>" + t + "</div>";
        $("body").append(r),
        UI.showPanel("#custom-msg"),
        Sound.levelUp(),
        UI.showChatLevel(e)
    }
    ,
    Games.popFirewall = function(e, t) {
        t <= 0 && (t = 0),
        y || (y = !0,
        v = new PIXI.Graphics,
        game.graphics.gui.minimap.mask = v),
        v.clear(),
        v.beginFill(16777215),
        v.drawCircle(game.screenX - config.minimapPaddingX - config.minimapSize * (16384 - e.x) / 32768, game.screenY - config.minimapPaddingY - config.minimapSize / 2 * (8192 - e.y) / 16384, 2 * t / (256 / config.minimapSize * 256)),
        v.endFill();
        var n = Graphics.getCamera()
          , r = Math.ceil((game.halfScreenX + 64) / game.scale / 64)
          , i = Math.ceil((game.halfScreenY + 64) / game.scale / 64)
          , o = 0
          , s = 0
          , a = ""
          , l = {}
          , u = 0
          , c = 0
          , h = new Vector(n.x - game.halfScreenX / game.scale - 64,n.y - game.halfScreenY / game.scale - 64)
          , d = new Vector(n.x + game.halfScreenX / game.scale + 64,n.y - game.halfScreenY / game.scale - 64)
          , p = new Vector(n.x - game.halfScreenX / game.scale - 64,n.y + game.halfScreenY / game.scale + 64)
          , f = new Vector(n.x + game.halfScreenX / game.scale + 64,n.y + game.halfScreenY / game.scale + 64);
        if (Tools.distance(e.x, e.y, h.x, h.y) > t || Tools.distance(e.x, e.y, d.x, d.y) > t || Tools.distance(e.x, e.y, p.x, p.y) > t || Tools.distance(e.x, e.y, f.x, f.y) > t)
            for (var g = -r; g <= r; g++)
                for (var b = -i; b <= i; b++)
                    if (o = 64 * (Math.floor(n.x / 64) + .5) + 64 * g,
                    s = 64 * (Math.floor(n.y / 64) + .5) + 64 * b,
                    !((u = Tools.distance(o, s, e.x, e.y)) < t) && (a = o + "_" + s,
                    l[a] = !0,
                    null == m[a])) {
                        var _ = Textures.sprite("hotsmoke_" + Tools.randInt(1, 4));
                        _.scale.set(Tools.rand(1.5, 2.5)),
                        _.anchor.set(.5, .5),
                        _.position.set(o, s),
                        c = 1,
                        Tools.rand(0, 1) > .5 && (_.blendMode = PIXI.BLEND_MODES.ADD,
                        c = .5),
                        game.graphics.layers.powerups.addChild(_),
                        m[a] = {
                            sprite: _,
                            rotation: Tools.rand(0, 100),
                            rotationSpeed: Tools.rand(-.0025, .0025),
                            opacity: 0,
                            maxOpacity: c,
                            opacitySpeed: u - t >= 64 ? .02 : .0035,
                            color: Tools.rand(0, 1),
                            colorDir: Tools.rand(0, 1) < .5 ? -1 : 1
                        }
                    }
        for (var x in m)
            null != l[x] ? (m[x].rotation += m[x].rotationSpeed * game.timeFactor,
            m[x].opacity += m[x].opacitySpeed * game.timeFactor,
            m[x].opacity > m[x].maxOpacity && (m[x].opacity = m[x].maxOpacity),
            m[x].color += .005 * m[x].colorDir * game.timeFactor,
            m[x].color < 0 && (m[x].colorDir = 1),
            m[x].color > 1 && (m[x].colorDir = -1),
            m[x].sprite.rotation = m[x].rotation,
            m[x].sprite.alpha = m[x].opacity,
            m[x].sprite.tint = Tools.colorLerp(16427014, 16404230, m[x].color)) : (game.graphics.layers.powerups.removeChild(m[x].sprite),
            m[x].sprite.destroy(),
            delete m[x])
    }
    ;
    var L = function() {
        if (y) {
            for (var e in m)
                game.graphics.layers.powerups.removeChild(m[e].sprite),
                m[e].sprite.destroy();
            m = {},
            game.graphics.gui.minimap.mask = null,
            null != v && (v.destroy(),
            v = null),
            y = !1
        }
    };
    Games.handleFirewall = function(e) {
        0 == e.status ? L() : (b.radius = e.radius,
        b.pos.x = e.posX,
        b.pos.y = e.posY,
        b.speed = e.speed,
        Games.popFirewall(b.pos, b.radius))
    }
    ,
    Games.update = function(e) {
        2 == game.gameType && g.flagBlue && (k(g.flagBlue, e),
        k(g.flagRed, e)),
        3 == game.gameType && y && (b.radius += b.speed / 60 * game.timeFactor,
        Games.popFirewall(b.pos, b.radius))
    }
})();
