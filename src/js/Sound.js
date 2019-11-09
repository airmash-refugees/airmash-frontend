import { Howl } from './howler';

var mainHowlInstance = {},
    howlsBySpriteName = {},
    thrustersByPlayerId = {},
    playerThrustersPlayingCount = 0,
    missileThrustersPlayingCount = 0,
    o = {},
    lastAllocatedThrusterSoundId = 0,
    lastSoundscapeUpdateTime = 0,
    l = {},
    mobExplosionBaseVolume = 0.3,
    playerKillBaseVolume = 1,
    missileLaunchBaseVolume = 0.3,
    d = 0.06,
    p = 0.08,
    playerImpactSpeedVolumeBoost = 0.05,
    powerupBaseVolume = 0.25,
    repelBaseVolume = 0.3,
    explosionVolumeByMobType = [0, 0.7, 1, 0.4, 0, 0.7, 0.4, 0.7],
    launchVolumeByMissileType = [0, 0.7, 1, 0.4, 0, 0.7, 1, 0.7],
    launchPlaybackRateByMissileType = [0, 0.8, 0.5, 1, 0, 0.8, 0.5, 0.8],
    playerKillVolumeByPlaneType = [0, 0.8, 1, 0.7, 0.8, 0.8],
    thrusterPlaybackRateByPlaneType = [0, 1.5, 1.2, 0.8, 1.35, 1.7],
    someKindOfThrusterVolumeByPlaneType = [0, 1, 1, 0.35, 1, 1],
    thrusterPlaybackRateByMobType = [0, 0.8, 0.5, 1, 0, 0.8, 0.8, 0.8],
    playbackRateByMissileType = [0, 1.5, 0.8, 2, 1, 1.5],
    customVolumeBySpriteName = {
        powerup_shield: 0.5,
        upgrade: 0.2,
        complete: 0.5,
        levelup: 0.5,
        respawn: 0.05,
        click: 0.5
    },
    I = {},
    mainHowlConfig = {
        src: ["assets/sounds.mp3?4"],
        volume: 0,
        sprite: {
            chopper: [0, 3206.1451247165533, true],
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
            missile: [6e4, 8335.351473922898, true],
            powerup_rampage: [7e4, 7423.083900226758],
            powerup_shield: [79e3, 2070.4761904761854],
            powerup_upgrade: [83e3, 1640.8616780045406],
            repel: [86e3, 2e3],
            respawn: [89e3, 1315.9410430838961],
            thruster: [92e3, 9499.841269841269, true],
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
        howlsBySpriteName[r] = new Howl(n)
    }
    mainHowlInstance = new Howl(mainHowlConfig)
};

Sound.toggle = function() {
    config.settings.sound = !config.settings.sound,
    Tools.setSettings({
        sound: config.settings.sound
    }),
    UI.updateSound(true),
    stopSoundsIfPlaying()
};

var stopSoundsIfPlaying = function() {
    config.settings.sound || mainHowlInstance.stop()
};

var getSpriteVolume = function(soundName) {
    var t = customVolumeBySpriteName[soundName];
    return null == t ? 1 : t
};

Sound.mobExplosion = function(pos, mobType) {
    var n = explosionVolumeByMobType[mobType] * mobExplosionBaseVolume,
        volume = getVolumeForCameraDistance(pos) * n,
        spriteName = "explosion" + Tools.randInt(1, 6);
    volume < .01 || someKindOfBooleanIsPlayingCheckMaybe("mobexplosions", 4) || maybePlaySound(spriteName, volume, pos, Tools.rand(.8, 1.2))
};

Sound.playerKill = function(playerObj) {
    var t = playerKillVolumeByPlaneType[playerObj.type] * playerKillBaseVolume,
        volume = getVolumeForCameraDistance(playerObj.pos) * t,
        spriteName = "explosion" + Tools.randInt(1, 6);
    volume < .01 || someKindOfBooleanIsPlayingCheckMaybe("playerkills", 3) || maybePlaySound(spriteName, volume, playerObj.pos, Tools.rand(.8, 1.2))
};

Sound.playerUpgrade = function() {
    if (!someKindOfBooleanIsPlayingCheckMaybe("upgrades", 1)) {
        var volume = getSpriteVolume("upgrade");
        maybePlaySound("upgrade", volume)
    }
};

Sound.playerRespawn = function(playerObj) {
    var volume = getSpriteVolume("respawn") * (playerObj.me() ? 1 : getVolumeForCameraDistance(playerObj.pos)),
        pos = playerObj.me() ? null : playerObj.pos;
    maybePlaySound("respawn", volume, pos)
};

Sound.gameComplete = function() {
    var e = getSpriteVolume("complete");
    maybePlaySound("complete", e)
};

Sound.levelUp = function() {
    var e = getSpriteVolume("levelup");
    maybePlaySound("levelup", e)
};

Sound.UIClick = function() {
    if (!someKindOfBooleanIsPlayingCheckMaybe("uiclick", 1, 200)) {
        var e = getSpriteVolume("click");
        maybePlaySound("click", e)
    }
};

Sound.effectRepel = function(pos) {
    var volume = getVolumeForCameraDistance(pos) * repelBaseVolume;
    maybePlaySound("repel", volume, pos, 1.5)
};

Sound.powerup = function(mobType, pos) {
  var volume = (null == pos ? 1 : getVolumeForCameraDistance(pos)) * powerupBaseVolume;
  var spriteName = "";
  if (4 == mobType) {
    spriteName = "powerup_upgrade";
  } else {
    if (8 == mobType) {
      spriteName = "powerup_shield";
    } else {
      if (9 == mobType) {
        spriteName = "powerup_rampage";
      }
    }
  }
  maybePlaySound(spriteName, volume * getSpriteVolume(spriteName), pos);
};

Sound.missileLaunch = function(pos, missileType) {
    var n = launchVolumeByMissileType[missileType] * missileLaunchBaseVolume,
        volume = getVolumeForCameraDistance(pos) * n,
        rate = launchPlaybackRateByMissileType[missileType],
        spriteName = "launch" + Tools.randInt(1, 2);
    volume < .01 || someKindOfBooleanIsPlayingCheckMaybe("launches", 5) || maybePlaySound(spriteName, volume, pos, rate)
};

Sound.playerImpact = function(pos, missileType, impactSpeed) {
    var r = playerImpactSpeedVolumeBoost * Tools.clamp(impactSpeed, 0, 1),
        volume = getVolumeForCameraDistance(pos) * r,
        rate = playbackRateByMissileType[missileType];
    maybePlaySound("impact", volume, pos, rate)
};

Sound.update = function() {
    if (!(game.time - lastSoundscapeUpdateTime < 100)) {
        var e = game.focus ? 300 : 1e3;
        for (var playerId in thrustersByPlayerId)
            game.time - thrustersByPlayerId[playerId].last > e && Sound.clearThruster(playerId);
        for (var r in o)
            game.time >= o[r].time && (stopPlayingAParticularInstance(o[r].id, o[r].sound),
            delete o[r]);
        lastSoundscapeUpdateTime = game.time
    }
};

var someKindOfBooleanIsPlayingCheckMaybe = function(e, t, n) {
    if (null == l[e])
        return l[e] = {
            num: 1,
            time: game.time
        },
        false;
    var r = null != n ? n : 1e3;
    return game.time - l[e].time > r ? (l[e].num = 1,
    l[e].time = game.time,
    false) : (l[e].num++,
    l[e].num > t)
};

var maybePlaySound = function(spriteName, volume, pos, rate, fade, useSpecificHowlerInstance) {
    if (config.settings.sound) {
        if (useSpecificHowlerInstance) {
            if (null == howlsBySpriteName[spriteName])
                return;
            var howl = howlsBySpriteName[spriteName]
        } else
            howl = mainHowlInstance;
        if (!(null != volume && volume < .01)) {
            var soundId = howl.play(useSpecificHowlerInstance ? void 0 : spriteName);
            if ("thruster" === spriteName || "missile" === spriteName || "chopper" === spriteName) {
                var c = howl.seek(null, soundId);
                howl.seek(c + Tools.rand(0, 1), soundId)
            }
            return playIfSoundEnabled(soundId, spriteName, volume, pos, rate, fade, useSpecificHowlerInstance),
            soundId
        }
    }
};

var playIfSoundEnabled = function(soundId, howlerInstanceName, volume, pos, rate, fade, useSpecificHowlerInstance) {
    if (config.settings.sound) {
        if (useSpecificHowlerInstance) {
            if (null == howlsBySpriteName[howlerInstanceName])
                return;
            var howl = howlsBySpriteName[howlerInstanceName]
        } else
            howl = mainHowlInstance;
        null != volume && howl.volume(volume, soundId),
        null != fade && howl.fade(fade[0], fade[1], fade[2], soundId, 4 == fade.length || null),
        null != rate && howl.rate(rate, soundId),
        null == pos || config.ios || howl.stereo(getStereoDirection(pos), soundId)
    }
};

var stopPlayingAParticularInstance = function(soundId, spriteName, useSpecificHowlerInstance) {
    if (useSpecificHowlerInstance) {
        if (null == howlsBySpriteName[spriteName])
            return;
        var howl = howlsBySpriteName[spriteName]
    } else
        howl = mainHowlInstance;
    howl.stop(soundId)
};

Sound.clearThruster = function(playerId) {
    if (null != thrustersByPlayerId[playerId]) {
        var thrusterSoundId = thrustersByPlayerId[playerId].soundId,
            thrusterSoundVol = thrustersByPlayerId[playerId].vol;
        playIfSoundEnabled(thrusterSoundId, thrustersByPlayerId[playerId].sound, null, null, null, [thrusterSoundVol, 0, 200, true]),
        function(e, t, n) {
            o[++lastAllocatedThrusterSoundId] = {
                id: e,
                sound: t,
                time: game.time + n
            }
        }(thrusterSoundId, thrustersByPlayerId[playerId].sound, 300),
        0 == thrustersByPlayerId[playerId].type ? playerThrustersPlayingCount-- : missileThrustersPlayingCount--,
        delete thrustersByPlayerId[playerId]
    }
};

Sound.updateThruster = function(zeroIfPlayerOneIfMob, mobOrPlayer, isVisible) {
    if (config.settings.sound) {
        if (0 == zeroIfPlayerOneIfMob) {
            if (3 == mobOrPlayer.type) {
                isVisible = mobOrPlayer.render;
                var spriteName = "chopper"
            } else {
                isVisible = mobOrPlayer.keystate.UP || mobOrPlayer.keystate.DOWN;
                spriteName = "thruster"
            }
            var a = "player_" + mobOrPlayer.id + "_" + mobOrPlayer.type
        } else {
            spriteName = "missile";
            a = "mob_" + mobOrPlayer.id
        }
        if (isVisible)
            if (null == thrustersByPlayerId[a]) {
                if (0 == zeroIfPlayerOneIfMob) {
                    if (!mobOrPlayer.me() && playerThrustersPlayingCount >= 5)
                        return
                } else if (missileThrustersPlayingCount >= 5)
                    return;
                var l = getVolumeForCameraDistance(mobOrPlayer.pos);
                if (0 == zeroIfPlayerOneIfMob)
                    var finalVolume = l * someKindOfThrusterVolumeByPlaneType[mobOrPlayer.type] * d,
                        rateToUse = thrusterPlaybackRateByPlaneType[mobOrPlayer.type];
                else
                    finalVolume = l * p,
                    rateToUse = thrusterPlaybackRateByMobType[mobOrPlayer.type];
                if (finalVolume < .01)
                    return;
                var soundId = maybePlaySound(spriteName, null, mobOrPlayer.pos, rateToUse, [0, finalVolume, 200]);
                thrustersByPlayerId[a] = {
                    type: zeroIfPlayerOneIfMob,
                    started: game.time,
                    last: game.time,
                    sound: spriteName,
                    soundId: soundId,
                    vol: finalVolume
                },
                0 == zeroIfPlayerOneIfMob ? playerThrustersPlayingCount++ : missileThrustersPlayingCount++
            } else {
                if (game.time - thrustersByPlayerId[a].last < 100)
                    return;
                l = getVolumeForCameraDistance(mobOrPlayer.pos);
                if (0 == zeroIfPlayerOneIfMob) {
                    finalVolume = l * someKindOfThrusterVolumeByPlaneType[mobOrPlayer.type] * d;
                    mobOrPlayer.boost && (finalVolume *= 3)
                } else
                    finalVolume = l * p;
                if (finalVolume < .01)
                    return void Sound.clearThruster(a);
                rateToUse = null;
                if (0 == zeroIfPlayerOneIfMob && 3 == mobOrPlayer.type && (rateToUse = thrusterPlaybackRateByPlaneType[mobOrPlayer.type] + mobOrPlayer.speed.length() / 20),
                game.time - thrustersByPlayerId[a].started < 250)
                    return;
                playIfSoundEnabled(thrustersByPlayerId[a].soundId, thrustersByPlayerId[a].sound, null, mobOrPlayer.pos, rateToUse, [thrustersByPlayerId[a].vol, finalVolume, 100, true]),
                thrustersByPlayerId[a].last = game.time,
                thrustersByPlayerId[a].vol = finalVolume
            }
        else
            null != thrustersByPlayerId[a] && Sound.clearThruster(a)
    }
};

var getVolumeForCameraDistance = function(pos) {
    var t = Graphics.getCamera(),
        n = Tools.length(pos.x - t.x, pos.y - t.y),
        r = (game.halfScreenX / game.scale + game.halfScreenY / game.scale) / 2;
    return Tools.clamp(1.5 * (1 - n / r), 0, 1)
};

var getStereoDirection = function(pos) {
    var t = Graphics.getCamera(),
        n = pos.x - t.x,
        r = game.halfScreenX / game.scale;
    return Tools.clamp(.8 * n / r, -1, 1)
};