import Vector from './Vector';
import 'js-cookie'; // $.getJSON

    var e, t = {
        position: Vector.zero(),
        center: Vector.zero(),
        lastOverdraw: Vector.zero(),
        lastOverdrawTime: 0,
        shake: 0
    }, n = {}, r = {}, i = {};
    Graphics.setup = function() {
        l(window.innerWidth, window.innerHeight),
        o(),
        Textures.load(),
        s(),
        u(),
        a(),
        h(),
        Mobs.setupDoodads(),
        UI.setupMinimap(),
        UI.setupHUD()
    }
    ;
    var o = function() {
        PIXI.utils.skipHello(),
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
        var t = {
            autoResize: true,
            clearBeforeRender: false,
            preserveDrawingBuffer: true
        };
        config.settings.hidpi && (t.resolution = 2);
        try {
            e = new PIXI.WebGLRenderer(game.screenX,game.screenY,t)
        } catch (e) {
            return void UI.popBigMsg(2)
        }
        document.body.appendChild(e.view)
    }
      , s = function() {
        for (var e of ["game", "ui0", "ui1", "ui2", "ui3", "ui4", "hudHealth", "hudEnergy", "flags", "doodads", "map", "sea", "objects", "groundobjects", "fields", "shadows", "powerups", "crates", "aircraft", "aircraftme", "glows", "playernames", "bubbles", "thrusters", "projectiles", "smoke", "explosions"])
            i[e] = new PIXI.Container;
        for (var t of ["smoke", "crates", "thrusters", "projectiles", "aircraft", "aircraftme", "glows", "explosions", "powerups", "playernames", "flags", "bubbles"])
            i.objects.addChild(i[t]);
        for (var n of ["fields"])
            i.groundobjects.addChild(i[n]);
        if (game.graphics.layers = i,
        game.graphics.gui = r,
        config.debug.collisions) {
            for (var o = new PIXI.Graphics, s = 0; s < config.walls.length; s++)
                o.beginFill(16777215, .2),
                o.drawCircle(config.walls[s][0], config.walls[s][1], config.walls[s][2]),
                o.endFill();
            i.objects.addChild(o)
        }
    }
      , a = function() {
        n.render = PIXI.RenderTexture.create(game.screenX + config.overdraw, game.screenY + config.overdraw, void 0, config.settings.hidpi ? 2 : void 0),
        n.renderSprite = new PIXI.Sprite(n.render),
        n.shadows = PIXI.RenderTexture.create(game.shadowX, game.shadowY, void 0, config.settings.hidpi ? 2 : void 0),
        n.shadowsSprite = new PIXI.Sprite(n.shadows),
        n.shadowsSprite.scale.set(game.screenX / game.shadowX, game.screenY / game.shadowY),
        n.shadowsSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY,
        n.shadowsSprite.alpha = .4,
        i.game.addChild(n.renderSprite),
        i.game.addChild(i.groundobjects),
        i.game.addChild(n.shadowsSprite),
        n.shade = Textures.sprite("screenshade"),
        n.shade.scale.set(game.shadowX / 126 / game.scale, game.shadowY / 126 / game.scale),
        n.shade.alpha = .825,
        n.shade.anchor.set(.5, .5),
        i.shadows.addChild(n.shade),
        i.game.addChild(i.objects),
        i.game.addChild(i.ui0),
        i.game.addChild(i.ui1),
        i.game.addChild(i.ui2),
        i.game.addChild(i.ui3),
        i.game.addChild(i.ui4),
        r.hudTextureEnergy = PIXI.RenderTexture.create(80, 348, void 0, config.settings.hidpi ? 2 : void 0),
        r.hudSpriteEnergy = new PIXI.Sprite(r.hudTextureEnergy),
        r.hudSpriteEnergy.pivot.set(-250, 174),
        r.hudTextureHealth = PIXI.RenderTexture.create(80, 348, void 0, config.settings.hidpi ? 2 : void 0),
        r.hudSpriteHealth = new PIXI.Sprite(r.hudTextureHealth),
        r.hudSpriteHealth.pivot.set(330, 174),
        i.game.addChild(r.hudSpriteEnergy),
        i.game.addChild(r.hudSpriteHealth)
    };
    Graphics.resizeRenderer = function(r, i) {
        var o = r + config.overdraw
          , s = i + config.overdraw;
        l(r, i),
        u(),
        e.resize(r, i),
        n.render.resize(o, s),
        n.shadows.resize(r, i),
        n.shadowsSprite.scale.set(game.screenX / game.shadowX, game.screenY / game.shadowY),
        n.shade.scale.set(game.shadowX / 126 / game.scale, game.shadowY / 126 / game.scale);
        for (var a of ["sea", "forest", "sand", "rock"])
            n[a].width = o,
            n[a].height = s;
        UI.resizeMinimap(),
        UI.resizeHUD(),
        d(),
        p(),
        Graphics.setCamera(t.center.x, t.center.y),
        game.state == Network.STATE.PLAYING && Network.resizeHorizon()
    }
    ,
    Graphics.toggleHiDPI = function() {
        config.settings.hidpi = !(1 == config.settings.hidpi),
        config.settings.hidpi ? Tools.setSettings({
            hidpi: true
        }) : Tools.removeSetting("hidpi"),
        UI.updateMainMenuSettings(),
        1 == config.settings.oldhidpi == config.settings.hidpi ? UI.showMessage("alert", "", 1e3) : UI.showMessage("alert", 'Reload game to apply HiDPI settings<br><span class="button" onclick="Games.redirRoot()">RELOAD</span>', 1e4)
    }
    ;
    var l = function(e, t) {
        game.screenX = e,
        game.screenY = t,
        game.halfScreenX = e / 2,
        game.halfScreenY = t / 2,
        game.shadowX = Math.floor(game.screenX / config.shadowScaling),
        game.shadowY = Math.floor(game.screenY / config.shadowScaling)
    }
      , u = function() {
        game.scale = (game.screenX + game.screenY) / config.scalingFactor,
        i.groundobjects.scale.set(game.scale),
        i.objects.scale.set(game.scale),
        i.shadows.scale.set(game.scale),
        i.doodads.scale.set(game.scale),
        i.bubbles.scale.set(1 / game.scale),
        c()
    }
      , c = function() {
        if (config.mobile) {
            var e = game.screenX > game.screenY ? "landscape" : "portrait";
            config.phone = game.screenX <= 599 && "portrait" == e || game.screenY <= 599 && "landscape" == e,
            config.tablet = game.screenX >= 600 && game.screenX <= 1024 && "portrait" == e || game.screenY >= 600 && game.screenY <= 1024 && game.screenX <= 1024 && "landscape" == e,
            config.maxScoreboard = 8,
            config.phone && (config.minimapSize = 160,
            config.maxScoreboard = 5),
            config.tablet && (config.maxScoreboard = 7),
            config.minimapPaddingX = game.screenX / 2 - config.minimapSize / 2
        }
    }
      , h = function() {
        var t = e.width + config.overdraw
          , r = e.height + config.overdraw;
        n.sea = Textures.tile("map_sea", t, r),
        n.sea_mask = Textures.sprite("map_sea_mask"),
        n.sea_mask.scale.set(8, 8),
        n.sea_mask.blendMode = PIXI.BLEND_MODES.MULTIPLY,
        n.sea_mask.alpha = .5,
        n.forest = Textures.tile("map_forest", t, r),
        n.sand = Textures.tile("map_sand", t, r),
        n.sand_mask = Textures.sprite("map_sand_mask"),
        n.sand_mask.scale.set(8, 8),
        n.sand.mask = n.sand_mask,
        n.rock = Textures.tile("map_rock", t, r),
        n.rock_mask = Textures.sprite("map_rock_mask"),
        n.rock_mask.scale.set(8, 8),
        n.rock.mask = n.rock_mask,
        i.sea.addChild(n.sea),
        i.sea.addChild(n.sea_mask);
        for (var o of ["forest", "sand", "sand_mask", "rock", "rock_mask"])
            i.map.addChild(n[o]);
        i.map.addChild(i.doodads),
        f(),
        d()
    }
      , d = function() {
        var e;
        for (e of ["sea", "forest", "sand", "rock"])
            n[e].tileScale.set(game.scale, game.scale);
        for (e of ["sea", "sand", "rock"])
            n[e + "_mask"].scale.set(8 * game.scale, 8 * game.scale)
    }
      , p = function() {
        n.polygons.scale.x = game.scale,
        n.polygons.scale.y = game.scale
    }
      , f = function() {
        $.getJSON("assets/map.json", function(e) {
            n.polygons = new PIXI.Graphics,
            n.polygons.beginFill();
            var t, r, o, s, a, l, u, c = 0, h = 0, d = 0;
            for (l = 0; l < e.length; l++)
                for (o = 0,
                u = 0; u < e[l].length; u++) {
                    for (s = [],
                    a = 0; a < e[l][u].length; a += 2)
                        t = e[l][u][a] + h,
                        r = e[l][u][a + 1] + d,
                        s.push(parseFloat(t), -parseFloat(r)),
                        h = t,
                        d = r,
                        c++;
                    n.polygons.drawPolygon(s),
                    0 != o && n.polygons.addHole(),
                    o++
                }
            n.polygons.endFill(),
            p(),
            i.map.addChild(n.polygons),
            i.map.mask = n.polygons
        })
    };
    Graphics.initSprite = function(e, t, n) {
        var r = Textures.sprite(e);
        return n.position && r.position.set(n.position[0], n.position[1]),
        n.anchor && r.anchor.set(n.anchor[0], n.anchor[1]),
        n.pivot && r.pivot.set(n.pivot[0], n.pivot[1]),
        n.scale && (Array.isArray(n.scale) ? r.scale.set(n.scale[0], n.scale[1]) : r.scale.set(n.scale)),
        n.rotation && (r.rotation = n.rotation),
        n.alpha && (r.alpha = n.alpha),
        n.blend && (r.blendMode = PIXI.BLEND_MODES[n.blend]),
        n.tint && (r.tint = n.tint),
        n.mask && (r.mask = n.mask),
        n.visible && (r.visible = n.visible),
        t.addChild(r),
        r
    }
    ,
    Graphics.transform = function(e, t, n, r, i, o, s) {
        e.position.set(t, n),
        null != o ? e.scale.set(i, o) : null != i && e.scale.set(i),
        null != r && (e.rotation = r),
        null != s && (e.alpha = s)
    }
    ,
    Graphics.update = function() {
        n.shade.position.set(t.center.x / config.shadowScaling, t.center.y / config.shadowScaling),
        n.renderSprite.position.set(game.scale * (-t.position.x + t.lastOverdraw.x) - config.overdraw / 2, game.scale * (-t.position.y + t.lastOverdraw.y) - config.overdraw / 2),
        i.objects.position.set(-t.position.x * game.scale, -t.position.y * game.scale),
        i.groundobjects.position.set(-t.position.x * game.scale, -t.position.y * game.scale),
        i.doodads.position.set(-t.position.x * game.scale + config.overdraw / 2, -t.position.y * game.scale + config.overdraw / 2),
        i.shadows.position.set(-t.position.x * (game.scale / config.shadowScaling), -t.position.y * (game.scale / config.shadowScaling)),
        r.minimap_box.position.set(game.screenX - config.minimapPaddingX - config.minimapSize * ((16384 - t.center.x) / 32768), game.screenY - config.minimapPaddingY - config.minimapSize / 2 * ((8192 - t.center.y) / 16384)),
        config.overdrawOptimize ? (Math.abs(t.position.x - t.lastOverdraw.x) > config.overdraw / 2 / game.scale || Math.abs(t.position.y - t.lastOverdraw.y) > config.overdraw / 2 / game.scale || game.time - t.lastOverdrawTime > 2e3) && g() : g()
    }
    ,
    Graphics.setCamera = function(e, n) {
        var r = 0
          , i = 0;
        t.shake > .5 && (r = Tools.rand(-t.shake, t.shake),
        i = Tools.rand(-t.shake, t.shake),
        t.shake *= 1 - .06 * game.timeFactor);
        var o = game.halfScreenX / game.scale
          , s = game.halfScreenY / game.scale;
        e = Tools.clamp(e, -16384 + o, 16384 - o),
        n = Tools.clamp(n, -8192 + s, 8192 - s),
        t.position.x = r + e - game.screenX / 2 / game.scale,
        t.position.y = i + n - game.screenY / 2 / game.scale,
        t.center.x = r + e,
        t.center.y = i + n
    }
    ,
    Graphics.getCamera = function() {
        return t.center
    }
    ,
    Graphics.shakeCamera = function(e, n) {
        var r = Tools.length(e.x - t.center.x, e.y - t.center.y)
          , i = (game.halfScreenX / game.scale + game.halfScreenY / game.scale) / 2
          , o = Tools.clamp(1.3 * (1 - r / i), 0, 1);
        o < .1 || (t.shake = o * n)
    }
    ,
    Graphics.shadowCoords = function(e) {
        var t = Mobs.getClosestDoodad(e);
        return new Vector((e.x + config.shadowOffsetX * t) / config.shadowScaling,(e.y + config.shadowOffsetY * t) / config.shadowScaling)
    }
    ,
    Graphics.minimapMob = function(e, t, n) {
        null != e && e.position.set(game.screenX - config.minimapPaddingX - config.minimapSize * ((16384 - t) / 32768), game.screenY - config.minimapPaddingY - config.minimapSize / 2 * ((8192 - n) / 16384))
    }
    ;
    Graphics.toggleFullscreen = function() {
        !function() {
            var e = document;
            return e.fullscreenElement ? null !== e.fullscreenElement : e.mozFullScreenElement ? null !== e.mozFullScreenElement : e.webkitFullscreenElement ? null !== e.webkitFullscreenElement : e.msFullscreenElement ? null !== e.msFullscreenElement : void 0
        }() ? function() {
            var e = document.documentElement;
            if (e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen && e.msRequestFullscreen(),
            config.mobile && null != window.screen && null != window.screen.orientation)
                try {
                    screen.orientation.lock("landscape")
                } catch (e) {}
        }() : function() {
            var e = document;
            e.exitFullscreen ? e.exitFullscreen() : e.mozCancelFullScreen ? e.mozCancelFullScreen() : e.webkitExitFullscreen ? e.webkitExitFullscreen() : e.msExitFullscreen && e.msExitFullscreen()
        }()
    }
    ,
    Graphics.inScreen = function(e, n) {
        return e.x >= t.center.x - game.halfScreenX / game.scale - n && e.x <= t.center.x + game.halfScreenX / game.scale + n && e.y >= t.center.y - game.halfScreenY / game.scale - n && e.y <= t.center.y + game.halfScreenY / game.scale + n
    }
    ;
    var g = function() {
        Mobs.updateDoodads(),
        t.lastOverdraw.x = t.position.x,
        t.lastOverdraw.y = t.position.y,
        n.renderSprite.position.set(-config.overdraw / 2, -config.overdraw / 2);
        var r, o = t.position.x - config.overdraw / game.scale / 2, s = t.position.y - config.overdraw / game.scale / 2, a = -o * game.scale, l = -s * game.scale, u = (-o - 16384) * game.scale, c = (-s - 8192) * game.scale;
        for (r of ["sea", "forest", "sand", "rock"])
            n[r].tilePosition.set(a, l);
        for (r of ["sea", "sand", "rock"])
            n[r + "_mask"].position.set(u, c);
        null != n.polygons && null != n.polygons.position && n.polygons.position.set(-o * game.scale, -s * game.scale),
        t.lastOverdrawTime = game.time,
        e.render(i.sea, n.render),
        e.render(i.map, n.render)
    };
    Graphics.render = function() {
        e.render(i.shadows, n.shadows, true),
        e.render(i.hudEnergy, r.hudTextureEnergy, true),
        e.render(i.hudHealth, r.hudTextureHealth, true),
        e.render(i.game)
    }
