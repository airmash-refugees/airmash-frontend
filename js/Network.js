(function() {
    var primarySock = null
      , backupSock = null
      , backupSockIsConnected = false
      , currentSockUrl = ""
      , shouldSendNextAckOnBackupSock = false
      , ackIntervalId = null
      , lastPacketDivClk = -1
      , lastPacketTime = -1
      , jitterMemory = 0
      , messageTombstoneMap = {}
      , lastTombstoneGcTime = 0
      , sendKeyCount = 0
      , oldTimeNetwork = 0
      , lastReceivedError = false
      , f = 2e3
      , g = 2e3;
    Network.sendKey = function(e, r) {
        if (game.state == Network.STATE.PLAYING) {
            sendKeyCount++;
            var msg = {
                c: ClientMessage.KEY,
                seq: sendKeyCount,
                key: KeyCodes[e],
                state: r
            };
            null != game.spectatingID && r && ("RIGHT" == e ? Network.spectatePrev() : "LEFT" == e && Network.spectateNext()),
            sendMessageDict(msg),
            backupSock && backupSockIsConnected && sendMessageDict(msg, true)
        }
    }
    ,
    Network.sendChat = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: ClientMessage.CHAT,
            text: e
        })
    }
    ,
    Network.sendWhisper = function(e, t) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: ClientMessage.WHISPER,
            id: e,
            text: t
        })
    }
    ,
    Network.sendSay = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: ClientMessage.SAY,
            text: e
        })
    }
    ,
    Network.sendTeam = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: ClientMessage.TEAMCHAT,
            text: e
        })
    }
    ,
    Network.sendCommand = function(e, t) {
        game.state == Network.STATE.PLAYING && ("flag" === e && (game.lastFlagSet = t),
        sendMessageDict({
            c: ClientMessage.COMMAND,
            com: e,
            data: t
        }))
    }
    ,
    Network.voteMute = function(e) {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: ClientMessage.VOTEMUTE,
            id: e
        })
    }
    ,
    Network.force = function(e) {
        var t;
        Players.network(ServerMessage.PLAYER_UPDATE, e);
        for (t in e.players)
            Players.network(ServerMessage.PLAYER_UPDATE, e.players[t]);
        for (t in e.mobs)
            Mobs.network(e.mobs[t]);
        var n = new Vector(e.posX,e.posY);
        Particles.spiritShockwave(n),
        Sound.effectRepel(n)
    }
    ,
    Network.getScores = function() {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: ClientMessage.SCOREDETAILED
        })
    }
    ,
    Network.resizeHorizon = function() {
        game.state == Network.STATE.PLAYING && sendMessageDict({
            c: ClientMessage.HORIZON,
            horizonX: Math.ceil(game.halfScreenX / game.scale),
            horizonY: Math.ceil(game.halfScreenY / game.scale)
        })
    }
    ,
    Network.detectConnectivity = function() {
        game.lagging = game.timeNetwork - oldTimeNetwork > 1300
    }
    ,
    Network.shutdown = function() {
        null != ackIntervalId && clearInterval(ackIntervalId),
        null != primarySock && primarySock.close(),
        null != backupSock && backupSock.close(),
        backupSockIsConnected = false,
        shouldSendNextAckOnBackupSock = false,
        lastPacketDivClk = -1,
        lastPacketTime = -1,
        jitterMemory = 0,
        messageTombstoneMap = {},
        lastTombstoneGcTime = 0,
        sendKeyCount = 0,
        oldTimeNetwork = 0,
        lastReceivedError = false,
        f = 2e3,
        g = 2e3
    }
    ,
    Network.receivedError = function(errorText) {
        lastReceivedError = errorText
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
    var sendRegularAckMsg = function() {
        game.lagging || game.state == Network.STATE.PLAYING && (shouldSendNextAckOnBackupSock ? backupSock && backupSockIsConnected && sendMessageDict({
            c: ClientMessage.ACK
        }, true) : sendMessageDict({
            c: ClientMessage.ACK
        }),
        shouldSendNextAckOnBackupSock = !shouldSendNextAckOnBackupSock)
    }
      , saveLastPacketTimes = function(packetDivClk) {
        if(Math.abs(packetDivClk - lastPacketDivClk) > 36e5) {
            lastPacketDivClk = packetDivClk;
            lastPacketTime = performance.now();
            jitterMemory = 0;
        }
    }
      , dispatchIncomingMessage = function(msg) {
        if (game.state == Network.STATE.PLAYING || msg.c == ServerMessage.LOGIN || msg.c == ServerMessage.ERROR) {
            if ((msg.c == ServerMessage.PLAYER_UPDATE || msg.c == ServerMessage.PLAYER_FIRE || msg.c == ServerMessage.EVENT_BOOST || msg.c == ServerMessage.EVENT_BOUNCE) && msg.id == game.myID || msg.c == ServerMessage.PING) {
                if (msg.c != ServerMessage.PING && shouldDiscardTimestampedMessage(msg))
                    return;
                game.timeNetwork = performance.now(),
                oldTimeNetwork = game.timeNetwork,
                function(curPacketDivClk) {
                    game.jitter = 0;
                    if (-1 != lastPacketDivClk) {
                        saveLastPacketTimes(curPacketDivClk);
                        var curTime = game.timeNetwork;
                        var delta = (curPacketDivClk - lastPacketDivClk) - (curTime - lastPacketTime);
                        var newJitter = delta - (jitterMemory = (.8 * jitterMemory) + (delta / 5));
                        if(Math.abs(newJitter) < 100) {
                            game.jitter = newJitter;
                        }
                    }
                }(msg.clock / 100)
            } else
                game.timeNetwork = performance.now(),
                oldTimeNetwork = game.timeNetwork,
                null != msg.clock && function(curPacketDivClk) {
                    -1 != lastPacketDivClk && (saveLastPacketTimes(curPacketDivClk),
                    game.jitter = curPacketDivClk - lastPacketDivClk - (game.timeNetwork - lastPacketTime) - jitterMemory)
                }(msg.clock / 100);
            switch (msg.c) {
            case ServerMessage.PLAYER_UPDATE:
            case ServerMessage.PLAYER_FIRE:
            case ServerMessage.CHAT_SAY:
            case ServerMessage.PLAYER_RESPAWN:
            case ServerMessage.PLAYER_FLAG:
            case ServerMessage.EVENT_BOOST:
            case ServerMessage.EVENT_BOUNCE:
                if (Players.network(msg.c, msg),
                msg.c === ServerMessage.PLAYER_FIRE) {
                    for (var t = 0; t < msg.projectiles.length; t++)
                        msg.projectiles[t].c = ServerMessage.PLAYER_FIRE,
                        Mobs.add(msg.projectiles[t]);
                    msg.projectiles.length > 0 && Sound.missileLaunch(new Vector(msg.projectiles[0].posX,msg.projectiles[0].posY), msg.projectiles[0].type)
                }
                break;
            case ServerMessage.LOGIN:
                !function(e) {
                    ackIntervalId = setInterval(sendRegularAckMsg, 50);
                    game.myID = e.id;
                    game.myTeam = e.team;
                    game.myToken = e.token;
                    game.state = Network.STATE.PLAYING;
                    game.roomName = e.room;
                    game.gameType = e.type;
                    game.spectatingID = null;
                    game.myLevel = 0;
                    Games.prep();
                    lastPacketDivClk = e.clock / 100;
                    lastPacketTime = performance.now();
                    initBackupSock();
                }(msg),
                UI.loggedIn(msg);
                for (t = 0; t < msg.players.length; t++)
                    Players.add(msg.players[t], true);
                break;
            case ServerMessage.ERROR:
                UI.errorHandler(msg);
                break;
            case ServerMessage.PLAYER_NEW:
                Players.add(msg);
                break;
            case ServerMessage.PLAYER_LEAVE:
                Players.destroy(msg.id);
                break;
            case ServerMessage.PLAYER_TYPE:
                Players.changeType(msg);
                break;
            case ServerMessage.PLAYER_HIT:
                Players.impact(msg),
                200 != msg.type && Mobs.destroy(msg);
                break;
            case ServerMessage.PLAYER_KILL:
                Players.kill(msg);
                break;
            case ServerMessage.PLAYER_UPGRADE:
                UI.updateUpgrades([msg.speed, msg.defense, msg.energy, msg.missile], msg.upgrades, msg.type);
                break;
            case ServerMessage.PLAYER_POWERUP:
                Players.powerup(msg);
                break;
            case ServerMessage.PLAYER_LEVEL:
                Players.updateLevel(msg);
                break;
            case ServerMessage.PLAYER_RETEAM:
                for (t = 0; t < msg.players.length; t++)
                    Players.reteam(msg.players[t]);
                break;
            case ServerMessage.EVENT_REPEL:
                Network.force(msg);
                break;
            case ServerMessage.EVENT_LEAVEHORIZON:
                0 == msg.type ? Players.leaveHorizon(msg) : Mobs.destroy(msg);
                break;
            case ServerMessage.EVENT_STEALTH:
                Players.stealth(msg);
                break;
            case ServerMessage.MOB_UPDATE:
            case ServerMessage.MOB_UPDATE_STATIONARY:
                Mobs.network(msg);
                break;
            case ServerMessage.MOB_DESPAWN:
                Mobs.despawn(msg);
                break;
            case ServerMessage.MOB_DESPAWN_COORDS:
                Mobs.destroy(msg);
                break;
            case ServerMessage.GAME_FLAG:
                Games.networkFlag(msg);
                break;
            case ServerMessage.GAME_PLAYERSALIVE:
                Games.playersAlive(msg.players);
                break;
            case ServerMessage.SCORE_UPDATE:
                UI.newScore(msg);
                break;
            case ServerMessage.SCORE_BOARD:
                UI.scoreboardUpdate(msg.data, msg.rankings, config.maxScoreboard),
                Players.updateBadges(msg.data);
                break;
            case ServerMessage.SCORE_DETAILED:
            case ServerMessage.SCORE_DETAILED_CTF:
            case ServerMessage.SCORE_DETAILED_BTR:
                UI.updateScore(msg);
                break;
            case ServerMessage.PING:
                !function(e) {
                    sendMessageDict({
                        c: ClientMessage.PONG,
                        num: e
                    })
                }(msg.num);
                break;
            case ServerMessage.PING_RESULT:
                UI.updateStats(msg);
                break;
            case ServerMessage.CHAT_PUBLIC:
                if (config.mobile)
                    return;
                Players.chat(msg);
                break;
            case ServerMessage.CHAT_TEAM:
                if (config.mobile)
                    return;
                Players.teamChat(msg);
                break;
            case ServerMessage.CHAT_WHISPER:
                if (config.mobile)
                    return;
                Players.whisper(msg);
                break;
            case ServerMessage.CHAT_VOTEMUTEPASSED:
                if (config.mobile)
                    return;
                Players.votemutePass(msg);
                break;
            case ServerMessage.CHAT_VOTEMUTED:
                if (config.mobile)
                    return;
                return void UI.chatMuted();
            case ServerMessage.SERVER_MESSAGE:
                UI.serverMessage(msg);
                break;
            case ServerMessage.SERVER_CUSTOM:
                handleCustomMessage(msg);
                break;
            case ServerMessage.GAME_SPECTATE:
                Games.spectate(msg.id);
                break;
            case ServerMessage.GAME_FIREWALL:
                Games.handleFirewall(msg);
                break;
            case ServerMessage.COMMAND_REPLY:
                UI.showCommandReply(msg)
            }
        }
    }
      , handleCustomMessage = function(msg) {
        try {
            var t = JSON.parse(msg.data)
        } catch (e) {
            return
        }
        1 == msg.type ? Games.showBTRWin(t) : 2 == msg.type && Games.showCTFWin(t)
    }
      , shouldDiscardTimestampedMessage = function(msg) {
        var msgTombstone = msg.c + "_" + msg.clock + "_" + msg.posX + "_" + msg.posY + "_" + msg.rot + "_" + msg.speedX + "_" + msg.speedY;
        var now = performance.now();

        if((now - lastTombstoneGcTime) > 15e3) {
            for(var key in messageTombstoneMap) {
                if((now - messageTombstoneMap[key]) > 3e4) {
                    delete messageTombstoneMap[key];
                }
            }
            lastTombstoneGcTime = now;
        }

        if(messageTombstoneMap[msgTombstone] != null) {
            return true;
        } else {
            messageTombstoneMap[msgTombstone] = now;
            return false;
        }
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
            currentSockUrl = -1 != document.domain.indexOf("192.168.") ? "ws://" + document.domain + ":8010/" + game.playPath : "ws://" + game.playHost + ".airmash.devel:8000/" + game.playPath
        } else
            //r = "wss://game-" + game.playHost + ".airma.sh/" + game.playPath;
            currentSockUrl = game.playData.url; // DERPS
        backupSock && backupSockIsConnected && backupSock.close(),
        (primarySock = new WebSocket(currentSockUrl)).binaryType = "arraybuffer",
        primarySock.onopen = function() {
            sendMessageDict({
                c: ClientMessage.LOGIN,
                protocol: game.protocol,
                name: game.myName,
                session: config.settings.session ? config.settings.session : "none",
                horizonX: Math.ceil(game.halfScreenX / game.scale),
                horizonY: Math.ceil(game.halfScreenY / game.scale),
                flag: game.myFlag
            })
        }
        ,
        primarySock.onclose = function() {
            null != ackIntervalId && clearInterval(ackIntervalId),
            game.state !== Network.STATE.CONNECTING && (game.state = Network.STATE.CONNECTING,
            false === lastReceivedError && Network.reconnectMessage())
        }
        ,
        primarySock.onerror = function(event) {
            console.error("WebSocket error observed:", event);
            UI.serverMessage({
                type: 1,
                text: "WebSocket connection failed. Try disabling AdBlock!",
                duration: 30000
            });
        }
        ,
        primarySock.onmessage = function(e) {
            dispatchIncomingMessage(decodeMessageToDict(e.data))
        }
    }
    ;
    var initBackupSock = function() {
        (backupSock = new WebSocket(currentSockUrl)).binaryType = "arraybuffer";
        backupSock.onopen = function() {
            sendMessageDict({
                c: ClientMessage.BACKUP,
                token: game.myToken
            }, true)
        }
        ,
        backupSock.onclose = function() {
            backupSockIsConnected = false
        }
        ,
        backupSock.onerror = function(event) {
            console.error("WebSocket error observed:", event);
            UI.serverMessage({
                type: 1,
                text: "WebSocket connection failed. Try disabling AdBlock!",
                duration: 30000
            });
        }
        ,
        backupSock.onmessage = function(sockMsg) {
            var msg = decodeMessageToDict(sockMsg.data);
            msg.c === ServerMessage.BACKUP && (backupSockIsConnected = true),
            msg.backup = true,
            dispatchIncomingMessage(msg)
        }
    }
      , encodeNetworkMessage = function(msg, t) {
        var n, msgLen = 1, encodedStrings = [], schema = ClientMessageSchema[msg.c];
        if (null == schema)
            return null;
        for (n = 0; n < schema.length; n++)
            switch (schema[n][1]) {
            case FieldTypeCode.text:
                var s = Tools.encodeUTF8(msg[schema[n][0]]);
                encodedStrings.push(s),
                msgLen += 1 + s.length;
                break;
            case FieldTypeCode.array:
            case FieldTypeCode.arraysmall:
                break;
            case FieldTypeCode.uint8:
                msgLen += 1;
                break;
            case FieldTypeCode.uint16:
                msgLen += 2;
                break;
            case FieldTypeCode.uint32:
            case FieldTypeCode.float32:
                msgLen += 4;
                break;
            case FieldTypeCode.float64:
                msgLen += 8;
                break;
            case FieldTypeCode.boolean:
                msgLen += 1
            }
        var buf = new ArrayBuffer(msgLen)
          , dataView = new DataView(buf)
          , curEncodedString = 0
          , outputOffset = 1;
        for (dataView.setUint8(0, msg.c, true),
        n = 0; n < schema.length; n++)
            switch (schema[n][1]) {
            case FieldTypeCode.text:
                var h = encodedStrings[curEncodedString].length;
                dataView.setUint8(outputOffset, h, true),
                outputOffset += 1;
                for (var d = 0; d < h; d++)
                    dataView.setUint8(outputOffset + d, encodedStrings[curEncodedString][d], true);
                encodedStrings[curEncodedString],
                curEncodedString++,
                outputOffset += h;
                break;
            case FieldTypeCode.array:
            case FieldTypeCode.arraysmall:
                break;
            case FieldTypeCode.uint8:
                dataView.setUint8(outputOffset, msg[schema[n][0]], true),
                outputOffset += 1;
                break;
            case FieldTypeCode.uint16:
                dataView.setUint16(outputOffset, msg[schema[n][0]], true),
                outputOffset += 2;
                break;
            case FieldTypeCode.uint32:
                dataView.setUint32(outputOffset, msg[schema[n][0]], true),
                outputOffset += 4;
                break;
            case FieldTypeCode.float32:
                dataView.setFloat32(outputOffset, msg[schema[n][0]], true),
                outputOffset += 4;
                break;
            case FieldTypeCode.float64:
                dataView.setFloat64(outputOffset, msg[schema[n][0]], true),
                outputOffset += 8;
                break;
            case FieldTypeCode.boolean:
                dataView.setUint8(outputOffset, false === msg[schema[n][0]] ? 0 : 1),
                outputOffset += 1
            }
        return buf
    }
      , decodeMessageToDict = function(encoded, t) {
        var dataView = new DataView(encoded)
          , msg = {
            c: dataView.getUint8(0, true)
        }
          , i = 1
          , schema = ServerMessageSchema[msg.c];
        if (null == schema)
            return null;
        for (var s = 0; s < schema.length; s++) {
            var a = schema[s][0];
            switch (schema[s][1]) {
            case FieldTypeCode.text:
            case FieldTypeCode.textbig:
                if (schema[s][1] == FieldTypeCode.text) {
                    var l = dataView.getUint8(i, true);
                    i += 1
                } else {
                    l = dataView.getUint16(i, true);
                    i += 2
                }
                for (var u = new Uint8Array(l), c = 0; c < l; c++)
                    u[c] = dataView.getUint8(i + c, true);
                var h = Tools.decodeUTF8(u);
                msg[a] = h,
                i += l;
                break;
            case FieldTypeCode.array:
            case FieldTypeCode.arraysmall:
                if (schema[s][1] == FieldTypeCode.arraysmall) {
                    var d = dataView.getUint8(i, true);
                    i += 1
                } else {
                    d = dataView.getUint16(i, true);
                    i += 2
                }
                msg[a] = [];
                for (var p = schema[s][2], f = 0; f < d; f++) {
                    for (var g = {}, m = 0; m < p.length; m++) {
                        var v = p[m][0];
                        switch (p[m][1]) {
                        case FieldTypeCode.text:
                        case FieldTypeCode.textbig:
                            if (p[m][1] == FieldTypeCode.text) {
                                l = dataView.getUint8(i, true);
                                i += 1
                            } else {
                                l = dataView.getUint16(i, true);
                                i += 2
                            }
                            for (u = new Uint8Array(l),
                            c = 0; c < l; c++)
                                u[c] = dataView.getUint8(i + c, true);
                            h = Tools.decodeUTF8(u);
                            g[v] = h,
                            i += l;
                            break;
                        case FieldTypeCode.uint8:
                            g[v] = dataView.getUint8(i, true),
                            i += 1;
                            break;
                        case FieldTypeCode.uint16:
                            g[v] = dataView.getUint16(i, true),
                            i += 2;
                            break;
                        case FieldTypeCode.uint24:
                            var y = 256 * dataView.getUint16(i, true);
                            i += 2,
                            msg[v] = y + dataView.getUint8(i, true),
                            i += 1;
                            break;
                        case FieldTypeCode.uint32:
                            g[v] = dataView.getUint32(i, true),
                            i += 4;
                            break;
                        case FieldTypeCode.float32:
                            g[v] = dataView.getFloat32(i, true),
                            i += 4;
                            break;
                        case FieldTypeCode.float64:
                            g[v] = dataView.getFloat64(i, true),
                            i += 8;
                            break;
                        case FieldTypeCode.boolean:
                            g[v] = 0 != dataView.getUint8(i, true),
                            i += 1;
                            break;
                        case FieldTypeCode.speed:
                            g[v] = Tools.decodeSpeed(dataView.getUint16(i, true)),
                            i += 2;
                            break;
                        case FieldTypeCode.accel:
                            g[v] = Tools.decodeAccel(dataView.getUint16(i, true)),
                            i += 2;
                            break;
                        case FieldTypeCode.coordx:
                            g[v] = Tools.decodeCoordX(dataView.getUint16(i, true)),
                            i += 2;
                            break;
                        case FieldTypeCode.coordy:
                            g[v] = Tools.decodeCoordY(dataView.getUint16(i, true)),
                            i += 2;
                            break;
                        case FieldTypeCode.coord24:
                            y = 256 * dataView.getUint16(i, true);
                            i += 2,
                            msg[v] = Tools.decodeCoord24(y + dataView.getUint8(i, true)),
                            i += 1;
                            break;
                        case FieldTypeCode.rotation:
                            g[v] = Tools.decodeRotation(dataView.getUint16(i, true)),
                            i += 2;
                            break;
                        case FieldTypeCode.regen:
                            g[v] = Tools.decodeRegen(dataView.getUint16(i, true)),
                            i += 2;
                            break;
                        case FieldTypeCode.healthnergy:
                            g[v] = Tools.decodeHealthnergy(dataView.getUint8(i, true)),
                            i += 1
                        }
                    }
                    msg[a].push(g)
                }
                break;
            case FieldTypeCode.uint8:
                msg[a] = dataView.getUint8(i, true),
                i += 1;
                break;
            case FieldTypeCode.uint16:
                msg[a] = dataView.getUint16(i, true),
                i += 2;
                break;
            case FieldTypeCode.uint24:
                y = 256 * dataView.getUint16(i, true);
                i += 2,
                msg[a] = y + dataView.getUint8(i, true),
                i += 1;
                break;
            case FieldTypeCode.uint32:
                msg[a] = dataView.getUint32(i, true),
                i += 4;
                break;
            case FieldTypeCode.float32:
                msg[a] = dataView.getFloat32(i, true),
                i += 4;
                break;
            case FieldTypeCode.float64:
                msg[a] = dataView.getFloat64(i, true),
                i += 8;
                break;
            case FieldTypeCode.boolean:
                msg[a] = 0 != dataView.getUint8(i, true),
                i += 1;
                break;
            case FieldTypeCode.speed:
                msg[a] = Tools.decodeSpeed(dataView.getUint16(i, true)),
                i += 2;
                break;
            case FieldTypeCode.accel:
                msg[a] = Tools.decodeAccel(dataView.getUint16(i, true)),
                i += 2;
                break;
            case FieldTypeCode.coordx:
                msg[a] = Tools.decodeCoordX(dataView.getUint16(i, true)),
                i += 2;
                break;
            case FieldTypeCode.coordy:
                msg[a] = Tools.decodeCoordY(dataView.getUint16(i, true)),
                i += 2;
                break;
            case FieldTypeCode.coord24:
                y = 256 * dataView.getUint16(i, true);
                i += 2,
                msg[a] = Tools.decodeCoord24(y + dataView.getUint8(i, true)),
                i += 1;
                break;
            case FieldTypeCode.rotation:
                msg[a] = Tools.decodeRotation(dataView.getUint16(i, true)),
                i += 2;
                break;
            case FieldTypeCode.regen:
                msg[a] = Tools.decodeRegen(dataView.getUint16(i, true)),
                i += 2;
                break;
            case FieldTypeCode.healthnergy:
                msg[a] = Tools.decodeHealthnergy(dataView.getUint8(i, true)),
                i += 1;
                break;
            default:
                return null
            }
        }
        return msg
    }
      , sendMessageDict = function(msg, useBackupConn) {
        if(useBackupConn) {
            backupSock.send(encodeNetworkMessage(msg));
        } else {
            primarySock.send(encodeNetworkMessage(msg));
        }
    }
      , KeyCodes = {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4,
        FIRE: 5,
        SPECIAL: 6
    }
      , FieldTypeCode = {
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
      , ClientMessage = {
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
      , ClientMessageSchema = {
        [ClientMessage.LOGIN]: [["protocol", FieldTypeCode.uint8], ["name", FieldTypeCode.text], ["session", FieldTypeCode.text], ["horizonX", FieldTypeCode.uint16], ["horizonY", FieldTypeCode.uint16], ["flag", FieldTypeCode.text]],
        [ClientMessage.BACKUP]: [["token", FieldTypeCode.text]],
        [ClientMessage.HORIZON]: [["horizonX", FieldTypeCode.uint16], ["horizonY", FieldTypeCode.uint16]],
        [ClientMessage.ACK]: [],
        [ClientMessage.PONG]: [["num", FieldTypeCode.uint32]],
        [ClientMessage.KEY]: [["seq", FieldTypeCode.uint32], ["key", FieldTypeCode.uint8], ["state", FieldTypeCode.boolean]],
        [ClientMessage.COMMAND]: [["com", FieldTypeCode.text], ["data", FieldTypeCode.text]],
        [ClientMessage.SCOREDETAILED]: [],
        [ClientMessage.CHAT]: [["text", FieldTypeCode.text]],
        [ClientMessage.WHISPER]: [["id", FieldTypeCode.uint16], ["text", FieldTypeCode.text]],
        [ClientMessage.SAY]: [["text", FieldTypeCode.text]],
        [ClientMessage.TEAMCHAT]: [["text", FieldTypeCode.text]],
        [ClientMessage.VOTEMUTE]: [["id", FieldTypeCode.uint16]],
        [ClientMessage.LOCALPING]: [["auth", FieldTypeCode.uint32]]
    }
      , ServerMessage = {
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
      , ServerMessageSchema = {
        [ServerMessage.LOGIN]: [["success", FieldTypeCode.boolean], ["id", FieldTypeCode.uint16], ["team", FieldTypeCode.uint16], ["clock", FieldTypeCode.uint32], ["token", FieldTypeCode.text], ["type", FieldTypeCode.uint8], ["room", FieldTypeCode.text], ["players", FieldTypeCode.array, [["id", FieldTypeCode.uint16], ["status", FieldTypeCode.uint8], ["level", FieldTypeCode.uint8], ["name", FieldTypeCode.text], ["type", FieldTypeCode.uint8], ["team", FieldTypeCode.uint16], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["rot", FieldTypeCode.rotation], ["flag", FieldTypeCode.uint16], ["upgrades", FieldTypeCode.uint8]]]],
        [ServerMessage.BACKUP]: [],
        [ServerMessage.PING]: [["clock", FieldTypeCode.uint32], ["num", FieldTypeCode.uint32]],
        [ServerMessage.PING_RESULT]: [["ping", FieldTypeCode.uint16], ["playerstotal", FieldTypeCode.uint32], ["playersgame", FieldTypeCode.uint32]],
        [ServerMessage.ACK]: [],
        [ServerMessage.ERROR]: [["error", FieldTypeCode.uint8]],
        [ServerMessage.COMMAND_REPLY]: [["type", FieldTypeCode.uint8], ["text", FieldTypeCode.textbig]],
        [ServerMessage.PLAYER_NEW]: [["id", FieldTypeCode.uint16], ["status", FieldTypeCode.uint8], ["name", FieldTypeCode.text], ["type", FieldTypeCode.uint8], ["team", FieldTypeCode.uint16], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["rot", FieldTypeCode.rotation], ["flag", FieldTypeCode.uint16], ["upgrades", FieldTypeCode.uint8]],
        [ServerMessage.PLAYER_LEAVE]: [["id", FieldTypeCode.uint16]],
        [ServerMessage.PLAYER_UPDATE]: [["clock", FieldTypeCode.uint32], ["id", FieldTypeCode.uint16], ["keystate", FieldTypeCode.uint8], ["upgrades", FieldTypeCode.uint8], ["posX", FieldTypeCode.coord24], ["posY", FieldTypeCode.coord24], ["rot", FieldTypeCode.rotation], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed]],
        [ServerMessage.PLAYER_FIRE]: [["clock", FieldTypeCode.uint32], ["id", FieldTypeCode.uint16], ["energy", FieldTypeCode.healthnergy], ["energyRegen", FieldTypeCode.regen], ["projectiles", FieldTypeCode.arraysmall, [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed], ["accelX", FieldTypeCode.accel], ["accelY", FieldTypeCode.accel], ["maxSpeed", FieldTypeCode.speed]]]],
        [ServerMessage.PLAYER_SAY]: [["id", FieldTypeCode.uint16], ["text", FieldTypeCode.text]],
        [ServerMessage.PLAYER_RESPAWN]: [["id", FieldTypeCode.uint16], ["posX", FieldTypeCode.coord24], ["posY", FieldTypeCode.coord24], ["rot", FieldTypeCode.rotation], ["upgrades", FieldTypeCode.uint8]],
        [ServerMessage.PLAYER_FLAG]: [["id", FieldTypeCode.uint16], ["flag", FieldTypeCode.uint16]],
        [ServerMessage.PLAYER_HIT]: [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["owner", FieldTypeCode.uint16], ["players", FieldTypeCode.arraysmall, [["id", FieldTypeCode.uint16], ["health", FieldTypeCode.healthnergy], ["healthRegen", FieldTypeCode.regen]]]],
        [ServerMessage.PLAYER_KILL]: [["id", FieldTypeCode.uint16], ["killer", FieldTypeCode.uint16], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy]],
        [ServerMessage.PLAYER_UPGRADE]: [["upgrades", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["speed", FieldTypeCode.uint8], ["defense", FieldTypeCode.uint8], ["energy", FieldTypeCode.uint8], ["missile", FieldTypeCode.uint8]],
        [ServerMessage.PLAYER_TYPE]: [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8]],
        [ServerMessage.PLAYER_POWERUP]: [["type", FieldTypeCode.uint8], ["duration", FieldTypeCode.uint32]],
        [ServerMessage.PLAYER_LEVEL]: [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["level", FieldTypeCode.uint8]],
        [ServerMessage.PLAYER_RETEAM]: [["players", FieldTypeCode.array, [["id", FieldTypeCode.uint16], ["team", FieldTypeCode.uint16]]]],
        [ServerMessage.GAME_FLAG]: [["type", FieldTypeCode.uint8], ["flag", FieldTypeCode.uint8], ["id", FieldTypeCode.uint16], ["posX", FieldTypeCode.coord24], ["posY", FieldTypeCode.coord24], ["blueteam", FieldTypeCode.uint8], ["redteam", FieldTypeCode.uint8]],
        [ServerMessage.GAME_SPECTATE]: [["id", FieldTypeCode.uint16]],
        [ServerMessage.GAME_PLAYERSALIVE]: [["players", FieldTypeCode.uint16]],
        [ServerMessage.GAME_FIREWALL]: [["type", FieldTypeCode.uint8], ["status", FieldTypeCode.uint8], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["radius", FieldTypeCode.float32], ["speed", FieldTypeCode.float32]],
        [ServerMessage.EVENT_REPEL]: [["clock", FieldTypeCode.uint32], ["id", FieldTypeCode.uint16], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["rot", FieldTypeCode.rotation], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed], ["energy", FieldTypeCode.healthnergy], ["energyRegen", FieldTypeCode.regen], ["players", FieldTypeCode.arraysmall, [["id", FieldTypeCode.uint16], ["keystate", FieldTypeCode.uint8], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["rot", FieldTypeCode.rotation], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed], ["energy", FieldTypeCode.healthnergy], ["energyRegen", FieldTypeCode.regen], ["playerHealth", FieldTypeCode.healthnergy], ["playerHealthRegen", FieldTypeCode.regen]]], ["mobs", FieldTypeCode.arraysmall, [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed], ["accelX", FieldTypeCode.accel], ["accelY", FieldTypeCode.accel], ["maxSpeed", FieldTypeCode.speed]]]],
        [ServerMessage.EVENT_BOOST]: [["clock", FieldTypeCode.uint32], ["id", FieldTypeCode.uint16], ["boost", FieldTypeCode.boolean], ["posX", FieldTypeCode.coord24], ["posY", FieldTypeCode.coord24], ["rot", FieldTypeCode.rotation], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed], ["energy", FieldTypeCode.healthnergy], ["energyRegen", FieldTypeCode.regen]],
        [ServerMessage.EVENT_BOUNCE]: [["clock", FieldTypeCode.uint32], ["id", FieldTypeCode.uint16], ["keystate", FieldTypeCode.uint8], ["posX", FieldTypeCode.coord24], ["posY", FieldTypeCode.coord24], ["rot", FieldTypeCode.rotation], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed]],
        [ServerMessage.EVENT_STEALTH]: [["id", FieldTypeCode.uint16], ["state", FieldTypeCode.boolean], ["energy", FieldTypeCode.healthnergy], ["energyRegen", FieldTypeCode.regen]],
        [ServerMessage.EVENT_LEAVEHORIZON]: [["type", FieldTypeCode.uint8], ["id", FieldTypeCode.uint16]],
        [ServerMessage.MOB_UPDATE]: [["clock", FieldTypeCode.uint32], ["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy], ["speedX", FieldTypeCode.speed], ["speedY", FieldTypeCode.speed], ["accelX", FieldTypeCode.accel], ["accelY", FieldTypeCode.accel], ["maxSpeed", FieldTypeCode.speed]],
        [ServerMessage.MOB_UPDATE_STATIONARY]: [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["posX", FieldTypeCode.float32], ["posY", FieldTypeCode.float32]],
        [ServerMessage.MOB_DESPAWN]: [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8]],
        [ServerMessage.MOB_DESPAWN_COORDS]: [["id", FieldTypeCode.uint16], ["type", FieldTypeCode.uint8], ["posX", FieldTypeCode.coordx], ["posY", FieldTypeCode.coordy]],
        [ServerMessage.SCORE_UPDATE]: [["id", FieldTypeCode.uint16], ["score", FieldTypeCode.uint32], ["earnings", FieldTypeCode.uint32], ["upgrades", FieldTypeCode.uint16], ["totalkills", FieldTypeCode.uint32], ["totaldeaths", FieldTypeCode.uint32]],
        [ServerMessage.SCORE_BOARD]: [["data", FieldTypeCode.array, [["id", FieldTypeCode.uint16], ["score", FieldTypeCode.uint32], ["level", FieldTypeCode.uint8]]], ["rankings", FieldTypeCode.array, [["id", FieldTypeCode.uint16], ["x", FieldTypeCode.uint8], ["y", FieldTypeCode.uint8]]]],
        [ServerMessage.SCORE_DETAILED]: [["scores", FieldTypeCode.array, [["id", FieldTypeCode.uint16], ["level", FieldTypeCode.uint8], ["score", FieldTypeCode.uint32], ["kills", FieldTypeCode.uint16], ["deaths", FieldTypeCode.uint16], ["damage", FieldTypeCode.float32], ["ping", FieldTypeCode.uint16]]]],
        [ServerMessage.SCORE_DETAILED_CTF]: [["scores", FieldTypeCode.array, [["id", FieldTypeCode.uint16], ["level", FieldTypeCode.uint8], ["captures", FieldTypeCode.uint16], ["score", FieldTypeCode.uint32], ["kills", FieldTypeCode.uint16], ["deaths", FieldTypeCode.uint16], ["damage", FieldTypeCode.float32], ["ping", FieldTypeCode.uint16]]]],
        [ServerMessage.SCORE_DETAILED_BTR]: [["scores", FieldTypeCode.array, [["id", FieldTypeCode.uint16], ["level", FieldTypeCode.uint8], ["alive", FieldTypeCode.boolean], ["wins", FieldTypeCode.uint16], ["score", FieldTypeCode.uint32], ["kills", FieldTypeCode.uint16], ["deaths", FieldTypeCode.uint16], ["damage", FieldTypeCode.float32], ["ping", FieldTypeCode.uint16]]]],
        [ServerMessage.CHAT_TEAM]: [["id", FieldTypeCode.uint16], ["text", FieldTypeCode.text]],
        [ServerMessage.CHAT_PUBLIC]: [["id", FieldTypeCode.uint16], ["text", FieldTypeCode.text]],
        [ServerMessage.CHAT_SAY]: [["id", FieldTypeCode.uint16], ["text", FieldTypeCode.text]],
        [ServerMessage.CHAT_WHISPER]: [["from", FieldTypeCode.uint16], ["to", FieldTypeCode.uint16], ["text", FieldTypeCode.text]],
        [ServerMessage.CHAT_VOTEMUTEPASSED]: [["id", FieldTypeCode.uint16]],
        [ServerMessage.CHAT_VOTEMUTED]: [],
        [ServerMessage.SERVER_MESSAGE]: [["type", FieldTypeCode.uint8], ["duration", FieldTypeCode.uint32], ["text", FieldTypeCode.textbig]],
        [ServerMessage.SERVER_CUSTOM]: [["type", FieldTypeCode.uint8], ["data", FieldTypeCode.textbig]]
    };
    Network.KEYPACKET = KeyCodes,
    Network.KEYLOOKUP = {
        1: "UP",
        2: "DOWN",
        3: "LEFT",
        4: "RIGHT",
        5: "FIRE",
        6: "SPECIAL"
    },
    Network.CLIENTPACKET = ClientMessage,
    Network.SERVERPACKET = ServerMessage,
    Network.STATE = {
        LOGIN: 1,
        CONNECTING: 2,
        PLAYING: 3
    }
})();
