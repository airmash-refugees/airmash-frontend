// TODO: this should be merged away into something shared with Wight server
// code.

// TOOD: make this work with modules

// airmash-protocol-rs/blob/master/src/enums/mob_type.rs
window.MobType = {
    PredatorMissile: 1,
    GoliathMissile: 2,
    MohawkMissile: 3,
    Upgrade: 4,
    TornadoSingleMissile: 5,
    TornadoTripleMissile: 6,
    ProwlerMissile: 7,
    Shield: 8,
    Inferno: 9,

    // Frivolity
    CarrotMissile: 12,
    MagicCrate: 13
};

// IDs in this set have 'missile' behaviour in Mob.js, i.e. they get a thruster
// and are expected to move.
window.MissileMobTypeSet = {
    [MobType.PredatorMissile]: true,
    [MobType.GoliathMissile]: true,
    [MobType.MohawkMissile]: true,
    [MobType.TornadoSingleMissile]: true,
    [MobType.TornadoTripleMissile]: true,
    [MobType.ProwlerMissile]: true,

    // Frivolity
    [MobType.CarrotMissile]: true
};

// IDs in this set have 'crate' behaviour in Mob.js. They have no thruster and
// are expected to be stationary.
window.CrateMobTypeSet = {
    [MobType.Upgrade]: true,
    [MobType.Shield]: true,
    [MobType.Inferno]: true,

    // Frivolity
    [MobType.MagicCrate]: true
};

window.MobDespawnType = {
    LifetimeEnded: 0,
    Collided: 1
};

// Mapping from MobType to Textures.js name for the box image used to render a
// crate from CrateMobTypeSet.
window.CrateTextureNameByMobType = {
    [MobType.Upgrade]: "crateUpgrade",
    [MobType.Shield]: "crateShield",
    [MobType.Inferno]: "crateRampage",
    [MobType.MagicCrate]: "crateMagic"
};
