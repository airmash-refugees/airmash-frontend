class Player {
    constructor(e, t) {
        this.id = e.id,
        this.status = e.status,
        this.level = null == e.level || 0 == e.level ? null : e.level,
        this.reel = 1 == e.reel,
        this.name = e.name,
        this.type = e.type,
        this.team = e.team,
        this.pos = new Vector(e.posX,e.posY),
        this.lowResPos = new Vector(e.posX,e.posY),
        this.speed = Vector.zero(),
        this.speedupgrade = 0,
        this.rot = e.rot,
        this.flag = e.flag,
        this.speedLength = 0,
        this.sprites = {},
        this.randomness = Tools.rand(0, 1e5),
        this.keystate = {},
        this.lastTick = 0,
        this.health = 1,
        this.energy = 1,
        this.healthRegen = 1,
        this.energyRegen = 1,
        this.boost = false,
        this.strafe = false,
        this.flagspeed = false,
        this.stealthed = false,
        this.alpha = 1,
        this.scale = 1,
        this.powerups = {
            shield: false,
            rampage: false
        },
        this.powerupsShown = {
            shield: false,
            rampage: false
        },
        this.powerupActive = false,
        this.render = true,
        this.hidden = false,
        this.culled = false,
        this.timedout = false,
        this.reducedFactor = false,
        this.lastPacket = game.timeNetwork,
        this.state = {
            thrustLevel: 0,
            thrustDir: 0,
            bubble: false,
            bubbleProgress: 0,
            bubbleFade: 0,
            bubbleTime: 0,
            bubbleTextWidth: 0,
            hasBadge: false,
            badge: 0,
            stealthLevel: 0,
            scaleLevel: 1,
            powerupAngle: 0,
            powerupFade: 0,
            powerupFadeState: 0,
            lastBounceSound: 0
        },
        this.setupGraphics(),
        0 == this.status ? (Tools.decodeUpgrades(this, e.upgrades),
        this.updatePowerups()) : (this.hidden = true,
        this.me() && UI.visibilityHUD(false)),
        this.reel ? (this._prevPos = null,
        this._offset = null) : this.visibilityUpdate(),
        (!t && this.render || this.me()) && (this.scale = 0,
        this.state.scaleLevel = 0),
        this.me() && (game.myType = e.type,
        UI.aircraftSelected(e.type))
    }
    setupGraphics(e) {
        var t = null;
        switch (this.me() && (t = {
            layer: "aircraftme"
        }),
        this.sprites.powerup = Textures.init("powerupShield", {
            visible: false,
            alpha: .75
        }),
        this.sprites.powerupCircle = Textures.init("powerupCircle", {
            visible: false,
            alpha: .75
        }),
        this.type) {
        case 1:
            this.state.baseScale = .25,
            this.state.nameplateDist = 60,
            this.sprites.sprite = Textures.init("shipRaptor", t),
            this.sprites.shadow = Textures.init("shipRaptorShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            }),
            this.sprites.thruster = Textures.init("shipRaptorThruster"),
            this.sprites.thrusterGlow = Textures.init("thrusterGlowSmall"),
            this.sprites.thrusterShadow = Textures.init("thrusterShadow");
            break;
        case 2:
            this.state.baseScale = .35,
            this.state.nameplateDist = 60,
            this.sprites.sprite = Textures.init("shipSpirit", t),
            this.sprites.shadow = Textures.init("shipSpiritShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            }),
            this.sprites.thruster1 = Textures.init("shipRaptorThruster"),
            this.sprites.thruster2 = Textures.init("shipRaptorThruster"),
            this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall"),
            this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall"),
            this.sprites.thruster1Shadow = Textures.init("thrusterShadow"),
            this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
            break;
        case 3:
            this.state.baseScale = .25,
            this.state.nameplateDist = 60,
            this.sprites.sprite = Textures.init("shipComanche", t),
            this.sprites.rotor = Textures.init("shipComancheRotor", t),
            this.sprites.shadow = Textures.init("shipComancheShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            }),
            this.sprites.rotorShadow = Textures.init("shipComancheRotorShadow", {
                scale: 2 * this.state.baseScale * (2.4 / config.shadowScaling)
            });
            break;
        case 4:
            this.state.baseScale = .28,
            this.state.nameplateDist = 60,
            this.sprites.sprite = Textures.init("shipTornado", t),
            this.sprites.shadow = Textures.init("shipTornadoShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            }),
            this.sprites.thruster1 = Textures.init("shipRaptorThruster"),
            this.sprites.thruster2 = Textures.init("shipRaptorThruster"),
            this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall"),
            this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall"),
            this.sprites.thruster1Shadow = Textures.init("thrusterShadow"),
            this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
            break;
        case 5:
            this.state.baseScale = .28,
            this.state.nameplateDist = 60,
            this.sprites.sprite = Textures.init("shipProwler", t),
            this.sprites.shadow = Textures.init("shipProwlerShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            }),
            this.sprites.thruster1 = Textures.init("shipRaptorThruster"),
            this.sprites.thruster2 = Textures.init("shipRaptorThruster"),
            this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall"),
            this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall"),
            this.sprites.thruster1Shadow = Textures.init("thrusterShadow"),
            this.sprites.thruster2Shadow = Textures.init("thrusterShadow")
        }
        if (this.reel || e || (this.setupNameplate(),
        this.setupChatBubbles(),
        null != this.level && this.setupLevelPlate()),
        config.debug.collisions) {
            this.col = new PIXI.Graphics;
            for (var n of config.ships[this.type].collisions)
                this.col.beginFill(16777215, .2),
                this.col.drawCircle(n[0], n[1], n[2]),
                this.col.endFill();
            game.graphics.layers.explosions.addChild(this.col)
        }
    }
    reteam(e) {
        this.team = e,
        this.sprites.name.style = new PIXI.TextStyle(this.nameplateTextStyle()),
        UI.changeMinimapTeam(this.id, this.team)
    }
    nameplateTextStyle() {
        if (2 == game.gameType)
            var e = 1 == this.team ? "#4076E2" : "#EA4242";
        else
            e = this.team == game.myTeam ? "#FFFFFF" : "#FFEC52";
        return {
            fontFamily: "MontserratWeb, Helvetica, sans-serif",
            fontSize: "33px",
            fill: e,
            dropShadow: true,
            dropShadowBlur: 10,
            dropShadowDistance: 0,
            padding: 4
        }
    }
    setupNameplate() {
        var e = "";
        2 == game.gameType && (e = "  ■"),
        this.sprites.name = new PIXI.Text(this.name + e,this.nameplateTextStyle()),
        this.sprites.name.scale.set(.5, .5),
        this.sprites.flag = Textures.sprite("flag_" + this.flag),
        this.sprites.flag.scale.set(.4, .4),
        this.sprites.flag.anchor.set(.5, .5),
        this.sprites.badge = Textures.sprite("badge_gold"),
        this.sprites.badge.scale.set(.3),
        this.sprites.badge.visible = false,
        game.graphics.layers.playernames.addChild(this.sprites.badge),
        game.graphics.layers.playernames.addChild(this.sprites.flag),
        game.graphics.layers.playernames.addChild(this.sprites.name)
    }
    setupChatBubbles() {
        this.sprites.bubble = new PIXI.Container,
        this.sprites.bubbleLeft = Graphics.initSprite("chatbubbleleft", this.sprites.bubble, {
            scale: .5
        }),
        this.sprites.bubbleRight = Graphics.initSprite("chatbubbleright", this.sprites.bubble, {
            scale: .5
        }),
        this.sprites.bubbleCenter = Graphics.initSprite("chatbubblecenter", this.sprites.bubble, {
            scale: .5
        }),
        this.sprites.bubblePoint = Graphics.initSprite("chatbubblepoint", this.sprites.bubble, {
            scale: .5
        }),
        this.sprites.emote = Graphics.initSprite("emote_tf", this.sprites.bubble, {
            scale: .6,
            anchor: [.5, .5]
        }),
        this.sprites.bubbleText = new PIXI.Text("a",{
            fontFamily: "MontserratWeb, Helvetica, sans-serif",
            fontSize: "12px",
            fill: "white"
        }),
        this.sprites.bubble.addChild(this.sprites.bubbleText),
        this.sprites.bubble.visible = false,
        this.sprites.bubble.pivot.set(.5, 34),
        game.graphics.layers.bubbles.addChild(this.sprites.bubble)
    }
    visibilityUpdate(e) {
        this.culled = !Graphics.inScreen(this.pos, 128);
        var t = !(this.hidden || this.culled || this.timedout);
        if (e || this.render != t) {
            switch (this.sprites.sprite.visible = t,
            this.sprites.shadow.visible = t,
            this.sprites.flag.visible = t,
            this.sprites.name.visible = t,
            null != this.sprites.level && (this.sprites.level.visible = t,
            this.sprites.levelBorder.visible = t),
            this.sprites.badge.visible = this.state.hasBadge && t,
            this.sprites.powerup.visible = this.powerupActive && t,
            this.sprites.powerupCircle.visible = this.powerupActive && t,
            this.type) {
            case 1:
                this.sprites.thruster.visible = t,
                this.sprites.thrusterGlow.visible = t,
                this.sprites.thrusterShadow.visible = t;
                break;
            case 2:
            case 4:
            case 5:
                this.sprites.thruster1.visible = t,
                this.sprites.thruster1Glow.visible = t,
                this.sprites.thruster1Shadow.visible = t,
                this.sprites.thruster2.visible = t,
                this.sprites.thruster2Glow.visible = t,
                this.sprites.thruster2Shadow.visible = t;
                break;
            case 3:
                this.sprites.rotor.visible = t,
                this.sprites.rotorShadow.visible = t
            }
            this.render = t,
            t || Sound.clearThruster(this.id)
        }
    }
    stealth(e) {
        this.lastPacket = game.timeNetwork,
        this.energy = e.energy,
        this.energyRegen = e.energyRegen,
        e.state ? (this.stealthed = true,
        this.state.stealthLevel = 0,
        this.team != game.myTeam && (this.keystate.LEFT && delete this.keystate.LEFT,
        this.keystate.RIGHT && delete this.keystate.RIGHT)) : this.unstealth()
    }
    unstealth() {
        this.stealthed = false,
        this.state.stealthLevel = 0,
        this.opacity(1)
    }
    opacity(e) {
        this.alpha = e,
        this.sprites.sprite.alpha = e,
        this.sprites.shadow.alpha = e,
        this.sprites.flag.alpha = e,
        this.sprites.name.alpha = e,
        this.sprites.badge.alpha = e,
        this.sprites.powerup.alpha = .75 * e,
        this.sprites.powerupCircle.alpha = .75 * e,
        null != this.sprites.level && (this.sprites.level.alpha = e,
        this.sprites.levelBorder.alpha = .4 * e),
        5 == this.type && (this.sprites.thruster1.alpha = e,
        this.sprites.thruster1Glow.alpha = e,
        this.sprites.thruster2.alpha = e,
        this.sprites.thruster2Glow.alpha = e)
    }
    kill(e) {
        if (this.status = 1,
        this.keystate = {},
        this.pos.x = e.posX,
        this.pos.y = e.posY,
        this.speed = Vector.zero(),
        this.me() && UI.resetPowerups(),
        this.resetPowerups(),
        this.hidden = true,
        this.visibilityUpdate(),
        this.stealthed && this.unstealth(),
        !this.culled && true !== e.spectate) {
            switch (this.type) {
            case 1:
                Particles.explosion(this.pos.clone(), Tools.rand(1.5, 2), Tools.randInt(2, 3));
                break;
            case 2:
                Particles.explosion(this.pos.clone(), Tools.rand(2, 2.5), Tools.randInt(4, 7));
                break;
            case 3:
            case 4:
            case 5:
                Particles.explosion(this.pos.clone(), Tools.rand(1.5, 2), Tools.randInt(2, 3))
            }
            Graphics.shakeCamera(this.pos, this.me() ? 20 : 10),
            Sound.clearThruster(this.id),
            Sound.playerKill(this)
        }
    }
    me() {
        return game.myID == this.id
    }
    destroy(e) {
        var t = this.me() ? game.graphics.layers.aircraftme : game.graphics.layers.aircraft;
        switch (t.removeChild(this.sprites.sprite),
        game.graphics.layers.shadows.removeChild(this.sprites.shadow),
        this.sprites.sprite.destroy(),
        this.sprites.shadow.destroy(),
        this.sprites.powerup.destroy(),
        this.sprites.powerupCircle.destroy(),
        this.type) {
        case 1:
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster),
            game.graphics.layers.thrusters.removeChild(this.sprites.thrusterGlow),
            this.sprites.thruster.destroy(),
            this.sprites.thrusterGlow.destroy(),
            this.sprites.thrusterShadow.destroy();
            break;
        case 2:
        case 4:
        case 5:
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster1, this.sprites.thruster2),
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster1Glow, this.sprites.thruster2Glow),
            this.sprites.thruster1.destroy(),
            this.sprites.thruster2.destroy(),
            this.sprites.thruster1Glow.destroy(),
            this.sprites.thruster2Glow.destroy(),
            this.sprites.thruster1Shadow.destroy(),
            this.sprites.thruster2Shadow.destroy();
            break;
        case 3:
            t.removeChild(this.sprites.rotor),
            this.sprites.rotor.destroy(),
            game.graphics.layers.shadows.removeChild(this.sprites.rotorShadow),
            this.sprites.rotorShadow.destroy()
        }
        e && !this.reel && (game.graphics.layers.playernames.removeChild(this.sprites.badge, this.sprites.name, this.sprites.flag),
        null != this.sprites.level && (game.graphics.layers.playernames.removeChild(this.sprites.level, this.sprites.levelBorder),
        this.sprites.level.destroy(),
        this.sprites.levelBorder.destroy()),
        game.graphics.layers.bubbles.removeChild(this.sprites.bubble),
        this.sprites.badge.destroy(),
        this.sprites.name.destroy(),
        this.sprites.flag.destroy(),
        this.sprites.bubble.destroy({
            children: true
        }))
    }
    sayBubble(e) {
        this.state.bubbleTime = game.time,
        this.state.bubbleFade = 0,
        this.state.bubble || (this.state.bubble = true,
        this.state.bubbleProgress = 0,
        this.sprites.bubble.visible = true,
        this.sprites.bubble.alpha = 0,
        this.sprites.bubble.scale.set(0, 0)),
        this.sprites.bubble.cacheAsBitmap = false;
        var t = UI.isEmote(e.text, true);
        if (t) {
            this.sprites.bubbleText.visible = false,
            this.sprites.emote.texture = Textures.get("emote_" + t),
            this.sprites.emote.visible = true;
            var n = 26;
            this.sprites.emote.position.set(0, 0)
        } else {
            this.sprites.bubbleText.visible = true,
            this.sprites.emote.visible = false,
            this.sprites.bubbleText.text = e.text;
            n = this.sprites.bubbleText.width;
            this.sprites.bubbleText.position.set(-n / 2, -7)
        }
        this.sprites.bubbleLeft.position.set(-n / 2 - 16, -21),
        this.sprites.bubbleRight.position.set(n / 2 + 8, -21),
        this.sprites.bubbleCenter.position.set(-n / 2 - 9, -21),
        this.sprites.bubbleCenter.scale.set(n / 82 + 18 / 82, .5),
        this.sprites.bubblePoint.position.set(-9, 18),
        this.sprites.bubble.cacheAsBitmap = true,
        this.state.bubbleTextWidth = n
    }
    networkKey(e, t) {
        this.lastPacket = game.timeNetwork,
        1 == this.status && this.revive(),
        null != t.posX && (this.reducedFactor = Tools.reducedFactor(),
        this.pos.x = t.posX,
        this.pos.y = t.posY,
        this.rot = t.rot,
        this.speed.x = t.speedX,
        this.speed.y = t.speedY);
        var n = this.stealthed;
        null != t.keystate && Tools.decodeKeystate(this, t.keystate),
        null != t.upgrades && (Tools.decodeUpgrades(this, t.upgrades),
        this.updatePowerups()),
        null != t.energy && (this.energy = t.energy,
        this.energyRegen = t.energyRegen),
        null != t.boost && (this.boost = t.boost),
        this.team != game.myTeam && (this.stealthed || n && !this.stealthed) && this.unstealth(),
        this.me() || !n || this.stealthed || this.unstealth(),
        t.c == Network.SERVERPACKET.EVENT_BOUNCE && game.time - this.state.lastBounceSound > 300 && (this.state.lastBounceSound = game.time,
        Sound.playerImpact(this.pos, this.type, this.speed.length() / config.ships[this.type].maxSpeed))
    }
    updateLevel(e) {
        this.me() && (1 == e.type && Games.showLevelUP(e.level),
        UI.updateMyLevel(e.level)),
        this.level = e.level,
        this.setupLevelPlate()
    }
    setupLevelPlate() {
        null == this.sprites.level ? (this.sprites.level = new PIXI.Text(this.level + "",{
            fontFamily: "MontserratWeb, Helvetica, sans-serif",
            fontSize: "28px",
            fill: "rgb(200, 200, 200)",
            dropShadow: true,
            dropShadowBlur: 6,
            dropShadowDistance: 0,
            padding: 4
        }),
        this.sprites.level.scale.set(.5, .5),
        this.sprites.levelBorder = Textures.sprite("levelborder"),
        this.sprites.levelBorder.alpha = .4,
        game.graphics.layers.playernames.addChild(this.sprites.levelBorder),
        game.graphics.layers.playernames.addChild(this.sprites.level)) : this.sprites.level.text = this.level + "",
        this.sprites.levelBorder.scale.set((this.sprites.level.width + 10) / 32, .65),
        this.sprites.level.visible = this.render,
        this.sprites.levelBorder.visible = this.render
    }
    powerup(e) {
        UI.addPowerup(e.type, e.duration)
    }
    resetPowerups() {
        this.powerupActive && (this.sprites.powerup.visible = false,
        this.sprites.powerupCircle.visible = false),
        this.powerups.shield = false,
        this.powerupsShown.shield = false,
        this.powerups.rampage = false,
        this.powerupsShown.rampage = false,
        this.powerupActive = false,
        this.state.powerupFade = 0,
        this.state.powerupFadeState = 0
    }
    updatePowerups() {
        var e = false;
        this.powerups.shield != this.powerupsShown.shield && (this.powerupsShown.shield = this.powerups.shield,
        this.powerups.shield && (this.sprites.powerup.texture = Textures.get("powerup_shield"),
        this.sprites.powerupCircle.tint = 16777215),
        e = true),
        this.powerups.rampage != this.powerupsShown.rampage && (this.powerupsShown.rampage = this.powerups.rampage,
        this.powerups.rampage && (this.sprites.powerup.texture = Textures.get("powerup_rampage"),
        this.sprites.powerupCircle.tint = 16712448),
        e = true),
        e && (this.powerupActive = this.powerups.shield || this.powerups.rampage,
        this.powerupActive ? (this.state.powerupFade = 0,
        this.state.powerupFadeState = 0,
        this.sprites.powerup.visible = true,
        this.sprites.powerupCircle.visible = true) : (this.powerupActive = true,
        this.state.powerupFade = 0,
        this.state.powerupFadeState = 1))
    }
    impact(e, t, n, r) {
        this.health = n,
        this.healthRegen = r,
        this.stealthed && this.unstealth(),
        200 != e && Mobs.explosion(t, e),
        this.me() && 0 == this.status && Graphics.shakeCamera(t, 8)
    }
    changeType(e) {
        this.type != e.type && (this.destroy(false),
        this.type = e.type,
        this.setupGraphics(true),
        this.visibilityUpdate(true))
    }
    respawn(e) {
        this.lastPacket = game.timeNetwork,
        this.status = 0,
        this.keystate = {},
        this.pos.x = e.posX,
        this.pos.y = e.posY,
        this.rot = e.rot,
        this.speed.x = 0,
        this.speed.y = 0,
        this.health = 1,
        this.energy = 1,
        this.healthRegen = 1,
        this.energyRegen = 1,
        this.boost = false,
        this.strafe = false,
        this.flagspeed = false,
        this.state.thrustLevel = 0,
        this.state.thrustDir = 0,
        this.hidden = false,
        this.timedout = false,
        this.visibilityUpdate(),
        this.me() && UI.resetPowerups(),
        Tools.decodeUpgrades(this, e.upgrades),
        this.updatePowerups(),
        (this.render || this.me()) && (this.scale = 0,
        this.state.scaleLevel = 0),
        this.stealthed && this.unstealth(),
        this.me() && (game.myType = this.type,
        game.spectatingID = null,
        UI.aircraftSelected(this.type),
        UI.visibilityHUD(true),
        UI.hideSpectator()),
        this.updateGraphics(1),
        Sound.playerRespawn(this)
    }
    revive() {
        this.status = 0,
        this.boost = false,
        this.strafe = false,
        this.flagspeed = false,
        this.hidden = false,
        this.health = 1,
        this.energy = 1,
        this.healthRegen = 1,
        this.energyRegen = 1,
        this.stealthed && this.unstealth()
    }
    changeFlag(e) {
        this.flag = e.flag,
        this.sprites.flag.texture = Textures.get("flag_" + e.flag)
    }
    changeBadge(e) {
        this.sprites.badge.texture = Textures.get(e)
    }
    updateNameplate() {
        if (!this.reel) {
            var e = (this.sprites.name.width + this.sprites.flag.width + 10) / 2
              , t = this.pos.x - e + (this.state.hasBadge ? 12 : 0) - (null != this.level ? this.sprites.level.width / 2 + 8 : 0)
              , n = this.pos.y + this.state.nameplateDist * this.scale;
            this.sprites.name.position.set(t + 40, n),
            this.sprites.flag.position.set(t + 15, n + 10),
            null != this.level && (this.sprites.level.position.set(t + 2 * e + 13, n + 2),
            this.sprites.levelBorder.position.set(t + 2 * e + 7.75, n - .5)),
            this.state.hasBadge && this.sprites.badge.position.set(t - 28, n)
        }
    }
    updateBubble() {
        this.state.bubbleProgress += .015 * game.timeFactor,
        this.state.bubbleProgress >= 1 && (this.state.bubbleProgress = 1),
        game.time - this.state.bubbleTime > 4e3 ? (this.state.bubbleFade += .08 * game.timeFactor,
        this.state.bubbleFade >= 1 && (this.state.bubbleFade = 1),
        this.sprites.bubble.scale.set(1 + .2 * this.state.bubbleFade),
        this.sprites.bubble.alpha = 1 * (1 - this.state.bubbleFade),
        this.state.bubbleFade >= 1 && (this.state.bubble = false,
        this.sprites.bubble.visible = false)) : (this.sprites.bubble.scale.set(Tools.easing.outElastic(this.state.bubbleProgress, .5)),
        this.sprites.bubble.alpha = 1);
        var e = (this.state.bubbleTextWidth + game.screenX) % 2 == 0 ? .5 : 0
          , t = game.screenY % 2 == 0 ? 0 : .5
          , n = this.state.nameplateDist * this.scale;
        this.powerupActive && (n += 60),
        this.sprites.bubble.position.set(this.pos.x * game.scale + e, (this.pos.y - n) * game.scale + t)
    }
    detectTimeout() {
        if (!this.me()) {
            var e = this.timedout;
            this.timedout = !game.lagging && game.timeNetwork - this.lastPacket > 3e3,
            this.timedout && !e && (this.boost = false,
            this.strafe = false,
            this.flagspeed = false,
            this.speed = Vector.zero(),
            this.keystate = {},
            this.resetPowerups())
        }
    }
    leaveHorizon() {
        this.me() || this.timedout || (this.lastPacket = -1e4,
        this.timedout = true,
        this.boost = false,
        this.strafe = false,
        this.flagspeed = false,
        this.speed = Vector.zero(),
        this.keystate = {},
        this.resetPowerups())
    }
    update(e) {
        if (this.reel)
            this.clientCalcs(e);
        else {
            if (this.detectTimeout(),
            this.visibilityUpdate(),
            !this.render)
                return this.health += e * this.healthRegen,
                void (this.health >= 1 && (this.health = 1));
            if (!(false !== this.reducedFactor && (e -= this.reducedFactor,
            this.reducedFactor = false,
            e <= 0))) {
                var t, n, r, i, o = e > .51 ? Math.round(e) : 1, s = e / o, a = 2 * Math.PI, l = this.boost ? 1.5 : 1;
                for (t = 0; t < o; t++) {
                    this.energy += s * this.energyRegen,
                    this.energy >= 1 && (this.energy = 1),
                    this.health += s * this.healthRegen,
                    this.health >= 1 && (this.health = 1),
                    i = -999,
                    this.strafe ? (this.keystate.LEFT && (i = this.rot - .5 * Math.PI),
                    this.keystate.RIGHT && (i = this.rot + .5 * Math.PI)) : (this.keystate.LEFT && (this.rot += -s * config.ships[this.type].turnFactor),
                    this.keystate.RIGHT && (this.rot += s * config.ships[this.type].turnFactor)),
                    n = this.speed.x,
                    r = this.speed.y,
                    this.keystate.UP ? -999 == i ? i = this.rot : i += Math.PI * (this.keystate.RIGHT ? -.25 : .25) : this.keystate.DOWN && (-999 == i ? i = this.rot + Math.PI : i += Math.PI * (this.keystate.RIGHT ? .25 : -.25)),
                    -999 !== i && (this.speed.x += Math.sin(i) * config.ships[this.type].accelFactor * s * l,
                    this.speed.y -= Math.cos(i) * config.ships[this.type].accelFactor * s * l);
                    var u = this.speed.length()
                      , c = config.ships[this.type].maxSpeed * l * config.upgrades.speed.factor[this.speedupgrade]
                      , h = config.ships[this.type].minSpeed;
                    this.powerups.rampage && (c *= .75),
                    this.flagspeed && (c = 5),
                    u > c ? this.speed.multiply(c / u) : this.speed.x > h || this.speed.x < -h || this.speed.y > h || this.speed.y < -h ? (this.speed.x *= 1 - config.ships[this.type].brakeFactor * s,
                    this.speed.y *= 1 - config.ships[this.type].brakeFactor * s) : (this.speed.x = 0,
                    this.speed.y = 0),
                    this.pos.x += s * n + .5 * (this.speed.x - n) * s * s,
                    this.pos.y += s * r + .5 * (this.speed.y - r) * s * s,
                    this.clientCalcs(s)
                }
                this.rot = (this.rot % a + a) % a,
                -1 != game.gameType ? (this.pos.x < -16352 && (this.pos.x = -16352),
                this.pos.x > 16352 && (this.pos.x = 16352),
                this.pos.y < -8160 && (this.pos.y = -8160),
                this.pos.y > 8160 && (this.pos.y = 8160)) : (this.pos.x < -16384 && (this.pos.x += 32768),
                this.pos.x > 16384 && (this.pos.x -= 32768),
                this.pos.y < -8192 && (this.pos.y += 16384),
                this.pos.y > 8192 && (this.pos.y -= 16384)),
                Sound.updateThruster(0, this)
            }
        }
    }
    clientCalcs(e) {
        switch (this.type) {
        case 1:
        case 2:
        case 4:
        case 5:
            var t = false
              , n = false
              , r = this.boost ? 1.5 : 1;
            false !== (t = this.keystate.LEFT ? .3 : this.keystate.RIGHT ? -.3 : 0) && (this.state.thrustDir = Tools.converge(this.state.thrustDir, t, .1 * e)),
            false !== (n = this.keystate.UP ? 1 : this.keystate.DOWN ? -1 : 0) && (this.state.thrustLevel = Tools.converge(this.state.thrustLevel, n * r, .2 * e));
            break;
        case 3:
            this.state.thrustDir += (.2 + this.speed.length() / 50) * e
        }
        this.culled || this.render && (!this.stealthed && this.health < .4 && Particles.planeDamage(this),
        !this.stealthed && this.health < .2 && Particles.planeDamage(this),
        this.boost && Particles.planeBoost(this, n >= 0),
        5 == this.type && this.stealthed && (this.state.stealthLevel += .03 * e,
        this.state.stealthLevel = Tools.clamp(this.state.stealthLevel, 0, this.team == game.myTeam ? .5 : 1),
        this.opacity(1 - this.state.stealthLevel)),
        this.state.scaleLevel += .005 * e,
        this.state.scaleLevel >= 1 ? (this.state.scaleLevel = 1,
        this.scale = 1) : this.scale = Tools.easing.outElastic(this.state.scaleLevel, .5),
        this.powerupActive && (this.state.powerupAngle += .075 * e,
        0 == this.state.powerupFadeState ? (this.state.powerupFade += .05 * e,
        this.state.powerupFade >= 1 && (this.state.powerupFade = 1)) : (this.state.powerupFade += .05 * e,
        this.state.powerupFade >= 1 && (this.powerupActive = false,
        this.sprites.powerup.visible = false,
        this.sprites.powerupCircle.visible = false))))
    }
    updateGraphics(e) {
        var t = Tools.oscillator(.025, 1e3, this.randomness) * this.scale
          , n = 1.5 * this.state.thrustLevel
          , r = this.rot
          , i = Graphics.shadowCoords(this.pos);
        if (Graphics.transform(this.sprites.sprite, this.pos.x, this.pos.y, r, t * this.state.baseScale, t * this.state.baseScale),
        Graphics.transform(this.sprites.shadow, i.x, i.y, r, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale),
        this.powerupActive) {
            var o = .35 * (0 == this.state.powerupFadeState ? 2 * (1 - this.state.powerupFade) + 1 : 1 - this.state.powerupFade) * Tools.oscillator(.075, 100, this.randomness)
              , s = .75 * (0 == this.state.powerupFadeState ? Tools.clamp(2 * this.state.powerupFade, 0, 1) : Tools.clamp(1 - 1.3 * this.state.powerupFade, 0, 1)) * this.alpha;
            Graphics.transform(this.sprites.powerup, this.pos.x, this.pos.y - 80, 0, o, o, s),
            Graphics.transform(this.sprites.powerupCircle, this.pos.x, this.pos.y - 80, this.state.powerupAngle, 1.35 * o, 1.35 * o, s)
        }
        var a = Tools.oscillator(.1, .5, this.randomness)
          , l = Math.abs(this.state.thrustLevel) < .01 ? 0 : this.state.thrustLevel / 2 + (this.state.thrustLevel > 0 ? .5 : -.5)
          , u = Tools.clamp(2 * Math.abs(this.state.thrustLevel) - .1, 0, 1);
        switch (this.type) {
        case 1:
            Graphics.transform(this.sprites.thruster, this.pos.x + Math.sin(-r) * (20 * t), this.pos.y + Math.cos(-r) * (20 * t), r + (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .5 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thrusterShadow, i.x + Math.sin(-r) * (20 * t) / config.shadowScaling, i.y + Math.cos(-r) * (20 * t) / config.shadowScaling, r + (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale * (4 / config.shadowScaling), .5 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thrusterGlow, this.pos.x + Math.sin(-r - .5 * this.state.thrustDir) * (40 * t), this.pos.y + Math.cos(-r - .5 * this.state.thrustDir) * (40 * t), null, 1.5 * n * this.scale, 1 * n * this.scale, .3 * this.state.thrustLevel);
            break;
        case 2:
            this.state.thrustLevel < 0 && (a *= .7),
            Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-r - .5) * (32 * t), this.pos.y + Math.cos(-r - .5) * (32 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale, .6 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.5 - r) * (32 * t), this.pos.y + Math.cos(.5 - r) * (32 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale, .6 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster1Shadow, i.x + Math.sin(-r - .5) * (32 * t) / config.shadowScaling, i.y + Math.cos(-r - .5) * (32 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .5 * a * l * this.scale * (4 / config.shadowScaling), .6 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster2Shadow, i.x + Math.sin(.5 - r) * (32 * t) / config.shadowScaling, i.y + Math.cos(.5 - r) * (32 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .5 * a * l * this.scale * (4 / config.shadowScaling), .6 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-r - .3) * (50 * t), this.pos.y + Math.cos(-r - .3) * (50 * t), null, 2.5 * this.scale, 1.5 * this.scale, .3 * this.state.thrustLevel),
            Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.3 - r) * (50 * t), this.pos.y + Math.cos(.3 - r) * (50 * t), null, 2.5 * this.scale, 1.5 * this.scale, .3 * this.state.thrustLevel);
            break;
        case 3:
            Graphics.transform(this.sprites.rotor, this.pos.x, this.pos.y, this.state.thrustDir, t * this.state.baseScale * 2, t * this.state.baseScale * 2, .8),
            Graphics.transform(this.sprites.rotorShadow, i.x, i.y, this.state.thrustDir, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale * 2, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale * 2);
            break;
        case 4:
            this.state.thrustLevel < 0 && (a *= .7),
            Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-r - .15) * (28 * t), this.pos.y + Math.cos(-r - .15) * (28 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .5 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.15 - r) * (28 * t), this.pos.y + Math.cos(.15 - r) * (28 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .5 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster1Shadow, i.x + Math.sin(-r - .15) * (28 * t) / config.shadowScaling, i.y + Math.cos(-r - .15) * (28 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale * (4 / config.shadowScaling), .5 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster2Shadow, i.x + Math.sin(.15 - r) * (28 * t) / config.shadowScaling, i.y + Math.cos(.15 - r) * (28 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale * (4 / config.shadowScaling), .5 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-r - .2) * (45 * t), this.pos.y + Math.cos(-r - .2) * (45 * t), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel),
            Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - r) * (45 * t), this.pos.y + Math.cos(.2 - r) * (45 * t), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel);
            break;
        case 5:
            this.state.thrustLevel < 0 && (a *= .7),
            Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-r - .35) * (20 * t), this.pos.y + Math.cos(-r - .35) * (20 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .4 * a * l * this.scale, u * this.alpha),
            Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.35 - r) * (20 * t), this.pos.y + Math.cos(.35 - r) * (20 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .4 * a * l * this.scale, u * this.alpha),
            Graphics.transform(this.sprites.thruster1Shadow, i.x + Math.sin(-r - .35) * (20 * t) / config.shadowScaling, i.y + Math.cos(-r - .35) * (20 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale * (4 / config.shadowScaling), .4 * a * l * this.scale * (4 / config.shadowScaling), u * this.alpha / 2.5),
            Graphics.transform(this.sprites.thruster2Shadow, i.x + Math.sin(.35 - r) * (20 * t) / config.shadowScaling, i.y + Math.cos(.35 - r) * (20 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale * (4 / config.shadowScaling), .4 * a * l * this.scale * (4 / config.shadowScaling), u * this.alpha / 2.5),
            Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-r - .2 - 0 * this.state.thrustDir) * (35 * t), this.pos.y + Math.cos(-r - .2 - 0 * this.state.thrustDir) * (35 * t), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha),
            Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - r - 0 * this.state.thrustDir) * (35 * t), this.pos.y + Math.cos(.2 - r - 0 * this.state.thrustDir) * (35 * t), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha)
        }
        this.updateNameplate(),
        this.state.bubble && this.updateBubble(),
        config.debug.collisions && this.col && (this.col.position.set(this.pos.x, this.pos.y),
        this.col.rotation = this.rot)
    }
}
