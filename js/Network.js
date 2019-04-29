(function() {
    var e = null
      , t = null
      , n = false
      , r = ""
      , i = false
      , o = null
      , s = -1
      , a = -1
      , l = 0
      , u = {}
      , c = 0
      , h = 0
      , d = 0
      , p = false
      , f = 2e3
      , g = 2e3;
    Network.sendKey = function(e, r) {
        if (game.state == Network.STATE.PLAYING) {
            h++;
            var i = {
                c: P.KEY,
                seq: h,
                key: S[e],
                state: r
            };
            null != game.spectatingID && r && ("RIGHT" == e ? Network.spectatePrev() : "LEFT" == e && Network.spectateNext()),
            sendMessageDict(i),
            t && n && sendMessageDict(i, true)
        }
    }
    ,
    Network.sendChat = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: P.CHAT,
            text: e
        })
    }
    ,
    Network.sendWhisper = function(e, t) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: P.WHISPER,
            id: e,
            text: t
        })
    }
    ,
    Network.sendSay = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: P.SAY,
            text: e
        })
    }
    ,
    Network.sendTeam = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: P.TEAMCHAT,
            text: e
        })
    }
    ,
    Network.sendCommand = function(e, t) {
        game.state == Network.STATE.PLAYING && ("flag" === e && (game.lastFlagSet = t),
        sendMessageDict({
            c: P.COMMAND,
            com: e,
            data: t
        }))
    }
    ,
    Network.voteMute = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: P.VOTEMUTE,
            id: e
        })
    }
    ,
    Network.force = function(e) {
        var t;
        Players.network(A.PLAYER_UPDATE, e);
        for (t in e.players)
            Players.network(A.PLAYER_UPDATE, e.players[t]);
        for (t in e.mobs)
            Mobs.network(e.mobs[t]);
        var n = new Vector(e.posX,e.posY);
        Particles.spiritShockwave(n),
        Sound.effectRepel(n)
    }
    ,
    Network.getScores = function() {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: P.SCOREDETAILED
        })
    }
    ,
    Network.resizeHorizon = function() {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: P.HORIZON,
            horizonX: Math.ceil(game.halfScreenX / game.scale),
            horizonY: Math.ceil(game.halfScreenY / game.scale)
        })
    }
    ,
    Network.detectConnectivity = function() {
        game.lagging = game.timeNetwork - d > 1300
    }
    ,
    Network.shutdown = function() {
        null != o && clearInterval(o),
        null != e && e.close(),
        null != t && t.close(),
        n = false,
        i = false,
        s = -1,
        a = -1,
        l = 0,
        u = {},
        c = 0,
        h = 0,
        d = 0,
        p = false,
        f = 2e3,
        g = 2e3
    }
    ,
    Network.receivedError = function(e) {
        p = e
    }
    ,
    Network.spectateNext = function() {
        game.state == Network.STATE.PLAYING && Network.sendCommand("spectate", "-1")
    }
    ,
    Network.spectatePrev = function() {
        game.state == Network.STATE.PLAYING && Network.sendCommand("spectate", "-2")
    }
    ,
    Network.spectateForce = function() {
        game.state == Network.STATE.PLAYING && (Players.amIAlive() ? Network.sendCommand("spectate", "-3") : Network.spectateNext())
    }
    ;
    var m = function() {
        game.lagging || game.state == Network.STATE.PLAYING && (i ? t && n && sendMessageDict({
            c: P.ACK
        }, true) : sendMessageDict({
            c: P.ACK
        }),
        i = !i)
    }
      , v = function(e) {
        Math.abs(e - s) > 36e5 && (s = e,
        a = performance.now(),
        l = 0)
    }
      , y = function(e) {
        if (game.state == Network.STATE.PLAYING || e.c == A.LOGIN || e.c == A.ERROR) {
            if ((e.c == A.PLAYER_UPDATE || e.c == A.PLAYER_FIRE || e.c == A.EVENT_BOOST || e.c == A.EVENT_BOUNCE) && e.id == game.myID || e.c == A.PING) {
                if (e.c != A.PING && _(e))
                    return;
                game.timeNetwork = performance.now(),
                d = game.timeNetwork,
                function(e) {
                    if (game.jitter = 0,
                    -1 != s) {
                        v(e);
                        var t = game.timeNetwork
                          , n = e - s - (t - a)
                          , r = n - (l = .8 * l + n / 5);
                        Math.abs(r) < 100 && (game.jitter = r)
                    }
                }(e.clock / 100)
            } else
                game.timeNetwork = performance.now(),
                d = game.timeNetwork,
                null != e.clock && function(e) {
                    -1 != s && (v(e),
                    game.jitter = e - s - (game.timeNetwork - a) - l)
                }(e.clock / 100);
            switch (e.c) {
            case A.PLAYER_UPDATE:
            case A.PLAYER_FIRE:
            case A.CHAT_SAY:
            case A.PLAYER_RESPAWN:
            case A.PLAYER_FLAG:
            case A.EVENT_BOOST:
            case A.EVENT_BOUNCE:
                if (Players.network(e.c, e),
                e.c === A.PLAYER_FIRE) {
                    for (var t = 0; t < e.projectiles.length; t++)
                        e.projectiles[t].c = A.PLAYER_FIRE,
                        Mobs.add(e.projectiles[t]);
                    e.projectiles.length > 0 && Sound.missileLaunch(new Vector(e.projectiles[0].posX,e.projectiles[0].posY), e.projectiles[0].type)
                }
                break;
            case A.LOGIN:
                !function(e) {
                    o = setInterval(m, 50),
                    game.myID = e.id,
                    game.myTeam = e.team,
                    game.myToken = e.token,
                    game.state = Network.STATE.PLAYING,
                    game.roomName = e.room,
                    game.gameType = e.type,
                    game.spectatingID = null,
                    game.myLevel = 0,
                    Games.prep(),
                    s = e.clock / 100,
                    a = performance.now(),
                    x()
                }(e),
                UI.loggedIn(e);
                for (t = 0; t < e.players.length; t++)
                    Players.add(e.players[t], true);
                break;
            case A.ERROR:
                UI.errorHandler(e);
                break;
            case A.PLAYER_NEW:
                Players.add(e);
                break;
            case A.PLAYER_LEAVE:
                Players.destroy(e.id);
                break;
            case A.PLAYER_TYPE:
                Players.changeType(e);
                break;
            case A.PLAYER_HIT:
                Players.impact(e),
                200 != e.type && Mobs.destroy(e);
                break;
            case A.PLAYER_KILL:
                Players.kill(e);
                break;
            case A.PLAYER_UPGRADE:
                UI.updateUpgrades([e.speed, e.defense, e.energy, e.missile], e.upgrades, e.type);
                break;
            case A.PLAYER_POWERUP:
                Players.powerup(e);
                break;
            case A.PLAYER_LEVEL:
                Players.updateLevel(e);
                break;
            case A.PLAYER_RETEAM:
                for (t = 0; t < e.players.length; t++)
                    Players.reteam(e.players[t]);
                break;
            case A.EVENT_REPEL:
                Network.force(e);
                break;
            case A.EVENT_LEAVEHORIZON:
                0 == e.type ? Players.leaveHorizon(e) : Mobs.destroy(e);
                break;
            case A.EVENT_STEALTH:
                Players.stealth(e);
                break;
            case A.MOB_UPDATE:
            case A.MOB_UPDATE_STATIONARY:
                Mobs.network(e);
                break;
            case A.MOB_DESPAWN:
                Mobs.despawn(e);
                break;
            case A.MOB_DESPAWN_COORDS:
                Mobs.destroy(e);
                break;
            case A.GAME_FLAG:
                Games.networkFlag(e);
                break;
            case A.GAME_PLAYERSALIVE:
                Games.playersAlive(e.players);
                break;
            case A.SCORE_UPDATE:
                UI.newScore(e);
                break;
            case A.SCORE_BOARD:
                UI.scoreboardUpdate(e.data, e.rankings, config.maxScoreboard),
                Players.updateBadges(e.data);
                break;
            case A.SCORE_DETAILED:
            case A.SCORE_DETAILED_CTF:
            case A.SCORE_DETAILED_BTR:
                UI.updateScore(e);
                break;
            case A.PING:
                !function(e) {
                    sendMessageDict({
                        c: P.PONG,
                        num: e
                    })
                }(e.num);
                break;
            case A.PING_RESULT:
                UI.updateStats(e);
                break;
            case A.CHAT_PUBLIC:
                if (config.mobile)
                    return;
                Players.chat(e);
                break;
            case A.CHAT_TEAM:
                if (config.mobile)
                    return;
                Players.teamChat(e);
                break;
            case A.CHAT_WHISPER:
                if (config.mobile)
                    return;
                Players.whisper(e);
                break;
            case A.CHAT_VOTEMUTEPASSED:
                if (config.mobile)
                    return;
                Players.votemutePass(e);
                break;
            case A.CHAT_VOTEMUTED:
                if (config.mobile)
                    return;
                return void UI.chatMuted();
            case A.SERVER_MESSAGE:
                UI.serverMessage(e);
                break;
            case A.SERVER_CUSTOM:
                b(e);
                break;
            case A.GAME_SPECTATE:
                Games.spectate(e.id);
                break;
            case A.GAME_FIREWALL:
                Games.handleFirewall(e);
                break;
            case A.COMMAND_REPLY:
                UI.showCommandReply(e)
            }
        }
    }
      , b = function(e) {
        try {
            var t = JSON.parse(e.data)
        } catch (e) {
            return
        }
        1 == e.type ? Games.showBTRWin(t) : 2 == e.type && Games.showCTFWin(t)
    }
      , _ = function(e) {
        var t = performance.now()
          , n = e.c + "_" + e.clock + "_" + e.posX + "_" + e.posY + "_" + e.rot + "_" + e.speedX + "_" + e.speedY;
        if (t - c > 15e3) {
            for (var r in u)
                t - u[r] > 3e4 && delete u[r];
            c = t
        }
        return null != u[n] || (u[n] = t,
        false)
    };
    Network.reconnectMessage = function() {
        game.reloading || UI.showMessage("alert", '<span class="info">DISCONNECTED</span>Connection reset<br><span class="button" onclick="Network.reconnect()">RECONNECT</span>', 6e5)
    }
    ,
    Network.reconnect = function() {
        UI.showMessage("alert", "", 100),
        Games.switchGame()
    }
    ,
    Network.setup = function() {
        if (DEVELOPMENT) {
            r = -1 != document.domain.indexOf("192.168.") ? "ws://" + document.domain + ":8010/" + game.playPath : "ws://" + game.playHost + ".airmash.devel:8000/" + game.playPath
        } else
            //r = "wss://game-" + game.playHost + ".airma.sh/" + game.playPath;
            r = game.playData.url; // DERPS
        t && n && t.close(),
        (e = new WebSocket(r)).binaryType = "arraybuffer",
        e.onopen = function() {
            sendMessageDict({
                c: P.LOGIN,
                protocol: game.protocol,
                name: game.myName,
                session: config.settings.session ? config.settings.session : "none",
                horizonX: Math.ceil(game.halfScreenX / game.scale),
                horizonY: Math.ceil(game.halfScreenY / game.scale),
                flag: game.myFlag
            })
        }
        ,
        e.onclose = function() {
            null != o && clearInterval(o),
            game.state !== Network.STATE.CONNECTING && (game.state = Network.STATE.CONNECTING,
            false === p && Network.reconnectMessage())
        }
        ,
        e.onerror = function(event) {
            console.error("WebSocket error observed:", event);
            UI.serverMessage({
                type: 1,
                text: "WebSocket connection failed. Try disabling AdBlock!",
                duration: 30000
            });
        }
        ,
        e.onmessage = function(e) {
            y(decodeMessageToDict(e.data))
        }
    }
    ;
    var x = function() {
        (t = new WebSocket(r)).binaryType = "arraybuffer";
        t.onopen = function() {
            sendMessageDict({
                c: P.BACKUP,
                token: game.myToken
            }, true)
        }
        ,
        t.onclose = function() {
            n = false
        }
        ,
        t.onerror = function(event) {
            console.error("WebSocket error observed:", event);
            UI.serverMessage({
                type: 1,
                text: "WebSocket connection failed. Try disabling AdBlock!",
                duration: 30000
            });
        }
        ,
        t.onmessage = function(e) {
            var t = decodeMessageToDict(e.data);
            t.c === A.BACKUP && (n = true),
            t.backup = true,
            y(t)
        }
    }
      , encodeNetworkMessage = function(e, t) {
        var n, r = 1, i = [], o = M[e.c];
        if (null == o)
            return null;
        for (n = 0; n < o.length; n++)
            switch (o[n][1]) {
            case I.text:
                var s = Tools.encodeUTF8(e[o[n][0]]);
                i.push(s),
                r += 1 + s.length;
                break;
            case I.array:
            case I.arraysmall:
                break;
            case I.uint8:
                r += 1;
                break;
            case I.uint16:
                r += 2;
                break;
            case I.uint32:
            case I.float32:
                r += 4;
                break;
            case I.float64:
                r += 8;
                break;
            case I.boolean:
                r += 1
            }
        var a = new ArrayBuffer(r)
          , l = new DataView(a)
          , u = 0
          , c = 1;
        for (l.setUint8(0, e.c, true),
        n = 0; n < o.length; n++)
            switch (o[n][1]) {
            case I.text:
                var h = i[u].length;
                l.setUint8(c, h, true),
                c += 1;
                for (var d = 0; d < h; d++)
                    l.setUint8(c + d, i[u][d], true);
                i[u],
                u++,
                c += h;
                break;
            case I.array:
            case I.arraysmall:
                break;
            case I.uint8:
                l.setUint8(c, e[o[n][0]], true),
                c += 1;
                break;
            case I.uint16:
                l.setUint16(c, e[o[n][0]], true),
                c += 2;
                break;
            case I.uint32:
                l.setUint32(c, e[o[n][0]], true),
                c += 4;
                break;
            case I.float32:
                l.setFloat32(c, e[o[n][0]], true),
                c += 4;
                break;
            case I.float64:
                l.setFloat64(c, e[o[n][0]], true),
                c += 8;
                break;
            case I.boolean:
                l.setUint8(c, false === e[o[n][0]] ? 0 : 1),
                c += 1
            }
        return a
    }
      , decodeMessageToDict = function(e, t) {
        var n = new DataView(e)
          , r = {
            c: n.getUint8(0, true)
        }
          , i = 1
          , o = O[r.c];
        if (null == o)
            return null;
        for (var s = 0; s < o.length; s++) {
            var a = o[s][0];
            switch (o[s][1]) {
            case I.text:
            case I.textbig:
                if (o[s][1] == I.text) {
                    var l = n.getUint8(i, true);
                    i += 1
                } else {
                    l = n.getUint16(i, true);
                    i += 2
                }
                for (var u = new Uint8Array(l), c = 0; c < l; c++)
                    u[c] = n.getUint8(i + c, true);
                var h = Tools.decodeUTF8(u);
                r[a] = h,
                i += l;
                break;
            case I.array:
            case I.arraysmall:
                if (o[s][1] == I.arraysmall) {
                    var d = n.getUint8(i, true);
                    i += 1
                } else {
                    d = n.getUint16(i, true);
                    i += 2
                }
                r[a] = [];
                for (var p = o[s][2], f = 0; f < d; f++) {
                    for (var g = {}, m = 0; m < p.length; m++) {
                        var v = p[m][0];
                        switch (p[m][1]) {
                        case I.text:
                        case I.textbig:
                            if (p[m][1] == I.text) {
                                l = n.getUint8(i, true);
                                i += 1
                            } else {
                                l = n.getUint16(i, true);
                                i += 2
                            }
                            for (u = new Uint8Array(l),
                            c = 0; c < l; c++)
                                u[c] = n.getUint8(i + c, true);
                            h = Tools.decodeUTF8(u);
                            g[v] = h,
                            i += l;
                            break;
                        case I.uint8:
                            g[v] = n.getUint8(i, true),
                            i += 1;
                            break;
                        case I.uint16:
                            g[v] = n.getUint16(i, true),
                            i += 2;
                            break;
                        case I.uint24:
                            var y = 256 * n.getUint16(i, true);
                            i += 2,
                            r[v] = y + n.getUint8(i, true),
                            i += 1;
                            break;
                        case I.uint32:
                            g[v] = n.getUint32(i, true),
                            i += 4;
                            break;
                        case I.float32:
                            g[v] = n.getFloat32(i, true),
                            i += 4;
                            break;
                        case I.float64:
                            g[v] = n.getFloat64(i, true),
                            i += 8;
                            break;
                        case I.boolean:
                            g[v] = 0 != n.getUint8(i, true),
                            i += 1;
                            break;
                        case I.speed:
                            g[v] = Tools.decodeSpeed(n.getUint16(i, true)),
                            i += 2;
                            break;
                        case I.accel:
                            g[v] = Tools.decodeAccel(n.getUint16(i, true)),
                            i += 2;
                            break;
                        case I.coordx:
                            g[v] = Tools.decodeCoordX(n.getUint16(i, true)),
                            i += 2;
                            break;
                        case I.coordy:
                            g[v] = Tools.decodeCoordY(n.getUint16(i, true)),
                            i += 2;
                            break;
                        case I.coord24:
                            y = 256 * n.getUint16(i, true);
                            i += 2,
                            r[v] = Tools.decodeCoord24(y + n.getUint8(i, true)),
                            i += 1;
                            break;
                        case I.rotation:
                            g[v] = Tools.decodeRotation(n.getUint16(i, true)),
                            i += 2;
                            break;
                        case I.regen:
                            g[v] = Tools.decodeRegen(n.getUint16(i, true)),
                            i += 2;
                            break;
                        case I.healthnergy:
                            g[v] = Tools.decodeHealthnergy(n.getUint8(i, true)),
                            i += 1
                        }
                    }
                    r[a].push(g)
                }
                break;
            case I.uint8:
                r[a] = n.getUint8(i, true),
                i += 1;
                break;
            case I.uint16:
                r[a] = n.getUint16(i, true),
                i += 2;
                break;
            case I.uint24:
                y = 256 * n.getUint16(i, true);
                i += 2,
                r[a] = y + n.getUint8(i, true),
                i += 1;
                break;
            case I.uint32:
                r[a] = n.getUint32(i, true),
                i += 4;
                break;
            case I.float32:
                r[a] = n.getFloat32(i, true),
                i += 4;
                break;
            case I.float64:
                r[a] = n.getFloat64(i, true),
                i += 8;
                break;
            case I.boolean:
                r[a] = 0 != n.getUint8(i, true),
                i += 1;
                break;
            case I.speed:
                r[a] = Tools.decodeSpeed(n.getUint16(i, true)),
                i += 2;
                break;
            case I.accel:
                r[a] = Tools.decodeAccel(n.getUint16(i, true)),
                i += 2;
                break;
            case I.coordx:
                r[a] = Tools.decodeCoordX(n.getUint16(i, true)),
                i += 2;
                break;
            case I.coordy:
                r[a] = Tools.decodeCoordY(n.getUint16(i, true)),
                i += 2;
                break;
            case I.coord24:
                y = 256 * n.getUint16(i, true);
                i += 2,
                r[a] = Tools.decodeCoord24(y + n.getUint8(i, true)),
                i += 1;
                break;
            case I.rotation:
                r[a] = Tools.decodeRotation(n.getUint16(i, true)),
                i += 2;
                break;
            case I.regen:
                r[a] = Tools.decodeRegen(n.getUint16(i, true)),
                i += 2;
                break;
            case I.healthnergy:
                r[a] = Tools.decodeHealthnergy(n.getUint8(i, true)),
                i += 1;
                break;
            default:
                return null
            }
        }
        return r
    }
      , sendMessageDict = function(n, useBackupConn) {
        if(useBackupConn) {
            t.send(encodeNetworkMessage(n));
        } else {
            e.send(encodeNetworkMessage(n));
        }
    }
      , S = {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4,
        FIRE: 5,
        SPECIAL: 6
    }
      , I = {
        text: 1,
        textbig: 2,
        array: 3,
        arraysmall: 4,
        uint8: 5,
        uint16: 6,
        uint24: 7,
        uint32: 8,
        float32: 9,
        float64: 10,
        boolean: 11,
        speed: 12,
        accel: 13,
        coordx: 14,
        coordy: 15,
        coord24: 16,
        rotation: 17,
        healthnergy: 18,
        regen: 19
    }
      , P = {
        LOGIN: 0,
        BACKUP: 1,
        HORIZON: 2,
        ACK: 5,
        PONG: 6,
        KEY: 10,
        COMMAND: 11,
        SCOREDETAILED: 12,
        CHAT: 20,
        WHISPER: 21,
        SAY: 22,
        TEAMCHAT: 23,
        VOTEMUTE: 24,
        LOCALPING: 255
    }
      , M = {
        [P.LOGIN]: [["protocol", I.uint8], ["name", I.text], ["session", I.text], ["horizonX", I.uint16], ["horizonY", I.uint16], ["flag", I.text]],
        [P.BACKUP]: [["token", I.text]],
        [P.HORIZON]: [["horizonX", I.uint16], ["horizonY", I.uint16]],
        [P.ACK]: [],
        [P.PONG]: [["num", I.uint32]],
        [P.KEY]: [["seq", I.uint32], ["key", I.uint8], ["state", I.boolean]],
        [P.COMMAND]: [["com", I.text], ["data", I.text]],
        [P.SCOREDETAILED]: [],
        [P.CHAT]: [["text", I.text]],
        [P.WHISPER]: [["id", I.uint16], ["text", I.text]],
        [P.SAY]: [["text", I.text]],
        [P.TEAMCHAT]: [["text", I.text]],
        [P.VOTEMUTE]: [["id", I.uint16]],
        [P.LOCALPING]: [["auth", I.uint32]]
    }
      , A = {
        LOGIN: 0,
        BACKUP: 1,
        PING: 5,
        PING_RESULT: 6,
        ACK: 7,
        ERROR: 8,
        COMMAND_REPLY: 9,
        PLAYER_NEW: 10,
        PLAYER_LEAVE: 11,
        PLAYER_UPDATE: 12,
        PLAYER_FIRE: 13,
        PLAYER_HIT: 14,
        PLAYER_RESPAWN: 15,
        PLAYER_FLAG: 16,
        PLAYER_KILL: 17,
        PLAYER_UPGRADE: 18,
        PLAYER_TYPE: 19,
        PLAYER_POWERUP: 20,
        PLAYER_LEVEL: 21,
        PLAYER_RETEAM: 22,
        GAME_FLAG: 30,
        GAME_SPECTATE: 31,
        GAME_PLAYERSALIVE: 32,
        GAME_FIREWALL: 33,
        EVENT_REPEL: 40,
        EVENT_BOOST: 41,
        EVENT_BOUNCE: 42,
        EVENT_STEALTH: 43,
        EVENT_LEAVEHORIZON: 44,
        MOB_UPDATE: 60,
        MOB_UPDATE_STATIONARY: 61,
        MOB_DESPAWN: 62,
        MOB_DESPAWN_COORDS: 63,
        CHAT_PUBLIC: 70,
        CHAT_TEAM: 71,
        CHAT_SAY: 72,
        CHAT_WHISPER: 73,
        CHAT_VOTEMUTEPASSED: 78,
        CHAT_VOTEMUTED: 79,
        SCORE_UPDATE: 80,
        SCORE_BOARD: 81,
        SCORE_DETAILED: 82,
        SCORE_DETAILED_CTF: 83,
        SCORE_DETAILED_BTR: 84,
        SERVER_MESSAGE: 90,
        SERVER_CUSTOM: 91
    }
      , O = {
        [A.LOGIN]: [["success", I.boolean], ["id", I.uint16], ["team", I.uint16], ["clock", I.uint32], ["token", I.text], ["type", I.uint8], ["room", I.text], ["players", I.array, [["id", I.uint16], ["status", I.uint8], ["level", I.uint8], ["name", I.text], ["type", I.uint8], ["team", I.uint16], ["posX", I.coordx], ["posY", I.coordy], ["rot", I.rotation], ["flag", I.uint16], ["upgrades", I.uint8]]]],
        [A.BACKUP]: [],
        [A.PING]: [["clock", I.uint32], ["num", I.uint32]],
        [A.PING_RESULT]: [["ping", I.uint16], ["playerstotal", I.uint32], ["playersgame", I.uint32]],
        [A.ACK]: [],
        [A.ERROR]: [["error", I.uint8]],
        [A.COMMAND_REPLY]: [["type", I.uint8], ["text", I.textbig]],
        [A.PLAYER_NEW]: [["id", I.uint16], ["status", I.uint8], ["name", I.text], ["type", I.uint8], ["team", I.uint16], ["posX", I.coordx], ["posY", I.coordy], ["rot", I.rotation], ["flag", I.uint16], ["upgrades", I.uint8]],
        [A.PLAYER_LEAVE]: [["id", I.uint16]],
        [A.PLAYER_UPDATE]: [["clock", I.uint32], ["id", I.uint16], ["keystate", I.uint8], ["upgrades", I.uint8], ["posX", I.coord24], ["posY", I.coord24], ["rot", I.rotation], ["speedX", I.speed], ["speedY", I.speed]],
        [A.PLAYER_FIRE]: [["clock", I.uint32], ["id", I.uint16], ["energy", I.healthnergy], ["energyRegen", I.regen], ["projectiles", I.arraysmall, [["id", I.uint16], ["type", I.uint8], ["posX", I.coordx], ["posY", I.coordy], ["speedX", I.speed], ["speedY", I.speed], ["accelX", I.accel], ["accelY", I.accel], ["maxSpeed", I.speed]]]],
        [A.PLAYER_SAY]: [["id", I.uint16], ["text", I.text]],
        [A.PLAYER_RESPAWN]: [["id", I.uint16], ["posX", I.coord24], ["posY", I.coord24], ["rot", I.rotation], ["upgrades", I.uint8]],
        [A.PLAYER_FLAG]: [["id", I.uint16], ["flag", I.uint16]],
        [A.PLAYER_HIT]: [["id", I.uint16], ["type", I.uint8], ["posX", I.coordx], ["posY", I.coordy], ["owner", I.uint16], ["players", I.arraysmall, [["id", I.uint16], ["health", I.healthnergy], ["healthRegen", I.regen]]]],
        [A.PLAYER_KILL]: [["id", I.uint16], ["killer", I.uint16], ["posX", I.coordx], ["posY", I.coordy]],
        [A.PLAYER_UPGRADE]: [["upgrades", I.uint16], ["type", I.uint8], ["speed", I.uint8], ["defense", I.uint8], ["energy", I.uint8], ["missile", I.uint8]],
        [A.PLAYER_TYPE]: [["id", I.uint16], ["type", I.uint8]],
        [A.PLAYER_POWERUP]: [["type", I.uint8], ["duration", I.uint32]],
        [A.PLAYER_LEVEL]: [["id", I.uint16], ["type", I.uint8], ["level", I.uint8]],
        [A.PLAYER_RETEAM]: [["players", I.array, [["id", I.uint16], ["team", I.uint16]]]],
        [A.GAME_FLAG]: [["type", I.uint8], ["flag", I.uint8], ["id", I.uint16], ["posX", I.coord24], ["posY", I.coord24], ["blueteam", I.uint8], ["redteam", I.uint8]],
        [A.GAME_SPECTATE]: [["id", I.uint16]],
        [A.GAME_PLAYERSALIVE]: [["players", I.uint16]],
        [A.GAME_FIREWALL]: [["type", I.uint8], ["status", I.uint8], ["posX", I.coordx], ["posY", I.coordy], ["radius", I.float32], ["speed", I.float32]],
        [A.EVENT_REPEL]: [["clock", I.uint32], ["id", I.uint16], ["posX", I.coordx], ["posY", I.coordy], ["rot", I.rotation], ["speedX", I.speed], ["speedY", I.speed], ["energy", I.healthnergy], ["energyRegen", I.regen], ["players", I.arraysmall, [["id", I.uint16], ["keystate", I.uint8], ["posX", I.coordx], ["posY", I.coordy], ["rot", I.rotation], ["speedX", I.speed], ["speedY", I.speed], ["energy", I.healthnergy], ["energyRegen", I.regen], ["playerHealth", I.healthnergy], ["playerHealthRegen", I.regen]]], ["mobs", I.arraysmall, [["id", I.uint16], ["type", I.uint8], ["posX", I.coordx], ["posY", I.coordy], ["speedX", I.speed], ["speedY", I.speed], ["accelX", I.accel], ["accelY", I.accel], ["maxSpeed", I.speed]]]],
        [A.EVENT_BOOST]: [["clock", I.uint32], ["id", I.uint16], ["boost", I.boolean], ["posX", I.coord24], ["posY", I.coord24], ["rot", I.rotation], ["speedX", I.speed], ["speedY", I.speed], ["energy", I.healthnergy], ["energyRegen", I.regen]],
        [A.EVENT_BOUNCE]: [["clock", I.uint32], ["id", I.uint16], ["keystate", I.uint8], ["posX", I.coord24], ["posY", I.coord24], ["rot", I.rotation], ["speedX", I.speed], ["speedY", I.speed]],
        [A.EVENT_STEALTH]: [["id", I.uint16], ["state", I.boolean], ["energy", I.healthnergy], ["energyRegen", I.regen]],
        [A.EVENT_LEAVEHORIZON]: [["type", I.uint8], ["id", I.uint16]],
        [A.MOB_UPDATE]: [["clock", I.uint32], ["id", I.uint16], ["type", I.uint8], ["posX", I.coordx], ["posY", I.coordy], ["speedX", I.speed], ["speedY", I.speed], ["accelX", I.accel], ["accelY", I.accel], ["maxSpeed", I.speed]],
        [A.MOB_UPDATE_STATIONARY]: [["id", I.uint16], ["type", I.uint8], ["posX", I.float32], ["posY", I.float32]],
        [A.MOB_DESPAWN]: [["id", I.uint16], ["type", I.uint8]],
        [A.MOB_DESPAWN_COORDS]: [["id", I.uint16], ["type", I.uint8], ["posX", I.coordx], ["posY", I.coordy]],
        [A.SCORE_UPDATE]: [["id", I.uint16], ["score", I.uint32], ["earnings", I.uint32], ["upgrades", I.uint16], ["totalkills", I.uint32], ["totaldeaths", I.uint32]],
        [A.SCORE_BOARD]: [["data", I.array, [["id", I.uint16], ["score", I.uint32], ["level", I.uint8]]], ["rankings", I.array, [["id", I.uint16], ["x", I.uint8], ["y", I.uint8]]]],
        [A.SCORE_DETAILED]: [["scores", I.array, [["id", I.uint16], ["level", I.uint8], ["score", I.uint32], ["kills", I.uint16], ["deaths", I.uint16], ["damage", I.float32], ["ping", I.uint16]]]],
        [A.SCORE_DETAILED_CTF]: [["scores", I.array, [["id", I.uint16], ["level", I.uint8], ["captures", I.uint16], ["score", I.uint32], ["kills", I.uint16], ["deaths", I.uint16], ["damage", I.float32], ["ping", I.uint16]]]],
        [A.SCORE_DETAILED_BTR]: [["scores", I.array, [["id", I.uint16], ["level", I.uint8], ["alive", I.boolean], ["wins", I.uint16], ["score", I.uint32], ["kills", I.uint16], ["deaths", I.uint16], ["damage", I.float32], ["ping", I.uint16]]]],
        [A.CHAT_TEAM]: [["id", I.uint16], ["text", I.text]],
        [A.CHAT_PUBLIC]: [["id", I.uint16], ["text", I.text]],
        [A.CHAT_SAY]: [["id", I.uint16], ["text", I.text]],
        [A.CHAT_WHISPER]: [["from", I.uint16], ["to", I.uint16], ["text", I.text]],
        [A.CHAT_VOTEMUTEPASSED]: [["id", I.uint16]],
        [A.CHAT_VOTEMUTED]: [],
        [A.SERVER_MESSAGE]: [["type", I.uint8], ["duration", I.uint32], ["text", I.textbig]],
        [A.SERVER_CUSTOM]: [["type", I.uint8], ["data", I.textbig]]
    };
    Network.KEYPACKET = S,
    Network.KEYLOOKUP = {
        1: "UP",
        2: "DOWN",
        3: "LEFT",
        4: "RIGHT",
        5: "FIRE",
        6: "SPECIAL"
    },
    Network.CLIENTPACKET = P,
    Network.SERVERPACKET = A,
    Network.STATE = {
        LOGIN: 1,
        CONNECTING: 2,
        PLAYING: 3
    }
})();
