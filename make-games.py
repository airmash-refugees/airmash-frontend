
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
                    "name": "UK Server",
                    "players": 7,
                    "url": "wss://uk.airmashrefugees.tk/ffa",
                    "nameShort": "GB-ffa",
                    "host": "GB-ffa",
                    "type": 1,
                    "id": "GB-ffa",
                },
            ]
        },
        {
            "name": "USA",
            "id": "USA",
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
            ]
        },
    ]
}

GAMES['data'] = json.dumps(GAMES['data'], separators=',:')
print json.dumps(GAMES, separators=',:')
