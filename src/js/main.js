"use strict";

import './Game';
import './Games';
import './Graphics';
import './Input';
import './Mobs';
import './Network';
import './Particles';
import './Players';
import './Sound';
import './Textures';
import './Tools';
import './UI';

// this is a temporary hack until we have a standard way of having the game server communicate its maximum scaling factor
!function() {
    var alreadyWarned = false;
    setInterval(function() {
        if (!alreadyWarned && config.scalingFactor > 2500 && "eu" == game.playRegion && "ffa2" == game.playRoom)
        {
            console.log("%c⚠️ The maximum scalingFactor on FFA #2 is 2500. This is enforced by the server. For zoom hacking, switch to FFA #1.", "color:red");
            alreadyWarned = true;
        }
    }, 100);
}();   