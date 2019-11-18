// TODO: this should be merged away into something shared with Wight server
// code.

// TOOD: make this work with modules


// ab-protocol/src/types/flags.ts
window.FlagCodeById = {
  1: 'SY',
  2: 'TH',
  3: 'TM',
  4: 'TN',
  5: 'TR',
  6: 'TT',
  7: 'TW',
  8: 'TZ',
  9: 'UA',
  10: 'UN',
  11: 'US',
  12: 'UY',
  13: 'UZ',
  14: 'VE',
  15: 'VN',
  16: 'PR',
  17: 'PT',
  18: 'PY',
  19: 'QA',
  20: 'RAINBOW',
  21: 'RO',
  22: 'RS',
  23: 'RU',
  24: 'SA',
  25: 'SE',
  26: 'SG',
  27: 'SI',
  28: 'SK',
  29: 'SM',
  30: 'MK',
  31: 'MO',
  32: 'MT',
  33: 'MX',
  34: 'MY',
  35: 'NG',
  36: 'NL',
  37: 'NO',
  38: 'NP',
  39: 'NZ',
  40: 'OM',
  41: 'PA',
  42: 'PE',
  43: 'JP',
  44: 'KP',
  45: 'KR',
  46: 'KW',
  47: 'KZ',
  48: 'LB',
  49: 'LI',
  50: 'LK',
  51: 'LT',
  52: 'LU',
  53: 'LV',
  54: 'HN',
  55: 'HR',
  56: 'HU',
  57: 'ID',
  58: 'IE',
  59: 'IL',
  60: 'IM',
  61: 'IMPERIAL',
  62: 'IN',
  63: 'IQ',
  64: 'DE',
  65: 'DK',
  66: 'DO',
  67: 'DZ',
  68: 'EC',
  69: 'EE',
  70: 'EG',
  71: 'ES',
  72: 'EU',
  73: 'BH',
  74: 'BO',
  75: 'BR',
  76: 'BT',
  77: 'BY',
  78: 'CA',
  79: 'CH',
  80: 'AD',
  81: 'AE',
  82: 'AL',
  83: 'AM',
  84: 'CL',
  85: 'AQ',
  86: 'CN',
  87: 'AR',
  88: 'FI',
  89: 'CO',
  90: 'AT',
  91: 'IR',
  92: 'FR',
  93: 'COMMUNIST',
  94: 'AU',
  95: 'LY',
  96: 'IS',
  97: 'GB',
  98: 'CONFEDERATE',
  99: 'AZ',
  100: 'MA',
  101: 'IT',
  102: 'GE',
  103: 'CR',
  104: 'BA',
  105: 'PH',
  106: 'MC',
  107: 'JM',
  108: 'GR',
  109: 'CU',
  110: 'BD',
  111: 'SO',
  112: 'PK',
  113: 'MD',
  114: 'JO',
  115: 'GT',
  116: 'CY',
  117: 'BE',
  118: 'ZA',
  119: 'SV',
  120: 'PL',
  121: 'ME',
  122: 'JOLLY',
  123: 'HK',
  124: 'CZ',
  125: 'BG'
};

// airmash-protocol-rs/blob/master/src/enums/game_type.rs
window.GameType = {
    FFA: 1,
    CTF: 2,
    BTR: 3
};

// airmash-protocol-rs/blob/master/src/enums/plane_type.rs
window.PlaneType = {
    Predator: 1,
    Goliath: 2,
    Mohawk: 3,
    Tornado: 4,
    Prowler: 5
};

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
