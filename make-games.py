
import json

GAMES = {
    "country": "GB",
    "protocol": 5,
    "data": [
        {
            "name": "Europe",
            "id": "eu",
            "games": [
                {
                    "name": "FFA wight",
                    "players": 7,
                    "url": "wss://game-eu-s1.airbattle.xyz/ffa",
                    "nameShort": "ffa-wight",
                    "host": "ffa-wight",
                    "type": 1,
                    "id": "ffa-wight",
                },
                {
                    "name": "CTF fr Server",
                    "players": 7,
                    "url": "wss://lags.win/ctf",
                    "nameShort": "ctf fr",
                    "host": "ctf",
                    "type": 2,
                    "id": "ctf",
                },
                {
                    "name": "CTF wight",
                    "players": 7,
                    "url": "wss://game-eu-s1.airbattle.xyz/ctf",
                    "nameShort": "cft wight",
                    "host": "ctf-wight",
                    "type": 2,
                    "id": "ctf-wight",
                }
            ]
        },
        {
            "name": "USA",
            "id": "us",
            "games": [
                {
                    "name": "US Server",
                    "players": 7,
                    "url": "wss://game.airmash.steamroller.tk/ffa",
                    "nameShort": "us-ffa",
                    "host": "us-ffa",
                    "type": 1,
                    "id": "us-ffa",
                },
                {
                    "name": "US DEV",
                    "players": 7,
                    "url": "wss://game.airmash.steamroller.tk/dev",
                    "nameShort": "us-dev",
                    "host": "us-dev",
                    "type": 1,
                    "id": "us-dev",
                },
            ]
        },
    ]
}

GAMES['data'] = json.dumps(GAMES['data'], separators=',:')
print(json.dumps(GAMES, separators=',:'))
