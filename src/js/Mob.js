import Vector from './Vector.js';

class Mob {
    constructor(e) {
        this.id = e.id,
        this.type = e.type,
        this.pos = new Vector(e.posX,e.posY),
        this.spriteRot = 0,
        this.missile = 1 == this.type || 2 == this.type || 3 == this.type || 5 == this.type || 6 == this.type || 7 == this.type,
        this.missile && e.c !== Network.SERVERPACKET.MOB_UPDATE_STATIONARY ? (this.speed = new Vector(e.speedX,e.speedY),
        this.accel = new Vector(e.accelX,e.accelY),
        this.maxSpeed = e.maxSpeed,
        this.exhaust = config.mobs[this.type].exhaust,
        this.lastAccelX = 0,
        this.lastAccelY = 0,
        this.stationary = false,
        this.spriteRot = this.speed.angle() + Math.PI) : this.stationary = true,
        this.sprites = {},
        this.state = {
            inactive: false,
            despawnTicker: 0,
            despawnType: 0,
            baseScale: 1,
            baseScaleShadow: 1,
            luminosity: 1
        },
        this.randomness = Tools.rand(0, 1e5),
        this.culled = false,
        this.visibility = true,
        this.reducedFactor = false,
        this.forDeletion = false,
        this.spawnTime = game.time,
        this.lastPacket = game.timeNetwork,
        this.setupSprite()
    }
    setupSprite() {
        switch (4 != this.type && 8 != this.type && 9 != this.type && (this.sprites.thrusterGlow = Textures.init("thrusterGlowSmall", {
            layer: "projectiles"
        }),
        this.sprites.smokeGlow = Textures.init("smokeGlow", {
            layer: "projectiles"
        }),
        this.sprites.thruster = Textures.init("missileThruster")),
        this.type) {
        case 1:
        case 5:
        case 6:
        case 7:
            this.sprites.sprite = Textures.init("missile"),
            this.sprites.shadow = Textures.init("missileShadow", {
                scale: [.25, .2]
            }),
            this.sprites.thrusterGlow.scale.set(3, 2),
            this.sprites.thrusterGlow.alpha = .2,
            this.sprites.smokeGlow.scale.set(1.5, 3),
            this.sprites.smokeGlow.alpha = .75;
            break;
        case 2:
            this.sprites.sprite = Textures.init("missileFat"),
            this.sprites.shadow = Textures.init("missileShadow", {
                scale: [.5, .25]
            }),
            this.sprites.thrusterGlow.scale.set(4, 3),
            this.sprites.thrusterGlow.alpha = .25,
            this.sprites.smokeGlow.scale.set(2.5, 3),
            this.sprites.smokeGlow.alpha = .75;
            break;
        case 3:
            this.sprites.sprite = Textures.init("missileSmall", {
                scale: [.28, .2]
            }),
            this.sprites.shadow = Textures.init("missileShadow", {
                scale: [.18, .14]
            }),
            this.sprites.thrusterGlow.scale.set(3, 2),
            this.sprites.thrusterGlow.alpha = .2,
            this.sprites.smokeGlow.scale.set(1, 2),
            this.sprites.smokeGlow.alpha = .75;
            break;
        case 4:
        case 8:
        case 9:
            var e = "crateUpgrade";
            8 == this.type ? e = "crateShield" : 9 == this.type && (e = "crateRampage"),
            this.state.baseScale = .33,
            this.state.baseScaleShadow = 2.4 / config.shadowScaling * .33,
            this.sprites.sprite = Textures.init(e, {
                scale: this.state.baseScale
            }),
            this.sprites.shadow = Textures.init("crateShadow", {
                scale: this.state.baseScaleShadow
            })
        }
    }
    despawn(e) {
        if (4 == this.type || 8 == this.type || 9 == this.type)
            return this.state.inactive = true,
            this.state.despawnTicker = 0,
            this.state.despawnType = e,
            void (1 == e && 4 != this.type && Sound.powerup(this.type, this.pos));
        this.state.inactive = true,
        this.state.despawnTicker = 0,
        this.sprites.thruster.renderable = false,
        this.sprites.thrusterGlow.renderable = false,
        this.sprites.smokeGlow.renderable = false,
        this.accel.x = 0,
        this.accel.y = 0,
        this.missile && Sound.updateThruster(1, this, false)
    }
    destroy(e) {
        switch (this.type) {
        case 1:
        case 2:
        case 3:
        case 5:
        case 6:
        case 7:
            game.graphics.layers.projectiles.removeChild(this.sprites.sprite),
            game.graphics.layers.shadows.removeChild(this.sprites.shadow),
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster),
            game.graphics.layers.projectiles.removeChild(this.sprites.thrusterGlow),
            game.graphics.layers.projectiles.removeChild(this.sprites.smokeGlow),
            this.sprites.sprite.destroy(),
            this.sprites.shadow.destroy(),
            this.sprites.thruster.destroy(),
            this.sprites.thrusterGlow.destroy(),
            this.sprites.smokeGlow.destroy();
            break;
        case 4:
        case 8:
        case 9:
            game.graphics.layers.crates.removeChild(this.sprites.sprite),
            game.graphics.layers.shadows.removeChild(this.sprites.shadow)
        }
        e.c === Network.SERVERPACKET.MOB_DESPAWN_COORDS && (Mobs.explosion(this.pos, e.type),
        this.missile && Sound.updateThruster(1, this, false))
    }
    network(e) {
        this.lastPacket = game.timeNetwork,
        e.c === Network.SERVERPACKET.MOB_UPDATE && (this.reducedFactor = Tools.reducedFactor()),
        this.pos.x = e.posX,
        this.pos.y = e.posY,
        null != e.speedX && (this.speed.x = e.speedX,
        this.speed.y = e.speedY),
        null != e.accelX && (this.accel.x = e.accelX,
        this.accel.y = e.accelY)
    }
    visible(e) {
        e == this.visibility && e != this.culled || (this.sprites.sprite.visible = e,
        this.sprites.shadow.visible = e,
        4 != this.type && 8 != this.type && 9 != this.type && (this.sprites.thruster.visible = e,
        this.sprites.thrusterGlow.visible = e),
        this.visibility = e)
    }
    visibilityUpdate() {
        this.culled = !Graphics.inScreen(this.pos, 128),
        this.visible(!this.culled)
    }
    update(e) {
        if (this.visibilityUpdate(),
        !(false !== this.reducedFactor && (e -= this.reducedFactor,
        this.reducedFactor = false,
        e <= 0))) {
            var t, n, r, i = e > .51 ? Math.round(e) : 1, o = e / i;
            for (t = 0; t < i; t++)
                if (this.stationary)
                    this.clientCalcs(o);
                else {
                    n = this.speed.x,
                    r = this.speed.y,
                    this.speed.x += this.accel.x * o,
                    this.speed.y += this.accel.y * o;
                    var s = this.speed.length();
                    s > this.maxSpeed && this.speed.multiply(this.maxSpeed / s),
                    this.state.inactive && this.speed.multiply(1 - .03 * o),
                    this.pos.x += o * n + .5 * (this.speed.x - n) * o,
                    this.pos.y += o * r + .5 * (this.speed.y - r) * o,
                    this.pos.x < -16384 && (this.pos.x += 32768),
                    this.pos.x > 16384 && (this.pos.x -= 32768),
                    this.pos.y < -8192 && (this.pos.y += 16384),
                    this.pos.y > 8192 && (this.pos.y -= 16384),
                    this.clientCalcs(o)
                }
            this.missile && !this.state.inactive && Sound.updateThruster(1, this, this.visibility)
        }
    }
    clientCalcs(e) {
        if (!this.forDeletion)
            switch (this.state.luminosity -= .075 * e,
            this.state.luminosity < 0 && (this.state.luminosity = 0),
            this.type) {
            case 1:
            case 2:
            case 3:
            case 5:
            case 6:
            case 7:
                var t = 1;
                if (this.state.inactive) {
                    if (this.state.despawnTicker += .01 * e,
                    this.state.despawnTicker > .75) {
                        var n = 1 - 4 * (this.state.despawnTicker - .75);
                        this.sprites.sprite.alpha = n,
                        this.sprites.shadow.alpha = n
                    }
                    if (this.state.despawnTicker > 1)
                        return void (this.forDeletion = true);
                    t = Tools.clamp(1 - this.state.despawnTicker, .3, 1)
                }
                if (!this.culled && t > .3) {
                    var r = this.speed.angle() + Math.PI;
                    r - this.spriteRot >= Math.PI ? this.spriteRot += 2 * Math.PI : this.spriteRot - r > Math.PI && (this.spriteRot -= 2 * Math.PI),
                    this.spriteRot = Tools.converge(this.spriteRot, r, .1 * e),
                    Particles.missileSmoke(this, this.exhaust, t)
                }
                break;
            case 4:
            case 8:
            case 9:
                if (this.state.inactive && (this.state.despawnTicker += .05 * e,
                this.state.despawnTicker > 1))
                    return void (this.forDeletion = true)
            }
    }
    updateGraphics(e) {
        switch (this.type) {
        case 1:
        case 2:
        case 3:
        case 5:
        case 6:
        case 7:
            var t = Graphics.shadowCoords(this.pos)
              , n = Tools.oscillator(.1, .5, this.randomness)
              , r = Tools.oscillator(.15, 10, this.randomness);
            Graphics.transform(this.sprites.sprite, this.pos.x, this.pos.y, this.spriteRot),
            Graphics.transform(this.sprites.shadow, t.x, t.y, this.spriteRot),
            Graphics.transform(this.sprites.thrusterGlow, this.pos.x + Math.sin(-this.spriteRot) * (this.exhaust + 20), this.pos.y + Math.cos(-this.spriteRot) * (this.exhaust + 20), null, null, null, (.5 * this.state.luminosity + .2) * r),
            Graphics.transform(this.sprites.smokeGlow, this.pos.x + Math.sin(-this.spriteRot) * (this.exhaust + 20), this.pos.y + Math.cos(-this.spriteRot) * (this.exhaust + 20), this.spriteRot),
            Graphics.transform(this.sprites.thruster, this.pos.x + Math.sin(-this.spriteRot) * this.exhaust, this.pos.y + Math.cos(-this.spriteRot) * this.exhaust, this.spriteRot, config.mobs[this.type].thruster[0] * n, config.mobs[this.type].thruster[1] * n);
            break;
        case 4:
        case 8:
        case 9:
            var i;
            t = Graphics.shadowCoords(this.pos);
            i = 0 == this.state.despawnType ? 1 - this.state.despawnTicker : 1 + 2 * this.state.despawnTicker,
            i *= Tools.oscillator(.08, 500, this.randomness),
            Graphics.transform(this.sprites.sprite, this.pos.x, this.pos.y + 20 * (Tools.oscillator(.08, 330, this.randomness) - 1.04), null, this.state.baseScale * i, this.state.baseScale * i, 1 - this.state.despawnTicker),
            Graphics.transform(this.sprites.shadow, t.x, t.y, null, this.state.baseScaleShadow * i, this.state.baseScaleShadow * i, 1 - this.state.despawnTicker)
        }
    }
}

export default Mob;
