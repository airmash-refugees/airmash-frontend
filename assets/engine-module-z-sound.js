(function() {
    var e = {}
      , t = {}
      , n = {}
      , r = 0
      , i = 0
      , o = {}
      , s = 0
      , a = 0
      , l = {}
      , u = .3
      , c = 1
      , h = .3
      , d = .06
      , p = .08
      , f = .05
      , g = .25
      , m = .3
      , v = [0, .7, 1, .4, 0, .7, .4, .7]
      , y = [0, .7, 1, .4, 0, .7, 1, .7]
      , b = [0, .8, .5, 1, 0, .8, .5, .8]
      , _ = [0, .8, 1, .7, .8, .8]
      , x = [0, 1.5, 1.2, .8, 1.35, 1.7]
      , w = [0, 1, 1, .35, 1, 1]
      , T = [0, .8, .5, 1, 0, .8, .8, .8]
      , E = [0, 1.5, .8, 2, 1, 1.5]
      , S = {
        powerup_shield: .5,
        upgrade: .2,
        complete: .5,
        levelup: .5,
        respawn: .05,
        click: .5
    }
      , I = {}
      , P = {
        src: ["assets/sounds.mp3?4"],
        volume: 0,
        sprite: {
            chopper: [0, 3206.1451247165533, !0],
            click: [5e3, 374.9886621315195],
            complete: [7e3, 1910.9750566893417],
            explosion1: [1e4, 4137.460317460316],
            explosion2: [16e3, 4155.44217687075],
            explosion3: [22e3, 4168.367346938776],
            explosion4: [28e3, 4580.272108843537],
            explosion5: [34e3, 4144.943310657595],
            explosion6: [4e4, 4191.360544217688],
            impact: [46e3, 3730.7709750566855],
            launch1: [51e3, 1492.4943310657568],
            launch2: [54e3, 1511.2244897959215],
            levelup: [57e3, 1886.4172335600883],
            missile: [6e4, 8335.351473922898, !0],
            powerup_rampage: [7e4, 7423.083900226758],
            powerup_shield: [79e3, 2070.4761904761854],
            powerup_upgrade: [83e3, 1640.8616780045406],
            repel: [86e3, 2e3],
            respawn: [89e3, 1315.9410430838961],
            thruster: [92e3, 9499.841269841269, !0],
            upgrade: [103e3, 2062.517006802722]
        }
    };
    Sound.setup = function() {
        var n = {};
        for (var r in I) {
            if (n = {
                src: ["/assets/sounds/" + r + ".wav"]
            },
            Object.keys(I[r]).length > 0)
                for (var i in I[r])
                    n[i] = I[r][i];
            t[r] = new Howl(n)
        }
        e = new Howl(P)
    }
    ,
    Sound.toggle = function() {
        config.settings.sound = !config.settings.sound,
        Tools.setSettings({
            sound: config.settings.sound
        }),
        UI.updateSound(!0),
        M()
    }
    ;
    var M = function() {
        config.settings.sound || e.stop()
    }
      , A = function(e) {
        var t = S[e];
        return null == t ? 1 : t
    };
    Sound.mobExplosion = function(e, t) {
        var n = v[t] * u
          , r = k(e) * n
          , i = "explosion" + Tools.randInt(1, 6);
        r < .01 || O("mobexplosions", 4) || C(i, r, e, Tools.rand(.8, 1.2))
    }
    ,
    Sound.playerKill = function(e) {
        var t = _[e.type] * c
          , n = k(e.pos) * t
          , r = "explosion" + Tools.randInt(1, 6);
        n < .01 || O("playerkills", 3) || C(r, n, e.pos, Tools.rand(.8, 1.2))
    }
    ,
    Sound.playerUpgrade = function() {
        if (!O("upgrades", 1)) {
            var e = A("upgrade");
            C("upgrade", e)
        }
    }
    ,
    Sound.playerRespawn = function(e) {
        var t = A("respawn") * (e.me() ? 1 : k(e.pos))
          , n = e.me() ? null : e.pos;
        C("respawn", t, n)
    }
    ,
    Sound.gameComplete = function() {
        var e = A("complete");
        C("complete", e)
    }
    ,
    Sound.levelUp = function() {
        var e = A("levelup");
        C("levelup", e)
    }
    ,
    Sound.UIClick = function() {
        if (!O("uiclick", 1, 200)) {
            var e = A("click");
            C("click", e)
        }
    }
    ,
    Sound.effectRepel = function(e) {
        var t = k(e) * m;
        C("repel", t, e, 1.5)
    }
    ,
    Sound.powerup = function(e, t) {
        var n = (null == t ? 1 : k(t)) * g
          , r = "";
        4 == e ? r = "powerup_upgrade" : 8 == e ? r = "powerup_shield" : 9 == e && (r = "powerup_rampage"),
        C(r, n * A(r), t)
    }
    ,
    Sound.missileLaunch = function(e, t) {
        var n = y[t] * h
          , r = k(e) * n
          , i = b[t]
          , o = "launch" + Tools.randInt(1, 2);
        r < .01 || O("launches", 5) || C(o, r, e, i)
    }
    ,
    Sound.playerImpact = function(e, t, n) {
        var r = f * Tools.clamp(n, 0, 1)
          , i = k(e) * r
          , o = E[t];
        C("impact", i, e, o)
    }
    ,
    Sound.update = function() {
        if (!(game.time - a < 100)) {
            var e = game.focus ? 300 : 1e3;
            for (var t in n)
                game.time - n[t].last > e && Sound.clearThruster(t);
            for (var r in o)
                game.time >= o[r].time && (D(o[r].id, o[r].sound),
                delete o[r]);
            a = game.time
        }
    }
    ;
    var O = function(e, t, n) {
        if (null == l[e])
            return l[e] = {
                num: 1,
                time: game.time
            },
            !1;
        var r = null != n ? n : 1e3;
        return game.time - l[e].time > r ? (l[e].num = 1,
        l[e].time = game.time,
        !1) : (l[e].num++,
        l[e].num > t)
    }
      , C = function(n, r, i, o, s, a) {
        if (config.settings.sound) {
            if (a) {
                if (null == t[n])
                    return;
                var l = t[n]
            } else
                l = e;
            if (!(null != r && r < .01)) {
                var u = l.play(a ? void 0 : n);
                if ("thruster" === n || "missile" === n || "chopper" === n) {
                    var c = l.seek(null, u);
                    l.seek(c + Tools.rand(0, 1), u)
                }
                return R(u, n, r, i, o, s, a),
                u
            }
        }
    }
      , R = function(n, r, i, o, s, a, l) {
        if (config.settings.sound) {
            if (l) {
                if (null == t[r])
                    return;
                var u = t[r]
            } else
                u = e;
            null != i && u.volume(i, n),
            null != a && u.fade(a[0], a[1], a[2], n, 4 == a.length || null),
            null != s && u.rate(s, n),
            null == o || config.ios || u.stereo(L(o), n)
        }
    }
      , D = function(n, r, i) {
        if (i) {
            if (null == t[r])
                return;
            var o = t[r]
        } else
            o = e;
        o.stop(n)
    };
    Sound.clearThruster = function(e) {
        if (null != n[e]) {
            var t = n[e].soundId
              , a = n[e].vol;
            R(t, n[e].sound, null, null, null, [a, 0, 200, !0]),
            function(e, t, n) {
                o[++s] = {
                    id: e,
                    sound: t,
                    time: game.time + n
                }
            }(t, n[e].sound, 300),
            0 == n[e].type ? r-- : i--,
            delete n[e]
        }
    }
    ,
    Sound.updateThruster = function(e, t, o) {
        if (config.settings.sound) {
            if (0 == e) {
                if (3 == t.type) {
                    o = t.render;
                    var s = "chopper"
                } else {
                    o = t.keystate.UP || t.keystate.DOWN;
                    s = "thruster"
                }
                var a = "player_" + t.id + "_" + t.type
            } else {
                s = "missile";
                a = "mob_" + t.id
            }
            if (o)
                if (null == n[a]) {
                    if (0 == e) {
                        if (!t.me() && r >= 5)
                            return
                    } else if (i >= 5)
                        return;
                    var l = k(t.pos);
                    if (0 == e)
                        var u = l * w[t.type] * d
                          , c = x[t.type];
                    else
                        u = l * p,
                        c = T[t.type];
                    if (u < .01)
                        return;
                    var h = C(s, null, t.pos, c, [0, u, 200]);
                    n[a] = {
                        type: e,
                        started: game.time,
                        last: game.time,
                        sound: s,
                        soundId: h,
                        vol: u
                    },
                    0 == e ? r++ : i++
                } else {
                    if (game.time - n[a].last < 100)
                        return;
                    l = k(t.pos);
                    if (0 == e) {
                        u = l * w[t.type] * d;
                        t.boost && (u *= 3)
                    } else
                        u = l * p;
                    if (u < .01)
                        return void Sound.clearThruster(a);
                    c = null;
                    if (0 == e && 3 == t.type && (c = x[t.type] + t.speed.length() / 20),
                    game.time - n[a].started < 250)
                        return;
                    R(n[a].soundId, n[a].sound, null, t.pos, c, [n[a].vol, u, 100, !0]),
                    n[a].last = game.time,
                    n[a].vol = u
                }
            else
                null != n[a] && Sound.clearThruster(a)
        }
    }
    ;
    var k = function(e) {
        var t = Graphics.getCamera()
          , n = Tools.length(e.x - t.x, e.y - t.y)
          , r = (game.halfScreenX / game.scale + game.halfScreenY / game.scale) / 2;
        return Tools.clamp(1.5 * (1 - n / r), 0, 1)
    }
      , L = function(e) {
        var t = Graphics.getCamera()
          , n = e.x - t.x
          , r = game.halfScreenX / game.scale;
        return Tools.clamp(.8 * n / r, -1, 1)
    }
})();
