!(function() {
    var e = {}
      , t = []
      , n = {};
    Mobs.add = function(t, n) {
        e[t.id] = new Mob(t),
        n && e[t.id].network(t)
    }
    ,
    Mobs.update = function() {
        var t, n;
        for (t in e)
            (n = e[t]).update(game.timeFactor),
            n.forDeletion ? Mobs.destroy(n) : n.updateGraphics(game.timeFactor)
    }
    ,
    Mobs.network = function(t) {
        var n = e[t.id];
        null == n ? Mobs.add(t, !0) : n.network(t)
    }
    ,
    Mobs.despawn = function(t) {
        var n = e[t.id];
        null != n && n.despawn(t.type)
    }
    ,
    Mobs.destroy = function(t) {
        var n = e[t.id];
        null != n && (n.destroy(t),
        delete e[t.id])
    }
    ,
    Mobs.explosion = function(e, t) {
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
    }
    ,
    Mobs.count = function() {
        var t, n = 0, r = 0;
        for (t in e)
            n++,
            e[t].culled && r++;
        return [n - r, n]
    }
    ,
    Mobs.wipe = function() {
        for (var t in e)
            e[t].destroy({}),
            delete e[t]
    }
    ,
    Mobs.countDoodads = function() {
        return [t.length, config.doodads.length]
    }
    ,
    Mobs.setupDoodads = function() {
        config.doodads = config.doodads.concat(config.groundDoodads);
        for (var e = 0; e < config.doodads.length; e++)
            Mobs.addDoodad(config.doodads[e])
    }
    ,
    Mobs.addDoodad = function(e) {
        var t = Number.isInteger(e[2])
          , n = Textures.init((t ? "mountain" : "") + e[2]);
        n.scale.set(e[3]),
        n.position.set(e[0], e[1]),
        n.visible = !1,
        e[4] && (n.rotation = e[4]),
        e[5] && (n.alpha = e[5]),
        e[6] && (n.tint = e[6]),
        e[7] = !1,
        e[8] = n,
        e[9] = t ? 0 : 1
    }
    ,
    Mobs.getClosestDoodad = function(e) {
        for (var n, r, i = 2, o = 0; o < t.length; o++)
            0 == (r = t[o])[5] && Tools.distFastCheckFloat(e.x, e.y, r[0], r[1], 256 * r[3]) && (n = Tools.distance(e.x, e.y, r[0], r[1]) / (256 * r[3])) < i && (i = n);
        return Tools.clamp(3.333 * (i - .5), .2, 1)
    }
    ,
    Mobs.updateDoodads = function() {
        for (var e, r = Tools.getBucketBounds(Graphics.getCamera(), 512 + game.halfScreenX / game.scale, 512 + game.halfScreenY / game.scale), i = r[0]; i <= r[1]; i++)
            for (var o = r[2]; o <= r[3]; o++)
                for (var s = 0; s < game.buckets[i][o][0].length; s++)
                    a = game.buckets[i][o][0][s],
                    e = config.doodads[a],
                    game.state == Network.STATE.LOGIN && 0 != e[9] || Graphics.inScreen(new Vector(e[0],e[1]), 256 * e[3] + config.overdraw) && (e[7] || (e[8].visible = !0,
                    e[7] = !0,
                    n[a] || (n[a] = !0,
                    t.push([e[0], e[1], e[2], e[3], a, e[9]]))));
        for (var a, l = t.length - 1; l >= 0; l--)
            a = t[l][4],
            e = config.doodads[a],
            Graphics.inScreen(new Vector(e[0],e[1]), 256 * e[3] + config.overdraw) || e[7] && (e[8].visible = !1,
            e[7] = !1,
            t.splice(l, 1),
            delete n[a])
    }
})();
