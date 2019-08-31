function createAirmashApi(websocketUrl, pathfindingFactory) {

    const rotationSpeeds = {
        1: 0.39, // predator
        2: 0.24, // goliath
        3: 0.42, // mohawk
        4: 0.33, // tornado
        5: 0.33  // prowler
    };

    function startMainLoop() {
        // only for headless env
    }
    function stopMainLoop() {
        // only for headless env
    }

    // joinGame(name: string, flag: string, aircraftType: number);
    function joinGame(name, flag, aircraftType) {
        game.playRoom = 'ffa-wight';
        game.playRegion = 'eu';
        game.myFlag = flag;
        // game.type = aircraftType;

        Games.start(name, true);
    }

    //on(what: string, subscriber: (e: any) => any);
    function on(what, subscriber) {
        subscribeToAmEvent(what, subscriber);
    }

    // getPathFinding(targetPlayerId: number): PathFinding;
    function getPathFinding(targetPlayerId) {
        const mobsHash = Mobs.mobs();
        const missiles = [];
        for (let id in mobsHash) {
            const mob = mobsHash[id];
            if (mob.missile && mob.playerID !== game.myID) {
                missiles.push(mob);
            }
        }

        const playersToAvoid = this.getPlayers().filter(p => p.id !== targetPlayerId && p.team !== game.myTeam);

        return pathfindingFactory(targetPlayerId, config.walls, missiles, playersToAvoid);
    }

    //me(): PlayerInfo;
    function me() {
        const me = this.getPlayer(game.myID);
        return me;
    }

    // myId(): number;
    function myId() {
        return game.myID;
    }

    //getPlayers(): PlayerInfo[];
    function getPlayers() {
        const result = [];
        const all = Players.all();
        for (let id in all) {
            result.push(getPlayerFrom(all[id]));
        }
        return result;
    }
    
    //getPlayer(id: number): PlayerInfo;
    function getPlayer(id) {
        const p = Players.get(id);
        if (!p) {
            return null;
        }
        return getPlayerFrom(p);
    }

    function getPlayerFrom(p) {
        var result = {};

        result.pos = p.pos;
        result.pos.isAccurate = true;
        result.id = p.id;
        result.team = p.team;
        result.name = p.name;
        result.maxRotationSpeed = rotationSpeeds[p.type] || 0.33;
        result.rot = p.rot;
        result.lowResPos = p.lowResPos;
        result.lowResPos.isAccurate = false;
        result.speed = p.speed;
        result.type = p.type;
        result.isSpectating = p.hidden;
        result.energy = p.energy;

        return result;
    }
    
    //getNativePlayer(id: number): any;
    function getNativePlayer(id) {
        return Players.get(id);
    }

    //sendKey(key: string, value: boolean);
    function sendKey(key, value) {
        Network.sendKey(key, value);
    }

    // getPing(): number;
    function getPing() {
        return game.ping || 50;
    };

    //logPlayer(id: number);
    function logPlayer(id) {
        const p = Players.get(id);
        console.log(p);
    }

    return {
        startMainLoop,
        stopMainLoop,
        joinGame,
        on,
        getPathFinding,
        me,
        myId,
        getPlayers,
        getPlayer,
        getNativePlayer,
        sendKey,
        getPing,
        logPlayer
    };
}