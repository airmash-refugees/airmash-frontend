import Vector from './Vector';

class ParticleContainer {
    constructor(pixiContainer, maxParticles, blendMode, shadow) {
        this.maxParticles = maxParticles,
        this.container = new PIXI.Container,
        null != blendMode && (this.container.blendMode = blendMode),
        this.particles = [],
        this.first = -1,
        this.last = -1,
        this.emitters = {},
        this.emitterId = 0,
        this.shadow = shadow,
        pixiContainer.addChild(this.container)
    }

    addParticle(type, spriteName, speed, pos, scale, alpha, rotationSpeed, rotation, tint, anchorPos, blendMode, life, data, emitter) {
        if (!(game.timeFactorUncapped > 20 || this.particles.length >= this.maxParticles)) {
            var sprite = Textures.sprite(spriteName),
                particle = {
                    type: type,
                    sprite: sprite,
                    speed: speed,
                    pos: pos,
                    scale: scale,
                    alpha: alpha,
                    rotationSpeed: rotationSpeed,
                    rotation: rotation,
                    lastRotation: 0,
                    time: game.time,
                    tint: tint,
                    life: 0,
                    data: null != data ? data : 0,
                    emitter: null != emitter ? emitter : null,
                    _prev: -1,
                    _next: -1
                };
            null != tint && (sprite.tint = tint),
            null != blendMode && (sprite.blendMode = blendMode),
            null != life && (particle.life = life),
            null != anchorPos ? sprite.anchor.set(anchorPos.x, anchorPos.y) : sprite.anchor.set(.5, .5),
            this.container.addChild(sprite);
            var particleId = this.particles.length;
            particleId > 0 ? (this.particles[this.last]._next = particleId,
            particle._prev = this.last,
            this.last = particleId) : (this.first = particleId,
            this.last = particleId),
            this.particles.push(particle)
        }
    }

    wipe() {
        this.emitters = {},
        this.emitterId = 0;
        for (var e = 0; e < this.particles.length; e++)
            this.container.removeChild(this.particles[e].sprite),
            this.particles[e].sprite.destroy();
        this.particles = [],
        this.first = -1,
        this.last = -1
    }

    addEmitter(type, speed, pos, life, shadowLayer) {
        game.timeFactorUncapped > 20 || (this.emitters[this.emitterId] = {
            type: type,
            pos: pos,
            speed: speed,
            life: null != life ? life : 0,
            shadowLayer: shadowLayer
        },
        this.emitterId++)
    }

    updateEmitters(e) {
        var t, r;
        for (t in this.emitters) {
            switch ((r = this.emitters[t]).type) {
            case particleTypeIdByName.EMITTER_EXPLOSION_FRAGMENT:
                r.life += .02 * e,
                r.speed.multiply(1 - .02 * e)
            }
            if (r.life > 1)
                delete this.emitters[t];
            else
                switch (r.pos.x += r.speed.x * e,
                r.pos.y += r.speed.y * e,
                r.type) {
                case particleTypeIdByName.EMITTER_EXPLOSION_FRAGMENT:
                    var i = Tools.randInt(1, 16),
                        o = 0.5 * (1 - r.life),
                        s = 1 - r.life,
                        a = Tools.rand(-0.1, 0.1),
                        l = Tools.randCircle();
                    this.addParticle(particleTypeIdByName.FRAGMENT_SMOKE, "smoke_" + i, Vector.zero(), r.pos.clone(), Vector.diag(o), 1, a, l, null, null, null, null, s + .2),
                    r.shadowLayer && r.shadowLayer.addParticle(particleTypeIdByName.FRAGMENT_SMOKE, "smokeshadow_" + i, Vector.zero(), r.pos.clone(), Vector.diag(o), 1, a, l, null, null, null, null, s + .2)
                }
        }
    }

    destroy(e) {
        var t = this.particles.length;
        if (0 != t && !(e >= t)) {
            this.container.removeChild(this.particles[e].sprite),
            this.particles[e].sprite.destroy();
            var n = this.particles[e]._prev,
                r = this.particles[e]._next;
            return t--,
            -1 != n ? this.particles[n]._next = r : this.first = r,
            -1 != r ? this.particles[r]._prev = n : this.last = n,
            e != t && (this.particles[e] = this.particles[t],
            -1 != this.particles[e]._prev ? this.particles[this.particles[e]._prev]._next = e : this.first = e,
            -1 != this.particles[e]._next ? this.particles[this.particles[e]._next]._prev = e : this.last = e),
            this.particles.splice(t, 1),
            r == t ? e : r
        }
    }

    update(e) {
        var t;
        this.updateEmitters(e);
        for (var r = this.first; -1 != r; ) {
            switch ((t = this.particles[r]).type) {
            case particleTypeIdByName.MISSILE:
            case particleTypeIdByName.MISSILE_FAT:
            case particleTypeIdByName.MISSILE_SMALL:
                t.type == particleTypeIdByName.MISSILE ? (t.scale.add(.2 * e),
                t.scale.ceil(2 * t.data),
                t.life += .05 * e) : t.type == particleTypeIdByName.MISSILE_FAT ? (t.scale.add(.3 * e),
                t.scale.ceil(3 * t.data),
                t.life += .05 * e) : (t.scale.add(.14 * e),
                t.scale.ceil(1.4 * t.data),
                t.life += .08 * e),
                t.speed.multiply(1 - .05 * e),
                t.alpha = .7 * (1 - t.life),
                t.sprite.tint = Tools.colorLerp(t.tint, 16777215, 2 * (1 - t.life));
                break;
            case particleTypeIdByName.SHOCKWAVE_SMOKE:
                t.life += .05 * e,
                t.alpha = .7 * Tools.easing.custom(t.life, "shockwave");
                break;
            case particleTypeIdByName.SHOCKWAVE_INNER:
            case particleTypeIdByName.SHOCKWAVE_OUTER:
                t.life += .05 * e;
                var i = Tools.easing.custom(t.life, "shockwave");
                t.alpha = .4 * i,
                t.type == particleTypeIdByName.SHOCKWAVE_OUTER ? t.scale.both(4 * t.life) : t.scale.both(3 * t.life);
                break;
            case particleTypeIdByName.EXPLOSION_FLASH:
                t.life += .1 * e,
                t.alpha = 1 - t.life;
                break;
            case particleTypeIdByName.EXPLOSION_FLASH_BIG:
                t.life += .04 * e,
                t.alpha = 1 - t.life;
                break;
            case particleTypeIdByName.EXPLOSION_HOT_SMOKE:
                t.life += .035 * e,
                t.alpha = 1 - t.life,
                t.scale.add(.05 * e),
                t.speed.multiply(1 - .1 * e),
                t.rotationSpeed *= 1 - .05 * e;
                break;
            case particleTypeIdByName.EXPLOSION_SMOKE:
                t.life += .01 * e,
                t.alpha = Tools.easing.custom(t.life, "explosionSmoke"),
                t.scale.add(.05 * e),
                t.speed.multiply(1 - .05 * e),
                t.rotationSpeed *= 1 - .05 * e;
                break;
            case particleTypeIdByName.EXPLOSION_SPARK:
                t.life += .02 * e,
                t.alpha = 2 * (1 - t.life),
                t.speed.multiply(1 - .05 * e),
                t.rotationSpeed *= 1 - .05 * e;
                break;
            case particleTypeIdByName.FRAGMENT_SMOKE:
                t.life += .02 * e,
                t.scale.add(.075 * e * t.data),
                t.scale.ceil(2 * t.data),
                t.rotationSpeed *= 1 - .05 * e,
                t.alpha = .3 * (1 - t.life);
                break;
            case particleTypeIdByName.PLANE_DAMAGE:
                t.life += .02 * e,
                t.alpha = 2 * (1 - t.life),
                t.speed.multiply(1 - .1 * e)
            }
            if (t.life > 1)
                r = this.destroy(r);
            else {
                if (t.pos.x += t.speed.x * e,
                t.pos.y += t.speed.y * e,
                t.rotation += t.rotationSpeed * e,
                this.shadow) {
                    var o = Graphics.shadowCoords(t.pos);
                    t.sprite.position.x = o.x,
                    t.sprite.position.y = o.y,
                    t.sprite.scale.x = t.scale.x / config.shadowScaling,
                    t.sprite.scale.y = t.scale.y / config.shadowScaling,
                    t.sprite.alpha = Tools.clamp(2 * t.alpha, 0, 1)
                } else
                    t.sprite.position.x = t.pos.x,
                    t.sprite.position.y = t.pos.y,
                    t.sprite.scale.x = t.scale.x,
                    t.sprite.scale.y = t.scale.y,
                    t.sprite.alpha = Tools.clamp(t.alpha, 0, 1);
                Math.abs(t.rotation - t.lastRotation) > .03 && (t.sprite.rotation = t.rotation,
                t.lastRotation = t.rotation),
                r = this.particles[r]._next
            }
        }
    }
}

var containersByName = {};

Particles.setup = function() {
    containersByName.smoke = new ParticleContainer(game.graphics.layers.smoke,2e3),
    containersByName.shadows = new ParticleContainer(game.graphics.layers.shadows,2e3,null,true),
    containersByName.explosions = new ParticleContainer(game.graphics.layers.explosions,2e3)
};

Particles.update = function() {
    for (var e = game.timeFactor > .51 ? Math.round(game.timeFactor) : 1, n = game.timeFactor / e, r = 0; r < e; r++)
        containersByName.smoke.update(n),
        containersByName.explosions.update(n),
        containersByName.shadows.update(n)
};

Particles.wipe = function() {
    containersByName.smoke.wipe(),
    containersByName.explosions.wipe(),
    containersByName.shadows.wipe()
};

Particles.planeDamage = function(player) {
    var r = 2 == player.type ? 2 : 1,
        sparkIdx = Tools.randInt(1, 4),
        angle = Tools.randCircle(),
        s = Tools.rand(0.5, 2),
        a = Tools.rand(0.2, 0.8),
        l = Tools.rand(0, 0.3),
        pos = Vector.createOff(player.pos, angle, Tools.rand(0, 5 * r)),
        c = Vector.create(angle, s);
    containersByName.explosions.addParticle(particleTypeIdByName.PLANE_DAMAGE, "spark_" + sparkIdx, new Vector(c.x + player.speed.x,c.y + player.speed.y), pos, Vector.diag(a), 0, 0, Tools.randCircle(), 16739073, null, PIXI.BLEND_MODES.ADD, l)
};

Particles.explosion = function(e, r, i) {
    for (var o = r > 1 ? 1 + (r - 1) / 1.5 : r, s = 0; s < 2; s++)
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_FLASH, "flash_" + Tools.randInt(1, 4), Vector.zero(), e.clone(), Vector.diag(1.5 * r), 0, 0, Tools.randCircle(), 15987628, null, PIXI.BLEND_MODES.ADD);
    var a, l, u, c, h, d, p, f, g;
    a = Math.round(Tools.rand(20, 30) * r);
    for (s = 0; s < a; s++)
        l = Tools.randInt(1, 4),
        u = Tools.randCircle(),
        h = Tools.rand(3, 10) * o,
        d = Tools.rand(-.2, .2),
        p = Tools.rand(.4, 1.5) * o,
        g = Tools.rand(0, .3),
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_SPARK, "spark_" + l, Vector.create(u, h), e.clone(), Vector.diag(p), 0, d, Tools.randCircle(), 16739073, null, PIXI.BLEND_MODES.ADD, g);
    for (s = 0; s < i; s++)
        u = Tools.randCircle(),
        h = Tools.rand(3, 7) * o,
        c = Tools.rand(15, 30) * r,
        containersByName.explosions.addEmitter(particleTypeIdByName.EMITTER_EXPLOSION_FRAGMENT, Vector.create(u, h), Vector.createOff(e, u, c), Tools.rand(0, .5), containersByName.shadows);
    a = Math.round(Tools.rand(20, 30) * r);
    for (s = 0; s < a; s++)
        l = Tools.randInt(1, 16),
        u = Tools.randCircle(),
        c = Tools.rand(0, 10) * r,
        h = Tools.rand(0, 3) * r,
        d = Tools.rand(-.1, .1),
        p = Tools.rand(.5, .8) * r,
        f = Tools.randCircle(),
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_SMOKE, "smoke_" + l, Vector.create(u, h), Vector.createOff(e, u, c), Vector.diag(p), 0, d, f),
        containersByName.shadows.addParticle(particleTypeIdByName.EXPLOSION_SMOKE, "smokeshadow_" + l, Vector.create(u, h), Vector.createOff(e, u, c), Vector.diag(p), 0, d, f);
    containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_FLASH_BIG, "glowsmall", Vector.zero(), e.clone(), Vector.diag(6 * r), 0, 0, 0, null, null, PIXI.BLEND_MODES.ADD),
    a = Math.round(Tools.rand(5, 10) * r);
    for (s = 0; s < a; s++)
        l = Tools.randInt(1, 4),
        u = Tools.randCircle(),
        h = Tools.rand(1, 3) * r,
        d = Tools.rand(-.1, .1),
        p = Tools.rand(.1, .3) * r,
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_HOT_SMOKE, "hotsmoke_" + l, Vector.create(u, h), e.clone(), Vector.diag(p), 0, d, Tools.randCircle(), 16739073, null, PIXI.BLEND_MODES.ADD)
};

Particles.missileSmoke = function(mob, exhaust, i) {
    var o = [
        null,
        particleTypeIdByName.MISSILE,
        particleTypeIdByName.MISSILE_FAT,
        particleTypeIdByName.MISSILE_SMALL,
        null,
        particleTypeIdByName.MISSILE,
        particleTypeIdByName.MISSILE,
        particleTypeIdByName.MISSILE
    ][mob.type];
    var s = mob.spriteRot + Math.PI,
        a = Vector.createOff(mob.pos, s, exhaust),
        l = 0.2 * (i = i || 1),
        u = Tools.rand(-0.1, 0.1),
        c = Vector.create(s + u, 5 * i),
        h = Tools.randInt(1, 16),
        d = Tools.rand(-0.1, 0.1);
    Tools.randCircle();
    containersByName.smoke.addParticle(o, "smoke_" + h, c.clone(), a.clone(), new Vector(1.25 * l,4 * l), 1, d, s, 16775590, null, null, null, i),
    containersByName.shadows.addParticle(o, "smokeshadow_" + h, c.clone(), a.clone(), new Vector(1.25 * l,4 * l), 1, d, s, null, null, null, null, i)
};

Particles.planeBoost = function(e, r) {
    var i = e.rot + e.state.thrustDir / 2 + Math.PI,
        o = Vector.createOff(e.pos, i, r ? 40 : -20),
        s = Tools.rand(-0.1, 0.1),
        a = r ? 0 : Math.PI,
        l = Vector.create(i + s + a, 6),
        u = Tools.randInt(1, 16),
        c = Tools.rand(-0.1, 0.1);
    Tools.randCircle();
    containersByName.smoke.addParticle(particleTypeIdByName.MISSILE, "smoke_" + u, l.clone(), o.clone(), new Vector(.3,1.2), 1, c, i, 16775590, null, null, null, 1.2),
    containersByName.shadows.addParticle(particleTypeIdByName.MISSILE, "smokeshadow_" + u, l.clone(), o.clone(), new Vector(.3,1.2), 1, c, i, null, null, null, null, 1.2)
};

Particles.spiritShockwave = function(e) {
    for (var r, i, o = 0; o < 40; o++)
        i = o / 40 * 2 * Math.PI,
        r = Tools.randInt(1, 16),
        containersByName.smoke.addParticle(particleTypeIdByName.SHOCKWAVE_SMOKE, "smoke_" + r, Vector.create(i, 8), e.clone(), Vector.diag(2), 0, .4, Tools.randCircle());
    containersByName.smoke.addParticle(particleTypeIdByName.SHOCKWAVE_INNER, "shockwave", Vector.zero(), e.clone(), Vector.zero(), 0, 0, -.35 + Math.PI),
    containersByName.smoke.addParticle(particleTypeIdByName.SHOCKWAVE_OUTER, "shockwave", Vector.zero(), e.clone(), Vector.zero(), 0, 0, -.35)
};

Particles.count = function() {
    var e = 0;
    for (var n in containersByName)
        e += containersByName[n].particles.length;
    return e
};

var particleTypeIdByName = {
    MISSILE: 0,
    MISSILE_FAT: 1,
    MISSILE_SMALL: 2,
    SHOCKWAVE_SMOKE: 3,
    SHOCKWAVE_INNER: 4,
    SHOCKWAVE_OUTER: 5,
    EXPLOSION_FLASH: 6,
    EXPLOSION_FLASH_BIG: 7,
    EXPLOSION_SMOKE: 8,
    EXPLOSION_HOT_SMOKE: 9,
    EXPLOSION_SPARK: 10,
    FRAGMENT_SMOKE: 11,
    PLANE_DAMAGE: 12,
    EMITTER_EXPLOSION_FRAGMENT: 100
};

Particles.PTYPE = particleTypeIdByName