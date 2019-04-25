
import json

GAMES = {
    "country": "GB",
    "protocol": 5,
    "data": [
        {
            "name": "Europe",
            "id": "GB",
            "games": [
                {
                    "name": "Derps UK Server",
                    "players": 0,
                    "url": "ws://uk.airmashrefugees.tk:3501/",
                    "nameShort": "GB-ffa",
                    "host": "GB-ffa",
                    "type": 1,
                    "id": "GB-ffa",
                },
            ]
        },
        {
            "name": "USA",
            "id": "UsA",
            "games": [
                {
                    "name": "Steamroller US Server",
                    "players": 7,
                    "url": "wss://game.airmash.steamroller.tk/ffa",
                    "nameShort": "us-ffa",
                    "host": "us-ffa",
                    "type": 1,
                    "id": "us-ffa",
                },
            ]
        },
    ]
}

GAMES['data'] = json.dumps(GAMES['data'], separators=',:')
print json.dumps(GAMES, separators=',:')
