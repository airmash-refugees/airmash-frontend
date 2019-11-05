import Vector from './Vector';
import Mob from './Mob';

    var mobs = {};
    var doodads = [];
    var someFlag = {};
    Mobs.add = function (t, n) {
        mobs[t.id] = new Mob(t),
            n && mobs[t.id].network(t)
    };

    Mobs.update = function () {
        var t, n;
        for (t in mobs)
            (n = mobs[t]).update(game.timeFactor),
                n.forDeletion ? Mobs.destroy(n) : n.updateGraphics(game.timeFactor)
    };

    Mobs.network = function (t) {
        var n = mobs[t.id];
        null == n ? Mobs.add(t, true) : n.network(t)
    };

    Mobs.despawn = function (t) {
        var n = mobs[t.id];
        null != n && n.despawn(t.type)
    };

    Mobs.destroy = function (t) {
        var n = mobs[t.id];
        null != n && (n.destroy(t),
            delete mobs[t.id])
    };

    Mobs.explosion = function (e, t) {
        switch (t) {
            case 1:
            case 5:
            case 6:
            case 7:
                Particles.explosion(e, Tools.rand(1, 1.2));
                break;
            case 2:
                Particles.explosion(e, Tools.rand(1.3, 1.6));
                break;
            case 3:
                Particles.explosion(e, Tools.rand(.8, 1))
        }
        Sound.mobExplosion(e, t)
    };

    Mobs.count = function () {
        count = 0;
        culledCount = 0;
        for (var mob in mobs) {
            count++;
            if (mobs[mob].culled) {
                culledCount++;
            }
        }
        return [count - culledCount, count]
    };

    Mobs.mobs = function () { // SPATIE
        return mobs;
    };

    Mobs.wipe = function () {
        for (var t in mobs)
            mobs[t].destroy({}),
                delete mobs[t]
    };

    Mobs.countDoodads = function () {
        return [doodads.length, config.doodads.length]
    };

    Mobs.setupDoodads = function () {
        config.doodads = config.doodads.concat(config.groundDoodads);
        for (var e = 0; e < config.doodads.length; e++)
            Mobs.addDoodad(config.doodads[e])
    };

    Mobs.addDoodad = function (e) {
        var t = Number.isInteger(e[2])
            , n = Textures.init((t ? "mountain" : "") + e[2]);
        n.scale.set(e[3]),
            n.position.set(e[0], e[1]),
            n.visible = false,
            e[4] && (n.rotation = e[4]),
            e[5] && (n.alpha = e[5]),
            e[6] && (n.tint = e[6]),
            e[7] = false,
            e[8] = n,
            e[9] = t ? 0 : 1
    };

    Mobs.getClosestDoodad = function (e) {
        for (var n, r, i = 2, o = 0; o < doodads.length; o++)
            0 == (r = doodads[o])[5] && Tools.distFastCheckFloat(e.x, e.y, r[0], r[1], 256 * r[3]) && (n = Tools.distance(e.x, e.y, r[0], r[1]) / (256 * r[3])) < i && (i = n);
        return Tools.clamp(3.333 * (i - .5), .2, 1)
    };

    Mobs.updateDoodads = function () {
        for (var e, r = Tools.getBucketBounds(Graphics.getCamera(), 512 + game.halfScreenX / game.scale, 512 + game.halfScreenY / game.scale), i = r[0]; i <= r[1]; i++)
            for (var o = r[2]; o <= r[3]; o++)
                for (var s = 0; s < game.buckets[i][o][0].length; s++)
                    a = game.buckets[i][o][0][s],
                        e = config.doodads[a],
                        game.state == Network.STATE.LOGIN && 0 != e[9] || Graphics.inScreen(new Vector(e[0], e[1]), 256 * e[3] + config.overdraw) && (e[7] || (e[8].visible = true,
                            e[7] = true,
                            someFlag[a] || (someFlag[a] = true,
                                doodads.push([e[0], e[1], e[2], e[3], a, e[9]]))));
        for (var a, l = doodads.length - 1; l >= 0; l--)
            a = doodads[l][4],
                e = config.doodads[a],
                Graphics.inScreen(new Vector(e[0], e[1]), 256 * e[3] + config.overdraw) || e[7] && (e[8].visible = false,
                    e[7] = false,
                    doodads.splice(l, 1),
                    delete someFlag[a])
    };
