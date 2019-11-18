import Vector from './Vector';

var e = false,
    t = false,
    gamesSelectorVisible = false,
    gameTypes = [
        "",
        "ffa",
        "ctf",
        "br",
        "dev"
    ],
    gameTypeNames = [
        "",
        "Free For All",
        "Capture The Flag",
        "Battle Royale",
        "Development"
    ],
    gameTypeDescriptions = [
        "",
        "Everyone versus everyone deathmatch. No teams.",
        "Players split into 2 teams. 2 flags are placed inside each base. The objective is to move the enemy flag from their base to your base.",
        "Players spawn at random locations all across the map. Destroyed players will not respawn. Last player standing wins.",
        "Game environments for development and testing."
    ],
    totalPlayersOnlineCount = 0,
    gameHostState = {},
    inProgressPingCount = 0,
    performPingTimerId = null,
    closestGameRegion = null,
    gameHasStarted = false,
    gamesJsonDataIsLoaded = false,
    inviteCopiedTimer = null,
    gamesJsonData = [],
    isServerMaintenance = false,
    ctfGameState = {},
    firewallHotSmokeSprites = {},
    pixiJsGfx = null,
    minimapIsInitialized = false,
    firewallStatus = {
        radius: 0,
        pos: Vector.zero(),
        speed: 0
    },
    unlockedFeature = {
        2: "Custom country flags",
        3: "Emotes",
        4: "Flag Pack #1"
    };

Games.setup = function() {
    $("#playregion").on("click", function(e) {
        Games.updateRegion(true, e)
    }),
    $("#playtype").on("click", function(event) {
        Games.updateType(true, event)
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
    refreshGamesJsonData(function() {
        if (gamesJsonDataIsLoaded = true,
        updatePlayersOnlineCount(),
        DEVELOPMENT && "#tony" == window.location.hash)
            return game.playRegion = "eu",
            game.playRoom = "ffa1",
            game.playInvited = true,
            game.myOriginalName = window.location.hash.substr(1),
            void Games.start(game.myOriginalName, true);
        isServerMaintenance || (I(),
        Games.updateRegion(false),
        Games.updateType(false),
        initGameHostState())
    }, true)
};

Games.popupLogin = function(e) {
    openLoginWindow("/auth_" + ["", "facebook", "google", "twitter", "reddit", "twitch"][e], "Login", 4 == e ? 900 : 500, 500)
};

var openLoginWindow = function(url, windowTitle, width, height) {
    var i = void 0 != window.screenLeft ? window.screenLeft : window.screenX,
        o = void 0 != window.screenTop ? window.screenTop : window.screenY,
        s = (window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width) / 2 - width / 2 + i,
        a = (window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height) / 2 - height / 2 + o;
    window.open(url, windowTitle, "width=" + width + ", height=" + height + ", top=" + a + ", left=" + s)
};

window.loginSuccess = function(e) {
    config.settings.session = e,
    Tools.setSettings({
        session: e
    }),
    Tools.removeSetting("flag"),
    Games.playerAuth(),
    UI.closeLogin()
};

window.loginFailure = function() {};

Games.playerGuest = function() {
    UI.show("#playbutton", true),
    UI.show("#loginbutton", true)
};

Games.playerAuth = function() {
    Tools.ajaxPost("/auth", {
        session: config.settings.session
    }, function(e) {
        if (null != e) {
            game.loggedIn = true,
            game.myUserID = e.user;
            var t = UI.escapeHTML(e.authName.substr(0, 30)) + '<span class="grey">(' + ["", "Facebook", "Google", "Twitter", "Reddit", "Twitch"][e.authType] + ")</span>",
                n = t + '<span class="link" onclick="Games.logout()">Logout</span>',
                r = "Logged in as " + t + '<span class="button" onclick="Games.logout()">LOG OUT</span>';
            null != e.name && $("#playername").val(e.name),
            $("#logout").html(n),
            $("#logout-mainmenu").html(r),
            $("#loginbutton").remove(),
            $("#lifetime-account").remove(),
            $("#playbutton").html("PLAY"),
            UI.show("#playbutton", true)
        } else
            Games.playerGuest()
    })
};

Games.logout = function() {
    Tools.removeSetting("session"),
    Tools.removeSetting("name"),
    Tools.removeSetting("flag"),
    window.location = "/"
};

var refreshGamesJsonData = function(successCallback, t) {
    var url = "https://" + game.backendHost + "/games";
    t && (url += "?main=1"),
    $.ajax({
        url: url,
        dataType: "json",
        cache: false,
        success: function(response) {
            try {
                gamesJsonData = JSON.parse(response.data)
            } catch (e) {
                return
            }
            if ("xx" == game.myFlag && (game.myFlag = response.country),
            t && game.protocol != response.protocol) {
                if ("#reload" !== window.location.hash)
                    return void Tools.ajaxPost("https://" + game.backendHost + "/clienterror", {
                        type: "protocol"
                    }, function(e) {
                        UI.showMessage("alert", '<span class="mainerror">Protocol update<br>Your client is being updated to the new version</span>', 3e4),
                        setTimeout(function() {
                            window.location = "/?" + Tools.randomID(10) + "#reload"
                        }, 5e3)
                    });
                Tools.ajaxPost("https://" + game.backendHost + "/clienterror", {
                    type: "protocolretry"
                })
            }
            successCallback()
        },
        error: function() {}
    })
};

var updatePlayersOnlineCount = function() {
    totalPlayersOnlineCount = 0;
    for (var e = 0, t = 0; t < gamesJsonData.length; t++)
        for (var n = 0; n < gamesJsonData[t].games.length; n++)
            totalPlayersOnlineCount += gamesJsonData[t].games[n].players,
            e++;
    if (0 == e)
        isServerMaintenance = true,
        UI.showMessage("alert", '<span class="mainerror">We are currently performing server maintenance<br>Please try again in a few minutes</span>', 3e4);
    else {
        var r = '<div class="item smallerpad">' + totalPlayersOnlineCount + "</div>player" + (totalPlayersOnlineCount > 1 ? "s" : "") + " online";
        $("#gameinfo").html(r)
    }
};

var getPlayRegion = function(regionName) {
    if ("closest" === regionName)
        return {
            name: "Closest"
        };
    for (var t = 0; t < gamesJsonData.length; t++)
        if (gamesJsonData[t].id === regionName)
            return gamesJsonData[t];
    return game.playRegion = "closest",
    {
        name: "Closest"
    }
};

var getPlayData = function(e, gameTypeId) {
    var n = getPlayRegion(e);
    if (null == n)
        return null;
    if (null == n.games)
        return null;
    for (var o = 0; o < n.games.length; o++)
        if (n.games[o].id === gameTypeId)
            return n.games[o];
    var s = gameTypes.indexOf(gameTypeId);
    if (-1 != s)
        for (o = 0; o < n.games.length; o++)
            if (n.games[o].type == s)
                return {
                    name: gameTypeNames[s]
                };
    return null
};

var I = function() {
    var e = window.location.hash;
    if (history.replaceState(null, null, "/"),
    "#reload" !== e && null != e && !(e.length < 4 || e.length > 20)) {
        var t = (e = e.substr(1)).indexOf("-");
        if (-1 != t) {
            var n = e.substr(0, t),
                r = e.substr(t + 1);
            null != getPlayData(n, r) && (game.playRegion = n,
            game.playRoom = r,
            game.playInvited = true)
        }
    }
};

Games.selectRegion = function(e, t) {
    e.stopPropagation(),
    Sound.UIClick(),
    game.playRegion = t,
    Games.updateRegion(false),
    Games.updateType()
};

Games.selectGame = function(e, t) {
    e.stopPropagation(),
    Sound.UIClick(),
    game.playRoom = t,
    Games.updateType(false)
};

Games.closeDropdowns = function() {
    t && Games.updateType(false),
    e && Games.updateRegion(false)
};

Games.updateRegion = function(n, r) {
    var i = "",
        o = null;
    if (gamesJsonDataIsLoaded && !isServerMaintenance) {
        if (null != r && (r.stopPropagation(),
        e || Sound.UIClick()),
        n && UI.closeLogin(),
        null == n && (n = e),
        n) {
            t && Games.updateType(false),
            i += '<div class="item"><div class="region header">REGION</div><div class="players header">PLAYERS</div><div class="ping header">PING</div><div class="clear"></div></div>';
            var s = "";
            null != closestGameRegion && (s = '<span class="autoregion">(' + gamesJsonData[closestGameRegion].name + ")</span>"),
            i += '<div class="item selectable' + ("closest" === game.playRegion ? " sel" : "") + '" onclick="Games.selectRegion(event, &quot;closest&quot;)"><div class="region chooser">Closest' + s + '</div><div class="clear"></div></div>';
            for (var a = 0; a < gamesJsonData.length; a++) {
                for (var l = 0, c = 0; c < gamesJsonData[a].games.length; c++)
                    l += gamesJsonData[a].games[c].players;
                var d;
                d = null == gamesJsonData[a].ping ? "&nbsp;" : Math.round(gamesJsonData[a].ping) + '<span class="ms">ms</span>',
                i += '<div class="item selectable' + (game.playRegion === gamesJsonData[a].id ? " sel" : "") + '" onclick="Games.selectRegion(event, &quot;' + gamesJsonData[a].id + '&quot;)"><div class="region chooser">' + gamesJsonData[a].name + '</div><div class="players number">' + l + '</div><div class="ping chooser nopadding">' + d + '</div><div class="clear"></div></div>'
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
            i += '<div class="playbottom">' + getPlayRegion(game.playRegion).name + "</div>",
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
};

var getSelectedGameId = function() {
    var gameId = game.playRegion;
    if ("closest" === gameId) {
        if (null == closestGameRegion)
            return null;
        gameId = gamesJsonData[closestGameRegion].id
    }
    return gameId
};

var getGameTypeInfoHtml = function(gameType) {
    var t = '<div class="infott">';
    t += gameTypeDescriptions[gameType];
    t += '<div class="arrow"></div></div>';
    return t;
};

Games.updateType = function(trueOrFalseOrUndefined, clickEvent) {
    var s = "",
        a = null;
    if (gamesJsonDataIsLoaded && !isServerMaintenance) {
        if (null != clickEvent && (clickEvent.stopPropagation(),
        t || Sound.UIClick()),
        trueOrFalseOrUndefined && UI.closeLogin(),
        null == trueOrFalseOrUndefined && (trueOrFalseOrUndefined = t),
        trueOrFalseOrUndefined) {
            e && Games.updateRegion(false),
            s += '<div class="item"><div class="gametype header">GAME</div><div class="players header">PLAYERS</div><div class="clear"></div></div>';
            if (null == (p = getSelectedGameId()))
                return;
            null == getPlayData(p, game.playRoom) && (game.playRoom = gameTypes[1]);
            var l, u, c = getPlayRegion(p).games, d = [[], [], [], [], [], [], [], [], []];
            for (l = 0; l < c.length; l++)
                d[c[l].type].push(c[l]);
            for (l = 1; l < d.length; l++)
                if (0 != d[l].length)
                    for (s += '<div class="item selectable' + (gameTypes[l] === game.playRoom ? " sel" : "") + '" onclick="Games.selectGame(event, &quot;' + gameTypes[l] + '&quot;)"><div class="gametype chooser">' + gameTypeNames[l] + '<span class="infocontainer">&nbsp;<div class="infoicon">' + getGameTypeInfoHtml(l) + '</div></span></div><div class="clear"></div></div>',
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
            if (null == (p = getSelectedGameId()))
                return;
            var g = getPlayData(p, game.playRoom);
            null == g ? (name = gameTypeNames[1],
            game.playRoom = gameTypes[1]) : name = g.name,
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
        t = trueOrFalseOrUndefined
    }
};

Games.popGames = function() {
    if (!gamesSelectorVisible) {
        UI.closeAllPanels("games");
        var e = A();
        UI.hide("#menu"),
        $("#gameselector").html(e),
        UI.show("#gameselector"),
        gamesSelectorVisible = true,
        O(),
        Sound.UIClick()
    }
};

var A = function() {
    var e = "";
    e += '<div class="header">' + game.roomName + '<span class="region">&nbsp;&nbsp;&bull;&nbsp;&nbsp;' + game.regionName + '</span></div><div class="buttons"><div class="button" onclick="Games.redirRoot()">CHANGE REGION</div></div>';
    var t, n, i = getPlayRegion(game.playRegion).games, o = [[], [], [], [], [], [], [], [], []];
    for (t = 0; t < i.length; t++)
        o[i[t].type].push(i[t]);
    var s, a;
    for (t = 1; t < o.length; t++)
        if (0 != o[t].length)
            for (e += '<div class="item head"><div class="gametype chooser section">' + gameTypeNames[t] + '<span class="infocontainer">&nbsp;<div class="infoicon">' + getGameTypeInfoHtml(t) + '</div></span></div><div class="clear"></div></div>',
            n = 0; n < o[t].length; n++)
                o[t][n].id === game.playRoom ? (s = " sel",
                a = "") : (s = " selectable",
                a = ' onclick="Games.switchGame(&quot;' + o[t][n].id + '&quot;)"'),
                e += '<div class="item' + s + '"' + a + '><div class="gametype chooser">' + o[t][n].nameShort + '</div><div class="players number">' + o[t][n].players + '</div><div class="clear"></div></div>';
    return e
};

Games.redirRoot = function() {
    game.reloading = true,
    window.location = "/"
};

var O = function() {
    refreshGamesJsonData(function() {
        var e = A();
        $("#gameselector").html(e)
    })
};

Games.closeGames = function() {
    gamesSelectorVisible && (UI.hide("#gameselector"),
    UI.show("#menu"),
    gamesSelectorVisible = false,
    Sound.UIClick())
};

Games.toggleGames = function() {
    gamesSelectorVisible ? Games.closeGames() : Games.popGames()
};

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
};

var initGameHostState = function() {
    gameHostState = {},
    inProgressPingCount = 0;
    for (var t = 0; t < gamesJsonData.length; t++) {
        var host = gamesJsonData[t].games[Tools.randInt(0, gamesJsonData[t].games.length - 1)].host;
        if(null == gameHostState[host]) {
            gameHostState[host] = {
                ping: 9999,
                num: 0,
                threshold: 0,
                server: t
            };
        }
    }
    Games.performPing();
    Games.performPing();
    Games.performPing();
    performPingTimerId = setInterval(Games.performPing, 300);
};

Games.performPing = function() {
    if (!(inProgressPingCount > 3 || gameHasStarted)) {
        var e = 9999,
            gameKey = null;
        for (var key in gameHostState)
            gameHostState[key].num < e && (e = gameHostState[key].num,
            gameKey = key);
        if (e > 6)
            null != performPingTimerId && clearInterval(performPingTimerId);
        else {
            gameHostState[gameKey].num++;
            var pingUrl;
            pingUrl = DEVELOPMENT ? "/ping" : "https://" + gameKey + "/ping",
            performSinglePing(gameKey, pingUrl, function() {
                performSinglePing(gameKey, pingUrl)
            })
        }
    }
};

var performSinglePing = function(gameKey, pingUrl, onSuccess) {
    if (null != gameHostState[gameKey] && !gameHasStarted) {
        inProgressPingCount++;
        var now = performance.now();
        fetch(pingUrl, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-cache"
        }).then(response => {
            if (!gameHasStarted && (inProgressPingCount--,
                null != gameHostState[gameKey])) {
                var delay = performance.now() - now;
                if (Math.abs(gameHostState[gameKey].ping - delay) < .1 * delay && gameHostState[gameKey].threshold++,
                gameHostState[gameKey].threshold >= 2)
                    return delay < gameHostState[gameKey].ping && (gamesJsonData[gameHostState[gameKey].server].ping = delay,
                    Games.findClosest(),
                    Games.updateRegion()),
                    void delete gameHostState[gameKey];
                delay < gameHostState[gameKey].ping && (gameHostState[gameKey].ping = delay,
                gamesJsonData[gameHostState[gameKey].server].ping = delay,
                Games.findClosest(),
                Games.updateRegion(),
                null != onSuccess && onSuccess())
            }
        }).catch(error => {
            inProgressPingCount--
        })
    }
};

Games.findClosest = function() {
    for (var bestPing = 9999, foundSaneGameRegion = false, n = 0; n < gamesJsonData.length; n++)
        null != gamesJsonData[n].ping && gamesJsonData[n].ping < bestPing && (bestPing = gamesJsonData[n].ping,
        closestGameRegion = n,
        foundSaneGameRegion = true);
    foundSaneGameRegion && "closest" === game.playRegion && Games.updateType()
};

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
};

Games.copyInviteLink = function() {
    D(game.inviteLink) && (UI.show("#invite-copied"),
    null != inviteCopiedTimer && clearTimeout(inviteCopiedTimer),
    inviteCopiedTimer = setTimeout(function() {
        UI.hide("#invite-copied")
    }, 2e3))
};

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
    var s = false;
    try {
        s = r.document.execCommand("copy")
    } catch (e) {}
    return i.removeAllRanges(),
    t.remove(),
    n.remove(),
    s
};

Games.start = function(playerName, isFirstTime) {
    const stillInitializing = isFirstTime && game.state == Network.STATE.CONNECTING;
    if (isServerMaintenance || stillInitializing) {
        return;
    }

    var playRegion = game.playRegion;
    var gameId = getSelectedGameId();
    if (!gameId) {
        return;
    }

    game.playRegion = gameId;
    if (null != performPingTimerId) {
            clearInterval(performPingTimerId);
    }
    gameHasStarted = true;

    var playRoom = getPlayRoom();

    var data = getPlayData(game.playRegion, playRoom);
    game.playHost = data.host;
    game.playPath = data.path;
    game.regionName = getPlayRegion(game.playRegion).name;
    game.playRoom = playRoom;
    if (game.state == Network.STATE.LOGIN) {
        Tools.wipeReel();
    }
    game.state = Network.STATE.CONNECTING;
    var player = {
        name: playerName
    };

    if (!game.playInvited) {
        player.region = playRegion;
    }

    Tools.setSettings(player);
    UI.gameStart(playerName, isFirstTime);
    
    // this is for stats and not necessary for the game
    if (isFirstTime) {
        Tools.ajaxPost("https://" + game.backendHost + "/enter", {
            id: config.settings.id,
            name: playerName,
            game: game.playRegion + "-" + game.playRoom,
            source: null != document.referrer ? document.referrer : "",
            mode: config.mobile ? 1 : 0
        });
    }
};

function getPlayRoom() {
    var result = game.playRoom;
    var playRoomIndex = gameTypes.indexOf(result);
    if (-1 != playRoomIndex) {
        var playRegionGames = getPlayRegion(game.playRegion).games;
        var roomIds = [];
        for (var i = 0; i < playRegionGames.length; i++) {
            if (playRegionGames[i].type == playRoomIndex) {
                roomIds.push(playRegionGames[i].id);
            }
        }
        result = roomIds[Tools.rand(0, 1) < .5 ? (roomIds.length - 1) : Tools.randInt(0, roomIds.length - 1)];
    }
    return result;
}

Games.prep = function() {
    if (Games.wipe(),
    2 == game.gameType) {
        $("#gamespecific").html('<div class="blueflag"></div><div id="blueflag-name" class="blueflag-player">&nbsp;</div><div class="redflag"></div><div id="redflag-name" class="redflag-player">&nbsp;</div>'),
        UI.show("#gamespecific"),
        ctfGameState = {
            flagBlue: {
                visible: false,
                playerId: null,
                direction: 1,
                diffX: 0,
                momentum: 0,
                position: Vector.zero(),
                basePos: new Vector(-9669,-1471),
                sprite: Textures.init("ctfFlagBlue", {
                    scale: .4,
                    visible: false
                }),
                spriteShadow: Textures.init("ctfFlagShadow", {
                    scale: .4 * 1.1,
                    visible: false
                }),
                minimapSprite: Textures.init("minimapFlagBlue"),
                minimapBase: Textures.init("minimapBaseBlue")
            },
            flagRed: {
                visible: false,
                playerId: null,
                direction: 1,
                diffX: 0,
                momentum: 0,
                position: Vector.zero(),
                basePos: new Vector(8602,-944),
                sprite: Textures.init("ctfFlagRed", {
                    scale: .4,
                    visible: false
                }),
                spriteShadow: Textures.init("ctfFlagShadow", {
                    scale: .4 * 1.1,
                    visible: false
                }),
                minimapSprite: Textures.init("minimapFlagRed"),
                minimapBase: Textures.init("minimapBaseRed")
            }
        },
        Graphics.minimapMob(ctfGameState.flagBlue.minimapBase, ctfGameState.flagBlue.basePos.x, ctfGameState.flagBlue.basePos.y),
        Graphics.minimapMob(ctfGameState.flagRed.minimapBase, ctfGameState.flagRed.basePos.x, ctfGameState.flagRed.basePos.y)
    } else
        3 == game.gameType && ($("#gamespecific").html(""),
        UI.show("#gamespecific"))
};

Games.wipe = function() {
    deinitMinimapAndFirewall(),
    ctfGameState.flagBlue && ctfGameState.flagRed && (game.graphics.layers.flags.removeChild(ctfGameState.flagBlue.sprite),
    game.graphics.layers.flags.removeChild(ctfGameState.flagRed.sprite),
    game.graphics.layers.shadows.removeChild(ctfGameState.flagBlue.spriteShadow),
    game.graphics.layers.shadows.removeChild(ctfGameState.flagRed.spriteShadow),
    game.graphics.layers.ui3.removeChild(ctfGameState.flagBlue.minimapSprite),
    game.graphics.layers.ui3.removeChild(ctfGameState.flagRed.minimapSprite),
    game.graphics.layers.ui2.removeChild(ctfGameState.flagBlue.minimapBase),
    game.graphics.layers.ui2.removeChild(ctfGameState.flagRed.minimapBase),
    ctfGameState.flagBlue.sprite.destroy(),
    ctfGameState.flagRed.sprite.destroy(),
    ctfGameState.flagBlue.spriteShadow.destroy(),
    ctfGameState.flagRed.spriteShadow.destroy(),
    ctfGameState.flagBlue.minimapSprite.destroy(),
    ctfGameState.flagRed.minimapSprite.destroy(),
    ctfGameState.flagBlue.minimapBase.destroy(),
    ctfGameState.flagRed.minimapBase.destroy())
};

Games.networkFlag = function(flagMsg) {
    var flagState = 1 == flagMsg.flag ? ctfGameState.flagBlue : ctfGameState.flagRed,
        flagElemSelector = 1 == flagMsg.flag ? "#blueflag-name" : "#redflag-name",
        r = 1 == flagMsg.flag ? flagMsg.blueteam : flagMsg.redteam;
    flagState.momentum = 0,
    flagState.direction = 1,
    flagState.sprite.scale.x = .4,
    flagState.sprite.rotation = 0,
    flagState.spriteShadow.scale.x = .4 * 1.1,
    flagState.spriteShadow.rotation = 0;
    var i = '<span class="rounds">' + r + '<span class="divider">/</span>3</span>';
    if (1 == flagMsg.type) {
        flagState.playerId = null,
        flagState.position.x = flagMsg.posX,
        flagState.position.y = flagMsg.posY,
        flagState.sprite.position.set(flagMsg.posX, flagMsg.posY);
        var o = Graphics.shadowCoords(new Vector(flagMsg.posX,flagMsg.posY));
        flagState.spriteShadow.position.set(o.x, o.y),
        Graphics.minimapMob(flagState.minimapSprite, flagMsg.posX, flagMsg.posY),
        $(flagElemSelector).html(i)
    } else {
        flagState.playerId = flagMsg.id;
        var s = Players.get(flagMsg.id);
        null != s && (1 == flagMsg.flag ? i = UI.escapeHTML(s.name) + i : i += UI.escapeHTML(s.name)),
        flagState.diffX = s.pos.x,
        $(flagElemSelector).html(i)
    }
    updateCtfFlagState(flagState, false)
};

var updateCtfFlagState = function(e, t) {
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

Games.spectate = function(playerID) {
    null == game.spectatingID && 3 != game.gameType && UI.showMessage("alert", '<span class="info">SPECTATOR MODE</span>Click on Respawn to resume playing', 4e3),
    game.spectatingID = playerID;
    var player = Players.get(playerID),
        n = '<div id="spectator-tag" class="spectating">Spectating ' + (null == player ? "" : UI.escapeHTML(player.name)) + '</div><div class="buttons"><div onclick="Network.spectateNext()" class="changeplayer left"><div class="arrow"></div></div><div onclick="Network.spectatePrev()" class="changeplayer right"><div class="arrow"></div></div></div>';
    UI.showSpectator(n)
};

Games.spectatorSwitch = function(e) {
    setTimeout(function() {
        e == game.spectatingID && Network.spectateNext()
    }, 2e3)
};

Games.playersAlive = function(e) {
    var t = "";
    e > 1 && (t = '<div class="playersalive">' + e + " players alive</div>"),
    $("#gamespecific").html(t)
};

Games.showBTRWin = function(e) {
    if (!$("#custom-msg").length) {
        var t = '<div id="custom-msg" class="btrwin"><div class="trophy"></div><div class="winner"><div class="player"><span class="flag big flag-' + e.f + '"></span>' + UI.escapeHTML(e.p) + '</div></div><div class="bounty"><span class="stat">' + e.k + " KILL" + (1 == e.k ? "" : "S") + "</span>+" + e.b + " BOUNTY</div></div>";
        $("body").append(t),
        UI.showPanel("#custom-msg"),
        setTimeout(function() {
            UI.hidePanel("#custom-msg", false, true)
        }, 1e3 * e.t),
        Sound.gameComplete()
    }
};

Games.showCTFWin = function(e) {
    if (!$("#custom-msg").length) {
        var t = '<div id="custom-msg" class="ctfwin"><div class="trophy"></div><div class="winner">' + (1 == e.w ? '<div class="player blue">BLUE TEAM</div>' : '<div class="player red">RED TEAM</div>') + '</div><div class="bounty">+' + e.b + " BOUNTY</div></div>";
        $("body").append(t),
        UI.showPanel("#custom-msg"),
        setTimeout(function() {
            UI.hidePanel("#custom-msg", false, true)
        }, 1e3 * e.t),
        Sound.gameComplete()
    }
};

Games.showLevelUP = function(e) {
    $("#custom-msg").length && $("#custom-msg").remove();
    var t = "",
        n = " lvlsmaller";
    null != unlockedFeature[e + ""] && (n = "",
    t = '<div class="unlocked">FEATURE UNLOCKED<br><div class="unlockedtext">' + unlockedFeature[e + ""] + "</div></div>");
    var r = '<div id="custom-msg" class="levelup' + n + '"><div class="leveltext">NEW LEVEL REACHED</div><div class="levelbadge"></div><div class="levelnum">' + e + "</div>" + t + "</div>";
    $("body").append(r),
    UI.showPanel("#custom-msg"),
    Sound.levelUp(),
    UI.showChatLevel(e)
};

Games.popFirewall = function(e, t) {
    t <= 0 && (t = 0),
    minimapIsInitialized || (minimapIsInitialized = true,
    pixiJsGfx = new PIXI.Graphics,
    game.graphics.gui.minimap.mask = pixiJsGfx),
    pixiJsGfx.clear(),
    pixiJsGfx.beginFill(16777215),
    pixiJsGfx.drawCircle(game.screenX - config.minimapPaddingX - config.minimapSize * (16384 - e.x) / 32768, game.screenY - config.minimapPaddingY - config.minimapSize / 2 * (8192 - e.y) / 16384, 2 * t / (256 / config.minimapSize * 256)),
    pixiJsGfx.endFill();
    var n = Graphics.getCamera(),
          r = Math.ceil((game.halfScreenX + 64) / game.scale / 64),
          i = Math.ceil((game.halfScreenY + 64) / game.scale / 64),
          o = 0,
          s = 0,
          a = "",
          l = {},
          u = 0,
          c = 0,
          h = new Vector(n.x - game.halfScreenX / game.scale - 64,n.y - game.halfScreenY / game.scale - 64),
          d = new Vector(n.x + game.halfScreenX / game.scale + 64,n.y - game.halfScreenY / game.scale - 64),
          p = new Vector(n.x - game.halfScreenX / game.scale - 64,n.y + game.halfScreenY / game.scale + 64),
          f = new Vector(n.x + game.halfScreenX / game.scale + 64,n.y + game.halfScreenY / game.scale + 64);
    if (Tools.distance(e.x, e.y, h.x, h.y) > t || Tools.distance(e.x, e.y, d.x, d.y) > t || Tools.distance(e.x, e.y, p.x, p.y) > t || Tools.distance(e.x, e.y, f.x, f.y) > t)
        for (var g = -r; g <= r; g++)
            for (var b = -i; b <= i; b++)
                if (o = 64 * (Math.floor(n.x / 64) + .5) + 64 * g,
                s = 64 * (Math.floor(n.y / 64) + .5) + 64 * b,
                !((u = Tools.distance(o, s, e.x, e.y)) < t) && (a = o + "_" + s,
                l[a] = true,
                null == firewallHotSmokeSprites[a])) {
                    var sprite = Textures.sprite("hotsmoke_" + Tools.randInt(1, 4));
                    sprite.scale.set(Tools.rand(1.5, 2.5)),
                    sprite.anchor.set(.5, .5),
                    sprite.position.set(o, s),
                    c = 1,
                    Tools.rand(0, 1) > .5 && (sprite.blendMode = PIXI.BLEND_MODES.ADD,
                    c = .5),
                    game.graphics.layers.powerups.addChild(sprite),
                    firewallHotSmokeSprites[a] = {
                        sprite: sprite,
                        rotation: Tools.rand(0, 100),
                        rotationSpeed: Tools.rand(-.0025, .0025),
                        opacity: 0,
                        maxOpacity: c,
                        opacitySpeed: u - t >= 64 ? .02 : .0035,
                        color: Tools.rand(0, 1),
                        colorDir: Tools.rand(0, 1) < .5 ? -1 : 1
                    }
                }
    for (var x in firewallHotSmokeSprites)
        null != l[x] ? (firewallHotSmokeSprites[x].rotation += firewallHotSmokeSprites[x].rotationSpeed * game.timeFactor,
        firewallHotSmokeSprites[x].opacity += firewallHotSmokeSprites[x].opacitySpeed * game.timeFactor,
        firewallHotSmokeSprites[x].opacity > firewallHotSmokeSprites[x].maxOpacity && (firewallHotSmokeSprites[x].opacity = firewallHotSmokeSprites[x].maxOpacity),
        firewallHotSmokeSprites[x].color += .005 * firewallHotSmokeSprites[x].colorDir * game.timeFactor,
        firewallHotSmokeSprites[x].color < 0 && (firewallHotSmokeSprites[x].colorDir = 1),
        firewallHotSmokeSprites[x].color > 1 && (firewallHotSmokeSprites[x].colorDir = -1),
        firewallHotSmokeSprites[x].sprite.rotation = firewallHotSmokeSprites[x].rotation,
        firewallHotSmokeSprites[x].sprite.alpha = firewallHotSmokeSprites[x].opacity,
        firewallHotSmokeSprites[x].sprite.tint = Tools.colorLerp(16427014, 16404230, firewallHotSmokeSprites[x].color)) : (game.graphics.layers.powerups.removeChild(firewallHotSmokeSprites[x].sprite),
        firewallHotSmokeSprites[x].sprite.destroy(),
        delete firewallHotSmokeSprites[x])
};

var deinitMinimapAndFirewall = function() {
    if (minimapIsInitialized) {
        for (var e in firewallHotSmokeSprites)
            game.graphics.layers.powerups.removeChild(firewallHotSmokeSprites[e].sprite),
            firewallHotSmokeSprites[e].sprite.destroy();
        firewallHotSmokeSprites = {},
        game.graphics.gui.minimap.mask = null,
        null != pixiJsGfx && (pixiJsGfx.destroy(),
        pixiJsGfx = null),
        minimapIsInitialized = false
    }
};

Games.handleFirewall = function(firewallMsg) {
    0 == firewallMsg.status ? deinitMinimapAndFirewall() : (firewallStatus.radius = firewallMsg.radius,
    firewallStatus.pos.x = firewallMsg.posX,
    firewallStatus.pos.y = firewallMsg.posY,
    firewallStatus.speed = firewallMsg.speed,
    Games.popFirewall(firewallStatus.pos, firewallStatus.radius))
};

Games.update = function(e) {
    2 == game.gameType && ctfGameState.flagBlue && (updateCtfFlagState(ctfGameState.flagBlue, e),
    updateCtfFlagState(ctfGameState.flagRed, e)),
    3 == game.gameType && minimapIsInitialized && (firewallStatus.radius += firewallStatus.speed / 60 * game.timeFactor,
    Games.popFirewall(firewallStatus.pos, firewallStatus.radius))
};